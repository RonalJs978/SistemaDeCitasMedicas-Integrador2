export default function ProfileUpload() {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 h-48 bg-white">
      <p className="text-gray-600 font-medium">Subir foto de perfil</p>
      <span className="text-sm text-gray-400 mt-1">
        PNG, JPG hasta 5MB
      </span>
    </div>
    
  );
}