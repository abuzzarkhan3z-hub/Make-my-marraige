import React from 'react';

/**
 * Reusable FormField wrapper for text, number, date, select, textarea
 */
export function FormField({
  label,
  id,
  error,
  helperText,
  required = false,
  children,
  className = '',
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-stone-700 tracking-wide uppercase">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-stone-400">{helperText}</p>}
    </div>
  );
}

export const inputClasses = "w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-600 transition-all duration-150 disabled:bg-stone-50 disabled:text-stone-400";

export default FormField;
