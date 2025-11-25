import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  
  // Estado inicial en 0
  const [summary, setSummary] = useState({
    orders: 0,
    newUsers: 0,
    totalIncome: 0
  });
  
  const navigate = useNavigate();

  // Función para traer datos REALES del backend
  const getSummary = async () => {
    try {
      const response = await fetch(`http://3.131.85.192:3000/admin/summary?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error("Error al cargar resumen");
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Cargar al inicio
  useEffect(() => {
    getSummary();
  }, []);

  // Cargar al enviar el formulario
  function handleSubmit(e) {
    e.preventDefault();
    getSummary();
  }

  return (
    <>
    
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h2>Panel Administrador</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <label>Periodo:</label><br />
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <label style={{ marginLeft: "10px" }}>Hasta:</label> 
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ marginLeft: "5px" }} />
        <p/>
        <button type="submit" style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}>Mostrar resumen</button>
      </form>

      <div style={{ background: "#f7f7f7", padding: "1rem", borderRadius: 6 }}>
        <p><b>Órdenes:</b> {summary.orders}</p>
        <p><b>Usuarios nuevos:</b> {summary.newUsers}</p>
        <p><b>Ingresos totales:</b> S/. {summary.totalIncome}</p>
      </div>

      <button style={{ marginTop: "1rem", width:"100%", padding: "8px", cursor: "pointer"}} onClick={() => navigate("/ProductList")}>Ver lista de productos</button>
      <button style={{ marginTop: "1rem", width:"100%", padding: "8px", cursor: "pointer"}} onClick={() => navigate("/CategoryList")}>Ver lista de categorías</button>
      <button style={{ marginTop: "1rem", width:"100%", padding: "8px", cursor: "pointer"}} onClick={() => navigate("/OrderList")}>Ver lista de órdenes</button>
      <button style={{ marginTop: "1rem", width:"100%", padding: "8px", cursor: "pointer"}} onClick={() => navigate("/UserList")}>Ver lista de usuarios registrados</button>
    </div>
    </>
  );
}