import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function formatGuestFromDB(item) {
  if (!item) return null;
  return {
    ...item,
    id: item.id,
    wedding_id: item.wedding_id,
    name: item.full_name || item.name || '',
    full_name: item.full_name || item.name || '',
    phone: item.phone || '',
    email: item.email || '',
    side: item.side || 'both',
    guest_count: item.guest_count || 1,
    rsvp_status: item.rsvp_status || 'pending',
    notes: item.notes || '',
  };
}

export async function getGuests(weddingId) {
  if (!isSupabaseConfigured || !supabase || !weddingId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('full_name', { ascending: true });

    if (error) throw error;
    return { data: (data || []).map(formatGuestFromDB), error: null };
  } catch (error) {
    console.error('Error fetching guests:', error);
    return { data: [], error };
  }
}

export async function createGuest(weddingId, guestData) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    wedding_id: weddingId,
    full_name: guestData.name || guestData.full_name || 'Guest',
    phone: guestData.phone || '',
    email: guestData.email || null,
    side: guestData.side || 'both',
    guest_count: Number(guestData.guest_count || 1),
    rsvp_status: guestData.rsvp_status || 'pending',
    notes: guestData.notes || '',
  };

  const { data, error } = await supabase
    .from('guests')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return formatGuestFromDB(data);
}

export async function updateGuest(guestId, updates) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined || updates.full_name !== undefined) {
    payload.full_name = updates.full_name || updates.name;
  }
  if (updates.phone !== undefined) payload.phone = updates.phone;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.side !== undefined) payload.side = updates.side;
  if (updates.guest_count !== undefined) payload.guest_count = Number(updates.guest_count);
  if (updates.rsvp_status !== undefined) payload.rsvp_status = updates.rsvp_status;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  const { data, error } = await supabase
    .from('guests')
    .update(payload)
    .eq('id', guestId)
    .select()
    .single();

  if (error) throw error;
  return formatGuestFromDB(data);
}

export async function deleteGuest(guestId) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', guestId);

  if (error) throw error;
  return true;
}
