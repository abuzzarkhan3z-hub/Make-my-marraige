import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function formatFunctionFromDB(item) {
  if (!item) return null;
  return {
    ...item,
    id: item.id,
    wedding_id: item.wedding_id,
    name: item.name || '',
    starts_at: item.event_date || item.starts_at || '',
    event_date: item.event_date || item.starts_at || '',
    venue: item.venue || '',
    notes: item.notes || '',
    status: item.status || 'Confirmed',
  };
}

export async function getWeddingFunctions(weddingId) {
  if (!isSupabaseConfigured || !supabase || !weddingId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('wedding_functions')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('event_date', { ascending: true });

    if (error) throw error;
    return { data: (data || []).map(formatFunctionFromDB), error: null };
  } catch (error) {
    console.error('Error fetching functions:', error);
    return { data: [], error };
  }
}

export async function createWeddingFunction(weddingId, fnData) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    wedding_id: weddingId,
    name: fnData.name || 'Untitled Function',
    event_date: fnData.starts_at || fnData.event_date || null,
    venue: fnData.venue || '',
    notes: fnData.notes || '',
  };

  const { data, error } = await supabase
    .from('wedding_functions')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return formatFunctionFromDB(data);
}

export async function updateWeddingFunction(functionId, updates) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.starts_at !== undefined || updates.event_date !== undefined) {
    payload.event_date = updates.starts_at || updates.event_date;
  }
  if (updates.venue !== undefined) payload.venue = updates.venue;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  const { data, error } = await supabase
    .from('wedding_functions')
    .update(payload)
    .eq('id', functionId)
    .select()
    .single();

  if (error) throw error;
  return formatFunctionFromDB(data);
}

export async function deleteWeddingFunction(functionId) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase
    .from('wedding_functions')
    .delete()
    .eq('id', functionId);

  if (error) throw error;
  return true;
}
