export default function CredentialsUpload() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">
        Credenciales y documentos
      </h3>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">
        <p className="text-gray-600 mb-2">
          Soltar certificaciones médicas aquí
        </p>
        <span className="text-sm text-gray-400 block mb-4">
          PDF, DOCX hasta 10MB
        </span>

        <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
          Subir archivos
        </button>
      </div>
    </div>
  );
}