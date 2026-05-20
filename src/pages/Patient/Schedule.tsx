// src/pages/Patient/Schedule.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Stethoscope } from "lucide-react";

import {
  AVAILABLE_TIMES,
  createAppointment,
  getDoctorsBySpecialty,
  getOccupiedTimes,
  getSpecialties,
} from "../../lib/appointment-service";

const Schedule = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState<any[]>([]);

  const [doctors, setDoctors] = useState<any[]>([]);

  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const [selectedDate, setSelectedDate] = useState("");

  const [selectedTime, setSelectedTime] = useState("");

  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);

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
    if (!selectedSpecialty) return;

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
      LOAD OCCUPIED TIMES
  ===================================== */
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;

    loadOccupiedTimes();
  }, [selectedDoctor, selectedDate]);

  const loadOccupiedTimes = async () => {
    try {
      const data = await getOccupiedTimes(selectedDoctor.id, selectedDate);

      setOccupiedTimes(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* =====================================
      CONFIRM APPOINTMENT
  ===================================== */
  const handleConfirm = async () => {
    try {
      if (!selectedDoctor || !selectedDate || !selectedTime) {
        return alert("Completa todos los campos");
      }

      setLoading(true);

      await createAppointment({
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
      });

      alert("Cita agendada correctamente");

      setSelectedTime("");

      loadOccupiedTimes();
    } catch (error: any) {
      console.error(error);

      alert(error.message || "Error al agendar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`

        .schedule-container{
          width:100%;
          min-height:100vh;
          padding:10px;
        }

        .header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:30px;
        }

        .title{
          font-size:42px;
          color:#17458f;
          font-weight:bold;
        }

        .appointments-btn{
          border:none;
          background:#17458f;
          color:white;
          padding:14px 22px;
          border-radius:14px;
          font-weight:bold;
          cursor:pointer;
        }

        .content{
          display:flex;
          gap:30px;
        }

        .left{
          width:420px;
        }

        .right{
          flex:1;
        }

        .card{
          background:white;
          border-radius:26px;
          padding:25px;
          box-shadow:0 2px 10px rgba(0,0,0,0.05);
          margin-bottom:25px;
        }

        .section-title{
          font-size:24px;
          font-weight:bold;
          margin-bottom:25px;
        }

        .label{
          display:block;
          margin-bottom:10px;
          color:#666;
          font-weight:bold;
          font-size:14px;
        }

        .select,
        .date-input{
          width:100%;
          padding:16px;
          border:none;
          border-radius:14px;
          background:#f1f3f7;
          outline:none;
          margin-bottom:20px;
          font-size:15px;
        }

        .doctor-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(230px,1fr));
          gap:20px;
        }

        .doctor-card{
          background:white;
          border-radius:22px;
          padding:20px;
          cursor:pointer;
          border:3px solid transparent;
          transition:0.3s;
          box-shadow:0 2px 10px rgba(0,0,0,0.04);
        }

        .doctor-card:hover{
          transform:translateY(-4px);
        }

        .doctor-card.active{
          border-color:#17458f;
        }

        .doctor-image-container{
          width:90px;
          height:90px;
          border-radius:50%;
          background:#e5e7eb;
          margin:0 auto 18px;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
        }

        .doctor-image{
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .doctor-default-icon{
          font-size:36px;
          color:#17458f;
        }

        .doctor-name{
          text-align:center;
          font-weight:bold;
          margin-bottom:8px;
          font-size:18px;
        }

        .doctor-specialty{
          text-align:center;
          color:#666;
        }

        .times-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:15px;
        }

        .time-btn{
          border:none;
          background:#f1f3f7;
          padding:15px;
          border-radius:14px;
          cursor:pointer;
          font-weight:bold;
          transition:0.3s;
        }

        .time-btn:hover{
          background:#dfe7ff;
        }

        .time-btn.active{
          background:#17458f;
          color:white;
        }

        .summary-card{
          background:linear-gradient(
            135deg,
            #17458f,
            #2563eb
          );
          color:white;
        }

        .summary-row{
          display:flex;
          align-items:center;
          gap:15px;
          margin-bottom:22px;
        }

        .summary-icon{
          width:48px;
          height:48px;
          border-radius:14px;
          background:rgba(255,255,255,0.15);
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .summary-label{
          font-size:13px;
          opacity:0.8;
          margin-bottom:5px;
        }

        .summary-value{
          font-size:18px;
          font-weight:bold;
        }

        .confirm-btn{
          width:100%;
          border:none;
          background:white;
          color:#17458f;
          padding:18px;
          border-radius:16px;
          font-size:18px;
          font-weight:bold;
          cursor:pointer;
          margin-top:10px;
        }

        .empty-message{
          color:#999;
          text-align:center;
          padding:30px;
        }

        @media(max-width:1100px){
          .content{
            flex-direction:column;
          }

          .left{
            width:100%;
          }

          .doctor-grid{
            grid-template-columns:1fr;
          }

          .times-grid{
            grid-template-columns:repeat(2,1fr);
          }
        }

        @media(max-width:600px){
          .header{
            flex-direction:column;
            align-items:flex-start;
            gap:20px;
          }

          .title{
            font-size:32px;
          }

          .times-grid{
            grid-template-columns:1fr;
          }
        }
      `}</style>

      <div className="schedule-container">
        {/* HEADER */}
        <div className="header">
          <h1 className="title">Agenda una Cita</h1>

          <button
            className="appointments-btn"
            onClick={() => navigate("/patient/appointments")}
          >
            Citas agendadas
          </button>
        </div>

        <div className="content">
          {/* LEFT */}
          <div className="left">
            {/* FORM */}
            <div className="card">
              <h2 className="section-title">Detalles de la Cita</h2>

              {/* SPECIALTY */}
              <label className="label">Especialidad</label>

              <select
                className="select"
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

              {/* DATE */}
              <label className="label">Fecha</label>

              <input
                type="date"
                className="date-input"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* SUMMARY */}
            <div className="card summary-card">
              <h2
                className="section-title"
                style={{
                  color: "white",
                }}
              >
                Resumen
              </h2>

              <div className="summary-row">
                <div className="summary-icon">
                  <User />
                </div>

                <div>
                  <p className="summary-label">MÉDICO</p>

                  <p className="summary-value">
                    {selectedDoctor
                      ? `${selectedDoctor.nombre} ${selectedDoctor.apellido}`
                      : "--"}
                  </p>
                </div>
              </div>

              <div className="summary-row">
                <div className="summary-icon">
                  <Calendar />
                </div>

                <div>
                  <p className="summary-label">FECHA</p>

                  <p className="summary-value">{selectedDate || "--"}</p>
                </div>
              </div>

              <div className="summary-row">
                <div className="summary-icon">
                  <Clock />
                </div>

                <div>
                  <p className="summary-label">HORA</p>

                  <p className="summary-value">{selectedTime || "--"}</p>
                </div>
              </div>

              <button className="confirm-btn" onClick={handleConfirm}>
                {loading ? "Agendando..." : "Confirmar Cita"}
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right">
            {/* DOCTORS */}
            <div className="card">
              <h2 className="section-title">Seleccionar Médico</h2>

              {doctors.length === 0 ? (
                <div className="empty-message">Selecciona una especialidad</div>
              ) : (
                <div className="doctor-grid">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`doctor-card ${
                        selectedDoctor?.id === doctor.id ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedDoctor(doctor);

                        setSelectedTime("");
                      }}
                    >
                      <div className="doctor-image-container">
                        {doctor.foto_url ? (
                          <img
                            src={doctor.foto_url}
                            alt=""
                            className="doctor-image"
                          />
                        ) : (
                          <Stethoscope className="doctor-default-icon" />
                        )}
                      </div>

                      <p className="doctor-name">
                        Dr. {doctor.nombre} {doctor.apellido}
                      </p>

                      <p className="doctor-specialty">
                        {doctor.especialidades?.nombre}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TIMES */}
            {selectedDoctor && (
              <div className="card">
                <h2 className="section-title">Horarios Disponibles</h2>

                <div className="times-grid">
                  {AVAILABLE_TIMES.filter((time) => {
                    if (occupiedTimes.includes(time)) {
                      return false;
                    }

                    if (!selectedDate) {
                      return true;
                    }

                    const now = new Date();

                    const today = now.toISOString().split("T")[0];

                    if (selectedDate === today) {
                      const [hours, minutes] = time.split(":");

                      const timeDate = new Date();

                      timeDate.setHours(Number(hours));

                      timeDate.setMinutes(Number(minutes));

                      return timeDate > now;
                    }

                    return true;
                  }).map((time) => (
                    <button
                      key={time}
                      className={`time-btn ${
                        selectedTime === time ? "active" : ""
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Schedule;
