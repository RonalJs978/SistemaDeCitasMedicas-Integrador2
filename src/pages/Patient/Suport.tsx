// src/pages/Patient/Suport.tsx

import { useState } from "react";

import {
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Copy,
} from "lucide-react";

import { sendAnonymousFeedback } from "../../lib/support-service";

const questions = [
  {
    question: "¿Cómo cancelar una cita médica?",
    answer: "",
  },
  {
    question: "¿Dónde descargar mis resultados?",
    answer: "",
  },
  {
    question: "¿Cómo cambiar mis datos de contacto?",
    answer: "",
  },
];

const Suport = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  /* =====================================
      COPIAR TELÉFONO
  ===================================== */
  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText("+51 981 123 456");
      alert("Número copiado");
    } catch (error) {
      console.error(error);
    }
  };

  /* =====================================
      ENVIAR FEEDBACK
  ===================================== */
  const handleSubmit = async () => {
    try {
      if (!message.trim()) {
        return alert("Escribe un mensaje");
      }

      setLoading(true);

      await sendAnonymousFeedback(message, rating);

      alert("Feedback enviado correctamente");

      setMessage("");
      setRating(5);
    } catch (error) {
      console.error(error);

      alert("Error al enviar feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] p-[10px]">
      <h1 className="text-[48px] text-[#17458f] mb-[40px]">
        Centro de Soporte
      </h1>

      <div className="flex gap-[30px] flex-col lg:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-[320px] flex flex-col gap-[20px]">
          {/* LLAMANOS */}
          <div className="bg-white rounded-[24px] p-[22px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex items-center gap-[18px]">
              <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center text-[22px] bg-[#dfe7ff] text-[#17458f]">
                <Phone />
              </div>

              <div>
                <p className="text-[15px] text-[#555] mb-[5px]">Llámanos</p>
                <p className="text-[20px]  text-[#17458f]">+51 981 123 456</p>
              </div>
            </div>

            <button
              className="border-none bg-none text-[22px] text-[#b7bfd3] cursor-pointer"
              onClick={copyPhone}
            >
              <Copy />
            </button>
          </div>

          {/* WHATSAPP */}
          <a
            href="https://www.whatsapp.com/"
            target="_blank"
            rel="noreferrer"
            className="no-underline"
          >
            <div className="bg-white rounded-[24px] p-[22px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-between">
              <div className="flex items-center gap-[18px]">
                <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center text-[22px] bg-[#dff7e5] text-[#22c55e]">
                  <MessageCircle />
                </div>

                <div>
                  <p className="text-[15px] text-[#555] mb-[5px]">WhatsApp</p>
                  <p className="text-[20px] text-[#17458f]">Chat Instantáneo</p>
                </div>
              </div>

              <ChevronRight className="text-[#b7bfd3]" />
            </div>
          </a>

          {/* FAQ */}
          <div className="bg-white rounded-[24px] p-[22px] shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <p className="text-[#17458f]  mb-[25px]">Preguntas Frecuentes</p>

            {questions.map((item, index) => (
              <div key={index} className="py-[15px] border-b border-[#eee]">
                <div
                  className="flex justify-between items-center cursor-pointer font-medium"
                  onClick={() =>
                    setOpenQuestion(openQuestion === index ? null : index)
                  }
                >
                  <span>{item.question}</span>

                  {openQuestion === index ? <ChevronUp /> : <ChevronDown />}
                </div>

                {openQuestion === index && (
                  <div className="mt-[15px] text-[#666] min-h-[30px]">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1">
          <div className="bg-white rounded-[28px] p-[35px] shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <h2 className="text-[42px]  text-[#222] mb-[15px]">
              Tu Opinión nos Ayuda a Mejorar
            </h2>

            <p className="text-[#666] leading-[1.6] mb-[35px] text-[18px]">
              Tus comentarios son analizados directamente para mejorar la
              calidad del servicio médico.
            </p>

            <label className=" mb-[10px] block">Tu Mensaje</label>

            <textarea
              className="w-full min-h-[180px] resize-none border-none bg-[#f1f3f7] rounded-[18px] p-[20px] text-[16px] outline-none mb-[35px]"
              placeholder="Cuéntanos tu experiencia con detalle..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* RATING */}
            <div className="text-center mb-[40px]">
              <p className=" mb-[25px] text-[18px]">
                ¿Cómo calificarías tu experiencia global?
              </p>

              <div className="flex justify-center gap-[15px] mb-[12px]">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`w-[54px] h-[54px] rounded-full border-none bg-[#f1f1f1]  text-[18px] cursor-pointer transition-[0.3s] ${
                      rating === num
                        ? "bg-[#17458f] text-white scale-110 shadow-[0_8px_20px_rgba(23,69,143,0.3)]"
                        : ""
                    }`}
                    onClick={() => setRating(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="flex justify-between text-[#999] text-[12px] max-w-[450px] mx-auto">
                <span>INSATISFACTORIO</span>
                <span>EXCELENTE</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="border-none bg-[#17458f] text-white p-[18px_35px] rounded-[16px] text-[18px] cursor-pointer"
                onClick={handleSubmit}
              >
                {loading ? "Enviando..." : "Enviar Comentarios"}
              </button>
            </div>
          </div>

          {/* PRIVACY */}
          <div className="mt-[30px] bg-gradient-to-br from-[#1f2937] to-[#475569] text-white rounded-[24px] p-[30px]">
            <p className="text-[13px] tracking-[2px] mb-[12px] opacity-80">
              PRIVACIDAD GARANTIZADA
            </p>

            <p className="text-[28px] max-w-[700px] leading-[1.4]">
              Tus datos y feedback están protegidos bajo los más estrictos
              estándares de seguridad médica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suport;
