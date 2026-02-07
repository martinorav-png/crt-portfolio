import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Fetch all projects (web apps) ordered by display_order
 */
export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data
}

/**
 * Fetch all works (gallery items) ordered by display_order
 */
export async function fetchWorks() {
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching works:', error)
    return []
  }
  return data
}

/**
 * Fetch works filtered by category
 */
export async function fetchWorksByCategory(category) {
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('category', category)
    .order('display_order', { ascending: true })

  if (error) {
    console.error(`Error fetching works (${category}):`, error)
    return []
  }
  return data
}