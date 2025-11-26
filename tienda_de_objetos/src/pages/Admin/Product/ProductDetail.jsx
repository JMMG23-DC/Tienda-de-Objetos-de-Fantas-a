import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        if (!response.ok) throw new Error("Producto no encontrado");

        const data = await response.json();
        setProduct(data); // ya viene un objeto del backend
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Mapeo de datos para mostrar
  const display = useMemo(() => {
    if (!product) return null;

    return {
      id: product.id_producto,
      nombre: product.nombre,
      categoria: product.categoria,
      precio: product.precio,
      activo: product.activo,
      imagen: product.imagen_url,
      descripcion: product.descripcion,
    };
  }, [product]);

  function fmtPrice(val) {
    const num = Number(val);
    return isNaN(num) ? "—" : `S/. ${num.toFixed(2)}`;
  }

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando...</div>;
  if (!display) return <div style={{ padding: "2rem", textAlign: "center" }}>No se encontró el producto.</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: 700, margin: "2rem auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem", cursor: "pointer", padding: "5px 10px" }}>Volver</button>

      <h2 style={{ textAlign: "center", color: "#333" }}>Detalle de producto</h2>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "2rem" }}>
        <img
          src={display.imagen || "https://via.placeholder.com/200"}
          alt={display.nombre}
          style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }}
        />

        <div>
          <p><b>ID:</b> {display.id}</p>
          <p><b>Nombre:</b> {display.nombre}</p>
          <p><b>Categoría:</b> {display.categoria}</p>
          <p><b>Precio:</b> <span style={{ color: "#e91e63" }}>{fmtPrice(display.precio)}</span></p>
          <p><b>Estado:</b> <span style={{ color: display.activo ? "green" : "red" }}>{display.activo ? "Activo" : "Desactivado"}</span></p>

          {display.descripcion && (
            <div style={{ marginTop: "1rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
              <b>Descripción:</b>
              <p style={{ fontSize: "0.9rem" }}>{display.descripcion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
