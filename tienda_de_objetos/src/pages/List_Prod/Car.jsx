import React, { useState, useEffect, useMemo } from "react";
// Eliminamos la importación de listaData, ya que el estado se maneja con localStorage
// import { listaData } from "../../data/listaData.jsx"; 
import { TopBar } from "../Home/components/TopBar.jsx";
import { Footer } from "../Home/components/Footer.jsx";
import "../List_Prod/car.css";
import { NavLink } from "react-router-dom";

// Clave del localStorage para el carrito
const LOCAL_STORAGE_CART_KEY = "cart"; 

// ====================================================================
// Función de utilidad para cargar el estado inicial
// ====================================================================
const loadInitialCart = () => {
    try {
        const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        // Devolvemos el carrito almacenado, o un array vacío si no existe
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Error al cargar el carrito de localStorage:", error);
        return [];
    }
};

export const Car = () => {
    
    // 1. Cargar el carrito inicial desde localStorage
    const [productos, setProductos] = useState(loadInitialCart);

    // 2. Persistir el carrito a localStorage cada vez que 'productos' cambie
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(productos));
        } catch (error) {
            console.error("Error al guardar el carrito en localStorage:", error);
        }
    }, [productos]);


    // Obtener el nombre del usuario directamente de localStorage
    // (Asumo que "nombre" en localStorage es la clave para el nombre del usuario)
    const nombreUsuario = localStorage.getItem("nombre") || "";


    // ====================================================================
    // Lógica de manipulación del carrito
    // ====================================================================

    const cambiarCantidad = (id, nuevaCantidad) => {
        const cantidadSegura = Math.max(1, nuevaCantidad); // Asegura que la cantidad sea al menos 1
        
        const nuevos = productos.map((p) =>
            p.id === id ? { ...p, cantidad: cantidadSegura } : p
        );
        setProductos(nuevos);
    };

    const eliminar = (id) => {
        // Simplemente filtra y elimina el producto
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

    // ====================================================================
    // Cálculos optimizados con useMemo
    // ====================================================================

    // Calcular el total solo para los productos NO guardados
    const total = useMemo(() => {
        return productos
            .filter((p) => !p.guardado)
            .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
            .toFixed(2); // Formatear a 2 decimales
    }, [productos]);

    // Filtrar productos para la vista principal
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