import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Trash2, Edit2, Plus } from 'lucide-react'

interface Doctor {
  id: string
  usuario_id: string
  especialidad_id: string
  bio: string | null
  is_available: boolean
  usuario: {
    full_name: string
    email: string
  }
  especialidad: {
    nombre: string
  }
}

export default function AdministratorDoctorList() {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      setLoading(true)
      setError('')

      // Cargar doctores con relaciones
      const { data, error: fetchError } = await supabase
        .from('doctores')
        .select(`
          id,
          usuario_id,
          especialidad_id,
          bio,
          is_available,
          usuario:usuarios(full_name, email),
          especialidad:especialidades(nombre)
        `)

      if (fetchError) throw fetchError

      // Asegurar que los datos tengan la estructura correcta
      const formattedData = data?.map((doc: any) => ({
        ...doc,
        usuario: Array.isArray(doc.usuario) ? doc.usuario[0] : doc.usuario,
        especialidad: Array.isArray(doc.especialidad) ? doc.especialidad[0] : doc.especialidad
      })) || []

      setDoctors(formattedData)
    } catch (err) {
      console.error('Error cargando doctores:', err)
      setError('Error al cargar la lista de doctores')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (doctorId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este doctor?')) {
      return
    }

    setDeletingId(doctorId)

    try {
      const { error: deleteError } = await supabase
        .from('doctores')
        .delete()
        .eq('id', doctorId)

      if (deleteError) throw deleteError

      setDoctors(doctors.filter((d) => d.id !== doctorId))
    } catch (err) {
      console.error('Error eliminando doctor:', err)
      setError('Error al eliminar el doctor')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctores</h1>
          <p className="text-gray-600 mt-2">Gestiona los doctores del sistema</p>
        </div>
        <button
          onClick={() => navigate('/administrator/doctor-manager')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Crear doctor
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando doctores...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No hay doctores registrados</p>
          <button
            onClick={() => navigate('/administrator/doctor-manager')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Crear primer doctor
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Especialidad</th>
                <th className="text-center px-6 py-4 font-semibold text-gray-700">Disponible</th>
                <th className="text-center px-6 py-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {doctor.usuario?.full_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {doctor.usuario?.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {doctor.especialidad?.nombre || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        doctor.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {doctor.is_available ? 'Disponible' : 'No disponible'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/administrator/doctor-edit/${doctor.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        disabled={deletingId === doctor.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}