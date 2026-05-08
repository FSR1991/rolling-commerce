import { createOrderRequest } from "../routes/orderService";
import { useCart } from "../hooks/useCart";
import MercadoPagoButton from "../components/MercadoPagoButton";

function Checkout() {
  const { items, total, clear } = useCart();

  // Transformar items del carrito al formato de MercadoPago
  const mercadoPagoItems = items.map(item => ({
    title: item.product?.name || item.name,
    quantity: item.quantity,
    unit_price: item.product?.price || item.price,
    currency_id: "ARS",
    description: item.product?.description || item.description,
    id: item.product?._id || item._id,
  }));

  const handleSuccess = () => {
    // Crear la orden después del pago exitoso
    createOrderRequest().then(() => {
      clear();
      alert("Compra realizada con éxito");
    }).catch(err => {
      console.error(err);
      alert("Error al procesar la orden");
    });
  };

  const handleFailure = () => {
    alert("Pago fallido");
  };

  const handlePending = () => {
    alert("Pago pendiente");
  };

  return (
    <div className="container mt-5 pt-5">
      <h2>Checkout</h2>

      <div className="mb-4">
        <h3>Total: ${total}</h3>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.product?.name || item.name} - Cantidad: {item.quantity} - Precio: ${item.product?.price || item.price}
            </li>
          ))}
        </ul>
      </div>

      <MercadoPagoButton
        items={mercadoPagoItems}
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        onPending={handlePending}
      />
    </div>
  );
}

export default Checkout;