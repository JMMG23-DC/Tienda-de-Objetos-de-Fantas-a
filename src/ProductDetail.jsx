import { useEffect, useMemo, useState } from "react";

export default function ProductDetail({
  product,
  onBack,
  onSave,
  readOnly = true,
  onAddToCart, // opcional: si lo pasas, aparece el botón "Agregar al carrito" en modo lectura
}) {
  if (!product) return <div>No se encontró el producto.</div>;

  // --- Normalización para soportar {nombre,categoria,precio} y {name,category,price} ---
  const display = useMemo(() => {
    const precio =
      product.precio ?? product.price ?? null; // puede venir como string o number
    const imagen =
      product.imagen ?? product.image ?? null; // string url o File

    return {
      id: product.id ?? "—",
      nombre: product.nombre ?? product.name ?? "Sin nombre",
      categoria: product.categoria ?? product.category ?? "—",
      precio: precio,
      activo: product.activo ?? true,
      imagen,
    };
  }, [product]);

  // Helper para formatear precio seguro
  function fmtPrice(val) {
    const num = Number(val);
    if (val === null || val === undefined || Number.isNaN(num)) return "—";
    return `$${num.toFixed(2)}`;
  }

  // Resolver src de imagen (File | string | null) + cleanup
  const [objectUrl, setObjectUrl] = useState(null);
  const imgSrc = useMemo(() => {
    if (!display.imagen) return "/assets/placeholder.png";
    if (typeof display.imagen === "string") return display.imagen;
    // File
    const url = URL.createObjectURL(display.imagen);
    setObjectUrl(url);
    return url;
  }, [display.imagen]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  // State for read-only view (must be at top level)
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // ----- VISTA SOLO LECTURA (MEJORADA) -----
  if (readOnly) {

    const handleAddToCart = () => {
      if (typeof onAddToCart === "function") {
        onAddToCart({
          id: display.id,
          name: display.nombre,
          price: typeof display.precio === "number"
              ? display.precio
              : Number(display.precio) || 0,
          category: display.categoria,
          image: display.imagen || null,
          quantity: quantity,
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
      }
    };

    return (
      <div
        className="product-detail"
        style={{
          padding: "2rem",
          maxWidth: 900,
          margin: "2rem auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <button 
          onClick={onBack} 
          style={{ 
            marginBottom: "1.5rem",
            padding: "0.5rem 1rem",
            background: "#f0f0f0",
            border: "1px solid #ddd",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          ← Volver
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Imagen del producto */}
          <div>
            <img
              src={imgSrc}
              alt={display.nombre}
              style={{
                width: "100%",
                maxHeight: 400,
                objectFit: "cover",
                borderRadius: 12,
                background: "#f3f3f3",
                border: "1px solid #e0e0e0",
              }}
            />
            {/* Badge de categoría */}
            <div
              style={{
                marginTop: "1rem",
                display: "inline-block",
                padding: "0.5rem 1rem",
                background: "#e3f2fd",
                color: "#1976d2",
                borderRadius: 20,
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              📦 {display.categoria}
            </div>
          </div>

          {/* Información del producto */}
          <div>
            <h1 style={{ 
              fontSize: "2rem", 
              marginBottom: "1rem",
              color: "#333",
              lineHeight: 1.2,
            }}>
              {display.nombre}
            </h1>

            <div style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#2e7d32",
              marginBottom: "1.5rem",
            }}>
              {fmtPrice(display.precio)}
            </div>

            {/* Estado del producto */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              padding: "0.75rem",
              background: display.activo ? "#e8f5e9" : "#ffebee",
              borderRadius: 8,
            }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: display.activo ? "#4caf50" : "#f44336",
              }}></span>
              <span style={{ 
                fontWeight: "500",
                color: display.activo ? "#2e7d32" : "#c62828",
              }}>
                {display.activo ? "✓ Disponible" : "✗ No disponible"}
              </span>
            </div>

            {/* Descripción (simulada) */}
            <div style={{
              marginBottom: "2rem",
              padding: "1rem",
              background: "#f9f9f9",
              borderRadius: 8,
              borderLeft: "4px solid #1976d2",
            }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Descripción</h3>
              <p style={{ color: "#666", lineHeight: 1.6 }}>
                Este es un producto de alta calidad de la categoría {display.categoria}. 
                Perfecto para tus necesidades mágicas y aventuras épicas.
              </p>
            </div>

            {/* Características */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Características</h3>
              <ul style={{ 
                listStyle: "none", 
                padding: 0,
                display: "grid",
                gap: "0.5rem",
              }}>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: "#4caf50" }}>✓</span>
                  <span>Calidad premium garantizada</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: "#4caf50" }}>✓</span>
                  <span>Envío rápido y seguro</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: "#4caf50" }}>✓</span>
                  <span>Garantía de satisfacción</span>
                </li>
              </ul>
            </div>

            {/* Selector de cantidad y botón de agregar */}
            {typeof onAddToCart === "function" && display.activo && (
              <div style={{
                padding: "1.5rem",
                background: "#f5f5f5",
                borderRadius: 8,
                marginTop: "1rem",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}>
                  <label style={{ fontWeight: "500" }}>Cantidad:</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        width: 32,
                        height: 32,
                        border: "1px solid #ddd",
                        background: "#fff",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: "1.2rem",
                      }}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{
                        width: 60,
                        textAlign: "center",
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: 4,
                      }}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      style={{
                        width: 32,
                        height: 32,
                        border: "1px solid #ddd",
                        background: "#fff",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: "1.2rem",
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: "1.2rem", fontWeight: "bold" }}>
                    Total: {fmtPrice((Number(display.precio) || 0) * quantity)}
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background: addedToCart ? "#4caf50" : "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  {addedToCart ? (
                    <>
                      ✓ Agregado al carrito
                    </>
                  ) : (
                    <>
                      🛒 Agregar al carrito
                    </>
                  )}
                </button>
              </div>
            )}

            {!display.activo && (
              <div style={{
                padding: "1rem",
                background: "#ffebee",
                color: "#c62828",
                borderRadius: 8,
                textAlign: "center",
                fontWeight: "500",
              }}>
                Este producto no está disponible actualmente
              </div>
            )}

            {/* ID del producto (pequeño) */}
            <div style={{ 
              marginTop: "1.5rem", 
              fontSize: "0.85rem", 
              color: "#999" 
            }}>
              ID: {display.id}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----- MODO EDICIÓN (basado en tu versión original) -----
  const [nombre, setNombre] = useState(display.nombre || "");
  const [categoria, setCategoria] = useState(display.categoria || "");
  const [precio, setPrecio] = useState(display.precio ?? "");
  const [activo, setActivo] = useState(display.activo ?? true);
  const [imagen, setImagen] = useState(display.imagen || null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !categoria || precio === "" || precio === null) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    onSave?.({
      ...product,
      nombre,
      categoria,
      precio,
      activo,
      imagen,
    });
  }

  function handleImage(e) {
    const file = e.target.files?.[0] || null;
    setImagen(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div
      className="product-detail"
      style={{
        padding: "2rem",
        maxWidth: 420,
        margin: "2rem auto",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0002",
      }}
    >
      <button onClick={onBack} style={{ marginBottom: "1rem" }}>
        Volver
      </button>
      <h2>Editar producto</h2>

      <form onSubmit={handleSubmit}>
        <label>Nombre:</label><br />
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required /><br />

        <label>Categoría:</label><br />
        <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} required /><br />

        <label>Precio:</label><br />
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required min={1} /><br />

        <label>Estado:</label><br />
        <select
          value={activo ? "activo" : "desactivado"}
          onChange={(e) => setActivo(e.target.value === "activo")}
        >
          <option value="activo">Activo</option>
          <option value="desactivado">Desactivado</option>
        </select><br />

        <label>Imagen:</label><br />
        <input type="file" accept="image/*" onChange={handleImage} /><br />

        {(previewUrl || (imagen && typeof imagen === "object")) && (
          <div style={{ marginTop: "1rem" }}>
            <img
              src={previewUrl || (imagen && typeof imagen === "object" ? URL.createObjectURL(imagen) : undefined)}
              alt="preview"
              style={{ maxWidth: "100%", maxHeight: 120 }}
            />
          </div>
        )}

        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}

        <button type="submit" style={{ marginTop: "1rem" }}>Guardar cambios</button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        <b>ID:</b> {display.id}
      </div>
    </div>
  );
}
