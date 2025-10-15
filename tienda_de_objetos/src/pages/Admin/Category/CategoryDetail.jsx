import { useParams, useNavigate } from "react-router-dom";

// Simulación de productos y lista de categorías solo para validar la existencia del parámetro.
const fixedCategoriesList = [
    "Categoría1",
    "Categoría2",
    "Categoría3",
    "Categoría4",
    "Categoría5",
];


// Componente para mostrar el nombre y la descripción de una categoría.
function CategoryDetail() {
  // 1. OBTENER el nombre de la categoría de la URL
  const { categoria } = useParams(); 
  const navigate = useNavigate();

  const categoriaActual = categoria;

  // --- 2. Simulación de la descripción de la categoría (Mock Data) ---
  // En una aplicación real, esta descripción vendría de una base de datos o API.
  const descriptionDetail = {
    'Categoría1': 'Esta categoría abarca todos los artículos esenciales para la oficina, como papelería, elementos de escritura y materiales de archivo. Es fundamental para mantener la operatividad diaria.',
    'Categoría2': 'Incluye todos los equipos electrónicos de alto rendimiento, como computadoras portátiles, tabletas, monitores y accesorios de conectividad. Orientado a la eficiencia tecnológica.',
    'Categoría3': 'Dedicada a la gestión y provisión de licencias de software, herramientas de productividad digital y soluciones de seguridad informática para todos los empleados.',
    'Categoría4': 'Comprende todas las herramientas manuales y equipos especializados necesarios para el mantenimiento, reparación y conservación de la infraestructura física.',
    'Categoría5': 'Agrupa los suministros y consumibles de limpieza, higiene y desinfección necesarios para el mantenimiento diario y salubridad de todas las instalaciones.',
  };

  const description = descriptionDetail[categoriaActual] || 
    `No se encontró una descripción específica para "${categoriaActual}". Esta es una categoría de ejemplo con un propósito desconocido.`;
  
  // Verificación de existencia de categoría
  const categoriaExiste = fixedCategoriesList.includes(categoriaActual); 

  if (!categoriaExiste) {
    return (
        <div style={{ 
            margin: "2rem", 
            color: "#c0392b", 
            textAlign: "center",
            padding: "1.5rem",
            backgroundColor: "#fbebeb",
            borderRadius: 8,
            border: "1px solid #e74c3c"
        }}>
            <h2>Error: Categoría No Encontrada</h2>
            <p>El nombre de categoría proporcionado no es válido.</p>
            <button 
                onClick={() => navigate("/CategoryList")}
                style={{
                    padding: "10px 15px",
                    marginTop: "1rem",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer"
                }}
            >
                Volver a la Lista
            </button>
        </div>
    );
  }
  

  return (
    <div style={{
      padding: "2rem",
      maxWidth: 600,
      margin: "2rem auto",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 4px 12px #0002"
    }}>
      
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1.5rem" }}>
          &larr; Volver
      </button>
      
      <h1 style={{ 
            textAlign: "center", 
            color: '#2c3e50', 
            paddingBottom: '10px',
            marginBottom: '1rem'
        }}>
          Información de Categoría
      </h1>

      {/* Contenedor de Información */}
      <div style={{ padding: "1.5rem", border: "1px solid #ddd", borderRadius: 8, backgroundColor: '#f9f9f9' }}>
          <h2 style={{ margin: "0 0 1rem 0", color: '#3498db' }}>{categoriaActual}</h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#555' }}>
            <b>Propósito:</b> {description}
          </p>
      </div>

      
      {/* --- Controles de Navegación --- */}
      <div style={{ marginTop: "3rem", borderTop: "1px solid #eee", paddingTop: "1.5rem", textAlign: 'center' }}>
        <button onClick={() => navigate("/CategoryList")} style={{ marginRight: "1rem", padding: "10px 15px" }}>
          Ir a Lista de Categorías
        </button>
        <button onClick={() => navigate("/AdminDashboard")} style={{ padding: "10px 15px" }}>
          Ir a Panel de Administración
        </button>
      </div>
    </div>
  );
}

export default CategoryDetail