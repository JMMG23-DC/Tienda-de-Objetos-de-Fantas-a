import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import { TopBar } from "../Home/components/TopBar";
import { Footer } from "../Home/components/Footer";
import "./checkout.css";
import qrImage from "../../../public/vite.svg";

// Claves de localStorage
const LOCAL_STORAGE_CART_KEY = "cart"; 
const LOCAL_STORAGE_USER_KEY = "nombre";

// ====================================================================
// FUNCIONES AUXILIARES (Se mantienen igual)
// ====================================================================

// Función para obtener datos de localStorage (sin try/catch explícito)
const getFromLocalStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
};

// Función para guardar datos en localStorage (Mantiene try/catch donde es crítico)
const setLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error al guardar ${key} en localStorage:`, error);
        return false;
    }
};

export const Checkout = () => {
    // Inicializar useNavigate
    const navigate = useNavigate();
    
    // 1. Cargar datos iniciales del carrito y usuario desde localStorage
    const [cartItems, setCartItems] = useState(() => {
        // Solo incluimos productos que NO estén "guardados para después" (Comportamiento original)
        const fullCart = getFromLocalStorage(LOCAL_STORAGE_CART_KEY, []);
        return fullCart.filter(item => !item.guardado);
    });

    const initialUserName = localStorage.getItem(LOCAL_STORAGE_USER_KEY) || "";

    // Estados de formulario
    const [nombre, setNombre] = useState(initialUserName); 
    const [direccion, setDireccion] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [metodoPago, setMetodoPago] = useState("qr");
    const [tarjeta, setTarjeta] = useState("");
    const [fechaExp, setFechaExp] = useState("");
    const [cvv, setCvv] = useState("");
    const [metodoEnvio, setMetodoEnvio] = useState("estandar");

    // 2. Calcular totales usando useMemo para optimización
    const { subtotal, costoEnvio, totalFinal } = useMemo(() => {
        const subtotalCalc = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        const envioCalc = metodoEnvio === "express" ? 20 : 10;
        const totalFinalCalc = subtotalCalc + envioCalc;
        
        return {
            subtotal: subtotalCalc.toFixed(2),
            costoEnvio: envioCalc.toFixed(2),
            totalFinal: totalFinalCalc.toFixed(2),
        };
    }, [cartItems, metodoEnvio]);


    // 3. Lógica para confirmar la orden, vaciar el carrito y redirigir
    const handleConfirmarOrden = () => {
        // --- VALIDACIONES ---
        if (!nombre || !direccion || !ciudad) {
            alert("Por favor completa los datos de envío.");
            return;
        }
        if (metodoPago === "tarjeta" && (!tarjeta || !fechaExp || !cvv)) {
            alert("Completa todos los campos de la tarjeta.");
            return;
        }
        if (cartItems.length === 0) {
            alert("Tu carrito está vacío.");
            navigate('/catalogo'); 
            return;
        }
        
        // --- CREACIÓN DE LA ORDEN (Solo para mostrar el resumen, no se guarda) ---
        const nuevaOrden = {
            id: Date.now(),
            cliente: nombre,
            total: parseFloat(totalFinal),
        };

        // --- VACIAR CARRITO COMPLETAMENTE ---
        // 🚨 CAMBIO: Se llama a setLocalStorage con un array vacío []
        const cartCleared = setLocalStorage(LOCAL_STORAGE_CART_KEY, []); 
        
        // --- RESPUESTA Y REDIRECCIÓN ---
        if (cartCleared) {
            setCartItems([]); // Limpiar el estado local
            alert(`Orden #${nuevaOrden.id} completada con éxito. Total: S/ ${totalFinal}. Volviendo al inicio.`);
            
            // Redireccionar a la página principal
            navigate("/"); 

        } else {
             // Este error ya fue manejado y logeado por setLocalStorage
            alert("Hubo un error al procesar tu orden debido a un problema de almacenamiento. Intenta nuevamente.");
        }
    };

    return (
        <>
            <TopBar />
            <div className="order-container">
                <h1>Checkout - Completa tu orden</h1>

                {/* Lista de productos */}
                <div className="order-section">
                    <h2>Productos en tu carrito ({cartItems.length})</h2>
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.id} className="order-item">
                                <p>{item.nombre} x {item.cantidad}</p>
                                <p>S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                            </div>
                        ))
                    ) : (
                        <p>No hay productos activos en el carrito. Por favor, ve al catálogo.</p>
                    )}
                </div>

                {/* Datos de envío */}
                <div className="order-section">
                    <h2>Dirección de envío</h2>
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Dirección"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Ciudad / País"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                    />
                </div>

                {/* Método de pago */}
                <div className="order-section">
                    <h2>Método de pago</h2>
                    <select onChange={(e) => setMetodoPago(e.target.value)} value={metodoPago}>
                        <option value="qr">Código QR</option>
                        <option value="tarjeta">Tarjeta de crédito</option>
                    </select>

                    {metodoPago === "qr" ? (
                        <div className="qr-container">
                            <p>Escanea este código para completar el pago:</p>
                            <img src={qrImage} alt="Código QR" className="qr-img" />
                        </div>
                    ) : (
                        <div className="tarjeta-form">
                            <input
                                type="text"
                                placeholder="Número de tarjeta"
                                value={tarjeta}
                                onChange={(e) => setTarjeta(e.target.value)}
                                maxLength="16"
                            />
                            <input
                                type="text"
                                placeholder="Fecha de expiración (MM/AA)"
                                value={fechaExp}
                                onChange={(e) => setFechaExp(e.target.value)}
                                maxLength="5"
                            />
                            <input
                                type="text"
                                placeholder="CVV"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                maxLength="4"
                            />
                        </div>
                    )}
                </div>

                {/* Método de envío */}
                <div className="order-section">
                    <h2>Método de envío</h2>
                    <select onChange={(e) => setMetodoEnvio(e.target.value)} value={metodoEnvio}>
                        <option value="estandar">Estándar (S/10.00)</option>
                        <option value="express">Express (S/20.00)</option>
                    </select>
                </div>

                {/* Resumen final */}
                <div className="order-summary">
                    <h2>Resumen de la orden</h2>
                    <p>Subtotal: S/ {subtotal}</p>
                    <p>Envío: S/ {costoEnvio}</p>
                    <h3>Total final: S/ {totalFinal}</h3>
                </div>

                <button 
                    className="btn-confirmar primary-btn"
                    onClick={handleConfirmarOrden} 
                    disabled={cartItems.length === 0}
                >
                    Completar orden
                </button>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;