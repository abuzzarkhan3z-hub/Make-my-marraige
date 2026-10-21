import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../lib/formatCurrency';
import { computeExpenseSummaries } from '../features/expenses/expenseUtils';
import { 
  PlusCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  AlertCircle,
  Building,
  ArrowRight,
  TrendingUp,
  ReceiptIndianRupee,
  Wallet
} from 'lucide-react';

export function Dashboard({
  wedding,
  expenses = [],
  functions = [],
  tasks = [],
  onNavigate,
  onOpenAddExpense,
}) {
  const expenseSummary = computeExpenseSummaries(expenses);
  const remainingBudget = Math.max(0, (wedding?.budget || 0) - expenseSummary.totalExpenses);
  const budgetUtilization = wedding?.budget > 0 
    ? Math.min(100, Math.round((expenseSummary.totalExpenses / wedding.budget) * 100))
    : 0;

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  // Sorted upcoming functions
  const upcomingFunctions = [...functions].sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at)).slice(0, 3);
  
  // Recent expenses
  const recentExpenses = [...expenses].slice(-4).reverse();

  return (
    <div className="space-y-6">
      {/* Wedding Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sage-800 via-sage-700 to-sage-900 text-white p-6 sm:p-8 shadow-card">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-400/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-900/60 border border-sage-600/50 text-gold-300 text-xs font-medium mb-3 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              <span>Wedding Planning Overview</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-ivory-50">
              {wedding?.couple_names || 'Wedding Celebration'}
            </h1>
            <p className="text-sage-200 text-xs sm:text-sm mt-1 max-w-xl">
              {wedding?.name} &bull; Main Date: {wedding?.main_date ? new Date(wedding.main_date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : 'To be announced'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="gold"
              onClick={onOpenAddExpense}
              icon={PlusCircle}
            >
              Add Expense
            </Button>
          </div>
        </div>
      </div>

      {/* Financial & Status Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <Card padding="default" className="border-l-4 border-l-stone-400">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Budget</span>
            <Wallet className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-serif">
            {formatCurrency(wedding?.budget)}
          </div>
          <p className="text-xs text-stone-400 mt-1">Planned wedding ceiling</p>
        </Card>

        {/* Total Expenses */}
        <Card padding="default" className="border-l-4 border-l-sage-600">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Expenses</span>
            <ReceiptIndianRupee className="w-4 h-4 text-sage-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-serif">
            {formatCurrency(expenseSummary.totalExpenses)}
          </div>
          <div className="mt-2 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-sage-600 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${budgetUtilization}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-1.5 flex justify-between">
            <span>{budgetUtilization}% of budget used</span>
            <span>{expenseSummary.count} records</span>
          </p>
        </Card>

        {/* Remaining Budget */}
        <Card padding="default" className="border-l-4 border-l-gold-500">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Remaining Budget</span>
            <TrendingUp className="w-4 h-4 text-gold-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-serif">
            {formatCurrency(remainingBudget)}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Outstanding to pay: <span className="font-semibold text-rose-600">{formatCurrency(expenseSummary.totalOutstanding)}</span>
          </p>
        </Card>

        {/* Tasks Summary */}
        <Card padding="default" className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Family Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-serif">
            {pendingTasks.length} <span className="text-sm font-normal text-stone-500">pending</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {completedTasks.length} completed out of {tasks.length} total
          </p>
        </Card>
      </div>

      {/* Main Grid: Upcoming Functions & Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Functions */}
        <Card padding="default">
          <CardHeader
            title="Upcoming Functions"
            subtitle="Ceremonies, events, and venues scheduled"
            action={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('coordination')}>
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />

          <div className="mt-4 space-y-3">
            {upcomingFunctions.length === 0 ? (
              <p className="text-sm text-stone-400 py-6 text-center">No functions added yet.</p>
            ) : (
              upcomingFunctions.map((fn) => (
                <div
                  key={fn.id}
                  className="p-3.5 rounded-xl border border-stone-100 bg-ivory-50/60 hover:bg-ivory-100/70 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-stone-900">{fn.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-sage-100 text-sage-800">
                        {fn.status || 'Scheduled'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {new Date(fn.starts_at).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-xs text-stone-600 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-stone-400" />
                      {fn.venue}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Expenses */}
        <Card padding="default">
          <CardHeader
            title="Recent Expenses"
            subtitle="Latest vendor payments and recorded costs"
            action={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('expenses')}>
                <span>All expenses</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />

          <div className="mt-4 space-y-3">
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-stone-400 py-6 text-center">No expenses recorded yet.</p>
            ) : (
              recentExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 rounded-xl border border-stone-100 bg-white hover:bg-ivory-50/60 transition-colors flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">{exp.name}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {exp.category} &bull; {exp.vendor || 'Direct'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-stone-900">{formatCurrency(exp.total_amount)}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Paid: {formatCurrency(exp.paid_amount)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
