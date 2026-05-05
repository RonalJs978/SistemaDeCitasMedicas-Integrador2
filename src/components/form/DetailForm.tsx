export default function DetailForm() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">
        Detalles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          className="p-3 rounded-lg bg-gray-100 outline-none"
          placeholder="Email de contacto"
        />
        <input
          className="p-3 rounded-lg bg-gray-100 outline-none"
          placeholder="Email de contacto"
        />
      </div>

      <input
        className="w-full p-3 rounded-lg bg-gray-100 outline-none"
        placeholder="Dirección / Teléfono"
      />
    </div>
  );
}