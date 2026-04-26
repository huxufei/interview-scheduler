import { supabase } from './supabase';
import type { Interview } from './types';
import { generateId } from './utils/helpers';

export async function fetchInterviews(): Promise<Interview[]> {
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: true });

  if (error) throw error;
  return data as Interview[];
}

export async function createInterview(
  data: Omit<Interview, 'id' | 'createdAt'>
): Promise<string> {
  const id = generateId();
  const createdAt = new Date().toISOString();

  const { error } = await supabase.from('interviews').insert({
    id,
    ...data,
    createdAt,
  });

  if (error) throw error;
  return id;
}

export async function updateInterview(
  id: string,
  data: Omit<Interview, 'id' | 'createdAt'>
): Promise<void> {
  const { error } = await supabase
    .from('interviews')
    .update(data)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteInterview(id: string): Promise<void> {
  const { error } = await supabase
    .from('interviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
