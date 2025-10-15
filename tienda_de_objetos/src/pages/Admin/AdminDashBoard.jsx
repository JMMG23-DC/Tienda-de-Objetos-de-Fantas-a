import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Simulación de datos
function getSummary(start, end) {
  const orders = Math.floor(Math.random() * 20 + 5);
  const newUsers = Math.floor(Math.random() * 10 + 1);
  const totalIncome = (orders * (Math.random() * 100 + 20)).toFixed(2);
  return { orders, newUsers, totalIncome };
}

export default function AdminDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [summary, setSummary] = useState(getSummary(today, today));
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setSummary(getSummary(startDate, endDate));
  }

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <h2>Panel Administrador</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <label>Periodo:</label><br />
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <label>Hasta:</label> 
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <p/>
        <button type="submit" style={{ marginLeft: "1rem" }}>Mostrar resumen</button>
      </form>

      <div style={{ background: "#f7f7f7", padding: "1rem", borderRadius: 6 }}>
        <p><b>Órdenes:</b> {summary.orders}</p>
        <p><b>Usuarios nuevos:</b> {summary.newUsers}</p>
        <p><b>Ingresos totales:</b> ${summary.totalIncome}</p>
      </div>


      <button style={{ marginTop: "1rem", width:"100%"}} onClick={() => navigate("/ProductList")}>Ver lista de productos</button>
      <button style={{ marginTop: "1rem", width:"100%"}} onClick={() => navigate("/CategoryList")}>Ver lista de categorías</button>
      <button style={{ marginTop: "1rem", width:"100%"}} onClick={() => navigate("/OrderList")}>Ver lista de órdenes</button>
      <button style={{ marginTop: "1rem", width:"100%"}} onClick={() => navigate("/UserList")}>Ver lista de usuarios registrados</button>
    </div>
  );
}
