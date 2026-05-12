interface DetailFormProps {
  bio?: string
  onBioChange?: (value: string) => void
  isAvailable?: boolean
  onIsAvailableChange?: (value: boolean) => void
}

export default function DetailForm({
  bio = '',
  onBioChange,
  isAvailable = true,
  onIsAvailableChange
}: DetailFormProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">
        Detalles
      </h3>

      <textarea
        className="w-full p-3 rounded-lg bg-gray-100 outline-none mb-4"
        placeholder="Biografía del doctor"
        rows={4}
        value={bio}
        onChange={(e) => onBioChange?.(e.target.value)}
      />

      <div className="flex items-center gap-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => onIsAvailableChange?.(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="ml-2 text-gray-700 font-medium">
            {isAvailable ? 'Disponible' : 'No disponible'}
          </span>
        </label>
      </div>
    </div>
  );
}