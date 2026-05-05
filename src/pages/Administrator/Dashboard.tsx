export default function AdministratorDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Bienvenido de nuevo</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-600 text-sm font-medium">Total Doctores</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">45</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-600 text-sm font-medium">Total Pacientes</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">320</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-gray-600 text-sm font-medium">Citas Hoy</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-gray-600 text-sm font-medium">Reportes</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>
        <p className="text-gray-600">No hay actividad reciente</p>
      </div>
    </div>
  )
}