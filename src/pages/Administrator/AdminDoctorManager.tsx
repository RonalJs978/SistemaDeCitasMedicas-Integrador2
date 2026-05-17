import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface Especialidad {
  id: string
  nombre: string
  descripcion: string
}

interface FormData {
  nombre: string
  apellido: string
  dni: string
  telefono: string
  especialidad_id: string
  bio: string
  is_available: boolean
}

export default function AdminDoctorManager() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    especialidad_id: '',
    bio: '',
    is_available: false
  })
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  
  // Especialidades
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])

  const [loadingEspecialidades, setLoadingEspecialidades] = useState(true)

  
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

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!formData.nombre.trim()) {
      setError('El nombre es requerido')
      return
    }

    if (!formData.apellido.trim()) {
      setError('El apellido es requerido')
      return
    }

    if (!formData.especialidad_id) {
      setError('Debes seleccionar una especialidad')
      return
    }



    setLoading(true)

    try {
      // Insertar directamente en tabla doctores
      const { data, error: insertError } = await supabase
        .from('doctores')
        .insert([
          {
            nombre: formData.nombre,
            apellido: formData.apellido,
            dni: formData.dni || null,
            telefono: formData.telefono || null,
            especialidad_id: formData.especialidad_id,
            bio: formData.bio || null,
            is_available: formData.is_available,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (insertError) {
        if (insertError.message.includes('unique')) {
          setError('Este DNI ya está registrado')
        } else {
          setError(`Error: ${insertError.message}`)
        }
        console.error('Error al registrar doctor:', insertError)
        return
      }

      console.log('Doctor registrado exitosamente:', data)
      setSuccessMessage(`¡Doctor ${formData.nombre} ${formData.apellido} registrado correctamente!`)
      
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        especialidad_id: '',
        bio: '',
        is_available: false
      })
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError('Error al registrar el doctor. Por favor intenta nuevamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 overflow-hidden relative">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="mb-12 text-center animate-fade-in" style={{ animationDuration: '0.6s' }}>
            <a href="/" className="inline-block mb-6 group">
              <span className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 dark:from-blue-400 dark:via-blue-300 dark:to-blue-500 bg-clip-text text-transparent">
                AuraHealth
              </span>
            </a>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
              Agregar Doctor
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Crea un nuevo perfil de doctor en el sistema
            </p>
          </div>

          {/* Main Form Container */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20  overflow-hidden animate-scale-in" style={{ animationDuration: '0.8s' }}>
            <div className="grid lg:grid-cols-1">
              {/* Left Column - Visual */}
             

              {/* Right Column - Form */}
              <div className="p-6 md:p-6">
                {error && (
                  <div className="mb-4 p-4 bg-red-50/90 dark:bg-red-950/40 border border-red-200/50 dark:border-red-800/50 rounded-xl flex items-start gap-3 animate-slide-down">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-red-700 dark:text-red-200">{error}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-6 p-4 bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/50 rounded-xl flex items-start gap-3 animate-slide-down">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-200">{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Name Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        onFocus={() => setFocusedField('nombre')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 transition-all duration-300 text-slate-900 dark:text-white rounded-xl placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                          focusedField === 'nombre' 
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                            : 'border-slate-200 dark:border-slate-600'
                        }`}
                        placeholder="Dr. Juan"
                        required
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest">
                        Apellido
                      </label>
                      <input
                        type="text"
                        value={formData.apellido}
                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                        onFocus={() => setFocusedField('apellido')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 transition-all duration-300 text-slate-900 dark:text-white rounded-xl placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                          focusedField === 'apellido' 
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                            : 'border-slate-200 dark:border-slate-600'
                        }`}
                        placeholder="Pérez"
                        required
                      />
                    </div>
                  </div>

                  {/* DNI */}
                  <div className="group">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest">
                      DNI/Cédula
                    </label>
                    <input
                      type="text"
                      value={formData.dni}
                      onChange={(e) => handleInputChange('dni', e.target.value)}
                      onFocus={() => setFocusedField('dni')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 transition-all duration-300 text-slate-900 dark:text-white rounded-xl placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                        focusedField === 'dni' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : 'border-slate-200 dark:border-slate-600'
                      }`}
                      placeholder="12345678"
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="group">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      onFocus={() => setFocusedField('telefono')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 transition-all duration-300 text-slate-900 dark:text-white rounded-xl placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                        focusedField === 'telefono' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : 'border-slate-200 dark:border-slate-600'
                      }`}
                      placeholder="+51 911 323 456"
                    />
                  </div>

                  {/* Especialidad */}
                  <div className="group">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest">
                      Especialidad
                    </label>
                    <select
                      value={formData.especialidad_id}
                      onChange={(e) => handleInputChange('especialidad_id', e.target.value)}
                      onFocus={() => setFocusedField('especialidad')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loadingEspecialidades}
                      className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 transition-all duration-300 text-slate-900 dark:text-white rounded-xl appearance-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        focusedField === 'especialidad' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : 'border-slate-200 dark:border-slate-600'
                      }`}
                      required
                    >
                      <option value="">
                        {loadingEspecialidades ? 'Cargando...' : 'Selecciona especialidad'}
                      </option>
                      {especialidades.map((esp) => (
                        <option key={esp.id} value={esp.id}>
                          {esp.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bio */}
                  <div className="group">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest">
                      Biografía (Opcional)
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      onFocus={() => setFocusedField('bio')}
                      onBlur={() => setFocusedField(null)}
                      rows={3}
                      className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 transition-all duration-300 text-slate-900 dark:text-white rounded-xl placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none ${
                        focusedField === 'bio' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : 'border-slate-200 dark:border-slate-600'
                      }`}
                      placeholder="Cuéntanos sobre tu experiencia y especialización..."
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group/check">
                      <input
                        type="checkbox"
                        checked={formData.is_available}
                        onChange={(e) => handleInputChange('is_available', e.target.checked)}
                        className="w-5 h-5 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 accent-blue-600 focus:ring-2 focus:ring-blue-600 cursor-pointer transition"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 group-hover/check:text-blue-600 transition">
                        Disponible desde el inicio
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 dark:from-blue-500 dark:to-blue-500 dark:hover:from-blue-600 dark:hover:to-blue-600 text-white font-bold text-lg rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 active:scale-95"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Registrando...
                      </span>
                    ) : (
                      'Agregar Doctor'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
}