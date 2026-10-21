import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Format DB expense row to UI friendly model (and vice-versa)
 */
export function formatExpenseFromDB(item) {
  if (!item) return null;
  const totalRupees = typeof item.amount_paise === 'number'
    ? Math.round(item.amount_paise / 100)
    : item.total_amount || 0;

  const paidRupees = typeof item.amount_paid_paise === 'number'
    ? Math.round(item.amount_paid_paise / 100)
    : item.paid_amount || 0;

  return {
    ...item,
    id: item.id,
    wedding_id: item.wedding_id,
    name: item.title || item.name || '',
    title: item.title || item.name || '',
    category: item.category || 'Other',
    total_amount: totalRupees,
    paid_amount: paidRupees,
    vendor: item.paid_to || item.vendor || '',
    paid_to: item.paid_to || item.vendor || '',
    function_id: item.function_id || null,
    expense_date: item.expense_date || new Date().toISOString().split('T')[0],
    notes: item.notes || '',
    payment_status: item.payment_status || (paidRupees >= totalRupees && totalRupees > 0 ? 'paid' : paidRupees > 0 ? 'partially_paid' : 'pending'),
  };
}

/**
 * Fetch expenses for a wedding
 */
export async function getExpenses(weddingId) {
  if (!isSupabaseConfigured || !supabase || !weddingId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('expense_date', { ascending: false });

    if (error) throw error;
    return { data: (data || []).map(formatExpenseFromDB), error: null };
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return { data: [], error };
  }
}

/**
 * Create a new expense
 */
export async function createExpense(weddingId, expenseData) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const totalAmount = Number(expenseData.total_amount ?? expenseData.amount ?? 0);
  const paidAmount = Number(expenseData.paid_amount ?? 0);

  const amountPaise = Math.round(totalAmount * 100);
  const amountPaidPaise = Math.round(paidAmount * 100);

  let paymentStatus = 'pending';
  if (amountPaidPaise >= amountPaise && amountPaise > 0) {
    paymentStatus = 'paid';
  } else if (amountPaidPaise > 0) {
    paymentStatus = 'partially_paid';
  }

  const payload = {
    wedding_id: weddingId,
    title: expenseData.name || expenseData.title || 'Untitled Expense',
    category: expenseData.category || 'Other',
    amount_paise: amountPaise,
    amount_paid_paise: amountPaidPaise,
    paid_to: expenseData.vendor || expenseData.paid_to || null,
    payment_status: paymentStatus,
    function_id: expenseData.function_id || null,
    expense_date: expenseData.expense_date || new Date().toISOString().split('T')[0],
    notes: expenseData.notes || '',
  };

  const { data, error } = await supabase
    .from('expenses')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return formatExpenseFromDB(data);
}

/**
 * Update an existing expense
 */
export async function updateExpense(expenseId, updates) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined || updates.title !== undefined) {
    payload.title = updates.title || updates.name;
  }
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.vendor !== undefined || updates.paid_to !== undefined) {
    payload.paid_to = updates.paid_to || updates.vendor;
  }
  if (updates.function_id !== undefined) payload.function_id = updates.function_id || null;
  if (updates.expense_date !== undefined) payload.expense_date = updates.expense_date;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  if (updates.total_amount !== undefined) {
    payload.amount_paise = Math.round(Number(updates.total_amount) * 100);
  }
  if (updates.paid_amount !== undefined) {
    payload.amount_paid_paise = Math.round(Number(updates.paid_amount) * 100);
  }

  // Recalculate payment status if amounts supplied
  if (payload.amount_paise !== undefined || payload.amount_paid_paise !== undefined) {
    const tot = payload.amount_paise ?? Math.round(Number(updates.total_amount || 0) * 100);
    const pd = payload.amount_paid_paise ?? Math.round(Number(updates.paid_amount || 0) * 100);
    if (pd >= tot && tot > 0) {
      payload.payment_status = 'paid';
    } else if (pd > 0) {
      payload.payment_status = 'partially_paid';
    } else {
      payload.payment_status = 'pending';
    }
  }

  const { data, error } = await supabase
    .from('expenses')
    .update(payload)
    .eq('id', expenseId)
    .select()
    .single();

  if (error) throw error;
  return formatExpenseFromDB(data);
}

/**
 * Delete an expense
 */
export async function deleteExpense(expenseId) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId);

  if (error) throw error;
  return true;
}
