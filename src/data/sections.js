/**
 * Static content for terminal sections.
 * Projects/gallery sections are loaded dynamically from Supabase.
 */

export const SECTIONS = {
  about: {
    title: 'ABOUT ME',
    content: [
      'NAME: Martin Orav',
      'AGE: 23',
      'LOCATION: Tallinn, Estonia',
      'STATUS: Digital Product Design Student',
      'INSTITUTION: Estonian Academy of Arts (EKA)',
      '',
      '————————————————————————————————————',
      '',
      'I design and build digital experiences',
      'that feel human. From product interfaces',
      'to game worlds to interactive prototypes —',
      'I care about the details that make',
      'technology quietly satisfying to use.',
      '',
      'Currently focused on interaction design,',
      'game UI/UX, and creative development.',
      '',
      '————————————————————————————————————',
      '',
      '> "Design should fade into the background,',
      '>  not demand attention."',
    ],
  },

  skills: {
    title: 'SKILLS & TOOLS',
    content: [
      'DESIGN',
      '  Figma ...................... ████████████████ 95%',
      '  Adobe Photoshop ........... ███████████████░ 90%',
      '  Adobe Illustrator ......... ██████████████░░ 85%',
      '  Adobe After Effects ....... ████████████░░░░ 75%',
      '',
      'DEVELOPMENT',
      '  HTML / CSS ................ ████████████████ 95%',
      '  JavaScript ................ ███████████████░ 90%',
      '  React / Vite .............. ██████████████░░ 85%',
      '  Arduino ................... ███████████░░░░░ 70%',
      '',
      'AUDIO',
      '  FL Studio ................. ████████████░░░░ 75%',
      '  Ableton ................... ██████████░░░░░░ 65%',
      '',
      '————————————————————————————————————',
      '',
      'EDUCATION:',
      '  Estonian Academy of Arts (EKA)',
      '  Digital Product Design',
      '',
      'LANGUAGES:',
      '  Estonian ................ Native',
      '  English ................ Fluent C2',
    ],
  },

  contact: {
    title: 'CONTACT',
    content: [
      'OPEN COMMUNICATION CHANNEL',
      '————————————————————————————————————',
      '',
      'STATUS: Available for freelance work,',
      'collaborations, and interesting projects.',
      '',
      'EMAIL:',
      '  > martinoravdisain@gmail.com',
      '',
      'GITHUB:',
      '  > github.com/martinorav-png',
      '',
      'LINKEDIN:',
      '  > linkedin.com/in/martin-orav-30747539b',
      '',
      'BEHANCE:',
      '  > behance.net/martinorav',
      '',
      '————————————————————————————————————',
      '',
      'For freelance inquiries, contact through',
      'MARORA DESIGN OU.',
      '',
      '> Awaiting transmission...',
    ],
  },
}

/**
 * Featured projects to show on homepage showcase.
 * These are fetched from Supabase and displayed as thumbnails
 * immediately when the portfolio loads — no clicks needed.
 */
export const FEATURED_CONFIG = {
  // Number of items to show in the homepage showcase
  maxItems: 6,
}
