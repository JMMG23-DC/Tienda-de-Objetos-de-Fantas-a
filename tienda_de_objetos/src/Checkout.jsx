import { useState } from "react";

export default function Checkout({ cart, total, onComplete, onCancel }) {
  const [address, setAddress] = useState("");
  const [shipping, setShipping] = useState("normal");
  const [paymentType, setPaymentType] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!address) return setError("Ingresa la dirección de envío.");
    if (!paymentType) return setError("Selecciona un método de pago.");
    if (paymentType === "card") {
      if (!card.number || !card.name || !card.expiry || !card.cvv) {
        return setError("Completa todos los datos de la tarjeta.");
      }
    }
    setError("");
    onComplete();
  }

  return (
    <div className="checkout" style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Dirección de envío:</label><br />
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} required />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Método de envío:</label><br />
          <select value={shipping} onChange={e => setShipping(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="express">Express</option>
          </select>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Método de pago:</label><br />
          <select value={paymentType} onChange={e => setPaymentType(e.target.value)} required>
            <option value="">Selecciona...</option>
            <option value="qr">Código QR</option>
            <option value="card">Tarjeta de crédito</option>
          </select>
        </div>
        {paymentType === "qr" && (
          <div style={{ marginTop: "1rem" }}>
            <label>Escanea el código QR para pagar:</label><br />
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PagoTiendaFantasía" alt="QR" />
          </div>
        )}
        {paymentType === "card" && (
          <div style={{ marginTop: "1rem" }}>
            <label>Número de tarjeta:</label><br />
            <input type="text" value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} required /><br />
            <label>Nombre en la tarjeta:</label><br />
            <input type="text" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} required /><br />
            <label>Fecha de expiración:</label><br />
            <input type="text" value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} required /><br />
            <label>CVV:</label><br />
            <input type="text" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} required />
          </div>
        )}
        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
        <div style={{ marginTop: "2rem" }}>
          <h4>Resumen de ítems</h4>
          <ul>
            {cart.map(item => (
              <li key={item.id}>{item.name} x {item.quantity} = ${item.price * item.quantity}</li>
            ))}
          </ul>
          <h4>Resumen de orden</h4>
          <div>Total: ${total}</div>
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>Completar orden</button>
        <button type="button" style={{ marginLeft: "1rem" }} onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
}
