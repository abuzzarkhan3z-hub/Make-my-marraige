/**
 * Utility functions for Expense calculations
 */

export function calculateExpenseStatus(totalAmount, paidAmount) {
  const total = Number(totalAmount) || 0;
  const paid = Number(paidAmount) || 0;

  if (paid <= 0) return 'Unpaid';
  if (paid >= total && total > 0) return 'Paid';
  return 'Partially Paid';
}

export function calculateExpenseRemaining(totalAmount, paidAmount) {
  const total = Number(totalAmount) || 0;
  const paid = Number(paidAmount) || 0;
  return Math.max(0, total - paid);
}

export function computeExpenseSummaries(expenses = []) {
  let totalExpenses = 0;
  let totalPaid = 0;

  expenses.forEach((item) => {
    const tot = Number(item.total_amount) || 0;
    const pd = Number(item.paid_amount) || 0;
    totalExpenses += tot;
    totalPaid += pd;
  });

  const totalOutstanding = Math.max(0, totalExpenses - totalPaid);

  return {
    totalExpenses,
    totalPaid,
    totalOutstanding,
    count: expenses.length,
  };
}
