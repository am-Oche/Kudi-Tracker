// KudiTrack original icon set — 24px grid, 2px rounded outline. Active state = gradient stroke/fill.
const KT_ICON_PATHS = {
  home: 'M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5h-6v5.5H5.5A1.5 1.5 0 0 1 4 19z',
  records: 'M7 3.5h10A1.5 1.5 0 0 1 18.5 5v15.5l-3-2-3 2-3-2-3 2V5A1.5 1.5 0 0 1 7 3.5zM9 8.5h6M9 12h6M9 15.5h3',
  mic: 'M12 3.5a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0v-5a3 3 0 0 1 3-3zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v3M9 20.5h6',
  chart: 'M4 20h16M7 16.5V11M12 16.5V6.5M17 16.5v-8',
  settings: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 13.5l1.3 1-1.8 3.1-1.6-.5a7 7 0 0 1-1.9 1.1L15 20.5h-3.6l-.4-1.6a7 7 0 0 1-1.9-1.1l-1.6.5L5.7 15.2l1.3-1a7 7 0 0 1 0-2.4l-1.3-1 1.8-3.1 1.6.5a7 7 0 0 1 1.9-1.1l.4-1.6H15l.4 1.6a7 7 0 0 1 1.9 1.1l1.6-.5 1.8 3.1-1.3 1a7 7 0 0 1 0 2.4z',
  wallet: 'M4 7.5A2.5 2.5 0 0 1 6.5 5H17v3M4 7.5V17a2.5 2.5 0 0 0 2.5 2.5h12A1.5 1.5 0 0 0 20 18V9.5A1.5 1.5 0 0 0 18.5 8H6.5A2.5 2.5 0 0 1 4 5.5M16 13.75h.5',
  naira: 'M7 19.5V4.5l10 15v-15M4.5 10h15M4.5 14h15',
  receipt: 'M6 3.5h12v17l-2.5-1.6L13 20.5l-2-1.6-2.5 1.6L6 18.9zM9 8h6M9 11.5h6M9 15h4',
  savings: 'M7 8.5V7a5 5 0 0 1 10 0v1.5M5 8.5h14l-1.2 10.2A2 2 0 0 1 15.8 20.5H8.2a2 2 0 0 1-2-1.8zM12 12v4.5M10 14.25h4',
  bell: 'M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15zM10 20.5h4',
  add: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  filter: 'M4 6.5h16M7 12h10M10 17.5h4',
  share: 'M12 15V4M8 7.5 12 3.5l4 4M6 11v7.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V11',
  search: 'M11 4.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM16 16l4 4',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  chevRight: 'M9.5 6l6 6-6 6',
  chevLeft: 'M14.5 6l-6 6 6 6',
  chevDown: 'M6 9.5l6 6 6-6',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  credit: 'M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19.5a5 5 0 0 1 10 0M16 8.5h5M18.5 6v5M15.5 15.5h5',
  box: 'M4 8l8-4 8 4v8.5l-8 4-8-4zM4 8l8 4 8-4M12 12v8.5',
  invoice: 'M7 3.5h7.5l4 4v13H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5zM14 3.5V8h4.5M8.5 12.5h7M8.5 16h4.5',
  sparkle: 'M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8zM18.5 16l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z',
  loan: 'M3.5 10 12 4.5l8.5 5.5M5.5 10v7.5M9.5 10v7.5M14.5 10v7.5M18.5 10v7.5M3.5 20h17',
  calendar: 'M5 6.5h14A1.5 1.5 0 0 1 20.5 8v11A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V8A1.5 1.5 0 0 1 5 6.5zM3.5 10.5h17M8 4v4M16 4v4',
  camera: 'M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l1.5-2.5h5.6L16.3 7h2.2A1.5 1.5 0 0 1 20 8.5v9.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18zM12 10a3.25 3.25 0 1 1 0 6.5 3.25 3.25 0 0 1 0-6.5z',
  note: 'M5 4.5h14v15H5zM8.5 9h7M8.5 12.5h7M8.5 16h4',
  edit: 'M4.5 19.5h4l10-10-4-4-10 10zM13.5 6.5l4 4',
  trash: 'M5 7h14M10 7V4.5h4V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5',
  undo: 'M9 14 4.5 9.5 9 5M5 9.5h9a5.5 5.5 0 0 1 0 11h-3',
  whatsapp: 'M4.5 19.5l1.2-3.7A8 8 0 1 1 8.5 18.6zM9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2z',
  globe: 'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zM3.5 12h17M12 3.5c2.5 2.6 3.5 5.5 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.5-3.5-8.5s1-5.9 3.5-8.5z',
  moon: 'M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z',
  sun: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4',
  cloud: 'M7 18.5a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5 3.5 3.5 0 0 1-.5 6.5z',
  cloudOff: 'M3.5 3.5l17 17M9 6.3A6 6 0 0 1 18 12a3.5 3.5 0 0 1 1.8 5.5M16 18.5H7a4 4 0 0 1-1.8-7.6',
  help: 'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01',
  user: 'M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM4.5 20.5a7.5 7.5 0 0 1 15 0',
  shop: 'M4 9.5 5.5 4.5h13L20 9.5M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 12v8.5h13V12M10 20.5v-5h4v5',
  lock: 'M6.5 10.5h11A1.5 1.5 0 0 1 19 12v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19v-7a1.5 1.5 0 0 1 1.5-1.5zM8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5',
  download: 'M12 4v11M8 11l4 4 4-4M5 19.5h14',
  send: 'M20.5 3.5 3.5 10.5l7 3 3 7z M10.5 13.5l4-4',
  bank: 'M3.5 9 12 4.5 20.5 9M5.5 9.5v8M18.5 9.5v8M9.5 9.5v8M14.5 9.5v8M3.5 20h17',
  target: 'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM12 11.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z',
  bus: 'M6 4.5h12A1.5 1.5 0 0 1 19.5 6v11h-15V6A1.5 1.5 0 0 1 6 4.5zM4.5 12h15M7.5 17v2.5M16.5 17v2.5M8 14.5h.01M16 14.5h.01',
  bag: 'M5.5 8h13l-1 12.5h-11zM9 8V6.5a3 3 0 0 1 6 0V8',
  bolt: 'M13 3.5 5.5 13.5H12l-1 7 7.5-10H12z',
  phone: 'M8 3.5h8A1.5 1.5 0 0 1 17.5 5v14a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V5A1.5 1.5 0 0 1 8 3.5zM11 17.5h2',
  bowl: 'M3.5 11.5h17a8.5 8.5 0 0 1-17 0zM8 8c0-1.5 1-1.5 1-3M12 8c0-1.5 1-1.5 1-3M16 8c0-1.5 1-1.5 1-3',
  drink: 'M7 4.5h10l-1.5 16h-7zM7.5 9h9M13 4.5l2-2',
  fabric: 'M4.5 6.5c2.5-2 5-2 7.5 0s5 2 7.5 0v11c-2.5 2-5 2-7.5 0s-5-2-7.5 0zM4.5 12c2.5-2 5-2 7.5 0s5 2 7.5 0',
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19.5a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.5M17.5 14a5.5 5.5 0 0 1 3 5.5',
  levy: 'M12 3.5l7.5 3v5.5c0 4.5-3.2 7.5-7.5 8.5-4.3-1-7.5-4-7.5-8.5V6.5zM9 12l2 2 4-4',
  dots: 'M6 12h.01M12 12h.01M18 12h.01',
  grid: 'M5 5h5.5v5.5H5zM13.5 5H19v5.5h-5.5zM5 13.5h5.5V19H5zM13.5 13.5H19V19h-5.5z',
  list: 'M8.5 6.5h11M8.5 12h11M8.5 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01',
  sort: 'M7 4.5v15M4 16.5l3 3 3-3M17 19.5v-15M14 7.5l3-3 3 3',
  wifiOff: 'M3.5 3.5l17 17M8.5 16a5 5 0 0 1 7 0M5 12.5a10 10 0 0 1 4-2.3M14.5 10.2a10 10 0 0 1 4.5 2.3M2 9a15 15 0 0 1 4-2.6M11 5.6A15 15 0 0 1 22 9M12 19.5h.01',
  play: 'M8 5.5v13l10.5-6.5z',
  stop: 'M7 7h10v10H7z',
  keyboard: 'M4 6.5h16A1.5 1.5 0 0 1 21.5 8v8a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 16V8A1.5 1.5 0 0 1 4 6.5zM6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M8 14h8',
  backspace: 'M8.5 5.5H20A1.5 1.5 0 0 1 21.5 7v10a1.5 1.5 0 0 1-1.5 1.5H8.5L2.5 12zM11.5 9.5l5 5M16.5 9.5l-5 5',
  logout: 'M14.5 4.5h4a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-4M10 16.5 5.5 12 10 7.5M5.5 12h10',
};

function Icon({ name, size = 22, active = false, stroke = 2, color, style, title }) {
  const d = KT_ICON_PATHS[name] || KT_ICON_PATHS.dots;
  const gid = React.useId ? 'g' + React.useId().replace(/:/g, '') : 'ktg';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} style={{ flex: 'none', display: 'block', ...style }}>
      {title && <title>{title}</title>}
      {active && (
        <defs>
          <linearGradient id={gid} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFA24A" /><stop offset=".5" stopColor="#F67300" /><stop offset="1" stopColor="#E0442A" />
          </linearGradient>
        </defs>
      )}
      <path d={d} stroke={active ? `url(#${gid})` : (color || 'currentColor')} strokeWidth={active ? stroke + 0.3 : stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Brand mark — evolved from the current logo (naira + rising arrow), redrawn as clean vector.
function KTLogo({ size = 36, mono = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="KudiTrack AI" role="img" style={{ flex: 'none', display: 'block' }}>
      <defs>
        <linearGradient id="ktlogo" x1="6" y1="40" x2="42" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E0442A" /><stop offset=".55" stopColor="#F67300" /><stop offset="1" stopColor="#FFA24A" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={mono ? 'currentColor' : 'url(#ktlogo)'} />
      <g stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M14 34V14l11 16" />
        <path d="M11 20.5h12M11 25.5h10" opacity=".9" />
        <path d="M22 33 36 15" />
        <path d="M29.5 14.5H36.5V21.5" />
      </g>
    </svg>
  );
}

Object.assign(window, { Icon, KTLogo, KT_ICON_PATHS });
