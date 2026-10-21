import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { FormField, inputClasses } from '../../components/ui/FormField';

export function FunctionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    name: '',
    starts_at: '',
    venue: '',
    notes: '',
    status: 'Planned',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        starts_at: initialData.starts_at || '',
        venue: initialData.venue || '',
        notes: initialData.notes || '',
        status: initialData.status || 'Planned',
      });
    } else {
      setFormData({
        name: '',
        starts_at: '',
        venue: '',
        notes: '',
        status: 'Planned',
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
      newErrors.name = 'Function name is required';
    }
    if (!formData.starts_at) {
      newErrors.starts_at = 'Start date and time is required';
    }
    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Wedding Function' : 'Add Wedding Function'}
      subtitle="Organize ceremonies like Sangeet, Mehendi, Haldi, or Reception"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Function / Event Name" id="name" required error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Sangeet & Cocktail Night, Haldi Ceremony"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Date & Time" id="starts_at" required error={errors.starts_at}>
            <input
              id="starts_at"
              name="starts_at"
              type="datetime-local"
              value={formData.starts_at}
              onChange={handleChange}
              className={inputClasses}
            />
          </FormField>

          <FormField label="Status" id="status">
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="Planned">Planned</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
            </select>
          </FormField>
        </div>

        <FormField label="Venue / Location" id="venue" required error={errors.venue}>
          <input
            id="venue"
            name="venue"
            type="text"
            placeholder="e.g. Grand Palace Lawn, Banquet Hall A"
            value={formData.venue}
            onChange={handleChange}
            className={inputClasses}
          />
        </FormField>

        <FormField label="Notes & Themes (Optional)" id="notes">
          <textarea
            id="notes"
            name="notes"
            rows={2}
            placeholder="Dress code, theme, timing instructions..."
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
            {initialData ? 'Update Function' : 'Add Function'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default FunctionForm;
