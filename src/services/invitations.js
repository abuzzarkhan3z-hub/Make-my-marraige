import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function formatInvitationFromDB(item) {
  if (!item) return null;
  let parsedNotes = {};
  if (item.notes) {
    try {
      parsedNotes = JSON.parse(item.notes);
    } catch {
      parsedNotes = { notes: item.notes };
    }
  }

  return {
    id: item.id,
    wedding_id: item.wedding_id,
    title: item.title || 'Wedding Invitation',
    couple_names: parsedNotes.couple_names || item.title || '',
    host_names: parsedNotes.host_names || '',
    function_name: parsedNotes.function_name || 'Wedding Ceremony & Reception',
    starts_at: parsedNotes.starts_at || '',
    venue: parsedNotes.venue || '',
    address: parsedNotes.address || '',
    message: parsedNotes.message || item.notes || '',
    channel: item.channel || 'whatsapp',
    status: item.status || 'draft',
    guest_id: item.guest_id || null,
  };
}

/**
 * Fetch the primary wedding digital invitation card
 */
export async function getPrimaryInvitation(weddingId) {
  if (!isSupabaseConfigured || !supabase || !weddingId) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('wedding_id', weddingId)
      .is('guest_id', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return { data: data ? formatInvitationFromDB(data) : null, error: null };
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return { data: null, error };
  }
}

/**
 * Upsert the primary digital invitation card
 */
export async function savePrimaryInvitation(weddingId, invData) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const notesObj = {
    couple_names: invData.couple_names || '',
    host_names: invData.host_names || '',
    function_name: invData.function_name || '',
    starts_at: invData.starts_at || '',
    venue: invData.venue || '',
    address: invData.address || '',
    message: invData.message || '',
  };

  const payload = {
    wedding_id: weddingId,
    title: invData.couple_names ? `${invData.couple_names}'s Wedding Invitation` : 'Wedding Invitation',
    channel: invData.channel || 'whatsapp',
    status: invData.status || 'draft',
    notes: JSON.stringify(notesObj),
    guest_id: null,
    updated_at: new Date().toISOString(),
  };

  if (invData.id && !invData.id.startsWith('inv-')) {
    const { data, error } = await supabase
      .from('invitations')
      .update(payload)
      .eq('id', invData.id)
      .select()
      .single();

    if (error) throw error;
    return formatInvitationFromDB(data);
  } else {
    const { data, error } = await supabase
      .from('invitations')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return formatInvitationFromDB(data);
  }
}
