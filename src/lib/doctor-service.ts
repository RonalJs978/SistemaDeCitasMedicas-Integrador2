import { supabase } from './supabase'

export interface CreateDoctorData {
  fullName: string
  especialidadId: string
  bio: string
  isAvailable: boolean
}

export interface DoctorCredentials {
  email: string
  password: string
}

export const generateEmail = (fullName: string): string => {
  const sanitized = fullName
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
    const generatedEmail = generateEmail(data.fullName)
    const generatedPassword = generatePassword()

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: generatedEmail,
      password: generatedPassword,
      options: {
        data: {
          full_name: data.fullName,
          user_role: 'doctor'
        }
      }
    })

    if (authError) throw new Error(`Error al crear usuario: ${authError.message}`)
    if (!authData.user?.id) throw new Error('Error: No se obtuvo el ID del usuario')

    // 2. Crear en tabla usuarios
    const { error: usuariosError } = await supabase
      .from('usuarios')
      .upsert([
        {
          id: authData.user.id,
          email: generatedEmail,
          full_name: data.fullName,
          user_role: 'doctor'
        }
      ], { onConflict: 'id' })

    if (usuariosError) throw new Error(`Error al registrar en usuarios: ${usuariosError.message}`)

    // 3. Crear en tabla doctores
    const { error: doctoresError } = await supabase
      .from('doctores')
      .insert([
        {
          usuario_id: authData.user.id,
          especialidad_id: data.especialidadId,
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



