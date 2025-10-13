import { imagesData } from "../../data/imagesData"
import { imagesData_2 } from "../../data/images_2Data"
import "../Home/home.css"
import { TopBar } from "./components/TopBar"
import { Footer } from "./components/Footer"


export const Home = () =>{

    //para las 3 categorías más vendidas
    let lista_categorias = ["Armas Encantadas", "Pociones y Elixires Místicos", "Grimorios Antiguos", "Cristales Elementales", "Reliquias y Artefactos Legendarios", "Armaduras y Escudos"];
    
    //Se crea un Array de objetos con ventas E IMAGEN representativa
    const ventasPorCategoria = lista_categorias.map(categoria => {
        // Filtra productos de la categoría actual
        const productosDeCategoria = imagesData.filter(p => p.categoria === categoria);

        // Suma las ventas totales de la categoría
        const ventasTotales = productosDeCategoria.reduce((sum, p) => sum + p.ventas, 0);

        // Ordena los productos para encontrar el más vendido y usar su imagen
        productosDeCategoria.sort((a, b) => b.ventas - a.ventas);
        const imagenRepresentativa = productosDeCategoria.length > 0 ? productosDeCategoria[0].imagen : ""; // Usa la imagen del más vendido

        return {
            categoria: categoria,
            ventas: ventasTotales,
            imagen: imagenRepresentativa // Se añade la imagen aquí
        };
    });

    ventasPorCategoria.sort((a, b) => b.ventas - a.ventas);
    const top3Categorias = ventasPorCategoria.slice(0, 3);


    // 12 productos de noviembre Mas Vendidos
    const productosNoviembre = imagesData.filter(imagen => imagen.mes === "Noviembre");
    productosNoviembre.sort((a, b) => b.ventas - a.ventas);
    const primeros12 = productosNoviembre.slice(0, 12);
    
    // 3 nuevas categorías
    const categoriasNuevas = ["Cristales Elementales", "Reliquias y Artefactos Legendarios", "Grimorios Antiguos"];


return (
        <>
            <TopBar />

            <section className="seccion_titulo">
                <h1>Bienvenido a Nuestra Tienda</h1>
                <p>Descubre los productos más destacados y aprovecha nuestras ofertas del mes.</p>
            </section>

            {/*Seccion de 3 productos (Corregida) */}
            <section className="seccion_producto">
                <h2>Las 3 Categorías Más Populares</h2>
                <div className="productos-flex">
                    {top3Categorias.map((categoriaInfo) => (
                        <article className="producto-card" key={categoriaInfo.categoria}> 
                            <img src={categoriaInfo.imagen} alt={categoriaInfo.categoria} />
                            <h3>{categoriaInfo.categoria}</h3>
                        </article>
                    ))}
                </div>
            </section>

            {/*Seccion de 12 productos */}
            <section className="seccion_producto">
                <h2>Los 12 Productos Más Vendidos del Mes</h2>
                <div className="productos-scroll">
                    {primeros12.map((imagen) => (
                        <article className="producto-card" key={imagen.id}>
                            <img src={imagen.imagen} alt={imagen.nombre} />
                            <h3>{imagen.nombre}</h3>
                            <p>{imagen.descripcion}</p>
                            <span className="precio">S/. {imagen.precio}</span>
                            </article>
                    ))}
                </div>
            </section>


            {/* Sección inferior */}
            <section className="seccion_producto">

                {/* Banner*/}
                <div className="banner">
                    <a href="https://www.tusuperpromo.com/descuento-especial" target="_blank" rel="noopener noreferrer">
                <img
                            src="https://static.vecteezy.com/system/resources/thumbnails/005/405/595/small/special-offer-sale-banner-besign-discount-label-and-sticker-for-media-promotion-product-free-vector.jpg"
                         alt="Banner de Descuento Especial"
                                style={{ width: "100%", height: "auto", borderRadius: "8px", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)"}}/>
                                </a>
                    </div>
          

                {/* Categorías nuevas */}
                <div className="productos-nuevos">
                    <h2>Categorías Nuevas</h2>
                    <div className="productos-flex wrap">
                        {categoriasNuevas.map((cat, index) => (
                            <article className="producto-card" key={index}>
                                <h3>{cat}</h3>
                                <p>Explora los mejores productos de {cat}</p>
                            </article>
                        ))}
                    </div>
                </div>

                {/* 6 productos nuevos */}
                <div className="productos-nuevos">
                    <h2>Productos Nuevos</h2>
                    <div className="productos-flex wrap">
                        {imagesData_2.map((imagen_2) => (
                            <article className="producto-card" key={imagen_2.id}>
                                <img src={imagen_2.imagen} alt={imagen_2.nombre} />
                                <h3>{imagen_2.nombre}</h3>
                                <p>{imagen_2.descripcion}</p>
                                <span className="precio">S/. {imagen_2.precio}</span>
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



  