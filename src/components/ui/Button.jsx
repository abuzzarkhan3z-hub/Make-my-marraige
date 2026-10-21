import React from 'react';

/**
 * Reusable Button component styled with Make My Marriage palette
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-sage-700 hover:bg-sage-800 text-white shadow-sm hover:shadow focus:ring-sage-600',
    secondary: 'bg-white hover:bg-ivory-100 text-stone-700 border border-stone-200 hover:border-stone-300 shadow-sm focus:ring-sage-500',
    gold: 'bg-gold-500 hover:bg-gold-600 text-white shadow-sm hover:shadow focus:ring-gold-400',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 focus:ring-rose-500',
    ghost: 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60 focus:ring-stone-400',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </button>
  );
}
export default Button;
