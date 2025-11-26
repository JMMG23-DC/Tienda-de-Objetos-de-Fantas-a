import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderList() {
  const [ordenes, setOrdenes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://3.131.85.192:3000/ordenes")
      .then(res => res.json())
      .then(data => setOrdenes(data))
      .catch(err => console.error("ERROR FRONT:", err));
  }, []);

  // FILTRO
  const filtradas = ordenes.filter(o =>
    o.id_orden.toString().includes(filtro) ||
    (o.user?.nombre || "").toLowerCase().includes(filtro.toLowerCase())
  );

  // PAGINACIÓN -------------------------------
  const totalPages = Math.ceil(filtradas.length / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const paginatedOrders = filtradas.slice(startIndex, endIndex);
  // ------------------------------------------

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "2rem auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0002"
      }}
    >

      {/* TÍTULO */}
      <h2 style={{ marginBottom: "1.5rem" }}>Lista de Órdenes</h2>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Filtrar por ID o nombre..."
        value={filtro}
        onChange={e => {
          setFiltro(e.target.value);
          setPage(1); // Reiniciar a página 1 al filtrar
        }}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "1.5rem",
          border: "1px solid #ccc",
          borderRadius: 4
        }}
      />

      <button onClick={() => navigate(-1)}>Regresar Admin</button>

      {/* TABLA */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ background: "#f7f7f7", textAlign: "left" }}>
            <th style={{ padding: 10 }}>ID</th>
            <th style={{ padding: 10 }}>Usuario</th>
            <th style={{ padding: 10 }}>Estado</th>
            <th style={{ padding: 10 }}>Total</th>
            <th style={{ padding: 10 }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {paginatedOrders.map(o => {
            const total = o.orden_productos.reduce(
              (sum, op) => sum + op.subtotal,
              0
            );

            return (
              <tr key={o.id_orden} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>{o.id_orden}</td>
                <td style={{ padding: 10 }}>{o.user?.nombre || "—"}</td>
                <td style={{ padding: 10 }}>{o.estado}</td>
                <td style={{ padding: 10 }}>S/ {total.toFixed(2)}</td>

                <td style={{ padding: 10 }}>
                  <button onClick={() => navigate(`/OrderDetailUser/${o.id_orden}`)}>
                    Ver detalle
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* PAGINACIÓN */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{ marginRight: 10 }}
        >
          Anterior
        </button>

        <span style={{ margin: "0 1rem" }}>
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>

    </div>
  );
}
