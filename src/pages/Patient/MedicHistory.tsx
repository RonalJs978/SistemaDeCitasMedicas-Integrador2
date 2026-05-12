import { useState } from 'react'

interface Document {
  id: string
  date: string
  month: string
  day: string
  type: 'CONSULTA GENERAL' | 'LABORATORIO' | 'RECETA'
  title: string
  description: string
  documentId: string
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
}

export default function PatientMedicHistory() {
  const [documentType, setDocumentType] = useState('Todos los documentos')
  const [period, setPeriod] = useState('Últimos 6 meses')

  const allDocuments: Document[] = [
    {
      id: '1',
      date: '24 OCT',
      month: 'OCT',
      day: '24',
      type: 'CONSULTA GENERAL',
      title: 'Seguimiento Hipertensión Arterial',
      description:
        '"Paciente muestra mejoría estable con el tratamiento actual. Se recomienda mantener dieta baja en sodio."',
      documentId: '#REC-8821',
    },
    {
      id: '2',
      date: '18 OCT',
      month: 'OCT',
      day: '18',
      type: 'LABORATORIO',
      title: 'Perfil Lipídico & Hemoglobina',
      description:
        'Resultados disponibles. Valores de colesterol dentro del rango deseado.',
      documentId: '#LAB-4450',
    },
    {
      id: '3',
      date: '30 SEP',
      month: 'SEP',
      day: '30',
      type: 'RECETA',
      title: 'Renovación de Medicamentos',
      description: 'Losartán 50mg (1 vez al día) / Metformina 850mg (Cena).',
      documentId: '#RX-1002',
    },
  ]

  const medications: Medication[] = [
    {
      id: '1',
      name: 'Losartán Potásico 50mg',
      dosage: '1 tab cada 24 hrs',
      frequency: 'Indefinido',
    },
    {
      id: '2',
      name: 'Vitamina D3 2000 UI',
      dosage: '1 caps al día',
      frequency: '3 meses',
    },
  ]

  const filteredDocuments = allDocuments.filter((doc) => {
    const typeMatch = documentType === 'Todos los documentos' || doc.type === documentType
    return typeMatch
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONSULTA GENERAL':
        return 'bg-blue-100 text-blue-700'
      case 'LABORATORIO':
        return 'bg-orange-100 text-orange-700'
      case 'RECETA':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Historia Clínica Digital</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT SIDEBAR - FILTROS */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filtrar Archivos */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wider">
                Filtrar Archivos
              </h2>

              {/* Tipo de Documento */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Tipo de Documento
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-100 outline-none border border-gray-300"
                >
                  <option>Todos los documentos</option>
                  <option>CONSULTA GENERAL</option>
                  <option>LABORATORIO</option>
                  <option>RECETA</option>
                </select>
              </div>

              {/* Período */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Período
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-100 outline-none border border-gray-300"
                >
                  <option>Últimos 6 meses</option>
                  <option>Último mes</option>
                  <option>Último año</option>
                  <option>Todos</option>
                </select>
              </div>

              {/* Botón Filtros */}
              <button className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition mb-6">
                Aplicar Filtros
              </button>

              {/* Resumen Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📊</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Resumen</span>
                </div>
                <div className="text-4xl font-bold mb-2">12</div>
                <p className="text-sm text-blue-100">Consultas este año</p>
                <div className="w-full bg-blue-500 rounded-full h-2 mt-4 mb-2"></div>
                <p className="text-xs text-blue-100">Próxima revisión: 15 de Mayo</p>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3 space-y-6">
            {/* Actividad Reciente */}
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  ⏱️ Actividad Reciente
                </h2>
                <a href="#" className="text-blue-600 text-sm font-semibold hover:underline">
                  Ver todo
                </a>
              </div>

              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex gap-6">
                      {/* Date */}
                      <div className="text-center min-w-fit">
                        <div className="text-xs uppercase text-gray-600 font-semibold">
                          {doc.month}
                        </div>
                        <div className="text-3xl font-bold text-blue-600">{doc.day}</div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded ${getTypeColor(
                              doc.type
                            )}`}
                          >
                            {doc.type}
                          </span>
                          <span className="text-xs text-gray-600">ID: {doc.documentId}</span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">{doc.title}</h3>
                        <p className="text-sm text-gray-600 italic">{doc.description}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold">
                          👁️ Ver
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2">
                          ⬇️ PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medicamentos Activos */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                💊 Medicamentos Activos
              </h2>

              <div className="space-y-3">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between p-4 border-l-4 border-blue-600 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">{med.name}</h3>
                      <p className="text-sm text-gray-600">
                        {med.dosage} - {med.frequency}
                      </p>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 text-xl">ℹ️</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}