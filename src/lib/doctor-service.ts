import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Cliente temporal sin persistencia de sesión para evitar que el Administrador sea deslogueado
const authClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})

export interface CreateDoctorData {
  nombre: string
  apellido: string
  especialidadId: string
  bio: string
  isAvailable: boolean
  dni?: string
  telefono?: string
}

export interface DoctorCredentials {
  email: string
  password: string
}

export const generateEmail = (nombre: string, apellido: string): string => {
  const sanitized = `${nombre}.${apellido}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '')
  return `${sanitized}@aurahealth.com`
}

export const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export const doctorService = {
  async createDoctor(data: CreateDoctorData): Promise<{ credentials: DoctorCredentials }> {
    const fullName = `${data.nombre} ${data.apellido}`
    const generatedEmail = generateEmail(data.nombre, data.apellido)
    const generatedPassword = generatePassword()

    // 1. Crear usuario en Supabase Auth usando el cliente temporal sessionless
    const { data: authData, error: authError } = await authClient.auth.signUp({
      email: generatedEmail,
      password: generatedPassword,
      options: {
        data: {
          full_name: fullName,
          user_role: 'doctor'
        }
      }
    })

    if (authError) throw new Error(`Error al crear usuario en Auth: ${authError.message}`)
    if (!authData.user?.id) throw new Error('Error: No se obtuvo el ID del usuario de Auth')

    // 2. Crear en tabla usuarios (public)
    const { error: usuariosError } = await supabase
      .from('usuarios')
      .upsert([
        {
          id: authData.user.id,
          email: generatedEmail,
          full_name: fullName,
          user_role: 'doctor',
          is_active: true
        }
      ], { onConflict: 'id' })

    if (usuariosError) throw new Error(`Error al registrar en usuarios: ${usuariosError.message}`)

    // 3. Crear en tabla doctores (public) con el usuario_id enlazado
    const { error: doctoresError } = await supabase
      .from('doctores')
      .insert([
        {
          id: authData.user.id, // Para mantener consistencia o usarlo como ID
          usuario_id: authData.user.id,
          especialidad_id: data.especialidadId,
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni || null,
          telefono: data.telefono || null,
          bio: data.bio || null,
          is_available: data.isAvailable
        }
      ])

    if (doctoresError) throw new Error(`Error al crear doctor: ${doctoresError.message}`)

    return {
      credentials: {
        email: generatedEmail,
        password: generatedPassword
      }
    }
  },

  async getDoctorEmail(usuarioId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('email')
      .eq('id', usuarioId)
      .single()

    if (error) {
      console.error('Error recuperando email:', error)
      return null
    }
    return data?.email || null
  }
}
