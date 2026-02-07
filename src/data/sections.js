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
      'I\'m a digital product designer with a deep interest',
      'in interactive systems, game design, and cyberpunk',
      'aesthetics. I approach design with empathy and',
      'systems thinking — building experiences that feel',
      'intuitive yet meaningful.',
      '',
      'My work spans web development, game prototyping,',
      'hardware experiments, and visual design. I believe',
      'in understanding the mechanism beneath every',
      'interface — not just how it looks, but how it',
      'thinks.',
      '',
      'When I\'m not designing, you\'ll find me exploring',
      'narrative-driven games, experimenting with sound',
      'design, or getting lost in some post-apocalyptic',
      'wasteland.',
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
      '  Photoshop .............. ████████░░ 80%',
      '  Illustrator ............ ███████░░░ 70%',
      '  Figma .................. ████████░░ 80%',
      '  After Effects .......... ██████░░░░ 60%',
      '',
      'DEVELOPMENT:',
      '  HTML / CSS ............. ███████░░░ 70%',
      '  JavaScript ............. ██████░░░░ 60%',
      '  React / Vite ........... █████░░░░░ 50%',
      '  Unity / C# ............. █████░░░░░ 50%',
      '  Arduino ................ █████░░░░░ 50%',
      '',
      'AUDIO:',
      '  FL Studio .............. ██████░░░░ 60%',
      '  Ableton ................ ████░░░░░░ 40%',
      '',
      '————————————————————————————————————',
      '',
      'EDUCATION:',
      '  Estonian Academy of Arts (EKA)',
      '  Digital Product Design',
      '  Expected graduation: 2026',
      '',
      'LANGUAGES:',
      '  Estonian ................ Native',
      '  English ................ Fluent',
      '',
      '————————————————————————————————————',
      '',
      'SPECIALIZATIONS:',
      '  • Human-centered & empathic design',
      '  • Interactive systems & prototyping',
      '  • Game UI/UX & world-building',
      '  • Physical computing (Arduino)',
      '  • Cyberpunk & retro-futuristic aesthetics',
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
      '————————————————————————————————————',
      '',
      'For freelance inquiries, contact through',
      'Marora Design OÜ.',
      '',
      '> Awaiting transmission...',
    ],
  },
}

/**
 * Project categories that get fetched from Supabase.
 * These appear as sub-entries inside the [PROJECTS] section.
 */
export const PROJECT_CATEGORIES = [
  { key: 'webapps', label: '[WEB APPS]', desc: 'Interactive applications', table: 'projects' },
  { key: 'catwees', label: '[CLIENT WORK]', desc: 'Catwees Honda designs', category: 'catwees' },
  { key: 'artist-posters', label: '[ARTIST POSTERS]', desc: 'Album & music artwork', category: 'artist-posters' },
  { key: 'game-posters', label: '[GAME POSTERS]', desc: 'Video game artwork', category: 'game-posters' },
]