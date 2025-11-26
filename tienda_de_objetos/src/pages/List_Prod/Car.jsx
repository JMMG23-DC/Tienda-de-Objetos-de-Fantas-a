import { useState, useEffect, useMemo } from "react";
import { TopBar } from "../Home/components/TopBar.jsx";
import { Footer } from "../Home/components/Footer.jsx";
import "../List_Prod/car.css";
import { NavLink } from "react-router-dom";


const loadInitialCart = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
};

export const Car = () => {
    
    // Cargar el carrito inicial y establecer el estado
    const [productos, setProductos] = useState(loadInitialCart);

 
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(productos));
    }, [productos]);


    // Obtener el nombre de usuario
    const nombreUsuario = localStorage.getItem("nombre") || "";


    // FUNCIÓN: Cambia la cantidad de un producto por su ID
    const cambiarCantidad = (id, nuevaCantidad) => {
        const cantidadSegura = Math.max(1, nuevaCantidad);
        
        const nuevos = productos.map((p) =>
            p.id === id ? { ...p, cantidad: cantidadSegura } : p
        );
        setProductos(nuevos);
    };

    // FUNCIÓN: Elimina un producto por su ID
    const eliminar = (id) => {
        const nuevos = productos.filter((p) => p.id !== id);
        setProductos(nuevos);
    };

    //  Mueve entre el carrito activo y la lista de guardados (guardado: true/false)
    const guardarParaDespues = (id) => {
        const nuevos = productos.map((p) =>
            p.id === id ? { ...p, guardado: !p.guardado } : p
        );
        setProductos(nuevos);
    };

    // CÁLCUlo optimaiz
    const { total, productosEnCarrito, productosGuardados } = useMemo(() => {
        let totalAcumulado = 0;
        const enCarrito = [];
        const guardados = [];

        for (const p of productos) {
            if (p.guardado) {
                guardados.push(p);
            } else {
                enCarrito.push(p);
                totalAcumulado += p.precio * p.cantidad;
            }
        }

        return {
            total: totalAcumulado.toFixed(2), 
            productosEnCarrito: enCarrito,
            productosGuardados: guardados,
        };

    }, [productos]); 


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

                <hr/>

                {/* Resumen y Botón de Checkout */}
                <div className="carrito-total">
                    <h2>Total a Pagar: S/. {total}</h2>
                    {nombreUsuario !== "" ? (
                        <NavLink to="/Checkout"> 
                            <button className="primary-btn" >
                                Completar orden
                            </button>
                        </NavLink>
                    ) : (
                        <p className="login-msg">Inicia sesión para completar tu orden</p>
                    )}
                </div>

                <hr/>
                
                {/* Productos Guardados para después */}
                <div className="carrito-guardados">
                    <h2>Guardados para después ({productosGuardados.length})</h2>
                    {productosGuardados.length === 0 ? (
                        <p className="carrito-vacio-msg">No hay productos guardados aquí.</p>
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
