import { imagesData } from "../../data/imagesData"
import { imagesData_2 } from "../../data/images_2Data"
import "../Home/home.css"
//  import Banner from "../../banner_image/banner.jpg";
import { TopBar } from "./components/TopBar"
import { Footer } from "./components/Footer"


export const Home = () =>{

        
    // 3 productos por Categorías Mas Vendidos
    let lista_categorias = ["Armas Encantadas", "Pociones y Elixires Místicos", "Grimorios Antiguos", "Cristales Elementales", "Reliquias y Artefactos Legendarios", "Armaduras y Escudos"];
    let lista_ventas = [0,0,0,0,0,0];

    const imagenes = imagesData.map((imagen)=>{
        for (let index = 0; index < 6; index++) {
            if(imagen.categoria === lista_categorias[index]){
                lista_ventas[index] = imagen.ventas + lista_ventas[index];
            }            
        }
    })

    //------> Se crea un Array de objetos
    const ventasPorCategoria = lista_categorias.map((cat, i) => ({
    categoria: cat,
    ventas: lista_ventas[i]
    }));

    ventasPorCategoria.sort((a, b) => b.ventas - a.ventas);
    const top3Categorias = ventasPorCategoria.slice(0, 3);


    // 12 productos de noviembre Mas Vendidos
    const productosNoviembre = imagesData.filter(imagen => imagen.mes === "Noviembre");
    productosNoviembre.sort((a, b) => b.ventas - a.ventas);
    const primeros12 = productosNoviembre.slice(0, 12);

    console.log("Cantidad de ventas totales por producto: "+ top3Categorias);
    console.log("Cantidad de objetos: " + primeros12.length);

    // 3 nuevas categorías
    const categoriasNuevas = ["Cristales Elementales", "Reliquias y Artefactos Legendarios", "Grimorios Antiguos"];


return (
        <>
            <TopBar />

            <section className="seccion_titulo">
                <h1>Bienvenido a Nuestra Tienda</h1>
                <p>Descubre los productos más destacados y aprovecha nuestras ofertas del mes.</p>
            </section>

            {/*Seccion de 3 productos */}
            <section className="seccion_producto">
                <h2>Los 3 Productos Más Destacados</h2>
                <div className="productos-flex">
                    {top3Categorias.map((imagen) => (
                        <article className="producto-card" key={imagen.id}>
                            <img src={imagen.imagen} alt={imagen.categoria} />
                            <h3>{imagen.categoria}</h3>
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
                    <img src="" alt="Banner Publicitario" style={{ maxWidth: "100%", height: "30%" }} />
                </div>

                {/* Categorías nuevas */}
                <div className="productos-nuevos">
                    <h2>Categorías Nuevas</h2>
                    <div className="productos-flex wrap">
                        {categoriasNuevas.map((cat) => (
                            <article className="producto-card" key={cat.id}>
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