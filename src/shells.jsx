// Layout shells: PhoneApp (<640px) and DesktopApp (>=640px). Same store, same screens.

const KT_NAV = [
  { id: 'home', icon: 'home', key: 'nav_home' },
  { id: 'records', icon: 'records', key: 'nav_records' },
  { id: 'voice', icon: 'mic', key: 'nav_voice', hero: true },
  { id: 'reports', icon: 'chart', key: 'nav_reports' },
  { id: 'settings', icon: 'settings', key: 'nav_settings' },
];
const KT_SUBPAGES = ['savings', 'credit', 'stock', 'ai', 'loan', 'invoice', 'notifications'];

function useRoute() {
  const parse = () => { const h = location.hash.replace(/^#\/?/, ''); const [a, b] = h.split('/'); return { area: a || '', page: b || 'home' }; };
  const [r, setR] = React.useState(parse);
  React.useEffect(() => { const f = () => setR(parse()); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  const nav = (area, page) => { location.hash = '/' + area + (page ? '/' + page : ''); };
  return [r, nav];
}

function ScreenSwitch({ page, wide, go, onAdd, onEdit, scrollY, back, replay }) {
  const p = { wide, go, onAdd, onEdit, onBack: back };
  switch (page) {
    case 'records': return <RecordsScreen {...p} />;
    case 'reports': return <ReportsScreen {...p} />;
    case 'settings': return <SettingsScreen {...p} onReplayOnboarding={replay} />;
    case 'savings': return <SavingsScreen {...p} />;
    case 'credit': return <CreditScreen {...p} />;
    case 'stock': return <StockScreen {...p} />;
    case 'ai': return <AIScreen {...p} />;
    case 'loan': return <LoanScreen {...p} />;
    case 'invoice': return <InvoiceScreen {...p} />;
    case 'notifications': return <NotificationsScreen {...p} />;
    default: return <HomeScreen {...p} scrollY={scrollY} />;
  }
}

// ---------- Shared sheet controller ----------
function useSheets() {
  const [voice, setVoice] = React.useState(false);
  const [tx, setTx] = React.useState(null); // initial obj or null
  return {
    voice, tx,
    openVoice: () => setVoice(true), closeVoice: () => setVoice(false),
    openTx: (init) => setTx(init || {}), closeTx: () => setTx(null),
    editFromVoice: (parsed) => { setVoice(false); setTimeout(() => setTx({ type: parsed.type, item: parsed.item, amount: parsed.amount, qty: parsed.qty, category: parsed.category, customer: parsed.customer }), 250); },
  };
}

// ---------- Floating pill nav with sliding gradient indicator ----------
function PillNav({ active, onNav, onVoice }) {
  const { t } = useKT();
  const ref = React.useRef(null);
  const [ind, setInd] = React.useState({ x: 0, w: 0 });
  const navActive = KT_NAV.some(n => n.id === active && !n.hero) ? active : (KT_SUBPAGES.includes(active) ? (active === 'savings' || active === 'credit' || active === 'stock' || active === 'invoice' || active === 'loan' ? 'settings' : 'home') : 'home');
  React.useLayoutEffect(() => {
    const el = ref.current && ref.current.querySelector(`[data-nav="${navActive}"]`);
    if (el) setInd({ x: el.offsetLeft + el.offsetWidth / 2 - 22, w: 44 });
  }, [navActive]);
  return (
    <nav aria-label="Main" style={{ position: 'fixed', left: 0, right: 0, bottom: 'calc(14px + env(safe-area-inset-bottom))', display: 'flex', justifyContent: 'center', zIndex: 50, pointerEvents: 'none' }}>
      <div ref={ref} style={{ pointerEvents: 'auto', position: 'relative', display: 'flex', alignItems: 'center', gap: 2, padding: 6, borderRadius: 999, background: 'rgba(22,18,14,.92)', backdropFilter: 'blur(16px)', boxShadow: '0 16px 40px rgba(22,18,14,.28)', width: 'min(400px, calc(100vw - 24px))', justifyContent: 'space-between' }}>
        <span aria-hidden style={{ position: 'absolute', top: 8, left: 0, width: 44, height: 4, borderRadius: 4, background: 'var(--grad-hot)', transform: `translateX(${ind.x}px)`, transition: 'transform .45s var(--ease-spring)' }} />
        {KT_NAV.map(n => {
          if (n.hero) return (
            <button key={n.id} onClick={onVoice} aria-label="Speak to record" style={{ position: 'relative', width: 68, height: 68, marginTop: -26, borderRadius: '50%', border: '5px solid var(--bg)', background: 'var(--grad-hot)', boxShadow: 'var(--sh-hot)', display: 'grid', placeItems: 'center', cursor: 'pointer', flex: 'none' }}>
              <span aria-hidden style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: '2px solid rgba(246,115,0,.5)', animation: 'kt-pulse 2.4s infinite var(--ease-out)' }} />
              <Icon name="mic" size={28} color="#fff" stroke={2.3} />
            </button>);
          const sel = navActive === n.id;
          return (
            <button key={n.id} data-nav={n.id} onClick={() => onNav(n.id)} aria-current={sel ? 'page' : undefined}
              style={{ flex: 1, minWidth: 56, height: 58, border: 0, background: 'none', color: sel ? '#fff' : 'rgba(255,255,255,.55)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, cursor: 'pointer', fontSize: 11.5, fontWeight: sel ? 700 : 500, paddingTop: 6, transition: 'color .2s' }}>
              <Icon name={n.icon} size={23} active={sel} />{t(n.key)}
            </button>);
        })}
      </div>
    </nav>
  );
}

function PhoneApp({ page, go }) {
  const sheets = useSheets();
  const { state, online, t } = useKT();
  const [scrollY, setScrollY] = React.useState(0);
  const [showOnb, setShowOnb] = React.useState(!state.prefs.onboarded);
  React.useEffect(() => { const f = () => setScrollY(window.scrollY); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  React.useEffect(() => { window.scrollTo(0, 0); }, [page]);
  const back = KT_SUBPAGES.includes(page) ? () => history.length > 1 ? history.back() : go('home') : undefined;
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 130, maxWidth: 560, margin: '0 auto' }} data-screen-label={'Phone · ' + page}>
      {!online && <div role="status" style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--credit)', color: '#fff', fontWeight: 600, fontSize: 14, padding: '8px 16px', display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="wifiOff" size={16} color="#fff" />{t('offline_banner')}</div>}
      <div key={page} style={{ animation: 'kt-rise .4s var(--ease-out) both' }}>
        <ScreenSwitch page={page} go={go} onAdd={sheets.openTx} onEdit={sheets.openTx} scrollY={scrollY} back={back} replay={() => setShowOnb(true)} />
      </div>
      <PillNav active={page} onNav={go} onVoice={sheets.openVoice} />
      <VoiceSheet open={sheets.voice} onClose={sheets.closeVoice} onEditParsed={sheets.editFromVoice} />
      <TxSheet open={!!sheets.tx} onClose={sheets.closeTx} initial={sheets.tx} />
      {showOnb && <Onboarding onDone={() => setShowOnb(false)} />}
    </div>
  );
}

// ---------- Desktop web app ----------
function DesktopApp({ page, go, toSite }) {
  const sheets = useSheets();
  const { state, t, online } = useKT();
  const [showOnb, setShowOnb] = React.useState(false);
  const mainNav = [
    { id: 'home', icon: 'home', label: t('nav_home') }, { id: 'records', icon: 'records', label: t('nav_records') }, { id: 'reports', icon: 'chart', label: t('nav_reports') },
    { id: 'credit', icon: 'credit', label: 'Credit' }, { id: 'savings', icon: 'savings', label: t('savings') }, { id: 'stock', icon: 'box', label: t('stock') },
    { id: 'invoice', icon: 'invoice', label: t('invoice') }, { id: 'ai', icon: 'sparkle', label: 'AI helper' }, { id: 'loan', icon: 'loan', label: 'Loan check' },
  ];
  const titles = { home: `${ktGreeting(t)}, ${state.profile.name.split(' ')[0]}` };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'var(--kt-side, 264px) 1fr', minHeight: '100vh' }} className="kt-desk" data-screen-label={'Desktop · ' + page}>
      <aside style={{ position: 'sticky', top: 0, height: '100vh', alignSelf: 'start', padding: 16, display: 'flex', flexDirection: 'column', gap: 6, borderRight: '1px solid var(--line)', background: 'var(--card)' }} className="kt-side">
        <button onClick={toSite} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 18px', border: 0, background: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 18 }} aria-label="KudiTrack website"><KTLogo size={36} /><span className="kt-side-label">KudiTrack <span style={{ color: 'var(--brand-500)' }}>AI</span></span></button>
        <button className="kt-btn kt-btn-hot" onClick={sheets.openVoice} style={{ marginBottom: 6 }}><Icon name="mic" size={20} color="#fff" /><span className="kt-side-label">Speak to record</span></button>
        <button className="kt-btn kt-btn-ghost" onClick={() => sheets.openTx({ type: 'sale' })} style={{ marginBottom: 12 }}><Icon name="add" size={20} /><span className="kt-side-label">{t('quick_add')}</span></button>
        <nav aria-label="App" style={{ display: 'grid', gap: 2 }}>
          {mainNav.map(n => { const sel = page === n.id; return (
            <button key={n.id} onClick={() => go(n.id)} aria-current={sel ? 'page' : undefined} style={{ minHeight: 48, borderRadius: 16, border: 0, background: sel ? 'var(--grad-soft)' : 'transparent', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', cursor: 'pointer', fontWeight: sel ? 700 : 500, fontSize: 15.5, color: sel ? 'var(--ink)' : 'var(--ink-2)', textAlign: 'left' }}>
              <Icon name={n.icon} size={21} active={sel} /><span className="kt-side-label">{n.label}</span>
            </button>); })}
        </nav>
        <div style={{ flex: 1 }} />
        <button onClick={() => go('settings')} aria-current={page === 'settings' ? 'page' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 18, border: '1px solid var(--line)', background: page === 'settings' ? 'var(--grad-soft)' : 'var(--card-2)', cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#FFB06B,#E0442A)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, flex: 'none' }}>{state.profile.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
          <span className="kt-side-label" style={{ flex: 1, minWidth: 0 }}><span style={{ display: 'block', fontWeight: 600, fontSize: 14.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{state.profile.business}</span><span className="muted" style={{ fontSize: 13 }}>{t('nav_settings')}</span></span>
        </button>
      </aside>
      <main style={{ minWidth: 0, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: '0 0 auto', height: 260, background: 'var(--grad-header)', opacity: .7, pointerEvents: 'none' }} />
        <header style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '20px clamp(20px,3vw,40px) 0' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {page === 'home' && <><div className="muted" style={{ fontSize: 15 }}>{new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}</div><h1 className="h" style={{ fontSize: 'clamp(26px,2.4vw,34px)' }}>{titles.home}</h1></>}
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: online ? 'var(--income)' : 'var(--credit)', padding: '8px 12px', borderRadius: 999, background: 'var(--glass)' }}><Icon name={online ? 'cloud' : 'cloudOff'} size={16} />{online ? t('synced') : 'Offline'}</span>
          <button className="kt-iconbtn" aria-label="Notifications" onClick={() => go('notifications')}><Icon name="bell" size={21} /><span style={{ position: 'absolute', top: 10, right: 11, width: 9, height: 9, borderRadius: '50%', background: 'var(--brand-500)', border: '2px solid #fff' }} /></button>
        </header>
        <div key={page} style={{ position: 'relative', padding: '20px clamp(20px,3vw,40px) 48px', maxWidth: 1440, animation: 'kt-rise .4s var(--ease-out) both' }}>
          <ScreenSwitch page={page} wide go={go} onAdd={sheets.openTx} onEdit={sheets.openTx} replay={() => setShowOnb(true)} />
        </div>
      </main>
      <VoiceSheet open={sheets.voice} onClose={sheets.closeVoice} onEditParsed={sheets.editFromVoice} />
      <TxSheet open={!!sheets.tx} onClose={sheets.closeTx} initial={sheets.tx} />
      {showOnb && <Onboarding onDone={() => setShowOnb(false)} />}
    </div>
  );
}

Object.assign(window, { PhoneApp, DesktopApp, useRoute, KT_NAV });
