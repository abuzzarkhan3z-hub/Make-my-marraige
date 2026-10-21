import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ExpenseTable } from '../features/expenses/ExpenseTable';
import { ExpenseForm } from '../features/expenses/ExpenseForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { computeExpenseSummaries, calculateExpenseStatus } from '../features/expenses/expenseUtils';
import { formatCurrency } from '../lib/formatCurrency';
import { expenseCategories } from '../data/sampleData';
import { PlusCircle, Search, Filter, ReceiptIndianRupee, CheckCircle2, Clock } from 'lucide-react';
import { inputClasses } from '../components/ui/FormField';

export function Expenses({
  expenses = [],
  functions = [],
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [functionFilter, setFunctionFilter] = useState('All');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);

  // Compute overall summaries
  const summaries = computeExpenseSummaries(expenses);

  // Filtered expense list
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      // Search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        exp.name?.toLowerCase().includes(searchLower) ||
        exp.vendor?.toLowerCase().includes(searchLower);

      // Category
      const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter;

      // Status
      const status = calculateExpenseStatus(exp.total_amount, exp.paid_amount);
      const matchesStatus = statusFilter === 'All' || status === statusFilter;

      // Function
      const matchesFunction = functionFilter === 'All' || exp.function_id === functionFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesFunction;
    });
  }, [expenses, searchTerm, categoryFilter, statusFilter, functionFilter]);

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingExpense(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingExpense) {
      onUpdateExpense({ ...formData, id: editingExpense.id, wedding_id: editingExpense.wedding_id });
    } else {
      onAddExpense({
        ...formData,
        id: `exp-${Date.now()}`,
        wedding_id: 'wed-001',
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingExpense) {
      onDeleteExpense(deletingExpense.id);
      setDeletingExpense(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wedding Expenses"
        subtitle="Track planned vendor contracts, payments made, and remaining balances"
        actions={
          <Button onClick={handleOpenAdd} icon={PlusCircle}>
            Add Expense
          </Button>
        }
      />

      {/* Financial Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm" className="bg-white border-l-4 border-l-stone-500">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase">
            <span>Total Expenses</span>
            <ReceiptIndianRupee className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
            {formatCurrency(summaries.totalExpenses)}
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">{expenses.length} budgeted line items</p>
        </Card>

        <Card padding="sm" className="bg-white border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold uppercase">
            <span>Total Paid</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-emerald-700 mt-1">
            {formatCurrency(summaries.totalPaid)}
          </div>
          <p className="text-[11px] text-emerald-600 mt-0.5">Disbursed to vendors</p>
        </Card>

        <Card padding="sm" className="bg-white border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between text-xs text-rose-800 font-semibold uppercase">
            <span>Outstanding Due</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-rose-700 mt-1">
            {formatCurrency(summaries.totalOutstanding)}
          </div>
          <p className="text-[11px] text-rose-500 mt-0.5">Pending settlements</p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card padding="sm" className="bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search expenses or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputClasses} pl-9 py-2 text-xs`}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`${inputClasses} py-2 text-xs`}
            >
              <option value="All">All Categories</option>
              {expenseCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Function Filter */}
          <div>
            <select
              value={functionFilter}
              onChange={(e) => setFunctionFilter(e.target.value)}
              className={`${inputClasses} py-2 text-xs`}
            >
              <option value="All">All Functions</option>
              {functions.map((fn) => (
                <option key={fn.id} value={fn.id}>
                  {fn.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${inputClasses} py-2 text-xs`}
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Expense List Table */}
      <ExpenseTable
        expenses={filteredExpenses}
        functions={functions}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeletingExpense(item)}
      />

      {/* Expense Add/Edit Modal */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
        functions={functions}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={!!deletingExpense}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense"
        message={`Are you sure you want to remove "${deletingExpense?.name}"? This will update your total expenses and budget calculations immediately.`}
        confirmText="Delete Expense"
      />
    </div>
  );
}

export default Expenses;
