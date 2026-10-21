import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { FormField, inputClasses } from '../../components/ui/FormField';
import { expenseCategories } from '../../data/sampleData';
import { formatCurrency } from '../../lib/formatCurrency';

export function ExpenseForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  functions = [],
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Venue',
    total_amount: '',
    paid_amount: '0',
    function_id: '',
    vendor: '',
    expense_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Venue',
        total_amount: initialData.total_amount !== undefined ? String(initialData.total_amount) : '',
        paid_amount: initialData.paid_amount !== undefined ? String(initialData.paid_amount) : '0',
        function_id: initialData.function_id || '',
        vendor: initialData.vendor || '',
        expense_date: initialData.expense_date || new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'Venue',
        total_amount: '',
        paid_amount: '0',
        function_id: '',
        vendor: '',
        expense_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Expense name is required';
    }

    const total = Number(formData.total_amount);
    if (!formData.total_amount || isNaN(total) || total <= 0) {
      newErrors.total_amount = 'Total amount must be greater than 0';
    }

    const paid = Number(formData.paid_amount);
    if (formData.paid_amount === '' || isNaN(paid) || paid < 0) {
      newErrors.paid_amount = 'Paid amount cannot be negative';
    } else if (total > 0 && paid > total) {
      newErrors.paid_amount = 'Paid amount cannot exceed total expense amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      total_amount: Number(formData.total_amount),
      paid_amount: Number(formData.paid_amount),
    });
    onClose();
  };

  const calculatedRemaining = Math.max(
    0,
    (Number(formData.total_amount) || 0) - (Number(formData.paid_amount) || 0)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Expense' : 'Add New Expense'}
      subtitle="Track planned costs and payments for wedding ceremonies and vendors"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Expense Item Name" id="name" required error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Catering advance, Floral decor, Vintage car rental"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Category" id="category" required>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClasses}
            >
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Related Function" id="function_id">
            <select
              id="function_id"
              name="function_id"
              value={formData.function_id}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="">General (All Wedding)</option>
              {functions.map((fn) => (
                <option key={fn.id} value={fn.id}>
                  {fn.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Total Amount (₹)" id="total_amount" required error={errors.total_amount}>
            <input
              id="total_amount"
              name="total_amount"
              type="number"
              min="0"
              step="500"
              placeholder="e.g. 150000"
              value={formData.total_amount}
              onChange={handleChange}
              className={inputClasses}
            />
          </FormField>

          <FormField label="Amount Paid (₹)" id="paid_amount" required error={errors.paid_amount}>
            <input
              id="paid_amount"
              name="paid_amount"
              type="number"
              min="0"
              step="500"
              placeholder="0"
              value={formData.paid_amount}
              onChange={handleChange}
              className={inputClasses}
            />
          </FormField>
        </div>

        {/* Live Calculation Preview Banner */}
        <div className="p-3 bg-ivory-50 border border-stone-200/80 rounded-xl flex items-center justify-between text-xs">
          <span className="text-stone-500 font-medium">Remaining Outstanding:</span>
          <span className="font-semibold text-rose-700 font-mono text-sm">
            {formatCurrency(calculatedRemaining)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Vendor / Recipient" id="vendor">
            <input
              id="vendor"
              name="vendor"
              type="text"
              placeholder="e.g. Royal Banquet, Shutter Films"
              value={formData.vendor}
              onChange={handleChange}
              className={inputClasses}
            />
          </FormField>

          <FormField label="Expense Date" id="expense_date">
            <input
              id="expense_date"
              name="expense_date"
              type="date"
              value={formData.expense_date}
              onChange={handleChange}
              className={inputClasses}
            />
          </FormField>
        </div>

        <FormField label="Notes (Optional)" id="notes">
          <textarea
            id="notes"
            name="notes"
            rows={2}
            placeholder="Payment mode, invoice number, or delivery milestones..."
            value={formData.notes}
            onChange={handleChange}
            className={inputClasses}
          />
        </FormField>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Expense' : 'Save Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ExpenseForm;
