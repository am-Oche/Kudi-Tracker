// Asset register — every visual used in the redesign.
export const assets = [
  { id: 'logo-vector', file: 'src/icons.jsx#KTLogo', source: 'Redrawn from live app logo (kuditrackai.lovable.app/assets/logo-*.png)', licence: 'Client-owned brand', status: 'verify before launch' },
  { id: 'logo-original', file: 'ref/kuditrack-logo.png', source: 'Live app', licence: 'Client-owned brand', status: 'reference only' },
  { id: 'icon-set', file: 'src/icons.jsx#KT_ICON_PATHS', source: 'Original, drawn for this project', licence: 'Project-owned', status: 'verify before launch' },
  { id: 'art-stall', file: 'src/ui.jsx#ArtStall', source: 'Original SVG', licence: 'Project-owned', status: 'verify before launch' },
  { id: 'art-mic', file: 'src/ui.jsx#ArtMic', source: 'Original SVG', licence: 'Project-owned', status: 'verify before launch' },
  { id: 'art-jar', file: 'src/ui.jsx#ArtJar', source: 'Original SVG', licence: 'Project-owned', status: 'verify before launch' },
  { id: 'art-notes', file: 'src/ui.jsx#ArtNotes', source: 'Original SVG', licence: 'Project-owned', status: 'verify before launch' },
  { id: 'font-urbanist', file: 'Google Fonts', source: 'fonts.google.com/specimen/Urbanist', licence: 'SIL OFL 1.1', status: 'verify before launch' },
  { id: 'reference-boards', file: '(user uploads)', source: 'Inspiration boards', licence: 'Unknown — private pitching only', status: 'do not ship' },
] as const;
