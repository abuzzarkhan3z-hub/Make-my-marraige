import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

/**
 * Confirmation dialog for destructive actions
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-3.5 mb-6">
        <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-stone-600 leading-relaxed pt-0.5">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
        <Button variant="secondary" onClick={onClose} size="sm">
          {cancelText}
        </Button>
        <Button
          variant={isDestructive ? 'danger' : 'primary'}
          onClick={() => {
            onConfirm();
            onClose();
          }}
          size="sm"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
