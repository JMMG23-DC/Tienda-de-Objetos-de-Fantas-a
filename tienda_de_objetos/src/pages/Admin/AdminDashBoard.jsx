import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  
  // Estado inicial en 0
  const [summary, setSummary] = useState({
    orders: 0,
    newUsers: 0,
    totalIncome: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Función para traer datos REALES del backend
  const getSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/admin/summary?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error("Error al cargar resumen");
      const data = await response.json();
      setSummary(data);
      // Intentar obtener ventas por mes
      try {
        const respSales = await fetch(`http://localhost:3000/admin/sales-by-month?startDate=${startDate}&endDate=${endDate}`);
        if (respSales.ok) {
          const sales = await respSales.json();
          setSalesData(sales);
        } else {
          setSalesData([]);
        }
      } catch (err) {
        setSalesData([]);
      }

      // Intentar obtener usuarios por mes
      try {
        const respUsers = await fetch(`http://localhost:3000/admin/users-by-month?startDate=${startDate}&endDate=${endDate}`);
        if (respUsers.ok) {
          const users = await respUsers.json();
          setUsersData(users);
        } else {
          setUsersData([]);
        }
      } catch (err) {
        setUsersData([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar al inicio
  useEffect(() => {
    getSummary();
  }, []);

  // Cargar al enviar el formulario
  function handleSubmit(e) {
    e.preventDefault();
    // Validación: startDate no puede ser posterior a endDate
    if (new Date(startDate) > new Date(endDate)) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }
    getSummary();
  }

  // Cerrar sesión: limpiar localStorage y redirigir
  function handleLogout() {
    const nombre = localStorage.getItem("nombre");
    localStorage.removeItem("nombre");
    localStorage.removeItem("usuario_id");
    if (nombre) localStorage.removeItem(`ordenes_${nombre}`);
    navigate("/login");
  }

  return (
    <>
      <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "1.5rem" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
          <div>
            <h2 style={{ margin: 0 }}>Panel Administrador</h2>
            <p style={{ margin: "6px 0", color: "#666" }}>Resumen del periodo seleccionado</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span style={{ color: "#666" }}>—</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <button onClick={handleSubmit} style={{ padding: "6px 12px", marginLeft: 8, cursor: "pointer" }}>Actualizar</button>
            <button onClick={handleLogout} style={{ padding: "6px 12px", marginLeft: 8, background: '#e60000', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cerrar sesión</button>
          </div>
        </header>

        {/* Indicadores en tarjetas */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 18 }}>
          <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px #0002", textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#888" }}>Órdenes</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{summary.orders}</div>
          </div>
          <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px #0002", textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#888" }}>Usuarios</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{summary.newUsers}</div>
          </div>
          <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px #0002", textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#888" }}>Ingresos</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(summary.totalIncome || 0)}</div>
          </div>
        </section>

        {/* Área de contenido: controles + gráficos */}
        <div style={{ display: "flex", gap: 20, marginTop: 22, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Izquierda: acciones rápidas */}
          <aside style={{ flex: "0 0 260px", minWidth: 220 }}>
            <div style={{ background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
              <h4 style={{ marginTop: 0 }}>Acciones</h4>
              <button style={{ display: "block", width: "100%", padding: "8px", marginBottom: 8, cursor: "pointer" }} onClick={() => navigate("/ProductList")}>Productos</button>
              <button style={{ display: "block", width: "100%", padding: "8px", marginBottom: 8, cursor: "pointer" }} onClick={() => navigate("/CategoryList")}>Categorías</button>
              <button style={{ display: "block", width: "100%", padding: "8px", marginBottom: 8, cursor: "pointer" }} onClick={() => navigate("/OrderList")}>Órdenes</button>
              <button style={{ display: "block", width: "100%", padding: "8px", cursor: "pointer" }} onClick={() => navigate("/UserList")}>Usuarios</button>
            </div>
          </aside>

          {/* Derecha: gráficos (dos columnas cuando hay espacio) */}
          <main style={{ flex: "1 1 700px", minWidth: 320, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "#fff", padding: "12px", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
              <h5 style={{ marginTop: 0 }}>Ventas por mes</h5>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={(salesData && salesData.length) ? salesData : [{ month: 'Ene', sales: 0 }, { month: 'Feb', sales: 0 }, { month: 'Mar', sales: 0 }, { month: 'Abr', sales: 0 }, { month: 'May', sales: 0 }, { month: 'Jun', sales: summary.totalIncome || 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background: "#fff", padding: "12px", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
              <h5 style={{ marginTop: 0 }}>Usuarios por mes</h5>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(usersData && usersData.length) ? usersData : [{ month: 'Ene', users: 0 }, { month: 'Feb', users: 0 }, { month: 'Mar', users: 0 }, { month: 'Abr', users: 0 }, { month: 'May', users: 0 }, { month: 'Jun', users: summary.newUsers || 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
