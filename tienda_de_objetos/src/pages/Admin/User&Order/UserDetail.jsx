import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener datos del usuario del Backend
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`http://3.131.85.192:3000/users/${id}`);
        if (!response.ok) throw new Error("Error al cargar datos del usuario");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando...</div>;
  if (!userData) return <div style={{ padding: "2rem", textAlign: "center" }}>Usuario no encontrado.</div>;

  const { usuario, ordenes } = userData;

  return (
    <>
      <div style={{ maxWidth: 600, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
        
        {/* Título: Detalle de Usuario */}
        <h3 style={{ color: "#333", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>Detalle de Usuario</h3>
        
        <div style={{ lineHeight: "1.8", color: "#555" }}>
          <p><b>ID:</b> {usuario.id}</p>
          <p><b>Nombre:</b> {usuario.nombre}</p>
          <p><b>Correo:</b> {usuario.email}</p>
          <p>
            <b>Estado:</b>{" "}
            <span style={{ 
              color: usuario.activo ? "green" : "red", 
              fontWeight: "bold" 
            }}>
              {usuario.activo ? "Activo" : "Inactivo"}
            </span>
          </p>
        </div>

        {/* Subtítulo: Órdenes Recientes */}
        <h4 style={{ marginTop: "2rem", color: "#444" }}>Órdenes Recientes</h4>
        
        {ordenes.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {ordenes.map(order => (
              <li key={order.id} style={{ padding: "1rem 0", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <b style={{ color: "#007bff" }}>Orden #{order.id}</b>
                  <div style={{ fontSize: "0.85rem", color: "#777" }}>
                    {new Date(order.date).toLocaleDateString()} — {order.items} artículo(s)
                  </div>
                  <div style={{ fontSize: "0.85rem", fontStyle: "italic" }}>
                    {order.estado}
                  </div>
                </div>
                <span style={{ color: "#28a745", fontWeight: "bold", fontSize: "1.1rem" }}> 
                   S/. {order.total}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontStyle: "italic", color: "#999" }}>Sin órdenes recientes.</p>
        )}

        {/* Botón: Volver */}
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            marginTop: "1.5rem", 
            padding: "10px 20px", 
            background: "#6c757d", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer" 
          }}
        >
          Volver
        </button>
      </div>
    </>
  );
}