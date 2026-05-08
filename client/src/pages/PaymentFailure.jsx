function PaymentFailure() {
  return (
    <div className="container mt-5 pt-5">
      <h2>Pago Fallido</h2>
      <p>Hubo un problema con tu pago. Por favor, intenta nuevamente.</p>
      <a href="/checkout" className="btn btn-primary">Volver al checkout</a>
    </div>
  );
}

export default PaymentFailure;