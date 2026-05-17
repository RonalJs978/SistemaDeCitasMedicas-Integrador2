import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface Especialidad {
  id: string
  nombre: string
  descripcion: string
}

const determineUserRole = (email: string) => {
  // Solo doctores con dominio @aurahealth.com
  if (email.endsWith('@aurahealth.com')) return 'doctor'
  return null // Rechazar otros dominios
}

export default function AdminDoctorManager() {
  const [fullName, setFullName] = useState('')
  const [emailPrefix, setEmailPrefix] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Especialidades
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const [especialidadId, setEspecialidadId] = useState('')
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(true)
  const [isAvailable, setIsAvailable] = useState(false)

  const userRole = determineUserRole(`${emailPrefix}@aurahealth.com`)
  const isValidDoctorEmail = userRole === 'doctor'
  
  // Cargar especialidades al montar el componente
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const { data, error } = await supabase
          .from('especialidades')
          .select('id, nombre, descripcion')
          .eq('is_active', true)
          .order('nombre', { ascending: true })

        if (error) {
          console.error('Error al cargar especialidades:', error)
          return
        }

        setEspecialidades(data || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoadingEspecialidades(false)
      }
    }

    fetchEspecialidades()
  }, [])
  
  const getRoleLabel = (role: string) => {
    return role === 'doctor' ? 'Doctor' : 'Inválido'
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim()) {
      setError('El nombre completo es requerido')
      return
    }

    if (!emailPrefix.trim()) {
      setError('El correo electrónico es requerido')
      return
    }

    if (!isValidDoctorEmail) {
      setError('Por favor, utiliza un correo con dominio @aurahealth.com')
      return
    }

    if (!especialidadId) {
      setError('Debes seleccionar una especialidad')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones')
      return
    }

    setLoading(true)

    try {
      // 1. Crear usuario en Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: `${emailPrefix}@aurahealth.com`,
        password,
        options: {
          data: {
            full_name: fullName,
            user_role: 'doctor'
          }
        }
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Este email ya está registrado. Por favor, inicia sesión.')
        } else {
          setError(signUpError.message || 'Error al registrarse')
        }
        return
      }

      if (!data.user?.id) {
        setError('Error: No se obtuvo el ID del usuario')
        return
      }

      // 2. Crear fila en tabla usuarios
      const usuariosResult = await supabase.from('usuarios').upsert([
        {
          id: data.user.id,
          email: `${emailPrefix}@aurahealth.com`,
          full_name: fullName,
          user_role: 'doctor'
        }
      ], { onConflict: 'id' })

      if (usuariosResult.error) {
        setError(`Error al registrar usuario: ${usuariosResult.error.message}`)
        console.error('Error en usuarios:', usuariosResult.error)
        return
      }

      // 3. Crear perfil de doctor usando función RPC con SECURITY DEFINER
      const { data: funcResult, error: funcError } = await supabase.rpc(
        'create_doctor_profile',
        {
          p_usuario_id: data.user.id,
          p_especialidad_id: especialidadId,
          p_bio: '',
          p_is_available: isAvailable
        }
      )

      if (funcError) {
        setError(`Error al crear perfil de doctor: ${funcError.message}`)
        console.error('Error en función RPC:', funcError)
        return
      }

      if (!funcResult || !funcResult[0]?.success) {
        setError(`Error al crear perfil de doctor: ${funcResult?.[0]?.message || 'Error desconocido'}`)
        console.error('Error en respuesta RPC:', funcResult)
        return
      }

      console.log('Doctor registrado exitosamente:', data.user)
      setFullName('')
      setEmailPrefix('')
      setPassword('')
      setConfirmPassword('')
      setEspecialidadId('')
      setIsAvailable(false)
      setTermsAccepted(false)
      
      alert('¡Doctor registrado exitosamente! Por favor, inicia sesión.')
    } catch (err) {
      setError('Error al crear la cuenta. Por favor intenta nuevamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/login" className="flex items-center justify-center mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              AuraHealth
            </span>
          </a>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Crear cuenta de Doctor
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Regístrate como doctor en AuraHealth
            </p>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-700 dark:text-red-200">{error}</span>
              </div>
            )}


            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  placeholder="John Doe Luthor"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Correo electrónico
                </label>

                <div className="flex items-center gap-2 mb-2">
                 <input type="text" name="email" id="email"
                    value={emailPrefix}
                    onChange={(e) => setEmailPrefix(e.target.value.replace(/\s/g, '').toLocaleLowerCase())} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    placeholder="nombre.apellido"
                    required
                    />
                  <span className={`px-4 py-3 bg-gray-100 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg`}>
                    @aurahealth.com
                  </span>
                </div>

              </div>

              <div>
                <label htmlFor="especialidad" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Especialidad
                </label>
                <select
                  id="especialidad"
                  name="especialidad"
                  value={especialidadId}
                  onChange={(e) => setEspecialidadId(e.target.value)}
                  disabled={loadingEspecialidades}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">
                    {loadingEspecialidades ? 'Cargando especialidades...' : 'Selecciona una especialidad'}
                  </option>
                  {especialidades.map((esp) => (
                    <option key={esp.id} value={esp.id}>
                      {esp.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-start pt-2">
                <div className="flex items-center h-6">
                  <input
                    id="isAvailable"
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 accent-green-600 focus:ring-2 focus:ring-green-600 cursor-pointer"
                  />
                </div>
                <label htmlFor="isAvailable" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  Doctor disponible desde el inicio
                </label>
              </div>

              <div className="flex items-start pt-2">
                <div className="flex items-center h-6">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 accent-blue-600 focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    required
                  />
                </div>
                <label htmlFor="terms" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  Acepto los{' '}
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition">
                    Términos y condiciones
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta de doctor'}
              </button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
                ¿Ya tienes una cuenta?{' '}
                <a href="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition">
                  Inicia sesión
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}