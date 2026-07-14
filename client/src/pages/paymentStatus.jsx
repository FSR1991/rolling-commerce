import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { getOrderByIdRequest } from '../routes/orderService';

const statusConfig = {
  '/success': {
    icon: CheckCircle2,
    title: 'Pago aprobado',
    message: 'Recibimos la confirmacion de Mercado Pago. Ya estamos preparando tu compra.',
    tone: '#22c55e',
  },
  '/failure': {
    icon: XCircle,
    title: 'Pago no completado',
    message: 'Mercado Pago no pudo completar la operacion. Podes volver al checkout e intentarlo nuevamente.',
    tone: '#fb7185',
  },
  '/pending': {
    icon: Clock,
    title: 'Pago pendiente',
    message: 'Tu pago esta pendiente de confirmacion. Te avisaremos cuando Mercado Pago actualice el estado.',
    tone: '#facc15',
  },
};

export default function PaymentStatus() {
  const { pathname, search } = useLocation();
  const { clearCartAfterApprovedPayment } = useCart();
  const [verification, setVerification] = useState(
    pathname === '/success' ? 'loading' : 'idle',
  );
  const [verificationMessage, setVerificationMessage] = useState('');
  const cartClearedRef = useRef(false);
  const orderId = useMemo(
    () => new URLSearchParams(search).get('orderId') || '',
    [search],
  );
  const baseConfig = statusConfig[pathname] || statusConfig['/pending'];
  const config =
    pathname === '/success' && verification !== 'paid'
      ? {
          ...statusConfig['/pending'],
          title: verification === 'loading' ? 'Verificando pago' : 'Pago pendiente de confirmacion',
          message:
            verificationMessage ||
            'Todavia no pudimos confirmar el pago. Tu carrito se conserva hasta recibir la confirmacion.',
        }
      : baseConfig;
  const Icon = config.icon;
  const isSuccess = pathname === '/success';

  useEffect(() => {
    if (!isSuccess) return;
    if (!orderId) {
      queueMicrotask(() => {
        setVerification('pending');
        setVerificationMessage(
          'No recibimos una referencia de orden valida. Tu carrito no fue modificado.',
        );
      });
      return;
    }

    let active = true;

    const verifyPayment = async () => {
      try {
        setVerification('loading');
        setVerificationMessage('');
        const order = await getOrderByIdRequest(orderId);
        const isConfirmed = order?.status === 'paid' || order?.status === 'delivered';

        if (!active) return;

        if (!isConfirmed) {
          setVerification('pending');
          setVerificationMessage(
            'Mercado Pago regreso al sitio, pero la orden aun no figura como pagada. Tu carrito se conserva.',
          );
          return;
        }

        setVerification('paid');

        if (!cartClearedRef.current) {
          cartClearedRef.current = true;
          try {
            await clearCartAfterApprovedPayment();
          } catch (clearError) {
            console.error(
              'El pago fue confirmado, pero no se pudo limpiar el carrito:',
              clearError,
            );
          }
        }
      } catch (error) {
        if (!active) return;
        setVerification('pending');
        setVerificationMessage(
          error?.message ||
            'No pudimos verificar el pago. Tu carrito no fue modificado.',
        );
      }
    };

    verifyPayment();

    return () => {
      active = false;
    };
  }, [clearCartAfterApprovedPayment, isSuccess, orderId]);

  return (
    <section style={styles.page}>
      <article style={styles.card}>
        <div style={{ ...styles.icon, color: config.tone, borderColor: `${config.tone}55` }}>
          <Icon size={42} strokeWidth={2.1} aria-hidden="true" />
        </div>
        <h1 style={styles.title}>{config.title}</h1>
        <p style={styles.message}>{config.message}</p>
        <div style={styles.actions}>
          <Link to="/products" style={styles.primaryLink}>Seguir comprando</Link>
          <Link to="/cart" style={styles.secondaryLink}>Ver carrito</Link>
        </div>
      </article>
    </section>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 92px)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 20px',
    background: 'radial-gradient(circle at top, rgba(66,196,255,0.14), transparent 34%), #060b16',
    boxSizing: 'border-box',
  },
  card: {
    width: '100%',
    maxWidth: '520px',
    padding: '40px',
    textAlign: 'center',
    background: 'rgba(10, 17, 31, 0.92)',
    border: '1px solid rgba(131,216,255,0.18)',
    borderRadius: '16px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.42)',
  },
  icon: {
    width: '76px',
    height: '76px',
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.045)',
  },
  title: {
    color: '#fff',
    fontSize: 'clamp(28px, 5vw, 38px)',
    margin: '0 0 12px',
    fontWeight: 800,
  },
  message: {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: 1.7,
    margin: '0 0 28px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryLink: {
    color: '#fff',
    background: '#0d6efd',
    border: '1px solid #0d6efd',
    borderRadius: '12px',
    padding: '12px 18px',
    textDecoration: 'none',
    fontWeight: 700,
  },
  secondaryLink: {
    color: '#dff6ff',
    background: 'transparent',
    border: '1px solid rgba(131,216,255,0.28)',
    borderRadius: '12px',
    padding: '12px 18px',
    textDecoration: 'none',
    fontWeight: 700,
  },
};
