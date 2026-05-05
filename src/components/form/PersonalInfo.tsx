export default function PersonalInfoForm() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">
        Información personal
      </h3>

      <input
        className="w-full mb-4 p-3 rounded-lg bg-gray-100 outline-none"
        placeholder="Nombre completo"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select className="p-3 rounded-lg bg-gray-100 outline-none">
          <option>Cardiología</option>
        </select>

        <input
          className="p-3 rounded-lg bg-gray-100 outline-none"
          placeholder="ID de Doctor"
        />
      </div>
    </div>
  );
}