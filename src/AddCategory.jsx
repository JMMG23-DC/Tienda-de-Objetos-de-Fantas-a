import { useState, useEffect } from "react";

// Mock products data (same as SearchResults)
const allProducts = [
  { id: 1, name: "Varita mágica", price: 120, category: "Magia", image: "/images/varita_magica.jpg" },
  { id: 2, name: "Poción de invisibilidad", price: 200, category: "Pociones", image: "/images/pocion_invisibilidad.jpg" },
  { id: 3, name: "Espada legendaria", price: 350, category: "Armas", image: "/images/espada_legendaria.jpg" },
  { id: 4, name: "Escudo encantado", price: 180, category: "Armas", image: "/images/escudo_encantado.jpg" },
  { id: 5, name: "Anillo de poder", price: 250, category: "Magia", image: "/images/anillo_de_poder.jpg" },
  { id: 6, name: "Capa voladora", price: 300, category: "Magia", image: "/images/capa_voladora.jpg" },
  { id: 7, name: "Botas rápidas", price: 90, category: "Artefactos", image: "/images/botas_rapidas.jpg" },
  { id: 8, name: "Libro de hechizos", price: 220, category: "Magia", image: "/images/libro_hechizos.jpg" },
  { id: 9, name: "Amuleto de suerte", price: 80, category: "Reliquias", image: "/images/amuleto_de_suerte.jpg" },
  { id: 10, name: "Casco de dragón", price: 400, category: "Armas", image: "/images/casco_dragon.jpg" },
  { id: 11, name: "Guantes mágicos", price: 110, category: "Magia", image: "/images/guantes_magicos.jpg" },
  { id: 12, name: "Escama de fénix", price: 500, category: "Reliquias", image: "/images/escama_de_fenix.jpg" },
  { id: 13, name: "Mapa encantado", price: 150, category: "Artefactos", image: "/images/mapa_encantado.jpg" },
  { id: 14, name: "Lámpara mágica", price: 210, category: "Artefactos", image: "/images/lampara_magica.jpg" },
  { id: 15, name: "Pergamino antiguo", price: 95, category: "Reliquias", image: "/images/pergamino_antiguo.jpg" },
  { id: 16, name: "Collar de runas", price: 175, category: "Reliquias", image: "/images/collar_de_runas.jpg" },
  { id: 17, name: "Cinturón de fuerza", price: 130, category: "Artefactos", image: "/images/cinturon_de_fuerza.jpg" },
  { id: 18, name: "Piedra filosofal", price: 600, category: "Reliquias", image: "/images/piedra_filosofal.jpg" },
];

// Modal component for searching and adding products
function ProductSearchModal({ isOpen, onClose, onAddProduct, excludeIds }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  if (!isOpen) return null;

  const filteredProducts = allProducts.filter(
    (p) =>
      !excludeIds.includes(p.id) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "3rem",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: "2rem",
          maxWidth: 600,
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0 }}>Buscar y agregar producto</h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "0.25rem 0.5rem",
            }}
          >
            ×
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
          autoFocus
        />

        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          {filteredProducts.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888" }}>No se encontraron productos</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f7f7f7", borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Nombre</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Categoría</th>
                  <th style={{ padding: "0.5rem", textAlign: "right" }}>Precio</th>
                  <th style={{ padding: "0.5rem", textAlign: "center" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "0.5rem" }}>{product.name}</td>
                    <td style={{ padding: "0.5rem" }}>{product.category}</td>
                    <td style={{ padding: "0.5rem", textAlign: "right" }}>${product.price}</td>
                    <td style={{ padding: "0.5rem", textAlign: "center" }}>
                      <button
                        onClick={() => {
                          onAddProduct(product);
                          setSearchTerm("");
                        }}
                        style={{
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AddCategory({ onSave, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e) {
    const file = e.target.files?.[0] || null;
    setImagen(file);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }

  function handleAddProduct(product) {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  }

  function handleRemoveProduct(productId) {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!nombre.trim()) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }
    
    if (selectedProducts.length === 0) {
      setError("Debes agregar al menos un producto a la categoría.");
      return;
    }

    setError("");
    
    // Save category data
    onSave({
      nombre,
      descripcion,
      imagen,
      productos: selectedProducts,
    });
  }

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      <div
        style={{
          maxWidth: 700,
          margin: "2rem auto",
          padding: "2rem",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Agregar nueva categoría</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Nombre de la categoría: *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Descripción:
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 4,
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Imagen de la categoría:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: "0.5rem" }}
            />
            {previewUrl && (
              <div style={{ marginTop: "0.5rem" }}>
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label style={{ fontWeight: "bold" }}>Productos en esta categoría: *</label>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                + Agregar producto
              </button>
            </div>

            {selectedProducts.length === 0 ? (
              <p style={{ color: "#888", fontStyle: "italic" }}>
                No hay productos agregados. Haz clic en "Agregar producto" para buscar y añadir productos.
              </p>
            ) : (
              <div style={{ border: "1px solid #ddd", borderRadius: 4, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f7f7f7" }}>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Nombre</th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Categoría actual</th>
                      <th style={{ padding: "0.5rem", textAlign: "right" }}>Precio</th>
                      <th style={{ padding: "0.5rem", textAlign: "center" }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((product) => (
                      <tr key={product.id} style={{ borderTop: "1px solid #eee" }}>
                        <td style={{ padding: "0.5rem" }}>{product.name}</td>
                        <td style={{ padding: "0.5rem" }}>{product.category}</td>
                        <td style={{ padding: "0.5rem", textAlign: "right" }}>${product.price}</td>
                        <td style={{ padding: "0.5rem", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(product.id)}
                            style={{
                              padding: "0.25rem 0.75rem",
                              background: "#dc3545",
                              color: "#fff",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                              fontSize: "0.9rem",
                            }}
                          >
                            Quitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {error && (
            <div
              style={{
                padding: "0.75rem",
                marginBottom: "1rem",
                background: "#f8d7da",
                color: "#721c24",
                border: "1px solid #f5c6cb",
                borderRadius: 4,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              style={{
                padding: "0.75rem 1.5rem",
                background: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Guardar categoría
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <ProductSearchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddProduct={handleAddProduct}
        excludeIds={selectedProducts.map((p) => p.id)}
      />
    </>
  );
}