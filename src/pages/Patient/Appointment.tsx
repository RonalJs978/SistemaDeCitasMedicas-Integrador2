import ReprogramModal from "../../components/ReprogramModal";
import {
  useEffect,
  useState,
} from "react";

import {
  Calendar,
  Clock,
  FileText,
  User,
} from "lucide-react";

import {
  cancelAppointment,
  getPatientAppointments,
} from "../../lib/appointment-service";

const Appointments = () => {
  const [appointments,
    setAppointments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [openModal,
    setOpenModal] =
    useState(false);

  const [selectedAppointment,
    setSelectedAppointment] =
    useState<any>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments =
    async () => {
      try {
        const data =
          await getPatientAppointments();

        setAppointments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const handleCancel =
    async (id: string) => {
      const confirmCancel =
        confirm(
          "¿Cancelar esta cita?"
        );

      if (!confirmCancel) return;

      try {
        await cancelAppointment(id);

        loadAppointments();

        alert(
          "Cita cancelada"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Error al cancelar"
        );
      }
    };

  const now = new Date();

  const upcomingAppointments =
    appointments.filter(
      (appointment) =>
        new Date(
          appointment.fecha_hora
        ) >= now
    );

  const pastAppointments =
    appointments.filter(
      (appointment) => {
        const date =
          new Date(
            appointment.fecha_hora
          );

        const diffDays =
          (now.getTime() -
            date.getTime()) /
          (1000 * 60 * 60 * 24);

        return (
          date < now &&
          diffDays <= 3
        );
      }
    );

  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
          font-family:Arial;
        }

        .appointments-container{
          min-height:100vh;
          padding:10px;
        }

        .title{
          font-size:42px;
          color:#17458f;
          font-weight:bold;
          margin-bottom:40px;
        }

        .section{
          margin-bottom:50px;
        }

        .section-title{
          font-size:28px;
          font-weight:bold;
          margin-bottom:25px;
        }

        .appointments-grid{
          display:grid;
          grid-template-columns:
            repeat(auto-fill,minmax(350px,1fr));
          gap:25px;
        }

        .appointment-card{
          background:white;
          border-radius:24px;
          padding:25px;
          box-shadow:0 2px 10px rgba(0,0,0,0.05);
        }

        .status{
          display:inline-block;
          background:#dbeafe;
          color:#17458f;
          padding:8px 14px;
          border-radius:999px;
          font-size:13px;
          font-weight:bold;
          margin-bottom:18px;
        }

        .doctor-row{
          display:flex;
          gap:18px;
          align-items:center;
          margin-bottom:20px;
        }

        .doctor-image-container{
          width:70px;
          height:70px;
          border-radius:50%;
          overflow:hidden;
          background:#e5e7eb;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .doctor-image{
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .doctor-icon{
          font-size:30px;
          color:#17458f;
        }

        .doctor-name{
          font-size:22px;
          font-weight:bold;
          margin-bottom:5px;
        }

        .specialty{
          color:#666;
        }

        .info-row{
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:10px;
          color:#444;
        }

        .actions{
          display:flex;
          gap:15px;
          margin-top:25px;
        }

        .btn{
          border:none;
          padding:14px 18px;
          border-radius:14px;
          font-weight:bold;
          cursor:pointer;
        }

        .primary-btn{
          background:#17458f;
          color:white;
        }

        .secondary-btn{
          background:#eceff5;
          color:#333;
        }

        .empty{
          color:#999;
        }

        @media(max-width:700px){
          .appointments-grid{
            grid-template-columns:1fr;
          }

          .doctor-row{
            flex-direction:column;
            text-align:center;
          }

          .actions{
            flex-direction:column;
          }

          .btn{
            width:100%;
          }
        }
      `}</style>
      
      <div className="appointments-container">
        <h1 className="title">
          Citas Agendadas
        </h1>

        <ReprogramModal open={openModal} appointment={selectedAppointment} onClose={() => setOpenModal(false)} onSuccess={loadAppointments}/>

        {/* UPCOMING */}
        <div className="section">
          <h2 className="section-title">
            Próximas Citas
          </h2>

          <div className="appointments-grid">
            {upcomingAppointments.length ===
            0 ? (
              <p className="empty">
                No tienes próximas
                citas
              </p>
            ) : (
              upcomingAppointments.map(
                (appointment) => (
                  <div
                    key={
                      appointment.id
                    }
                    className="appointment-card"
                  >
                    <div className="status">
                      PENDIENTE
                    </div>

                    <div className="doctor-row">
                      <div className="doctor-image-container">
                        {appointment
                          .doctores
                          ?.foto_url ? (
                          <img
                            src={
                              appointment
                                .doctores
                                .foto_url
                            }
                            className="doctor-image"
                          />
                        ) : (
                          <User className="doctor-icon" />
                        )}
                      </div>

                      <div>
                        <p className="doctor-name">
                          Dr.{" "}
                          {
                            appointment
                              .doctores
                              ?.nombre
                          }{" "}
                          {
                            appointment
                              .doctores
                              ?.apellido
                          }
                        </p>

                        <p className="specialty">
                          {
                            appointment
                              .doctores
                              ?.especialidades
                              ?.nombre
                          }
                        </p>
                      </div>
                    </div>

                    <div className="info-row">
                      <Calendar />

                      <span>
                        {new Date(
                          appointment.fecha_hora
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="info-row">
                      <Clock />

                      <span>
                        {appointment.fecha_hora
  .split("T")[1]
  .substring(0,5)}
                      </span>
                    </div>

                    <div className="actions">
                      <button
                        className="btn primary-btn"
                        onClick={() => {
                          setSelectedAppointment(
                            appointment
                          );

                          setOpenModal(true);
                        }}
                        >
                        Reprogramar
                    </button>

                      <button
                        className="btn secondary-btn"
                        onClick={() =>
                          handleCancel(
                            appointment.id
                          )
                        }
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>

        

        {/* PAST */}
        <div className="section">
          <h2 className="section-title">
            Citas Pasadas
          </h2>

          <div className="appointments-grid">
            {pastAppointments.length ===
            0 ? (
              <p className="empty">
                No hay citas pasadas
              </p>
            ) : (
              pastAppointments.map(
                (appointment) => (
                  <div
                    key={
                      appointment.id
                    }
                    className="appointment-card"
                  >
                    <div className="doctor-row">
                      <div className="doctor-image-container">
                        {appointment
                          .doctores
                          ?.foto_url ? (
                          <img
                            src={
                              appointment
                                .doctores
                                .foto_url
                            }
                            className="doctor-image"
                          />
                        ) : (
                          <User className="doctor-icon" />
                        )}
                      </div>

                      <div>
                        <p className="doctor-name">
                          Dr.{" "}
                          {
                            appointment
                              .doctores
                              ?.nombre
                          }{" "}
                          {
                            appointment
                              .doctores
                              ?.apellido
                          }
                        </p>

                        <p className="specialty">
                          {
                            appointment
                              .doctores
                              ?.especialidades
                              ?.nombre
                          }
                        </p>
                      </div>
                    </div>

                    <div className="info-row">
                      <Calendar />

                      <span>
                        {new Date(
                          appointment.fecha_hora
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="actions">
                      <button className="btn secondary-btn">
                        <FileText />
                        &nbsp;
                        Receta
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointments;