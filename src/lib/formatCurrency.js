/**
 * Format an amount in Indian Rupee format (or fallback)
 * @param {number|string} amount
 * @param {string} currencyCode - Default 'INR'
 * @returns {string} e.g. "₹12,50,000"
 */
export function formatCurrency(amount, currencyCode = 'INR') {
  const numericAmount = Number(amount) || 0;
  
  if (currencyCode === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numericAmount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

/**
 * Format a number to compact Indian display (e.g. ₹12.5 L)
 * @param {number|string} amount 
 * @returns {string}
 */
export function formatCompactCurrency(amount) {
  const num = Number(amount) || 0;
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)} L`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(0)}k`;
  }
  return `₹${num}`;
}
