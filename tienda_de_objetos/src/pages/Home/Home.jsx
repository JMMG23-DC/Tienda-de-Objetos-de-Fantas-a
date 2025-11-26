import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Home/home.css";
import { TopBar } from "./components/TopBar";
import { Footer } from "./components/Footer";

// Componente principal de la página de inicio (Home)
export const Home = () => {
    const [data, setData] = useState({
        topCategorias: [],      
        topProductos: [],       
        nuevosProductos: [],    
        categoriasNuevas: []    
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const response = await fetch("http://3.131.85.192:3000/home-data");
                if (!response.ok) throw new Error("Error al cargar datos del servidor");
                const result = await response.json();
                console.log("Datos recibidos del backend:", result);
                // Filtrar para mostrar solo productos activos (o sin definir activo, que por defecto es true)
                const filtered = {
                    topCategorias: result.topCategorias || [],
                    topProductos: (result.topProductos || []).filter(p => p.activo !== false),
                    
                    categoriasNuevas: result.categoriasNuevas || []
                };
                filtered.nuevosProductos = (result.nuevosProductos || []).filter(p => p.activo !== false);
                console.log("Productos nuevos filtrados:", filtered.nuevosProductos);
                setData(filtered);
            } catch (error) {
                console.error("Error conectando con el backend:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    if (loading) {
        return (
            <>
                <TopBar />
                <div style={{ textAlign: "center", padding: "100px 20px", fontSize: "1.5rem", color: "#555" }}>
                    Cargando la magia...
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <TopBar />

            {/* SECCIÓN DE BIENVENIDA */}
            <section className="seccion_titulo">
                <h1>Bienvenido a Nuestra Tienda Mágica</h1>
                <p>Descubre los productos más destacados y aprovecha nuestras ofertas del mes.</p>
            </section>

            <hr />

            {/* SECCIÓN 1: Las 3 Categorías Más Populares */}
            <section className="seccion_producto">
                <h2>Las 3 Categorías Más Populares</h2>
                <div className="productos-flex">
                    {data.topCategorias.length > 0 ? (
                        data.topCategorias.map((categoriaInfo) => (
                            <article className="producto-card" key={categoriaInfo.categoria}>
                                <img 
                                    src={categoriaInfo.imagen || "https://via.placeholder.com/150"} 
                                    alt={`Imagen de ${categoriaInfo.categoria}`} 
                                />
                                <h3>{categoriaInfo.categoria}</h3>
                                <p>Categoría destacada</p>
                            </article>
                        ))
                    ) : (
                        <p>No hay suficientes datos de ventas aún.</p>
                    )}
                </div>
            </section>

            <hr />

            {/* SECCIÓN 2: Los 12 Productos Más Vendidos del Mes */}
            <section className="seccion_producto">
                <h2>Los 12 Productos Más Vendidos del Mes</h2>
                <div className="productos-scroll">
                    {data.topProductos.map((producto) => (
                        <article className="producto-card" key={producto.id_producto}>
                            <img 
                                src={producto.imagen_url || "https://via.placeholder.com/150"} 
                                alt={producto.nombre} 
                            />
                            <h3>{producto.nombre}</h3>
                            <p>{producto.descripcion ? producto.descripcion.substring(0, 50) + "..." : ""}</p>
                            <span className="precio">S/. {producto.precio}</span>
                        </article>
                    ))}
                </div>
            </section>

            <hr />

            {/* SECCIÓN 3: Banner, Categorías Nuevas y Productos Recientes */}
            <section className="seccion_producto seccion_inferior">

                {/* Banner */}
                <div className="banner">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://static.vecteezy.com/system/resources/thumbnails/005/405/595/small/special-offer-sale-banner-besign-discount-label-and-sticker-for-media-promotion-product-free-vector.jpg"
                            alt="Banner de Descuento Especial"
                            style={{ width: "100%", height: "auto", borderRadius: "8px", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}
                        />
                    </a>
                </div>

                {/* Categorías Nuevas (Estáticas o dinámicas según backend) */}
                <div className="productos-nuevos">
                    <h2>Categorías Nuevas</h2>
                    <div className="productos-flex wrap">
                        {data.categoriasNuevas.map((cat, index) => (
                            <article className="producto-card" key={index}>
                                <h3>{cat}</h3>
                                <p>Explora los mejores productos de {cat}</p>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Productos Recientes */}
                <div className="productos-nuevos">
                    <h2>Productos Recién Agregados</h2>
                    <div className="productos-flex wrap">
                        {data.nuevosProductos.map((prod) => (
                            <article className="producto-card" key={prod.id_producto}>
                                <img 
                                    src={prod.imagen_url || "https://via.placeholder.com/150"} 
                                    alt={prod.nombre} 
                                />
                                <h3>{prod.nombre}</h3>
                                <p>{prod.descripcion ? prod.descripcion.substring(0, 50) + "..." : ""}</p>
                                <span className="precio">S/. {prod.precio}</span>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default Home;
