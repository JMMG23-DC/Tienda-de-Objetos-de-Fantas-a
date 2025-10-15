import { imagesData } from "../../data/imagesData"
import { imagesData_2 } from "../../data/images_2Data"
import "../Home/home.css"
import { TopBar } from "./components/TopBar"
import { Footer } from "./components/Footer"

// Componente principal de la página de inicio (Home)
export const Home = () => {

    // Definición de todas las categorías disponibles.
    const lista_categorias_completas = [
        "Armas Encantadas", 
        "Pociones y Elixires Místicos", 
        "Grimorios Antiguos", 
        "Cristales Elementales", 
        "Reliquias y Artefactos Legendarios", 
        "Armaduras y Escudos"
    ];
    
    // Calcular ventas totales y encuentra la imagen representativa por cada categoría.
    const ventasPorCategoria = lista_categorias_completas.map(categoriaActual => {
        
        // Obtener productos de la categoría actual.
        const productosDeCategoria = imagesData.filter(producto => producto.categoria === categoriaActual);

        // Sumar las ventas totales.
        const ventasTotales = productosDeCategoria.reduce((sumaAcumulada, producto) => {
            return sumaAcumulada + producto.ventas;
        }, 0); 

        // Ordenar para encontrar el producto más vendido y usar su imagen.
        productosDeCategoria.sort((a, b) => b.ventas - a.ventas); 
        
        const imagenRepresentativa = productosDeCategoria.length > 0 
            ? productosDeCategoria[0].imagen 
            : ""; 

        return {
            categoria: categoriaActual,
            ventas: ventasTotales,
            imagen: imagenRepresentativa 
        };
    });

    // Ordenar todas las categorías por ventas y obtener el top 3.
    ventasPorCategoria.sort((a, b) => b.ventas - a.ventas);
    const top3Categorias = ventasPorCategoria.slice(0, 3);

    // Filtrar por mes de "Noviembre".
    const productosNoviembre = imagesData.filter(imagen => imagen.mes === "Noviembre");
    
    // Ordenar por ventas (descendente).
    productosNoviembre.sort((a, b) => b.ventas - a.ventas);
    
    // Tomar los primeros 12.
    const primeros12_masVendidos = productosNoviembre.slice(0, 12);
    
    
    // Lista de categorías a destacar como "Nuevas".
    const categoriasNuevas = ["Cristales Elementales", "Reliquias y Artefactos Legendarios", "Grimorios Antiguos"];


    return (
        <>
            <TopBar />

            {/* SECCIÓN DE BIENVENIDA Y TÍTULO PRINCIPAL */}
            <section className="seccion_titulo">
                <h1>Bienvenido a Nuestra Tienda Mágica</h1>
                <p>Descubre los productos más destacados y aprovecha nuestras ofertas del mes.</p>
            </section>

            <hr />

            {/* SECCIÓN 1: Las 3 Categorías Más Populares (Top Ventas) */}
            <section className="seccion_producto">
                <h2>Las 3 Categorías Más Populares</h2>
                <div className="productos-flex">
                    {
                        top3Categorias.map((categoriaInfo) => (
                            <article className="producto-card" key={categoriaInfo.categoria}> 
                                <img src={categoriaInfo.imagen} alt={`Imagen de ${categoriaInfo.categoria}`} /> 
                                <h3>{categoriaInfo.categoria}</h3>
                            </article>
                        ))
                    }
                </div>
            </section>

            <hr />

            {/* SECCIÓN 2: Los 12 Productos Más Vendidos del Mes */}
            <section className="seccion_producto">
                <h2>Los 12 Productos Más Vendidos del Mes</h2>
                <div className="productos-scroll">
                    {
                        primeros12_masVendidos.map((producto) => (
                            <article className="producto-card" key={producto.id}>
                                <img src={producto.imagen} alt={producto.nombre} />
                                <h3>{producto.nombre}</h3>
                                <p>{producto.descripcion}</p>
                                <span className="precio">S/. {producto.precio}</span>
                              </article>
                        ))
                    }
                </div>
            </section>

            <hr />
            
            {/* SECCIÓN 3: Banner, Categorías Nuevas y Productos Recientes */}
            <section className="seccion_producto seccion_inferior">

                {/* Banner de Promoción */}
                <div className="banner">
                    <a 
                        href="https://www.tusuperpromo.com/descuento-especial" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://static.vecteezy.com/system/resources/thumbnails/005/405/595/small/special-offer-sale-banner-besign-discount-label-and-sticker-for-media-promotion-product-free-vector.jpg"
                            alt="Banner de Descuento Especial"
                            style={{ width: "100%", height: "auto", borderRadius: "8px", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)"}}
                        />
                    </a>
                </div>
          

                {/* Visualización de Categorías Nuevas */}
                <div className="productos-nuevos">
                    <h2>Categorías Nuevas</h2>
                    <div className="productos-flex wrap">
                        {
                            categoriasNuevas.map((cat, index) => (
                                <article className="producto-card" key={index}>
                                    <h3>{cat}</h3>
                                    <p>Explora los mejores productos de {cat}</p>
                                </article>
                            ))
                        }
                    </div>
                </div>

                {/* Visualización de 6 Productos Nuevos (imagesData_2) */}
                <div className="productos-nuevos">
                    <h2>Productos Recién Agregados</h2>
                    <div className="productos-flex wrap">
                        {
                            imagesData_2.map((imagen_2) => (
                                <article className="producto-card" key={imagen_2.id}>
                                    <img src={imagen_2.imagen} alt={imagen_2.nombre} />
                                    <h3>{imagen_2.nombre}</h3>
                                    <p>{imagen_2.descripcion}</p>
                                    <span className="precio">S/. {imagen_2.precio}</span>
                                </article>
                            ))
                        }
                    </div>
                </div>
            </section>
            
            {/* Pie de página */}
            <Footer />
        </>
    );
};

export default Home;