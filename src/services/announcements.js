import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function formatAnnouncementFromDB(item) {
  if (!item) return null;
  return {
    ...item,
    id: item.id,
    wedding_id: item.wedding_id,
    title: item.title || '',
    message: item.message || '',
    author_name: item.author_name || 'Family Organizer',
    created_at: item.created_at || new Date().toISOString(),
  };
}

export async function getAnnouncements(weddingId) {
  if (!isSupabaseConfigured || !supabase || !weddingId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: (data || []).map(formatAnnouncementFromDB), error: null };
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return { data: [], error };
  }
}

export async function createAnnouncement(weddingId, announcementData, authorName = '') {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    wedding_id: weddingId,
    title: announcementData.title || 'Wedding Update',
    message: announcementData.message || announcementData.text || '',
  };

  const { data, error } = await supabase
    .from('announcements')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return {
    ...formatAnnouncementFromDB(data),
    author_name: authorName || 'Family Organizer',
  };
}
