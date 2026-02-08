/**
 * Cloudinary URL helper.
 * Works with full Cloudinary URLs — parses them and injects transforms.
 * Also works with raw public IDs.
 */

const CLOUD_NAME = 'djtnmzx1r'
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

/**
 * Take a full Cloudinary URL and inject optimization transforms.
 * Input:  https://res.cloudinary.com/djtnmzx1r/image/upload/v1770508701/freegameexplorer_buzxkw.png
 * Output: https://res.cloudinary.com/djtnmzx1r/image/upload/f_auto,q_auto,w_1200,c_limit/v1770508701/freegameexplorer_buzxkw.png
 */
function injectTransforms(url, transforms) {
  const marker = '/image/upload/'
  const idx = url.indexOf(marker)
  if (idx === -1) return url

  const before = url.slice(0, idx + marker.length)
  const after = url.slice(idx + marker.length)

  return before + transforms + '/' + after
}

/**
 * Optimize any image URL for display.
 * Handles: Cloudinary URLs, Supabase URLs (passthrough), raw public IDs.
 *
 * @param {string} url - The image URL or Cloudinary public ID
 * @param {'thumbnail'|'preview'|'full'} size - Size preset
 */
export function optimizeUrl(url, size = 'preview') {
  if (!url) return url

  // Cloudinary full URL — inject transforms
  if (url.includes('res.cloudinary.com')) {
    const presets = {
      thumbnail: 'f_auto,q_auto:low,w_400,c_limit',
      preview: 'f_auto,q_auto,w_1200,c_limit',
      full: 'f_auto,q_auto:best,w_2000,c_limit',
    }
    return injectTransforms(url, presets[size] || presets.preview)
  }

  // Supabase URL — pass through unchanged
  if (url.includes('supabase.co')) return url

  // Raw public ID (no http) — build full URL
  if (!url.startsWith('http')) {
    const presets = {
      thumbnail: `${BASE_URL}/f_auto,q_auto:low,w_400,c_limit/${url}`,
      preview: `${BASE_URL}/f_auto,q_auto,w_1200,c_limit/${url}`,
      full: `${BASE_URL}/f_auto,q_auto:best,w_2000,c_limit/${url}`,
    }
    return presets[size] || presets.preview
  }

  return url
}