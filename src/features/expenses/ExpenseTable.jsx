import React from 'react';
import { formatCurrency } from '../../lib/formatCurrency';
import { calculateExpenseStatus, calculateExpenseRemaining } from './expenseUtils';
import { Edit2, Trash2, Calendar, Building, Tag } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ExpenseTable({
  expenses = [],
  functions = [],
  onEdit,
  onDelete,
}) {
  const getFunctionName = (fnId) => {
    if (!fnId) return 'General';
    const found = functions.find((f) => f.id === fnId);
    return found ? found.name : 'General';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Partially Paid':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Unpaid':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  if (!expenses.length) {
    return (
      <div className="text-center py-12 text-stone-500 bg-white rounded-2xl border border-stone-200">
        No expenses found matching the selected filters.
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-ivory-50 border-b border-stone-200/80 text-[11px] font-semibold uppercase text-stone-500 tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Expense & Category</th>
              <th className="py-3.5 px-4">Function & Vendor</th>
              <th className="py-3.5 px-4 text-right">Total Amount</th>
              <th className="py-3.5 px-4 text-right">Paid</th>
              <th className="py-3.5 px-4 text-right">Remaining</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {expenses.map((item) => {
              const status = calculateExpenseStatus(item.total_amount, item.paid_amount);
              const remaining = calculateExpenseRemaining(item.total_amount, item.paid_amount);

              return (
                <tr key={item.id} className="hover:bg-ivory-50/60 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-stone-900">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-stone-500">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px]">
                        {item.category}
                      </span>
                      {item.expense_date && (
                        <span>&bull; {item.expense_date}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <p className="text-xs font-medium text-stone-800">{getFunctionName(item.function_id)}</p>
                    {item.vendor && (
                      <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                        <Building className="w-3 h-3 text-stone-400" />
                        {item.vendor}
                      </p>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right font-medium text-stone-900">
                    {formatCurrency(item.total_amount)}
                  </td>

                  <td className="py-4 px-4 text-right text-emerald-700 font-medium">
                    {formatCurrency(item.paid_amount)}
                  </td>

                  <td className="py-4 px-4 text-right text-rose-700 font-medium">
                    {formatCurrency(remaining)}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(status)}`}>
                      {status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-stone-500 hover:text-sage-700 hover:bg-sage-50 rounded-lg transition-colors"
                        title="Edit expense"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {expenses.map((item) => {
          const status = calculateExpenseStatus(item.total_amount, item.paid_amount);
          const remaining = calculateExpenseRemaining(item.total_amount, item.paid_amount);

          return (
            <div key={item.id} className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {item.category}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${getStatusBadge(status)}`}>
                      {status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-stone-500 hover:text-sage-700 hover:bg-sage-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-ivory-50 rounded-lg text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">Total</span>
                  <span className="font-semibold text-stone-900">{formatCurrency(item.total_amount)}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Paid</span>
                  <span className="font-semibold text-emerald-700">{formatCurrency(item.paid_amount)}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Remaining</span>
                  <span className="font-semibold text-rose-700">{formatCurrency(remaining)}</span>
                </div>
              </div>

              {(item.vendor || item.expense_date) && (
                <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
                  <span>{item.vendor || 'Direct / General'}</span>
                  <span>{item.expense_date}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExpenseTable;
