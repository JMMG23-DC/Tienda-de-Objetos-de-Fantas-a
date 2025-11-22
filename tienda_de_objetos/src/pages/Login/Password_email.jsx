import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Footer } from "../Home/components/Footer";
import "../Login/login.css";

export const Password = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Por favor ingresa tu correo electrónico");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Ocurrió un error");
      } else {
        // Guardamos id_usuario y redirigimos
        localStorage.setItem("usuario_id", data.id_usuario);
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente");
    }

    setLoading(false);
    setEmail("");
  };

  return (
    <>
      <section className="login-container">
        <div className="login-card">
          <h1>Recuperar Contraseña</h1>
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>

          <div className="login-links">
            <NavLink to="/login">Volver al Login</NavLink>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Password;
