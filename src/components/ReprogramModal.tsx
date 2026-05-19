import { useEffect, useState } from "react";

import {
  Calendar,
  Clock,
  X,
} from "lucide-react";

import {
  AVAILABLE_TIMES,
  getOccupiedTimes,
  rescheduleAppointment,
} from "../lib/appointment-service";

interface Props {
  open: boolean;
  onClose: () => void;
  appointment: any;
  onSuccess: () => void;
}

const ReprogramModal = ({
  open,
  onClose,
  appointment,
  onSuccess,
}: Props) => {
  const [selectedDate,
    setSelectedDate] =
    useState("");

  const [selectedTime,
    setSelectedTime] =
    useState("");

  const [occupiedTimes,
    setOccupiedTimes] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (
      !appointment ||
      !selectedDate
    )
      return;

    loadOccupiedTimes();
  }, [selectedDate]);

  const loadOccupiedTimes =
    async () => {
      try {
        const data =
          await getOccupiedTimes(
            appointment.doctor_id,
            selectedDate
          );

        setOccupiedTimes(data);
      } catch (error) {
        console.error(error);
      }
    };

  const handleConfirm =
    async () => {
      try {
        if (
          !selectedDate ||
          !selectedTime
        ) {
          return alert(
            "Selecciona fecha y hora"
          );
        }

        setLoading(true);

        await rescheduleAppointment({
          appointmentId:
            appointment.id,

          doctorId:
            appointment.doctor_id,

          oldDate:
            appointment.fecha_hora,

          newDate:
            selectedDate,

          newTime:
            selectedTime,
        });
        /* RESET STATES */
setSelectedDate("");
setSelectedTime("");
setOccupiedTimes([]);

        alert(
          "Cita reprogramada"
        );

        onSuccess();

        onClose();
      } catch (error: any) {
        console.error(error);

        alert(
          error.message ||
            "Error al reprogramar"
        );
      } finally {
        setLoading(false);
      }
    };

  if (!open) return null;

  return (
    <>
      <style>{`
        .modal-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.5);
          backdrop-filter:blur(4px);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:9999;
          padding:20px;
        }

        .modal{
          width:100%;
          max-width:850px;
          background:white;
          border-radius:28px;
          overflow:hidden;
          animation:fadeIn .25s ease;
        }

        @keyframes fadeIn{
          from{
            opacity:0;
            transform:translateY(20px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        .modal-header{
          background:#17458f;
          color:white;
          padding:30px;
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
        }

        .modal-title{
          font-size:34px;
          font-weight:bold;
          margin-bottom:8px;
        }

        .modal-subtitle{
          opacity:0.8;
        }

        .close-btn{
          background:none;
          border:none;
          color:white;
          font-size:26px;
          cursor:pointer;
        }

        .modal-body{
          padding:35px;
        }

        .current-card{
          background:#f3f5f9;
          border-radius:24px;
          padding:25px;
          margin-bottom:35px;
        }

        .doctor-name{
          font-size:26px;
          font-weight:bold;
          color:#17458f;
          margin-bottom:10px;
        }

        .info{
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:10px;
          color:#555;
        }

        .grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:30px;
        }

        .section-title{
          font-size:22px;
          font-weight:bold;
          margin-bottom:20px;
        }

        .date-input{
          width:100%;
          border:none;
          background:#f3f5f9;
          padding:18px;
          border-radius:18px;
          font-size:16px;
          outline:none;
        }

        .times-grid{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:15px;
        }

        .time-btn{
          border:none;
          background:#f3f5f9;
          padding:18px;
          border-radius:16px;
          font-weight:bold;
          cursor:pointer;
          transition:0.3s;
        }

        .time-btn.active{
          background:#17458f;
          color:white;
        }

        .footer{
          display:flex;
          justify-content:flex-end;
          gap:20px;
          padding:30px;
          border-top:1px solid #eee;
        }

        .btn{
          border:none;
          padding:16px 28px;
          border-radius:16px;
          font-weight:bold;
          cursor:pointer;
          font-size:16px;
        }

        .cancel-btn{
          background:#eceff5;
        }

        .confirm-btn{
          background:#17458f;
          color:white;
        }

        @media(max-width:800px){
          .grid{
            grid-template-columns:1fr;
          }

          .footer{
            flex-direction:column;
          }

          .btn{
            width:100%;
          }

          .modal-title{
            font-size:28px;
          }
        }
      `}</style>

      <div
        className="modal-overlay"
        onClick={onClose}
      >
        <div
          className="modal"
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          {/* HEADER */}
          <div className="modal-header">
            <div>
              <h2 className="modal-title">
                Reprogramar Cita
              </h2>

              <p className="modal-subtitle">
                Ajusta tu horario
                según tu
                disponibilidad
              </p>
            </div>

            <button
              className="close-btn"
              onClick={onClose}
            >
              <X size={26} />
            </button>
          </div>

          {/* BODY */}
          <div className="modal-body">
            {/* CURRENT */}
            <div className="current-card">
              <p
                style={{
                  fontSize: 14,
                  color: "#666",
                  marginBottom: 10,
                  fontWeight:
                    "bold",
                }}
              >
                CITA ACTUAL
              </p>

              <h3 className="doctor-name">
                {
                  appointment
                    ?.doctores
                    ?.especialidades
                    ?.nombre
                }
              </h3>

              <div className="info">
                <Calendar size={16} />

                <span>
                  {new Date(
                    appointment.fecha_hora
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="info">
                <Clock size={16} />

                <span>
                  {appointment.fecha_hora
      .split("T")[1]
      .substring(0,5)}
                </span>
              </div>
            </div>

            {/* CONTENT */}
            <div className="grid">
              {/* DATE */}
              <div>
                <h3 className="section-title">
                  1. Selecciona Nueva
                  Fecha
                </h3>

                <input
                  type="date"
                  className="date-input"
                  min={
                    new Date()
                      .toISOString()
                      .split(
                        "T"
                      )[0]
                  }
                  value={
                    selectedDate
                  }
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* TIMES */}
              <div>
                <h3 className="section-title">
                  2. Horarios
                  Disponibles
                </h3>

                <div className="times-grid">
                  {AVAILABLE_TIMES
                    .filter(
                      (time) =>
                        !occupiedTimes.includes(
                          time
                        )
                    )
                    .map((time) => (
                      <button
                        key={time}
                        className={`time-btn ${
                          selectedTime ===
                          time
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedTime(
                            time
                          )
                        }
                      >
                        {time}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="footer">
            <button
              className="btn cancel-btn"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              className="btn confirm-btn"
              onClick={
                handleConfirm
              }
            >
              {loading
                ? "Reprogramando..."
                : "Confirmar Nueva Fecha"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReprogramModal;