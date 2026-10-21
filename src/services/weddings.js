import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Format a wedding DB record for the UI
 */
export function formatWeddingFromDB(dbWedding) {
  if (!dbWedding) return null;
  return {
    ...dbWedding,
    budget: typeof dbWedding.total_budget_paise === 'number'
      ? Math.round(dbWedding.total_budget_paise / 100)
      : dbWedding.budget || 0,
    main_date: dbWedding.wedding_date || dbWedding.main_date || '',
    currency: dbWedding.currency_code || dbWedding.currency || 'INR',
  };
}

/**
 * Fetch all weddings the authenticated user is a member of
 */
export async function getUserWeddings() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('weddings')
      .select(`
        *,
        wedding_members!inner(role)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: (data || []).map(formatWeddingFromDB), error: null };
  } catch (error) {
    console.error('Error fetching user weddings:', error);
    return { data: [], error };
  }
}

/**
 * Fetch single wedding by ID
 */
export async function getWeddingById(weddingId) {
  if (!isSupabaseConfigured || !supabase || !weddingId) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('id', weddingId)
      .single();

    if (error) throw error;
    return { data: formatWeddingFromDB(data), error: null };
  } catch (error) {
    console.error('Error fetching wedding:', error);
    return { data: null, error };
  }
}

/**
 * Atomically create a new wedding and assign authenticated user as admin
 */
export async function createWedding({
  name,
  couple_names,
  wedding_date,
  venue,
  city,
  currency_code = 'INR',
  budget = 0,
}) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const budgetPaise = Math.round(Number(budget || 0) * 100);

  const { data, error } = await supabase.rpc('create_wedding_with_admin', {
    p_name: name,
    p_couple_names: couple_names || null,
    p_wedding_date: wedding_date || null,
    p_venue: venue || null,
    p_city: city || null,
    p_currency_code: currency_code || 'INR',
    p_total_budget_paise: budgetPaise,
  });

  if (error) throw error;
  return formatWeddingFromDB(data);
}

/**
 * Update wedding details (Admin only)
 */
export async function updateWedding(weddingId, updates) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.couple_names !== undefined) payload.couple_names = updates.couple_names;
  if (updates.main_date !== undefined || updates.wedding_date !== undefined) {
    payload.wedding_date = updates.wedding_date || updates.main_date;
  }
  if (updates.venue !== undefined) payload.venue = updates.venue;
  if (updates.city !== undefined) payload.city = updates.city;
  if (updates.budget !== undefined) {
    payload.total_budget_paise = Math.round(Number(updates.budget || 0) * 100);
  }
  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('weddings')
    .update(payload)
    .eq('id', weddingId)
    .select()
    .single();

  if (error) throw error;
  return formatWeddingFromDB(data);
}
