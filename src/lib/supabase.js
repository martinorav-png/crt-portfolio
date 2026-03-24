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
 *   - 'game-wip'       → client = 'Personal' + description = 'Game project WIP'
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
  } else if (category === 'game-wip') {
    query = query.eq('client', 'Personal').eq('description', 'Game project WIP')
  }

  query = query.order('display_order', { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error(`Error fetching works (${category}):`, error)
    return []
  }
  return data
}

/**
 * Fetch featured items for the homepage showcase.
 * Pulls from both 'projects' and 'works' tables,
 * prioritizing the best work from each category.
 *
 * Returns items with a category_label for display.
 */
export async function fetchFeatured() {
  const results = []

  // Fetch web apps (these are always strong — shipped products)
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })
    .limit(2)

  if (projects) {
    results.push(...projects.map(p => ({ ...p, category_label: 'WEB APP' })))
  }

  // Fetch best client work (limit to top 2)
  const { data: clientWork } = await supabase
    .from('works')
    .select('*')
    .eq('client', 'Catwees')
    .order('display_order', { ascending: true })
    .limit(2)

  if (clientWork) {
    results.push(...clientWork.map(w => ({ ...w, category_label: 'CLIENT' })))
  }

  // Fetch game project WIP (top 1)
  const { data: gameWip } = await supabase
    .from('works')
    .select('*')
    .eq('client', 'Personal')
    .eq('description', 'Game project WIP')
    .order('display_order', { ascending: true })
    .limit(1)

  if (gameWip) {
    results.push(...gameWip.map(w => ({ ...w, category_label: 'GAME DEV' })))
  }

  // Fetch best poster (top 1)
  const { data: posters } = await supabase
    .from('works')
    .select('*')
    .eq('client', 'Personal')
    .in('description', ['Album poster design', 'Game poster design'])
    .order('display_order', { ascending: true })
    .limit(1)

  if (posters) {
    results.push(...posters.map(w => ({ ...w, category_label: 'POSTER' })))
  }

  return results
}

/**
 * Unified category fetcher for the flattened file browser.
 * Maps folder sources to the right query.
 */
export async function fetchProjectsByCategory(source) {
  if (source === 'projects') {
    return await fetchProjects()
  }

  if (source === 'selected') {
    // Selected client work — curated subset
    // Fetch all Catwees work, but the display_order controls curation
    return await fetchWorksByCategory('catwees')
  }

  if (source === 'posters') {
    // Merge artist + game posters into one folder
    const [artists, games] = await Promise.all([
      fetchWorksByCategory('artist-posters'),
      fetchWorksByCategory('game-posters'),
    ])
    return [...games, ...artists]
  }

  if (source === 'game-wip') {
    return await fetchWorksByCategory('game-wip')
  }

  if (source === 'featured') {
    return await fetchFeatured()
  }

  return []
}
