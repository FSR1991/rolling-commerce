import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useEffect, useState } from 'react';

const MercadoPagoButton = ({ items, onSuccess, onFailure, onPending }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Inicializar MercadoPago con la clave pública
    initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);
  }, []);

  const createPreference = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Asumiendo que el token está en localStorage
        },
        body: JSON.stringify({
          items,
          backUrls: {
            success: `${window.location.origin}/success`,
            failure: `${window.location.origin}/failure`,
            pending: `${window.location.origin}/pending`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error creating preference');
      }

      const data = await response.json();
      setPreferenceId(data.preferenceId);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la preferencia de pago');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    createPreference();
  };

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Cargando...' : 'Pagar con MercadoPago'}
      </button>

      {preferenceId && (
        <Wallet
          initialization={{ preferenceId }}
          onReady={() => console.log('Wallet ready')}
          onError={(error) => console.error('Wallet error:', error)}
          onSubmit={() => console.log('Payment submitted')}
        />
      )}
    </div>
  );
};

export default MercadoPagoButton;