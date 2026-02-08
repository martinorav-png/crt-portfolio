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
 * Fetch all works ordered by display_order
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
 * Fetch works by portfolio category.
 * Maps our category keys to the actual table columns:
 *   - 'catwees'        → client = 'Catwees'
 *   - 'artist-posters' → client = 'Personal' + description = 'Album poster design'
 *   - 'game-posters'   → client = 'Personal' + description = 'Game poster design'
 */
export async function fetchWorksByCategory(category) {
  let query = supabase
    .from('works')
    .select('*')

  if (category === 'catwees') {
    query = query.eq('client', 'Catwees')
  } else if (category === 'artist-posters') {
    query = query.eq('client', 'Personal').eq('description', 'Album poster design')
  } else if (category === 'game-posters') {
    query = query.eq('client', 'Personal').eq('description', 'Game poster design')
  }

  query = query.order('display_order', { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error(`Error fetching works (${category}):`, error)
    return []
  }
  return data
}