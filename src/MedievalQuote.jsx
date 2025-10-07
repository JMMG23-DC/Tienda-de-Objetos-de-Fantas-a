import { useState, useEffect } from "react";

const medievalQuotes = [
  "Non todo oro que reluce es tesoro verdadero.",
  "El tiempo, que todo lo muda, muestra quién es leal e quién es falso.",
  "Quien busca la verdad, halla dolor; mas también halla libertad.",
  "Non hay senda derecha sin tropiezo que la enderece.",
  "El sabio calla donde el necio grita.",
  "Non temas la soledad, que en ella mora la razón.",
  "Más vale honra sin vida, que vida sin honra.",
  "El corazón del hombre es como río: sereno en calma, fiero en tempestad.",
  "Aquel que domina su ira, vence mil batallas.",
  "Non hay mal que dure, ni bien que non se acabe.",
  "De la palabra nace la paz o la guerra.",
  "El destino guía a quien le sigue, y arrastra a quien le huye.",
  "Quien olvida su origen, pierde su destino.",
  "Non hay mayor sabiduría que conocerse a sí mesmo.",
  "Aun la noche más escura guarda en su seno el alba.",
];

export default function MedievalQuote() {
  const [quote, setQuote] = useState("");
  const [fade, setFade] = useState(true);

  useEffect(() => {
    // Set initial quote
    setQuote(medievalQuotes[Math.floor(Math.random() * medievalQuotes.length)]);

    // Change quote every 10 seconds
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuote(medievalQuotes[Math.floor(Math.random() * medievalQuotes.length)]);
        setFade(true);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "1.5rem 2rem",
        margin: "2rem auto",
        maxWidth: "800px",
        background: "linear-gradient(135deg, rgba(139, 69, 19, 0.9), rgba(101, 67, 33, 0.9))",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        border: "2px solid #8B4513",
        textAlign: "center",
        opacity: fade ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      <p
        style={{
          fontSize: "1.2rem",
          fontStyle: "italic",
          color: "#FFD700",
          margin: 0,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
          fontFamily: "Georgia, serif",
          lineHeight: 1.6,
        }}
      >
        "
{quote}"
      </p>
      <div
        style={{
          marginTop: "0.5rem",
          fontSize: "0.9rem",
          color: "#DEB887",
          fontStyle: "italic",
        }}
      >
        — Sabiduría Medieval —
      </div>
    </div>
  );
}
