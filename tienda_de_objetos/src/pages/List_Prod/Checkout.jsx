import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { TopBar } from "../Home/components/TopBar";
import { Footer } from "../Home/components/Footer";
import "./checkout.css";

const qrImage = "/vite.svg";

const getFromLocalStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
};

const setLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error LS:`, error);
        return false;
    }
};

export const Checkout = () => {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState(() => {
        const fullCart = getFromLocalStorage("cart", []);
        return fullCart.filter(item => !item.guardado);
    });

    const [nombre, setNombre] = useState(localStorage.getItem("nombre") || ""); 
    const [direccion, setDireccion] = useState("");
    const [ciudad, setCiudad] = useState("");

    // Métodos de pago nuevos
    const [metodoPago, setMetodoPago] = useState("qr");

    const [tarjeta, setTarjeta] = useState("");
    const [fechaExp, setFechaExp] = useState("");
    const [cvv, setCvv] = useState("");

    const [metodoEnvio, setMetodoEnvio] = useState("estandar");

    const [procesando, setProcesando] = useState(false);

    const subtotalCalc = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const envioCalc = metodoEnvio === "express" ? 20 : 10;
    const totalFinalCalc = subtotalCalc + envioCalc;

    const handleConfirmarOrden = async () => {

        const usuarioId = Number(localStorage.getItem("usuario_id"));

        if (!usuarioId) return alert("Error: usuario no autenticado.");

        if (!nombre || !direccion || !ciudad) return alert("Completa los datos de envío.");
        if (metodoPago === "tarjeta" && (!tarjeta || !fechaExp || !cvv)) 
            return alert("Completa los datos de tu tarjeta.");
        if (cartItems.length === 0) return alert("Carrito vacío.");

        setProcesando(true);

        // Datos del pago que sí se almacenan
        const ordenData = {
            usuario_id: usuarioId,
            datos_envio: { metodo: metodoEnvio, ciudad, direccion },
            datos_pago: { 
                metodo: metodoPago, 
                estado: "Completado",
                referencia: metodoPago === "yape" || metodoPago === "plin" ? "QR-OK" : null,
                moneda: "PEN",
                monto: totalFinalCalc
            },
            items: cartItems.map(item => ({
                id_producto: item.id,
                cantidad: item.cantidad,
                precio: item.precio
            }))
        };

        try {
            const response = await fetch("http://3.131.85.192:3000/api/ordenes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ordenData)
            });

            const data = await response.json();

            if (response.ok) {
                setLocalStorage("cart", []); 
                setCartItems([]); 
                alert(`¡Éxito! Orden #${data.ordenId} creada.`);
                navigate("/"); 
            } else {
                alert("Error: " + data.message);
            }

        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
        } finally {
            setProcesando(false);
        }
    };

    return (
        <>
            <TopBar />
            <div className="order-container">
                <h1>Checkout</h1>

                {/* Productos */}
                <div className="order-section">
                    <h2>Productos ({cartItems.length})</h2>
                    {cartItems.map((item) => (
                        <div key={item.id} className="order-item">
                            <p>{item.nombre} x {item.cantidad}</p>
                            <p>S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                {/* Envío */}
                <div className="order-section">
                    <h2>Envío</h2>
                    <input placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} />
                    <input placeholder="Dirección" value={direccion} onChange={e=>setDireccion(e.target.value)} />
                    <input placeholder="Ciudad" value={ciudad} onChange={e=>setCiudad(e.target.value)} />

                    <select value={metodoEnvio} onChange={e=>setMetodoEnvio(e.target.value)}>
                        <option value="estandar">Estándar (S/10)</option>
                        <option value="express">Express (S/20)</option>
                    </select>
                </div>

                {/* Métodos de pago */}
                <div className="order-section">
                    <h2>Pago</h2>

                    <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                        <option value="qr">QR</option>
                        <option value="yape">Yape</option>
                        <option value="plin">Plin</option>
                        <option value="paypal">PayPal</option>
                        <option value="tarjeta">Tarjeta</option>
                    </select>

                    {/* Mostrar QR */}
                    {(metodoPago === "qr" || metodoPago === "yape" || metodoPago === "plin") && (
                        <div className="qr-container">
                            <img src={qrImage} className="qr-img" alt="QR" />
                            <p>Escanea el QR para completar el pago</p>
                        </div>
                    )}

                    {/* Campos de tarjeta */}
                    {(metodoPago === "tarjeta" || metodoPago === "paypal")  && (
                        <div className="tarjeta-form">
                            <input 
                                placeholder="Número de tarjeta" 
                                maxLength={16}
                                value={tarjeta}
                                onChange={e=>setTarjeta(e.target.value)}
                            />
                            <input 
                                placeholder="MM/YY" 
                                value={fechaExp}
                                onChange={e=>setFechaExp(e.target.value)}
                            />
                            <input 
                                placeholder="CVV" 
                                maxLength={3}
                                value={cvv}
                                onChange={e=>setCvv(e.target.value)}
                            />
                        </div>
                    )}

                    
                </div>

                {/* Total */}
                <div className="order-summary">
                    <h3>Total: S/ {totalFinalCalc.toFixed(2)}</h3>
                </div>

                <button 
                    className="btn-confirmar primary-btn"
                    onClick={handleConfirmarOrden} 
                    disabled={cartItems.length === 0 || procesando}
                >
                    {procesando ? "Procesando..." : "Completar orden"}
                </button>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
