import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import {
  User,
  UserPen,
  Mail,
  Phone,
  MapPin,
  Lock,
  X,
  Stethoscope,
  ChevronDown,
} from "lucide-react";

interface Specialty {
  id: string;
  nombre: string;
}

const DoctorProfileEdit = () => {
  const [profile, setProfile] = useState<any>({
    id: "",
    nombre: "",
    apellido: "",
    fullName: "",
    especialidad_id: "",
    especialidad_nombre: "",
    bio: "",
    telefono: "",
    direccion: "",
    foto_url: "",
    email: "",
  });

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Modal de contraseña
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDoctorProfile();
    loadSpecialties();
  }, []);

  const loadDoctorProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Obtener datos de la tabla 'doctores'
      const { data: docData, error: docError } = await supabase
        .from("doctores")
        .select(`
          *,
          especialidades (
            id,
            nombre
          )
        `)
        .eq("usuario_id", user.id)
        .single();

      if (docError) throw docError;

      // 2. Obtener datos de la tabla 'usuarios' (email)
      const { data: userData } = await supabase
        .from("usuarios")
        .select("email")
        .eq("id", user.id)
        .single();

      const docNombre = docData.nombre || user.user_metadata?.full_name?.split(" ")[0] || "Julián";
      const docApellido = docData.apellido || user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "Rivera";
      const combinedFullName = `${docNombre} ${docApellido}`.trim();

      setProfile({
        id: docData.id,
        nombre: docNombre,
        apellido: docApellido,
        fullName: combinedFullName,
        especialidad_id: docData.especialidad_id || "",
        especialidad_nombre: docData.especialidades?.nombre || "Cardiología",
        bio: docData.bio || "Especialista con más de 12 años de experiencia en cardiología intervencionista. Formado en el Instituto Nacional de Cardiología, con enfoque en medicina preventiva y salud cardiovascular integral.",
        telefono: docData.telefono || "+34 612 345 678",
        direccion: docData.direccion || "Av. San Martín 450, Torre Médica Aura, Consultorio 402",
        foto_url: docData.foto_url || "",
        email: userData?.email || user.email || "julian.rivera@aurahealth.com",
      });
    } catch (error) {
      console.error("Error al cargar perfil de doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSpecialties = async () => {
    try {
      const { data } = await supabase
        .from("especialidades")
        .select("id, nombre")
        .eq("is_active", true)
        .order("nombre");
      setSpecialties(data || []);
    } catch (error) {
      console.error("Error al cargar especialidades:", error);
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `doctors/${fileName}`;

      // Subir al bucket 'doctores-fotos'
      const { error: uploadError } = await supabase.storage
        .from("doctores-fotos")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("doctores-fotos")
        .getPublicUrl(filePath);

      setProfile((prev: any) => ({
        ...prev,
        foto_url: data.publicUrl,
      }));
      alert("Foto de perfil actualizada correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Dividir el nombre completo en nombre y apellido de forma segura
      const nameParts = profile.fullName.trim().split(" ");
      const nombre = nameParts[0] || "";
      const apellido = nameParts.slice(1).join(" ") || "";

      // 1. Actualizar tabla 'doctores'
      const { error: doctorError } = await supabase
        .from("doctores")
        .update({
          nombre: nombre,
          apellido: apellido,
          bio: profile.bio,
          telefono: profile.telefono,
          direccion: profile.direccion,
          especialidad_id: profile.especialidad_id,
          foto_url: profile.foto_url,
        })
        .eq("usuario_id", user.id);

      if (doctorError) throw doctorError;

      // 2. Actualizar tabla 'usuarios'
      const { error: userError } = await supabase
        .from("usuarios")
        .update({
          full_name: profile.fullName,
        })
        .eq("id", user.id);

      if (userError) throw userError;

      // Obtener el nombre del select para actualizar la vista local
      const matchedSpecialty = specialties.find(s => s.id === profile.especialidad_id);

      setProfile((prev: any) => ({
        ...prev,
        nombre: nombre,
        apellido: apellido,
        especialidad_nombre: matchedSpecialty ? matchedSpecialty.nombre : prev.especialidad_nombre,
      }));

      alert("Perfil actualizado correctamente");
      loadDoctorProfile();
    } catch (error) {
      console.error(error);
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return alert("La contraseña debe tener al menos 6 caracteres");
    }
    if (newPassword !== confirmPassword) {
      return alert("Las contraseñas no coinciden");
    }

    try {
      setPasswordLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      alert("Contraseña establecida correctamente. Ya cuentas con credenciales formales.");
      setOpenPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al actualizar la contraseña");
    } finally {
      setPasswordLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        {/* TITLE */}
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
          Editar Perfil
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: AVATAR CARD */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-5" onClick={triggerFileSelect}>
              <div className="w-40 h-40 rounded-full bg-blue-50 border-4 border-gray-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:opacity-90 transition-all">
                {profile.foto_url ? (
                  <img
                    src={profile.foto_url}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-blue-900/60" />
                )}
              </div>

              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white text-xs font-bold animate-pulse">
                  Subiendo...
                </div>
              )}

              <div className="absolute bottom-1 right-2 w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center shadow shadow-blue-950/20 group-hover:scale-105 transition-transform">
                <UserPen className="w-5 h-5" />
              </div>
            </div>

            {/* Hidden upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadAvatar}
            />

            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-snug">
              Dr. {profile.nombre} {profile.apellido}
            </h2>
            
            <span className="inline-block mt-1 px-4 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-widest">
              {profile.especialidad_nombre}
            </span>
          </div>

          {/* RIGHT PANEL: INFO FORMS */}
          <div className="lg:col-span-8 space-y-6">
            {/* CARD 1: INFORMACIÓN PROFESIONAL */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Información Profesional
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* Nombre completo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-650 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-700 font-medium text-sm"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                  />
                </div>

                {/* Especialidad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-650 mb-2">
                    Especialidad
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-700 font-medium text-sm appearance-none"
                      value={profile.especialidad_id}
                      onChange={(e) =>
                        setProfile({ ...profile, specialtyId: e.target.value })
                      }
                    >
                      <option value="">Selecciona tu especialidad</option>
                      {specialties.map((esp) => (
                        <option key={esp.id} value={esp.id}>
                          {esp.nombre}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Biografía */}
              <div>
                <label className="block text-sm font-semibold text-gray-650 mb-2">
                  Biografía Profesional
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-700 font-medium text-sm resize-none mb-2"
                  placeholder="Cuéntanos acerca de tu formación, enfoque médico y trayectoria..."
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                />
                <p className="text-xs text-gray-450 leading-normal">
                  Describe tu trayectoria y enfoque médico para tus pacientes.
                </p>
              </div>
            </div>

            {/* CARD 2: DETALLES DE CONTACTO */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Detalles de Contacto
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* Correo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-650 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed font-medium text-sm"
                      value={profile.email}
                      disabled
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-650 mb-2">
                    Teléfono de Contacto
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-700 font-medium text-sm"
                      placeholder="Ej. +34 612 345 678"
                      value={profile.telefono}
                      onChange={(e) =>
                        setProfile({ ...profile, telefono: e.target.value })
                      }
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-semibold text-gray-655 mb-2">
                  Dirección de Consultorio
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-700 font-medium text-sm"
                    placeholder="Ej. Av. San Martín 450, Torre Médica Aura, Consultorio 402"
                    value={profile.direccion}
                    onChange={(e) =>
                      setProfile({ ...profile, direccion: e.target.value })
                    }
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* CARD 3: SEGURIDAD Y ACCESO */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-900" />
                  Seguridad y Acceso
                </h2>
                <p className="text-xs text-gray-450 leading-relaxed max-w-md">
                  Establece tus credenciales definitivas cambiando tu contraseña temporal de 12 caracteres por una contraseña segura y definitiva.
                </p>
              </div>

              <button
                type="button"
                className="px-5 py-3 rounded-xl font-bold text-sm bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-100 transition-all cursor-pointer whitespace-nowrap"
                onClick={() => setOpenPasswordModal(true)}
              >
                Establecer Credenciales Formales
              </button>
            </div>

            {/* BOTTOM GENERAL ACTIONS */}
            <div className="flex justify-end items-center gap-4 pt-2">
              <button
                type="button"
                className="px-5 py-3 rounded-xl font-bold text-sm text-gray-500 hover:text-gray-750 transition-colors cursor-pointer"
                onClick={loadDoctorProfile}
              >
                Descartar Cambios
              </button>

              <button
                type="button"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-blue-900 hover:bg-blue-800 text-white shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PASSWORD CHANGE MODAL */}
      {openPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-950 text-white p-6 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">Credenciales Formales</h3>
                <p className="text-xs text-blue-100/80 mt-1">
                  Establece una contraseña segura definitiva.
                </p>
              </div>
              <button
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all cursor-pointer"
                onClick={() => setOpenPasswordModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleChangePassword}>
              <div className="p-6 space-y-4">
                {/* Nueva clave */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-sm text-gray-700"
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                {/* Confirmar clave */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-sm text-gray-700"
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-100">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-150 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                  onClick={() => setOpenPasswordModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {passwordLoading ? "Estableciendo..." : "Guardar Contraseña"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfileEdit;