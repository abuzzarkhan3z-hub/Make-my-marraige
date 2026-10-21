import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { FormField, inputClasses } from '../../components/ui/FormField';

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  members = [],
  functions = [],
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_member_id: '',
    due_date: '',
    function_id: '',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        assigned_member_id: initialData.assigned_member_id || '',
        due_date: initialData.due_date || '',
        function_id: initialData.function_id || '',
        status: initialData.status || 'Pending',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assigned_member_id: '',
        due_date: '',
        function_id: '',
        status: 'Pending',
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
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
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
      title={initialData ? 'Edit Task' : 'Assign Family Task'}
      subtitle="Delegate wedding planning to-dos to family members"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Task Title" id="title" required error={errors.title}>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Taste catering menu, Pick up wedding bands"
            value={formData.title}
            onChange={handleChange}
            className={inputClasses}
          />
        </FormField>

        <FormField label="Task Description (Optional)" id="description">
          <textarea
            id="description"
            name="description"
            rows={2}
            placeholder="Details, contact person, or specific instructions..."
            value={formData.description}
            onChange={handleChange}
            className={inputClasses}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Assign To Member" id="assigned_member_id">
            <select
              id="assigned_member_id"
              name="assigned_member_id"
              value={formData.assigned_member_id}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Status" id="status">
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Due Date" id="due_date">
            <input
              id="due_date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
              className={inputClasses}
            />
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

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default TaskForm;
