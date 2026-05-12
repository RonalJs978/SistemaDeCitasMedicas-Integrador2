import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Eye, EyeOff, Copy } from 'lucide-react'

interface CreateDoctorData {
  fullName: string
  especialidadId: string
  bio: string
  isAvailable: boolean
  generatedEmail: string
  generatedPassword: string
}

interface Especialidad {
  id: string
  nombre: string
}

// Función para generar email
const generateEmail = (fullName: string): string => {
  const sanitized = fullName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '')
  return `${sanitized}@aurahealth.com`
}

// Función para generar contraseña aleatoria
const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export default function DoctorManager() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [especialidadId, setEspecialidadId] = useState('')
  const [bio, setBio] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdDoctor, setCreatedDoctor] = useState<CreateDoctorData | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(true)

  // Cargar especialidades al montar
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        setLoadingEspecialidades(true)
        
        const { data, error: fetchError } = await supabase
          .from('especialidades')
          .select('id, nombre')
        
        if (fetchError) throw fetchError
        
        setEspecialidades(data || [])
        setError('')
      } catch (err) {
        console.error('Error cargando especialidades:', err)
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(`Error al cargar especialidades: ${message}`)
        setEspecialidades([])
      } finally {
        setLoadingEspecialidades(false)
      }
    }

    fetchEspecialidades()
  }, [])

  const handleCreateDoctor = async () => {
    setError('')

    if (!fullName.trim() || !especialidadId) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    setLoading(true)

    try {
      // 1. Generar email y contraseña
      const generatedEmail = generateEmail(fullName)
      const generatedPassword = generatePassword()

      // 2. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: generatedEmail,
        password: generatedPassword,
        options: {
          data: {
            full_name: fullName,
            user_role: 'doctor'
          }
        }
      })

      if (authError) {
        setError(`Error al crear usuario: ${authError.message}`)
        return
      }

      if (!authData.user?.id) {
        setError('Error: No se obtuvo el ID del usuario')
        return
      }

      // 3. Crear en tabla usuarios
      const { error: usuariosError } = await supabase
        .from('usuarios')
        .upsert([
          {
            id: authData.user.id,
            email: generatedEmail,
            full_name: fullName,
            user_role: 'doctor'
          }
        ], { onConflict: 'id' })

      if (usuariosError) {
        setError(`Error al registrar en usuarios: ${usuariosError.message}`)
        return
      }

      // 4. Crear en tabla doctores
      const { error: doctoresError } = await supabase
        .from('doctores')
        .insert([
          {
            usuario_id: authData.user.id,
            especialidad_id: especialidadId,
            bio: bio || null,
            is_available: isAvailable
          }
        ])

      if (doctoresError) {
        setError(`Error al crear doctor: ${doctoresError.message}`)
        return
      }

      // Guardar datos del doctor creado para mostrar
      setCreatedDoctor({
        fullName,
        especialidadId,
        bio,
        isAvailable,
        generatedEmail,
        generatedPassword
      })

      // Limpiar formulario
      setFullName('')
      setEspecialidadId('')
      setBio('')
      setIsAvailable(true)
    } catch (err) {
      setError('Error al crear el doctor. Por favor intenta nuevamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    alert(`${label} copiado al portapapeles`)
  }

  if (createdDoctor) {
    return (
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <div className="text-center mb-6">
              <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h2 className="text-2xl font-bold text-green-900 mb-2">Doctor creado exitosamente</h2>
              <p className="text-green-700">El nuevo doctor ha sido registrado en el sistema</p>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Datos del nuevo doctor:</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{createdDoctor.fullName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex gap-2">
                    <p className="flex-1 p-3 bg-gray-50 rounded-lg text-gray-900 font-mono text-sm">
                      {createdDoctor.generatedEmail}
                    </p>
                    <button
                      onClick={() => copyToClipboard(createdDoctor.generatedEmail, 'Email')}
                      className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña temporal</label>
                  <div className="flex gap-2">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={createdDoctor.generatedPassword}
                      readOnly
                      className="flex-1 p-3 bg-gray-50 rounded-lg text-gray-900 font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(createdDoctor.generatedPassword, 'Contraseña')}
                      className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Importante:</strong> Guarda el email y la contraseña. El doctor debe usarlos para iniciar sesión por primera vez.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCreatedDoctor(null)
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Crear otro doctor
              </button>
              <button
                onClick={() => navigate('/administrator/doctor-list')}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Ver lista de doctores
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crear nuevo doctor</h1>
          <p className="text-gray-600 mt-2">Completa el formulario para agregar un nuevo doctor al sistema</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Nombre completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan Pérez González"
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Especialidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especialidad *
            </label>
            <select
              value={especialidadId}
              onChange={(e) => setEspecialidadId(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || loadingEspecialidades}
            >
              <option value="">
                {loadingEspecialidades ? 'Cargando especialidades...' : 'Seleccionar especialidad'}
              </option>
              {especialidades.map((esp) => (
                <option key={esp.id} value={esp.id}>
                  {esp.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biografía
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Descripción del doctor, experiencia, etc."
              rows={4}
              className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Disponibilidad */}
          <div className="flex items-center gap-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded"
                disabled={loading}
              />
              <span className="ml-2 text-gray-700 font-medium">
                {isAvailable ? 'Disponible' : 'No disponible'}
              </span>
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleCreateDoctor}
              disabled={loading || !fullName.trim() || !especialidadId || loadingEspecialidades}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando doctor...' : 'Crear doctor'}
            </button>
            <button
              onClick={() => navigate('/administrator/doctor-list')}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Flujo automático:</strong> El sistema generará automáticamente un email (@aurahealth.com) y una contraseña temporal para el nuevo doctor.
          </p>
        </div>
      </div>
    </main>
  )
}