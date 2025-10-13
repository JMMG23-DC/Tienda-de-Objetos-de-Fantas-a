import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

const mockProducts = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  nombre: `Producto${i + 1}`,
  categoria: `Categoría${(i % 5) + 1}`,
  precio: ((i + 1) * 10).toFixed(2),
  activo: true,
}));

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = mockProducts.find((p) => p.id === Number(id));
  if (!product) return <div>No se encontró el producto.</div>;

  const display = useMemo(() => ({
    id: product.id ?? "—",
    nombre: product.nombre ?? "Sin nombre",
    categoria: product.categoria ?? "—",
    precio: product.precio ?? null,
    activo: product.activo ?? true,
    imagen: product.imagen ?? null,
  }), [product]);

  function fmtPrice(val) {
    const num = Number(val);
    return val == null || Number.isNaN(num) ? "—" : `$${num.toFixed(2)}`;
  }

  const [objectUrl, setObjectUrl] = useState(null);
  const imgSrc = useMemo(() => {
    if (!display.imagen) return "/assets/placeholder.png";
    if (typeof display.imagen === "string") return display.imagen;
    const url = URL.createObjectURL(display.imagen);
    setObjectUrl(url);
    return url;
  }, [display.imagen]);

  useEffect(() => () => { if (objectUrl) URL.revokeObjectURL(objectUrl); }, [objectUrl]);

  return (
    <div style={{ padding: "2rem", maxWidth: 700, margin: "2rem auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>Volver</button>
      <h2 style={{ textAlign: "center" }}>Detalle de producto</h2>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1rem", alignItems: "start" }}>
        <img src="/images/botas_viento.png" alt={display.nombre} style={{ width: 200, height: 200, objectFit: "cover", borderRadius: 8, background: "#f3f3f3" }} />
        <div>
          <p><b>Nombre:</b> {display.nombre}</p>
          <p><b>Categoría:</b> {display.categoria}</p>
          <p><b>Precio:</b> {fmtPrice(display.precio)}</p>
          <p><b>Estado:</b> {display.activo ? "Activo" : "Desactivado"}</p>
          <p><b>ID:</b> {display.id}</p>
        </div>
      </div>
    </div>
  );
}
