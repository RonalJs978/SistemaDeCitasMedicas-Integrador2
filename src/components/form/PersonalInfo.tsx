import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface PersonalInfoProps {
  especialidadId?: string
  onEspecialidadChange?: (value: string) => void
  usuarioId?: string
  onUsuarioChange?: (value: string) => void
}

export default function PersonalInfoForm({
  especialidadId = '',
  onEspecialidadChange,
  usuarioId = '',
  onUsuarioChange
}: PersonalInfoProps) {
  const [especialidades, setEspecialidades] = useState<{ id: string; nombre: string }[]>([])
  const [usuarios, setUsuarios] = useState<{ id: string; email: string; full_name: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: espec, error: especError } = await supabase
          .from('especialidades')
          .select('id, nombre')
          .eq('is_active', true)
        
        if (especError) throw especError
        setEspecialidades(espec || [])

        const { data: docs, error: docsError } = await supabase
          .from('usuarios')
          .select('id, email, full_name')
          .eq('user_role', 'doctor')
        
        if (docsError) throw docsError
        setUsuarios(docs || [])
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">
        Información personal
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select 
          className="p-3 rounded-lg bg-gray-100 outline-none"
          value={especialidadId}
          onChange={(e) => onEspecialidadChange?.(e.target.value)}
          disabled={loading}
        >
          <option value="">Seleccionar especialidad</option>
          {especialidades.map((esp) => (
            <option key={esp.id} value={esp.id}>
              {esp.nombre}
            </option>
          ))}
        </select>

        <select 
          className="p-3 rounded-lg bg-gray-100 outline-none"
          value={usuarioId}
          onChange={(e) => onUsuarioChange?.(e.target.value)}
          disabled={loading}
        >
          <option value="">Seleccionar usuario (doctor)</option>
          {usuarios.map((usr) => (
            <option key={usr.id} value={usr.id}>
              {usr.full_name} ({usr.email})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}