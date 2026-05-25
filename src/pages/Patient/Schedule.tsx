// src/pages/Patient/Schedule.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Stethoscope, AlertCircle } from "lucide-react";

import {
  createAppointment,
  getDoctorsBySpecialty,
  getSpecialties,
} from "../../lib/appointment-service";
import { availabilityService } from "../../lib/availability-service";

const Schedule = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isDoctorBlocked, setIsDoctorBlocked] = useState(false);
  const [doctorBlockReason, setDoctorBlockReason] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =====================================
      LOAD SPECIALTIES
  ===================================== */
  useEffect(() => {
    loadSpecialties();
  }, []);

  const loadSpecialties = async () => {
    try {
      const data = await getSpecialties();
      setSpecialties(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* =====================================
      LOAD DOCTORS
  ===================================== */
  useEffect(() => {
    if (!selectedSpecialty) {
      setDoctors([]);
      setSelectedDoctor(null);
      setSelectedTime("");
      return;
    }
    loadDoctors();
  }, [selectedSpecialty]);

  const loadDoctors = async () => {
    try {
      const data = await getDoctorsBySpecialty(selectedSpecialty);
      setDoctors(data);
      setSelectedDoctor(null);
      setSelectedTime("");
    } catch (error) {
      console.error(error);
    }
  };

  /* =====================================
      LOAD AVAILABLE SLOTS
  ===================================== */
  useEffect(() => {
    setSelectedTime(""); // Limpiar hora seleccionada si cambia el doctor o la fecha
    if (!selectedDoctor || !selectedDate) {
      setAvailableSlots([]);
      setIsDoctorBlocked(false);
      return;
    }
    loadAvailableSlots();
  }, [selectedDoctor, selectedDate]);

  const loadAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const res = await availabilityService.getAvailableSlots(selectedDoctor.id, selectedDate);
      setAvailableSlots(res.slots);
      setIsDoctorBlocked(res.blocked);
      setDoctorBlockReason(res.blockReason || "");
    } catch (error) {
      console.error("Error al cargar horarios disponibles:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  /* =====================================
      CONFIRM APPOINTMENT
  ===================================== */
  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      return alert("Completa todos los campos");
    }

    if (isDoctorBlocked) {
      return alert("El médico no está disponible en la fecha seleccionada.");
    }

    try {
      setLoading(true);
      await createAppointment({
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
      });

      alert("Cita agendada correctamente");
      setSelectedTime("");
      loadAvailableSlots();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al agendar");
    } finally {
      setLoading(false);
    }
  };

  // Usar fecha local YYYY-MM-DD para evitar el desfase de zona horaria de toISOString()
  const localToday = new Date().toLocaleDateString('sv-SE');

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight">
              Agenda una Cita
            </h1>
            <p className="text-gray-500 mt-1">
              Selecciona especialidad, médico, fecha y hora para programar tu cita.
            </p>
          </div>

          <button
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-sm transition-all duration-200 cursor-pointer"
            onClick={() => navigate("/patient/appointments")}
          >
            Ver mis citas
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: FORM & SUMMARY */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* FORM CARD */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-50">
                Detalles de la Cita
              </h2>

              {/* SPECIALTY */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  Especialidad
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-700 font-medium"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="">Selecciona una especialidad</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}
              <div className="mb-2">
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  Fecha de Cita
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-700 font-medium"
                  value={selectedDate}
                  min={localToday}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* SUMMARY CARD */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white rounded-2xl p-6 shadow-md border-0">
              <h2 className="text-xl font-bold text-white mb-6 pb-2 border-b border-white/10">
                Resumen de Reserva
              </h2>

              <div className="space-y-4 mb-6">
                {/* Doctor */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-200/90 mb-0.5">
                      Médico Especialista
                    </p>
                    <p className="text-base font-bold text-white leading-tight">
                      {selectedDoctor
                        ? `Dr. ${selectedDoctor.nombre} ${selectedDoctor.apellido}`
                        : "No seleccionado"}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-200/90 mb-0.5">
                      Fecha de Cita
                    </p>
                    <p className="text-base font-bold text-white leading-tight">
                      {selectedDate || "No seleccionada"}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-200/90 mb-0.5">
                      Hora Seleccionada
                    </p>
                    <p className="text-base font-bold text-white leading-tight">
                      {selectedTime ? `${selectedTime} hrs` : "No seleccionada"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                className={`w-full py-4 font-bold rounded-xl text-lg transition-all shadow-sm flex items-center justify-center gap-2 ${
                  loading || isDoctorBlocked || !selectedDoctor || !selectedDate || !selectedTime
                    ? "bg-white/20 text-white/50 cursor-not-allowed border-0"
                    : "bg-white text-blue-955 hover:bg-blue-50 active:scale-[0.98] cursor-pointer"
                }`}
                onClick={handleConfirm}
                disabled={loading || isDoctorBlocked || !selectedDoctor || !selectedDate || !selectedTime}
              >
                {loading ? "Agendando..." : "Confirmar Cita"}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: DOCTORS & AVAILABILITY */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* DOCTOR SELECTION */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-50">
                Selecciona tu Médico
              </h2>

              {!selectedSpecialty ? (
                <div className="text-center text-gray-400 py-10 italic font-medium flex flex-col items-center justify-center gap-2">
                  <Stethoscope className="w-10 h-10 text-gray-300" />
                  <span>Selecciona una especialidad para ver los médicos disponibles</span>
                </div>
              ) : doctors.length === 0 ? (
                <div className="text-center text-gray-400 py-10 italic font-medium flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="w-10 h-10 text-gray-300" />
                  <span>No hay médicos disponibles para esta especialidad</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`bg-white rounded-xl p-4 cursor-pointer border-2 shadow-sm hover:shadow transition-all duration-200 flex flex-col items-center text-center group ${
                        selectedDoctor?.id === doctor.id
                          ? "border-blue-900 bg-blue-50/30 hover:border-blue-900"
                          : "border-transparent hover:border-gray-200"
                      }`}
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-150 flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform shadow-inner shrink-0">
                        {doctor.foto_url ? (
                          <img
                            src={doctor.foto_url}
                            alt={`Dr. ${doctor.nombre}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-blue-900/60" />
                        )}
                      </div>

                      <p className="text-base font-bold text-gray-800 leading-snug group-hover:text-blue-955 transition-colors">
                        Dr. {doctor.nombre} {doctor.apellido}
                      </p>

                      <p className="text-xs text-gray-500 font-medium mt-1">
                        {doctor.especialidades?.nombre || "Médico Especialista"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SLOTS SELECTION */}
            {selectedDoctor && selectedDate && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-50">
                  Horarios Disponibles
                </h2>

                {loadingSlots ? (
                  <div className="text-center text-gray-400 py-10 italic font-medium flex flex-col items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                    <span>Buscando horarios disponibles...</span>
                  </div>
                ) : isDoctorBlocked ? (
                  <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm font-medium">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                    <span>El médico no estará disponible: {doctorBlockReason || "Vacaciones / Licencia"}</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center text-gray-400 py-8 italic font-medium flex flex-col items-center justify-center gap-2 border border-dashed border-gray-200 rounded-xl">
                    <Clock className="w-8 h-8 text-gray-300" />
                    <span>No hay horarios disponibles para esta fecha. Selecciona otra fecha.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer text-center ${
                          selectedTime === time
                            ? "bg-blue-900 text-white border-blue-900 hover:bg-blue-800"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50/50 hover:border-blue-300"
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time} hrs
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
