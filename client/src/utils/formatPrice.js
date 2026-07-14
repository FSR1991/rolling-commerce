export const formatPrice = (value, currency = 'ARS') => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
  }).format(amount);
};

export default formatPrice;
