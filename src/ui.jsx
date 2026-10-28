// KudiTrack UI primitives — one set for phone + desktop.

// ---------- Segmented / Tabs: sliding pill, ARIA tablist, arrow keys, optional ?param= URL sync ----------
function Segmented({ options, value, onChange, urlKey, size = 'md', label, full = false, tone = 'light' }) {
  const ref = React.useRef(null);
  const [pill, setPill] = React.useState({ x: 0, w: 0, ready: false });
  // read from URL once
  React.useEffect(() => {
    if (!urlKey) return;
    const p = new URLSearchParams(location.search).get(urlKey);
    if (p && options.some(o => o.id === p) && p !== value) onChange(p);
  }, []);
  React.useEffect(() => {
    if (!urlKey) return;
    try { const u = new URL(location.href); u.searchParams.set(urlKey, value); history.replaceState(null, '', u); } catch (e) {}
  }, [value, urlKey]);
  const measure = React.useCallback(() => {
    const el = ref.current && ref.current.querySelector(`[data-seg="${value}"]`);
    if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth, ready: true });
  }, [value]);
  React.useLayoutEffect(() => { measure(); }, [measure, options.length]);
  React.useEffect(() => { const ro = new ResizeObserver(measure); ref.current && ro.observe(ref.current); return () => ro.disconnect(); }, [measure]);
  const onKey = (e) => {
    const i = options.findIndex(o => o.id === value);
    let n = i;
    if (e.key === 'ArrowRight') n = (i + 1) % options.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + options.length) % options.length;
    else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = options.length - 1; else return;
    e.preventDefault(); onChange(options[n].id);
    requestAnimationFrame(() => ref.current.querySelector(`[data-seg="${options[n].id}"]`)?.focus());
  };
  const h = size === 'sm' ? 40 : 48;
  const dark = tone === 'dark';
  return (
    <div ref={ref} role="tablist" aria-label={label} onKeyDown={onKey}
      style={{ position: 'relative', display: full ? 'flex' : 'inline-flex', padding: 4, borderRadius: 999, background: dark ? 'rgba(255,255,255,.08)' : 'var(--card-2)', border: '1px solid var(--line)', gap: 0, width: full ? '100%' : undefined }}>
      <span aria-hidden style={{ position: 'absolute', top: 4, left: 0, height: h - 8 + 0, width: pill.w, transform: `translateX(${pill.x}px)`, borderRadius: 999, background: 'var(--card)', boxShadow: '0 1px 2px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.08)', transition: pill.ready ? 'transform .42s var(--ease-spring), width .42s var(--ease-spring)' : 'none', opacity: pill.ready ? 1 : 0 }} />
      {options.map(o => {
        const sel = o.id === value;
        return (
          <button key={o.id} data-seg={o.id} role="tab" aria-selected={sel} tabIndex={sel ? 0 : -1} onClick={() => onChange(o.id)}
            style={{ position: 'relative', zIndex: 1, flex: full ? 1 : 'none', height: h - 8, minWidth: 44, padding: size === 'sm' ? '0 14px' : '0 18px', border: 0, background: 'transparent', borderRadius: 999, cursor: 'pointer', fontSize: size === 'sm' ? 14 : 15, fontWeight: sel ? 600 : 500, color: sel ? 'var(--ink)' : 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'color .25s', whiteSpace: 'nowrap' }}>
            {o.icon && <Icon name={o.icon} size={18} active={sel} />}{o.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Sheet: spring slide-up, drag handle, drag-to-dismiss, focus trap-lite, Esc ----------
function Sheet({ open, onClose, children, title, maxWidth = 560, height, desktopMode = 'center', labelledBy }) {
  const [mounted, setMounted] = React.useState(open);
  const [shown, setShown] = React.useState(false);
  const [dy, setDy] = React.useState(0);
  const drag = React.useRef(null);
  const panel = React.useRef(null);
  const isDesk = useIsDesktop();
  React.useEffect(() => {
    if (open) { setMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); }
    else { setShown(false); const id = setTimeout(() => setMounted(false), 380); return () => clearTimeout(id); }
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    const prev = document.activeElement;
    setTimeout(() => panel.current?.querySelector('button,input,[tabindex]')?.focus({ preventScroll: true }), 60);
    return () => { window.removeEventListener('keydown', k); prev && prev.focus && prev.focus({ preventScroll: true }); };
  }, [open]);
  if (!mounted) return null;
  const center = isDesk && desktopMode === 'center';
  const onDown = (e) => { drag.current = { y: e.clientY, t: Date.now() }; e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = (e) => { if (!drag.current) return; setDy(Math.max(0, e.clientY - drag.current.y)); };
  const onUp = (e) => {
    if (!drag.current) return;
    const v = dy / Math.max(1, Date.now() - drag.current.t);
    drag.current = null;
    if (dy > 120 || v > 0.6) onClose(); setDy(0);
  };
  const tf = center
    ? (shown ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-46%) scale(.97)')
    : (shown ? `translateY(${dy}px)` : 'translateY(105%)');
  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 80 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(16,12,8,.42)', backdropFilter: 'blur(3px)', opacity: shown ? 1 : 0, transition: 'opacity .3s' }} />
      <div ref={panel} role="dialog" aria-modal="true" aria-label={title} aria-labelledby={labelledBy}
        style={center ? {
          position: 'absolute', left: '50%', top: '50%', width: `min(${maxWidth}px, calc(100vw - 48px))`, maxHeight: 'calc(100vh - 64px)', overflow: 'auto',
          background: 'var(--bg)', borderRadius: 32, boxShadow: 'var(--sh-2)', transform: tf, opacity: shown ? 1 : 0,
          transition: 'transform .42s var(--ease-spring), opacity .25s',
        } : {
          position: 'absolute', left: 0, right: 0, bottom: 0, margin: '0 auto', maxWidth, height, maxHeight: '94vh', display: 'flex', flexDirection: 'column',
          background: 'var(--bg)', borderRadius: '32px 32px 0 0', boxShadow: 'var(--sh-2)', transform: tf,
          transition: drag.current ? 'none' : 'transform .5s var(--ease-spring)', paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
        {!center && (
          <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
            style={{ padding: '10px 0 4px', display: 'grid', placeItems: 'center', cursor: 'grab', touchAction: 'none', flex: 'none' }} aria-hidden>
            <span style={{ width: 44, height: 5, borderRadius: 9, background: 'var(--line-2)' }} />
          </div>
        )}
        <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }} className="no-scrollbar">{children}</div>
      </div>
    </div>, document.body);
}

function SheetHeader({ title, onClose, sub, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px 14px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 className="sub" style={{ margin: 0 }}>{title}</h2>
        {sub && <div className="muted" style={{ fontSize: 14 }}>{sub}</div>}
      </div>
      {right}
      {onClose && <button className="kt-iconbtn" onClick={onClose} aria-label="Close"><Icon name="close" size={20} /></button>}
    </div>
  );
}

// ---------- responsive hook ----------
function useIsDesktop() {
  const q = '(min-width: 640px)';
  const [m, setM] = React.useState(() => window.matchMedia(q).matches);
  React.useEffect(() => { const mq = window.matchMedia(q); const f = () => setM(mq.matches); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f); }, []);
  return m && !document.documentElement.classList.contains('kt-phone-preview');
}

// ---------- CountUp ----------
function CountUp({ value, duration = 900, format = ktNaira, className, style }) {
  const [v, setV] = React.useState(value);
  const from = React.useRef(0);
  React.useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = from.current, end = value; if (reduce || start === end) { setV(end); from.current = end; return; }
    let raf, t0;
    const step = (t) => { if (!t0) t0 = t; const p = Math.min(1, (t - t0) / duration); const e = 1 - Math.pow(1 - p, 4); setV(start + (end - start) * e); if (p < 1) raf = requestAnimationFrame(step); else from.current = end; };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); from.current = end; };
  }, [value]);
  return <span className={'num ' + (className || '')} style={style}>{format(v)}</span>;
}

// ---------- Progress ring ----------
function Ring({ pct, size = 64, stroke = 8, color = 'var(--savings)', track = 'var(--savings-bg)', children, grad }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const [p, setP] = React.useState(0);
  React.useEffect(() => { const id = requestAnimationFrame(() => setP(Math.max(0, Math.min(1, pct)))); return () => cancelAnimationFrame(id); }, [pct]);
  const gid = 'rg' + React.useId().replace(/:/g, '');
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }} aria-hidden>
        {grad && <defs><linearGradient id={gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B7E35A" /><stop offset="1" stopColor="#2563EB" /></linearGradient></defs>}
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={grad ? `url(#${gid})` : color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - p)} style={{ transition: 'stroke-dashoffset 1.1s var(--ease-out)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>{children}</div>
    </div>
  );
}

// ---------- Success burst ----------
function SuccessBurst({ size = 88 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }} aria-hidden>
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} style={{ position: 'absolute', left: '50%', top: '50%', width: 4, height: 16, marginLeft: -2, marginTop: -8, borderRadius: 4, background: i % 2 ? '#F67300' : '#13803F', '--a': `${i * 36}deg`, transformOrigin: '50% 50%', animation: `kt-ray .7s ${0.08 + i * 0.01}s var(--ease-out) both` }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--income)', display: 'grid', placeItems: 'center', animation: 'kt-pop .5s var(--ease-spring) both', boxShadow: '0 10px 30px rgba(19,128,63,.35)' }}>
        <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" style={{ animation: 'kt-draw .45s .25s var(--ease-out) both' }} /></svg>
      </div>
    </div>
  );
}

// ---------- Live waveform (reacts to mic level if available, else synthetic) ----------
function Waveform({ active, level = 0, bars = 36, height = 72, color = 'var(--ink)' }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!active) return; let raf; const f = () => { setTick(t => t + 1); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, height }} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const mid = 1 - Math.abs(i - bars / 2) / (bars / 2);
        const n = active ? (0.35 + 0.65 * Math.abs(Math.sin(tick * 0.09 + i * 0.55) * Math.cos(tick * 0.05 + i * 0.2))) * (0.4 + level * 1.2) : 0.12;
        const h = Math.max(4, Math.min(height, height * n * (0.35 + mid * 0.9)));
        return <span key={i} style={{ width: 4, height: h, borderRadius: 4, background: color, opacity: active ? 0.35 + mid * 0.65 : 0.25, transition: active ? 'none' : 'height .4s' }} />;
      })}
    </div>
  );
}

// ---------- Toast with Undo ----------
function Toast() {
  const { toast, undo, dismissToast, t } = useKT();
  React.useEffect(() => { if (!toast) return; const id = setTimeout(dismissToast, 5000); return () => clearTimeout(id); }, [toast]);
  if (!toast) return null;
  return ReactDOM.createPortal(
    <div role="status" aria-live="polite" key={toast.id}
      style={{ position: 'fixed', left: '50%', bottom: 'calc(112px + env(safe-area-inset-bottom))', transform: 'translateX(-50%)', zIndex: 120, background: '#16120E', color: '#fff', borderRadius: 999, padding: '8px 8px 8px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 30px rgba(0,0,0,.25)', animation: 'kt-rise .4s var(--ease-spring) both', maxWidth: 'calc(100vw - 32px)' }}>
      <span style={{ width: 24, height: 24, borderRadius: '50%', background: toast.kind === 'del' ? '#C8321F' : '#13803F', display: 'grid', placeItems: 'center' }}>
        <Icon name={toast.kind === 'del' ? 'trash' : 'check'} size={14} color="#fff" stroke={2.6} />
      </span>
      <span style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap' }}>{toast.msg}</span>
      {toast.canUndo && <button onClick={undo} style={{ minHeight: 40, padding: '0 16px', borderRadius: 999, border: 0, background: 'rgba(255,255,255,.14)', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="undo" size={16} color="#fff" />{t('undo')}</button>}
    </div>, document.body);
}

// ---------- Amount pill & tx row (swipe left to reveal edit/delete on touch; buttons on desktop hover) ----------
function AmountText({ type, amount, size = 17, weight = 600 }) {
  const sign = type === 'expense' ? '−' : '+';
  const color = type === 'expense' ? 'var(--expense)' : type === 'credit' ? 'var(--credit)' : 'var(--income)';
  return <span className="num" style={{ color, fontSize: size, fontWeight: weight, whiteSpace: 'nowrap' }}><span aria-hidden>{sign}</span><span className="sr-only">{type === 'expense' ? 'minus ' : 'plus '}</span>{ktNaira(amount)}</span>;
}
function TypeBadge({ type, category, size = 48 }) {
  const c = ktCat(category);
  const bg = type === 'expense' ? 'var(--expense-bg)' : type === 'credit' ? 'var(--credit-bg)' : 'var(--income-bg)';
  const fg = type === 'expense' ? 'var(--expense)' : type === 'credit' ? 'var(--credit)' : 'var(--income)';
  return (
    <span style={{ width: size, height: size, borderRadius: size * 0.36, background: bg, color: fg, display: 'grid', placeItems: 'center', flex: 'none', position: 'relative' }}>
      <Icon name={c.icon} size={size * 0.46} />
      <span style={{ position: 'absolute', right: -3, bottom: -3, width: 20, height: 20, borderRadius: '50%', background: fg, border: '2px solid var(--card)', display: 'grid', placeItems: 'center' }}>
        <Icon name={type === 'expense' ? 'arrowDown' : 'arrowUp'} size={12} color="#fff" stroke={2.8} />
      </span>
    </span>
  );
}
function TxRow({ tx, onEdit, onDelete, lang }) {
  const [x, setX] = React.useState(0);
  const st = React.useRef(null);
  const c = ktCat(tx.category);
  const onDown = (e) => { if (e.pointerType === 'mouse') return; st.current = { x: e.clientX - x, y: e.clientY, lock: null }; };
  const onMove = (e) => {
    if (!st.current) return; const dx = e.clientX - st.current.x; const dyy = Math.abs(e.clientY - st.current.y);
    if (st.current.lock === null) st.current.lock = Math.abs(dx - x) > dyy ? 'x' : 'y';
    if (st.current.lock === 'x') setX(Math.max(-148, Math.min(0, dx)));
  };
  const onUp = () => { if (!st.current) return; setX(x < -60 ? -148 : 0); st.current = null; };
  return (
    <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'stretch', gap: 6, padding: 6, background: 'var(--card-2)' }} aria-hidden={x === 0}>
        <button tabIndex={x ? 0 : -1} onClick={() => { setX(0); onEdit(tx); }} style={{ width: 66, border: 0, borderRadius: 18, background: 'var(--ink)', color: 'var(--bg)', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'grid', placeItems: 'center', gap: 2 }}><Icon name="edit" size={18} />Edit</button>
        <button tabIndex={x ? 0 : -1} onClick={() => { setX(0); onDelete(tx.id); }} style={{ width: 66, border: 0, borderRadius: 18, background: 'var(--expense)', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="trash" size={18} color="#fff" />Delete</button>
      </div>
      <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} className="kt-txrow"
        style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--card)', transform: `translateX(${x}px)`, transition: st.current ? 'none' : 'transform .35s var(--ease-spring)', touchAction: 'pan-y', minHeight: 72 }}>
        <TypeBadge type={tx.type} category={tx.category} />
        <button onClick={() => onEdit(tx)} style={{ flex: 1, minWidth: 0, textAlign: 'left', border: 0, background: 'none', padding: 0, cursor: 'pointer' }} aria-label={`${tx.item}, ${ktNaira(tx.amount)}. Edit`}>
          <div style={{ fontWeight: 600, fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.item}{tx.qty > 1 ? <span className="muted" style={{ fontWeight: 500 }}> ×{tx.qty}</span> : null}</div>
          <div className="muted" style={{ fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lang === 'pid' && c.pid ? c.pid : c.label} · {ktTime(tx.date)}{tx.customer ? ' · ' + tx.customer : ''}</div>
        </button>
        <AmountText type={tx.type} amount={tx.amount} />
        <span className="kt-rowact" style={{ display: 'none', gap: 4 }}>
          <button className="kt-iconbtn" style={{ width: 40, height: 40 }} onClick={() => onEdit(tx)} aria-label="Edit"><Icon name="edit" size={17} /></button>
          <button className="kt-iconbtn" style={{ width: 40, height: 40, color: 'var(--expense)' }} onClick={() => onDelete(tx.id)} aria-label="Delete"><Icon name="trash" size={17} /></button>
        </span>
      </div>
    </div>
  );
}

// ---------- Empty / skeleton / error ----------
function EmptyState({ art = 'stall', title, body, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '28px 20px 32px' }}>
      <div style={{ width: 150, margin: '0 auto 14px' }}>{art === 'jar' ? <ArtJar /> : art === 'mic' ? <ArtMic /> : <ArtStall />}</div>
      <div style={{ fontWeight: 600, fontSize: 18 }}>{title}</div>
      {body && <p className="muted" style={{ margin: '6px auto 16px', maxWidth: 300, textWrap: 'pretty' }}>{body}</p>}
      {action}
    </div>
  );
}
function SkeletonList({ n = 4 }) {
  return <div style={{ display: 'grid', gap: 10 }}>{Array.from({ length: n }).map((_, i) => (
    <div key={i} className="kt-card" style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 14, borderRadius: 22 }}>
      <div className="kt-skel" style={{ width: 48, height: 48, borderRadius: 17 }} />
      <div style={{ flex: 1, display: 'grid', gap: 8 }}><div className="kt-skel" style={{ height: 14, width: '60%' }} /><div className="kt-skel" style={{ height: 11, width: '40%' }} /></div>
      <div className="kt-skel" style={{ height: 16, width: 70 }} />
    </div>))}</div>;
}

// ---------- Original illustrations (flat, warm, same style; light on bytes) ----------
function ArtStall() {
  return (
    <svg viewBox="0 0 160 120" width="100%" aria-hidden>
      <ellipse cx="80" cy="110" rx="62" ry="6" fill="var(--line)" />
      <rect x="30" y="52" width="100" height="54" rx="8" fill="var(--card-2)" stroke="var(--line-2)" />
      <path d="M22 52h116l-8-26H30z" fill="#F67300" />
      <path d="M22 52c0 7 6 10 12 10s12-3 12-10c0 7 6 10 12 10s12-3 12-10c0 7 6 10 12 10s12-3 12-10c0 7 6 10 12 10s12-3 12-10c0 7 6 10 12 10s12-3 12-10" fill="#FFA24A" />
      <path d="M40 26 46 52M62 26l3 26M88 26l-1 26M112 26l-4 26" stroke="#E0442A" strokeWidth="5" opacity=".5" />
      <circle cx="54" cy="84" r="10" fill="#E0442A" /><circle cx="70" cy="86" r="9" fill="#FFB06B" /><circle cx="62" cy="76" r="8" fill="#13803F" opacity=".85" />
      <rect x="88" y="72" width="28" height="22" rx="5" fill="#FFE7A0" /><path d="M92 80h20M92 86h14" stroke="#A15C07" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ArtJar() {
  return (
    <svg viewBox="0 0 160 120" width="100%" aria-hidden>
      <ellipse cx="80" cy="111" rx="48" ry="5" fill="var(--line)" />
      <rect x="52" y="22" width="56" height="12" rx="5" fill="#2563EB" />
      <path d="M50 38c0-3 2-4 4-4h52c2 0 4 1 4 4v58c0 8-6 13-14 13H64c-8 0-14-5-14-13z" fill="var(--savings-bg)" stroke="var(--line-2)" />
      <rect x="58" y="70" width="44" height="32" rx="6" fill="#B7E35A" opacity=".9" />
      <rect x="60" y="58" width="40" height="14" rx="4" fill="#13803F" opacity=".75" transform="rotate(-8 80 65)" />
      <circle cx="80" cy="16" r="8" fill="#FFA24A" /><path d="M77 12v8l6-8v8M75.5 15h9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ArtMic() {
  return (
    <svg viewBox="0 0 160 120" width="100%" aria-hidden>
      <circle cx="80" cy="58" r="44" fill="var(--brand-50)" /><circle cx="80" cy="58" r="30" fill="url(#am)" />
      <defs><linearGradient id="am" x1="50" y1="30" x2="110" y2="90"><stop offset="0" stopColor="#FFA24A" /><stop offset="1" stopColor="#E0442A" /></linearGradient></defs>
      <rect x="73" y="40" width="14" height="24" rx="7" fill="#fff" /><path d="M67 58a13 13 0 0 0 26 0M80 71v6" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M22 58h8M130 58h8M26 46h4M130 70h4M26 70h4M130 46h4" stroke="#F67300" strokeWidth="3" strokeLinecap="round" opacity=".5" />
    </svg>
  );
}
function ArtNotes() {
  return (
    <svg viewBox="0 0 160 120" width="100%" aria-hidden>
      <rect x="26" y="36" width="96" height="54" rx="8" fill="#13803F" transform="rotate(-10 74 63)" opacity=".85" />
      <rect x="38" y="34" width="96" height="54" rx="8" fill="#B7E35A" transform="rotate(4 86 61)" />
      <circle cx="86" cy="61" r="14" fill="#fff" opacity=".7" /><path d="M81 54v14l10-14v14M78 59h16M78 63h16" stroke="#13803F" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ---------- Section header ----------
function SectionHead({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '22px 4px 10px' }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title}</h3>
      {action && <button onClick={onAction} style={{ border: 0, background: 'none', color: 'var(--ink-3)', fontWeight: 600, fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 4px' }}>{action}</button>}
    </div>
  );
}

Object.assign(window, { Segmented, Sheet, SheetHeader, useIsDesktop, CountUp, Ring, SuccessBurst, Waveform, Toast, AmountText, TypeBadge, TxRow, EmptyState, SkeletonList, ArtStall, ArtJar, ArtMic, ArtNotes, SectionHead });
