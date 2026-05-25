import { useEffect, useState, useRef } from "react";
import { User, UserPen, Shield, Mail, Calendar } from "lucide-react";

import {
  getPatientProfile,
  updatePatientProfile,
  uploadPatientAvatar,
} from "./patient-service";

const Config = () => {
  const [profile, setProfile] = useState<any>({
    dni: "",
    fecha_nac: "",
    direccion: "",
    alergias: "",
    foto_url: "",
    email: "",
    full_name: "",
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* =====================================
      CARGAR PERFIL
  ===================================== */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getPatientProfile();
      setProfile(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
      SUBIR FOTO
  ===================================== */
  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      const imageUrl = await uploadPatientAvatar(file);
      setProfile((prev: any) => ({
        ...prev,
        foto_url: imageUrl,
      }));
      alert("Foto de perfil actualizada");
    } catch (error) {
      console.error(error);
      alert("Error al subir imagen");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
      GUARDAR
  ===================================== */
  const handleSave = async () => {
    try {
      setLoading(true);
      await updatePatientProfile(profile);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight">
            Notificaciones y Ajustes
          </h1>
          <p className="text-gray-500 mt-2">
            Administra tu información personal, preferencias de alertas y seguridad de tu cuenta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: PROFILE CARD & SECURITY */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
              {/* Profile Avatar Header */}
              <div className="flex items-center gap-5 pb-5 border-b border-gray-100">
                <div className="relative group cursor-pointer shrink-0" onClick={triggerFileSelect}>
                  <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-gray-50 flex items-center justify-center overflow-hidden shadow-sm group-hover:opacity-95 transition-all">
                    {profile.foto_url ? (
                      <img
                        src={profile.foto_url}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-9 h-9 text-blue-900/60" />
                    )}
                  </div>

                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center shadow shadow-blue-950/20 group-hover:scale-105 transition-transform">
                    <UserPen className="w-4 h-4" />
                  </div>
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-gray-800 truncate">
                    {profile.full_name || "Paciente"}
                  </h2>
                  <p className="text-sm text-gray-400 truncate">{profile.email}</p>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadAvatar}
              />

              {/* FORM FIELDS */}
              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-700 font-medium text-sm"
                    value={profile.full_name || ""}
                    placeholder="Completa tu nombre"
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        full_name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Email (Disabled) */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed font-medium text-sm"
                    value={profile.email || ""}
                    disabled
                  />
                </div>

                {/* DNI */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    DNI / Documento
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-700 font-medium text-sm"
                    value={profile.dni || ""}
                    placeholder="Completa tu DNI"
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        dni: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Fecha Nacimiento */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-700 font-medium text-sm"
                    value={profile.fecha_nac || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        fecha_nac: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-700 font-medium text-sm"
                    value={profile.direccion || ""}
                    placeholder="Completa tu dirección"
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        direccion: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Alergias */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Alergias Conocidas
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-700 font-medium text-sm"
                    value={profile.alergias || ""}
                    placeholder="Ej. Ninguna, Penicilina, Mariscos"
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        alergias: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Password link */}
              <div className="pt-2">
                <button
                  type="button"
                  className="text-sm font-bold text-blue-900 hover:text-blue-800 transition-colors"
                  onClick={() => alert("Función próximamente disponible")}
                >
                  Cambiar contraseña
                </button>
              </div>
            </div>

            {/* SECURITY INFO */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-900 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-900 mb-1">Tus datos están protegidos</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  AuraHealth utiliza cifrado avanzado para asegurar que tu información personal y clínica permanezca estrictamente confidencial bajo normativas médicas vigentes.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PREFERENCES */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* TOP DUAL CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Calendar card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between gap-4">
                <div className="flex justify-between items-center">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                  </label>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-1">Añadir al Calendario</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Sincroniza y guarda automáticamente las citas médicas en tu calendario de preferencia (Google, Outlook, etc.).
                  </p>
                </div>
              </div>

              {/* Email card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between gap-4">
                <div className="flex justify-between items-center">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                  </label>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-1">Email Informativo</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Recibe recordatorios de cita, recetas y boletines mensuales de salud en tu correo electrónico principal.
                  </p>
                </div>
              </div>
            </div>

            {/* PREFERENCES LIST */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-50">
                Preferencias de Frecuencia
              </h2>

              <div className="space-y-6">
                {/* Reminders time */}
                <div className="flex justify-between items-center gap-4">
                  <div className="max-w-[70%]">
                    <h4 className="text-sm font-bold text-gray-700 mb-1">Recordatorios de Cita</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">¿Con cuánta anticipación deseas ser avisado de tu cita?</p>
                  </div>
                  <button className="px-4 py-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-700 transition-all cursor-pointer">
                    24 horas antes
                  </button>
                </div>

                {/* Prescription expiry */}
                <div className="flex justify-between items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="max-w-[70%]">
                    <h4 className="text-sm font-bold text-gray-700 mb-1">Vencimiento de Recetas</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Alertas de renovación cuando tus tratamientos estén por vencer.</p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer group shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                  </label>
                </div>

                {/* Wellness Content */}
                <div className="flex justify-between items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="max-w-[70%]">
                    <h4 className="text-sm font-bold text-gray-700 mb-1">Contenido de Bienestar</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Artículos de prevención, tips de nutrición y boletines médicos.</p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer group shrink-0">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end items-center gap-4 mt-2">
              <button
                className="px-5 py-3 rounded-xl font-bold text-sm text-gray-500 hover:text-gray-750 transition-colors cursor-pointer"
                onClick={loadProfile}
              >
                Cancelar
              </button>

              <button
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer bg-blue-900 hover:bg-blue-800 text-white shadow-blue-900/10`}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Config;
