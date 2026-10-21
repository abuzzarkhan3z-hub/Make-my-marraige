import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Map between DB role ('admin', 'family_member', 'viewer') and UI role ('Admin', 'Family Member', 'Viewer')
export function mapRoleToUI(role) {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'viewer':
      return 'Viewer';
    case 'family_member':
    default:
      return 'Family Member';
  }
}

export function mapRoleToDB(role) {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'admin';
    case 'viewer':
      return 'viewer';
    case 'family member':
    case 'family_member':
    default:
      return 'family_member';
  }
}

export function formatMemberFromDB(item) {
  if (!item) return null;
  const profile = item.profiles || {};
  return {
    id: item.id,
    wedding_id: item.wedding_id,
    user_id: item.user_id,
    role: mapRoleToUI(item.role),
    raw_role: item.role,
    name: profile.full_name || item.name || 'Family Member',
    phone: profile.phone || '',
    avatar_url: profile.avatar_url || '',
    joined_at: item.joined_at,
  };
}

export async function getWeddingMembers(weddingId) {
  if (!isSupabaseConfigured || !supabase || !weddingId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('wedding_members')
      .select(`
        id,
        wedding_id,
        user_id,
        role,
        joined_at,
        profiles (
          full_name,
          phone,
          avatar_url
        )
      `)
      .eq('wedding_id', weddingId);

    if (error) throw error;
    return { data: (data || []).map(formatMemberFromDB), error: null };
  } catch (error) {
    console.error('Error fetching wedding members:', error);
    return { data: [], error };
  }
}

export async function addWeddingMember(weddingId, userId, role = 'family_member') {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    wedding_id: weddingId,
    user_id: userId,
    role: mapRoleToDB(role),
  };

  const { data, error } = await supabase
    .from('wedding_members')
    .insert([payload])
    .select(`
      id,
      wedding_id,
      user_id,
      role,
      joined_at,
      profiles (
        full_name,
        phone,
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
  return formatMemberFromDB(data);
}

export async function updateWeddingMemberRole(memberId, role) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('wedding_members')
    .update({ role: mapRoleToDB(role) })
    .eq('id', memberId)
    .select(`
      id,
      wedding_id,
      user_id,
      role,
      joined_at,
      profiles (
        full_name,
        phone,
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
  return formatMemberFromDB(data);
}

export async function removeWeddingMember(memberId) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase
    .from('wedding_members')
    .delete()
    .eq('id', memberId);

  if (error) throw error;
  return true;
}
