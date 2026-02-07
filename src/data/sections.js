/**
 * Static content for terminal sections.
 * Projects/gallery sections are loaded dynamically from Supabase.
 */

export const BOOT_LINES = [
  'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL',
  'COPYRIGHT 2077 ROBCO INDUSTRIES',
  '',
  'MARTIN ORAV — PERSONAL TERMINAL v2.6.0',
  '',
  '> INITIALIZING SYSTEM...',
  '> LOADING USER PROFILE...',
  '> ESTABLISHING UPLINK...',
  '',
  'CONNECTION ESTABLISHED.',
  '',
]

export const MAIN_MENU = {
  title: 'MAIN MENU',
  header: [
    'WELCOME TO MARTIN ORAV\'S TERMINAL',
    'DIGITAL PRODUCT DESIGN // EKA 2026',
    '————————————————————————————————————',
  ],
  entries: [
    { key: 'about', label: '[ABOUT ME]', desc: 'Personal dossier' },
    { key: 'projects', label: '[PROJECTS]', desc: 'Portfolio archive' },
    { key: 'skills', label: '[SKILLS & RESUME]', desc: 'Technical specs' },
    { key: 'contact', label: '[CONTACT]', desc: 'Open comm channel' },
  ],
}

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
      'My name is Martin and I am a Digital Product',
      'Design student at the Estonian Academy of Arts',
      'with a focus on graphic design, interaction',
      'design, game design and more.',
      '',
      'I care about making technology feel human -',
      'to create experiences that are clear, meaningful,',
      'and quietly satisfying to use.',
      '',
      'Good design makes the world a nicer place :)',
      '',
      '————————————————————————————————————',
      '',
      '> "Design should fade into the background,',
      '>  not demand attention."',
    ],
  },

  skills: {
    title: 'SKILLS & RESUME',
    content: [
      'TECHNICAL SPECIFICATIONS',
      '————————————————————————————————————',
      '',
      'DESIGN TOOLS:',
      '  Adobe Photoshop',
      '  Adobe Illustrator',
      '  Adobe After Effects',
      '  Figma',
      '',
      'DEVELOPMENT:',
      '  HTML / CSS',
      '  JavaScript',
      '  React / Vite',
      '  Arduino',
      '',
      'AUDIO:',
      '  FL Studio',
      '  Ableton',
      '',
      '————————————————————————————————————',
      '',
      'EDUCATION:',
      '  Estonian Academy of Arts (EKA)',
      '  Digital Product Design',
      '',
      'LANGUAGES:',
      '  Estonian ................ Native',
      '  English ................ Fluent C2 level',
      '',
      '————————————————————————————————————',
      '',
      'SPECIALIZATIONS:',
      '  • Human-centered & empathic design',
      '  • Interactive systems & prototyping',
      '  • Game UI/UX & world-building',
      '  • Physical computing (Arduino)',
      '  • Advertisement & poster design',
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
      'MARORA DESIGN OÜ.',
      '',
      '> Awaiting transmission...',
    ],
  },
}

/**
 * Project categories that get fetched from Supabase.
 */
export const PROJECT_CATEGORIES = [
  { key: 'webapps', label: '[WEB APPS]', desc: 'Interactive applications', table: 'projects' },
  { key: 'catwees', label: '[CLIENT WORK]', desc: 'Catwees Honda designs', category: 'catwees' },
  { key: 'artist-posters', label: '[ARTIST POSTERS]', desc: 'Album & music artwork', category: 'artist-posters' },
  { key: 'game-posters', label: '[GAME POSTERS]', desc: 'Video game artwork', category: 'game-posters' },
]