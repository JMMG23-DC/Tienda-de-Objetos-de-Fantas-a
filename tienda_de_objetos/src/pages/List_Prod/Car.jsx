import { useState, useEffect, useMemo } from "react";
import { TopBar } from "../Home/components/TopBar.jsx";
import { Footer } from "../Home/components/Footer.jsx";
import "../List_Prod/car.css";
import { NavLink } from "react-router-dom";


const LOCAL_STORAGE_CART_KEY = "cart"; 

// Función de el estado inicial
const loadInitialCart = () => {
    try {
        const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Error al cargar el carrito de localStorage:", error);
        return [];
    }
};

export const Car = () => {
    
    //  Cargar el carrito inicial
    const [productos, setProductos] = useState(loadInitialCart);

    // El carrito cuando 'productos' cambie
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(productos));
        } catch (error) {
            console.error("Error al guardar el carrito en localStorage:", error);
        }
    }, [productos]);


    // Obtener usuario nombre 
    const nombreUsuario = localStorage.getItem("nombre") || "";


    //  cantidad del carrito
    const cambiarCantidad = (id, nuevaCantidad) => {
        const cantidadSegura = Math.max(1, nuevaCantidad); //la cantidad sea al menos 1
        
        const nuevos = productos.map((p) =>
            p.id === id ? { ...p, cantidad: cantidadSegura } : p
        );
        setProductos(nuevos);
    };

    const eliminar = (id) => {
        
        const nuevos = productos.filter((p) => p.id !== id);
        setProductos(nuevos);
    };

    const guardarParaDespues = (id) => {
        // Cambia el estado 'guardado' del producto
        const nuevos = productos.map((p) =>
            p.id === id ? { ...p, guardado: !p.guardado } : p
        );
        setProductos(nuevos);
    };

    // Calcular el total solo para los productos NO guardados
    const total = useMemo(() => {
        return productos
            .filter((p) => !p.guardado)
            .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
            .toFixed(2); // a 2 decimales
    }, [productos]);

    // Filtrar pa la vista principal
    const productosEnCarrito = useMemo(() => productos.filter((p) => !p.guardado), [productos]);
    
    // Filtrar productos guardados
    const productosGuardados = useMemo(() => productos.filter((p) => p.guardado), [productos]);


    return (
        <>
            <TopBar />
            <div className="carrito-container">
                <h1>Carrito de Compras</h1>
                
                {/* Productos en el carrito (Activos) */}
                <div className="carrito-lista">
                    {productosEnCarrito.length === 0 ? (
                        <p className="carrito-vacio-msg">Tu carrito está vacío</p>
                    ) : (
                        productosEnCarrito.map((producto) => (
                            <div key={producto.id} className="carrito-item">
                                <img src={producto.imagen} alt={producto.nombre} />
                                <div className="carrito-detalle">
                                    <h3>{producto.nombre}</h3>
                                    <p className="carrito-precio">S/. {producto.precio.toFixed(2)}</p>
                                    <p className="carrito-subtotal">Subtotal: S/. {(producto.precio * producto.cantidad).toFixed(2)}</p>

                                    <div className="carrito-controles">
                                        <input
                                            type="number"
                                            value={producto.cantidad}
                                            onChange={(e) =>
                                                cambiarCantidad(producto.id, parseInt(e.target.value))
                                            }
                                            min="1"
                                        />
                                        <button 
                                            onClick={() => eliminar(producto.id)} 
                                            className="btn-eliminar"
                                        >
                                            Eliminar
                                        </button>
                                        <button 
                                            onClick={() => guardarParaDespues(producto.id)}
                                            className="btn-guardar"
                                        >
                                            Guardar para después
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Total */}
                <div className="carrito-total">
                    <h2>Total: S/. {total}</h2>
                    {nombreUsuario !== "" ? (
                        <NavLink to="/Checkout"> 
                            <button className="primary-btn">Completar orden</button>
                        </NavLink>
                    ) : (
                        <p className="login-msg">Inicia sesión para completar tu orden</p>
                    )}
                </div>

                {/* Productos Guardados */}
                <div className="carrito-guardados">
                    <h2>Guardados para después ({productosGuardados.length})</h2>
                    {productosGuardados.length === 0 ? (
                        <p className="carrito-vacio-msg">No hay productos guardados</p>
                    ) : (
                        productosGuardados.map((p) => (
                            <div key={p.id} className="carrito-item carrito-item-guardado">
                                <img src={p.imagen} alt={p.nombre} />
                                <div className="carrito-detalle">
                                    <h3>{p.nombre}</h3>
                                    <p className="carrito-precio">S/. {p.precio.toFixed(2)}</p>
                                    <div className="carrito-controles">
                                        <button onClick={() => guardarParaDespues(p.id)} className="btn-mover">
                                            Mover al carrito
                                        </button>
                                        <button onClick={() => eliminar(p.id)} className="btn-eliminar">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Car;