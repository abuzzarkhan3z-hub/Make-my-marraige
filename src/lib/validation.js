/**
 * Form and input validation helpers
 */

export function isNonEmptyString(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

export function isValidNumber(val) {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(val);
  return !isNaN(num) && isFinite(num) && num >= 0;
}

export function isValidPhone(phone) {
  if (!phone) return true; // optional
  const clean = phone.replace(/[\s-]/g, '');
  return /^[+]?[0-9]{10,14}$/.test(clean);
}
