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

    const [productos, setProductos] = useState(loadInitialCart);
    const [categorias, setCategorias] = useState([]);
    const [categoriaFiltro, setCategoriaFiltro] = useState("todos");

    // Solicitar categorías desde el backend
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await fetch("http://3.131.85.192:3000/categoriassss");
                const data = await res.json();
                setCategorias(data);
            } catch (error) {
                console.error("Error cargando categorías:", error);
            }
        };

        fetchCategorias();
    }, []);

    // Guardar carrito en localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(productos));
    }, [productos]);

    const nombreUsuario = localStorage.getItem("nombre") || "";

    const cambiarCantidad = (id, nuevaCantidad) => {
        const cantidadSegura = Math.max(1, nuevaCantidad);
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
        const nuevos = productos.map((p) =>
            p.id === id ? { ...p, guardado: !p.guardado } : p
        );
        setProductos(nuevos);
    };


    const productosFiltrados = useMemo(() => {
        if (categoriaFiltro === "todos") return productos;

        return productos.filter(
            (p) => p.categoria_id === parseInt(categoriaFiltro)
        );
    }, [categoriaFiltro, productos]);

    const { total, productosEnCarrito, productosGuardados } = useMemo(() => {
        let totalAcumulado = 0;
        const enCarrito = [];
        const guardados = [];

        for (const p of productosFiltrados) {
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
    }, [productosFiltrados]);

    return (
        <>
            <TopBar />

            <div className="carrito-container">
                <h1>Carrito de Compras</h1>

                {/* 🆕 FILTRO POR CATEGORÍAS */}
                <div className="filtro-categorias">
                    <label>Filtrar por categoría:</label>
                    <select
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                    >
                        <option value="todos">Todas</option>
                        {categorias.map((cat) => (
                            <option key={cat.categoria_id} value={cat.categoria_id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Productos en carrito */}
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
                                    <p className="carrito-subtotal">
                                        Subtotal: S/. {(producto.precio * producto.cantidad).toFixed(2)}
                                    </p>

                                    <div className="carrito-controles">
                                        <input
                                            type="number"
                                            value={producto.cantidad}
                                            onChange={(e) =>
                                                cambiarCantidad(
                                                    producto.id,
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            min="1"
                                        />
                                        <button onClick={() => eliminar(producto.id)} className="btn-eliminar">
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

                <hr />

                <div className="carrito-total">
                    <h2>Total a Pagar: S/. {total}</h2>
                    {nombreUsuario !== "" ? (
                        <NavLink to="/Checkout">
                            <button className="primary-btn">Completar orden</button>
                        </NavLink>
                    ) : (
                        <p className="login-msg">Inicia sesión para completar tu orden</p>
                    )}
                </div>

                <hr />

                {/* Guardados */}
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
                                        <button
                                            onClick={() => guardarParaDespues(p.id)}
                                            className="btn-mover"
                                        >
                                            Mover al carrito
                                        </button>
                                        <button
                                            onClick={() => eliminar(p.id)}
                                            className="btn-eliminar"
                                        >
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
