import React from 'react';

/**
 * Reusable Card component with warm subtle borders and shadows
 */
export function Card({
  children,
  className = '',
  padding = 'default',
  hover = false,
  ...props
}) {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    default: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const hoverStyle = hover ? 'transition-all duration-200 hover:shadow-card hover:border-stone-300' : '';

  return (
    <div
      className={`bg-white rounded-2xl border border-stone-200/80 shadow-soft ${paddingStyles[padding] || paddingStyles.default} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between pb-4 border-b border-stone-100 ${className}`}>
      <div>
        {title && <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 tracking-tight">{title}</h3>}
        {subtitle && <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}

export default Card;
