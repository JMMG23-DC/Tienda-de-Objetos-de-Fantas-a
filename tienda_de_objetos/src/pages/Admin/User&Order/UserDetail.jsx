import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Cargar la información completa del usuario y sus órdenes
  useEffect(() => {
    fetch(`http://localhost:4000/admin/usuarios/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error:", err));
  }, [id]);

  if (!user) return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando datos...</div>;

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <button onClick={() => navigate("/UserList")} style={{ marginBottom: "1rem", cursor: "pointer" }}>
        &larr; Volver a la lista
      </button>

      <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", color: "#333" }}>
        Detalle de Usuario #{user.user_id}
      </h2>

      <div style={{ marginBottom: "2rem", lineHeight: "1.6" }}>
        <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p>
          <strong>Estado:</strong>{" "}
          <span style={{ color: user.activo ? "green" : "red", fontWeight: "bold" }}>
            {user.activo ? "Activo" : "Inactivo"}
          </span>
        </p>
      </div>

      <h3>Historial de Órdenes ({user.ordens ? user.ordens.length : 0})</h3>
      
      {user.ordens && user.ordens.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {/* Limitamos a las últimas 10 órdenes como pide el enunciado */}
          {user.ordens.slice(0, 10).map((orden) => (
            <li key={orden.id_orden} style={{
              background: "#f9f9f9",
              border: "1px solid #eee",
              margin: "10px 0",
              padding: "15px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <strong>Orden #{orden.id_orden}</strong>
                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                  Fecha: {new Date(orden.fecha_orden).toLocaleDateString()}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{
                  display: "inline-block",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  background: orden.estado === "Cancelado" ? "#ffebee" : "#e3f2fd",
                  color: orden.estado === "Cancelado" ? "#c62828" : "#1565c0",
                  fontWeight: "bold"
                }}>
                  {orden.estado}
                </span>
                <br />
                <button 
                  onClick={() => navigate(`/OrderDetailUser/${orden.id_orden}`)}
                  style={{ marginTop: "5px", fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline", border: "none", background: "transparent", color: "#333" }}
                >
                  Ver Orden &rarr;
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontStyle: "italic", color: "#888" }}>Este usuario no ha realizado ninguna orden aún.</p>
      )}
    </div>
  );
}