import { useEffect, useState } from "react";
import { FileTextIcon, History, Pill } from "lucide-react";
import { getMedicalHistory } from "../../lib/medical-history-service";

const MedicalHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getMedicalHistory();

      setHistory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "consulta":
        return "#dbeafe";

      case "receta":
        return "#ede9fe";

      case "analisis":
        return "#fee2e2";

      default:
        return "#eceff5";
    }
  };

  return (
    <>
      <style>{`

        .history-container{
          min-height:100vh;
          background:#f3f5f9;
          padding:30px;
        }

        .title{
          font-size:44px;
          font-weight:bold;
          color:#17458f;
          margin-bottom:40px;
        }

        .content{
          display:grid;
          grid-template-columns:
            1fr 340px;
          gap:30px;
        }

        .panel{
          background:white;
          border-radius:28px;
          padding:30px;
        }

        .section-title{
          font-size:30px;
          font-weight:bold;
          margin-bottom:30px;
          display:flex;
          align-items:center;
          gap:14px;
        }

        .history-list{
          display:flex;
          flex-direction:column;
          gap:22px;
        }

        .history-card{
          background:#f9fafb;
          border-radius:22px;
          padding:22px;
          display:flex;
          justify-content:space-between;
          gap:20px;
        }

        .date-box{
          min-width:80px;
          height:80px;
          border-radius:18px;
          background:white;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          font-weight:bold;
        }

        .month{
          font-size:13px;
          color:#666;
        }

        .day{
          font-size:28px;
          color:#17458f;
        }

        .card-content{
          flex:1;
        }

        .type{
          display:inline-block;
          padding:7px 14px;
          border-radius:999px;
          font-size:12px;
          font-weight:bold;
          margin-bottom:12px;
        }

        .record-title{
          font-size:28px;
          font-weight:bold;
          margin-bottom:10px;
        }

        .description{
          color:#555;
          line-height:1.6;
        }

        .pdf-btn{
          border:none;
          background:#17458f;
          color:white;
          padding:14px 20px;
          border-radius:14px;
          font-weight:bold;
          cursor:pointer;
          height:fit-content;
          display:flex;
          align-items:center;
          gap:10px;
        }

        .empty-card{
          background:white;
          border-radius:24px;
          padding:40px;
          text-align:center;
          color:#777;
        }

        .medications-box{
          background:white;
          border-radius:28px;
          padding:30px;
          margin-top:30px;
        }

        .medications-empty{
          background:#f9fafb;
          border-radius:18px;
          padding:40px;
          text-align:center;
          color:#999;
          margin-top:20px;
        }

        @media(max-width:900px){

          .content{
            grid-template-columns:1fr;
          }

          .history-card{
            flex-direction:column;
          }

          .record-title{
            font-size:22px;
          }

          .pdf-btn{
            width:100%;
            justify-content:center;
          }
        }
      `}</style>

      <div className="history-container">
        <h1 className="title">Historia Clínica Digital</h1>

        <div className="content">
          {/* LEFT */}
          <div>
            <div className="panel">
              <h2 className="section-title">
                <History />
                Actividad Reciente
              </h2>

              {history.length === 0 ? (
                <div className="empty-card">
                  No hay documentos médicos disponibles.
                </div>
              ) : (
                <div className="history-list">
                  {history.map((item) => {
                    const date = new Date(item.created_at);

                    const month = date.toLocaleString("es-PE", {
                      month: "short",
                    });

                    const day = date.getDate();

                    return (
                      <div key={item.id} className="history-card">
                        <div className="date-box">
                          <span className="month">{month.toUpperCase()}</span>

                          <span className="day">{day}</span>
                        </div>

                        <div className="card-content">
                          <div
                            className="type"
                            style={{
                              background: getTypeColor(item.tipo),
                            }}
                          >
                            {item.tipo}
                          </div>

                          <h3 className="record-title">{item.titulo}</h3>

                          <p className="description">{item.descripcion}</p>
                        </div>

                        {item.pdf_url && (
                          <a href={item.pdf_url} target="_blank">
                            <button className="pdf-btn">
                              <FileTextIcon />
                              PDF
                            </button>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* MEDICATIONS */}
            <div className="medications-box">
              <h2 className="section-title">
                <Pill />
                Medicamentos Activos
              </h2>

              <div className="medications-empty">
                Próximamente podrás visualizar tus medicamentos activos.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalHistory;
