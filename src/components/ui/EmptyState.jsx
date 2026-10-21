import React from 'react';
import { Button } from './Button';

/**
 * Reusable EmptyState component
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) {
  return (
    <div className={`text-center py-12 px-4 rounded-2xl border-2 border-dashed border-stone-200 bg-white/50 ${className}`}>
      {Icon && (
        <div className="mx-auto w-12 h-12 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h4 className="font-serif text-lg font-semibold text-stone-800">{title}</h4>
      {description && <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1 mb-5">{description}</p>}
      {actionText && onAction && (
        <Button onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
