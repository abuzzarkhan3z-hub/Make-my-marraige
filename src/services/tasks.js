import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Map between DB status ('todo', 'in_progress', 'done') and UI status ('Pending', 'In Progress', 'Completed')
export function mapStatusToUI(dbStatus) {
  switch (dbStatus) {
    case 'done':
      return 'Completed';
    case 'in_progress':
      return 'In Progress';
    case 'todo':
    default:
      return 'Pending';
  }
}

export function mapStatusToDB(uiStatus) {
  switch (uiStatus) {
    case 'Completed':
    case 'done':
      return 'done';
    case 'In Progress':
    case 'in_progress':
      return 'in_progress';
    case 'Pending':
    case 'todo':
    default:
      return 'todo';
  }
}

export function formatTaskFromDB(item) {
  if (!item) return null;
  return {
    ...item,
    id: item.id,
    wedding_id: item.wedding_id,
    title: item.title || '',
    description: item.description || '',
    assigned_member_id: item.assigned_to || item.assigned_member_id || null,
    assigned_to: item.assigned_to || item.assigned_member_id || null,
    due_date: item.due_at ? item.due_at.split('T')[0] : item.due_date || '',
    due_at: item.due_at || item.due_date || null,
    priority: item.priority || 'medium',
    status: mapStatusToUI(item.status),
  };
}

export async function getTasks(weddingId) {
  if (!isSupabaseConfigured || !supabase || !weddingId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('due_at', { ascending: true, nullsFirst: false });

    if (error) throw error;
    return { data: (data || []).map(formatTaskFromDB), error: null };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { data: [], error };
  }
}

export async function createTask(weddingId, taskData) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    wedding_id: weddingId,
    title: taskData.title || 'Untitled Task',
    description: taskData.description || '',
    assigned_to: taskData.assigned_to || taskData.assigned_member_id || null,
    due_at: taskData.due_date || taskData.due_at || null,
    priority: taskData.priority || 'medium',
    status: mapStatusToDB(taskData.status || 'Pending'),
  };

  const { data, error } = await supabase
    .from('tasks')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return formatTaskFromDB(data);
}

export async function updateTask(taskId, updates) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.assigned_to !== undefined || updates.assigned_member_id !== undefined) {
    payload.assigned_to = updates.assigned_to || updates.assigned_member_id || null;
  }
  if (updates.due_date !== undefined || updates.due_at !== undefined) {
    payload.due_at = updates.due_date || updates.due_at || null;
  }
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.status !== undefined) payload.status = mapStatusToDB(updates.status);

  const { data, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return formatTaskFromDB(data);
}

export async function deleteTask(taskId) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
  return true;
}
