// Home dashboard + Records (transactions). Rendered by both phone and desktop shells.

function ktGreeting(t) { const h = new Date().getHours(); return h < 12 ? t('good_morning') : h < 17 ? t('good_afternoon') : t('good_evening'); }

function ktInsight(tx) {
  // real computed insight: biggest week-over-week change in an expense category
  const now = new Date(); now.setHours(23, 59, 59);
  const wk = (n) => { const a = new Date(now); a.setDate(a.getDate() - 7 * (n + 1)); const b = new Date(now); b.setDate(b.getDate() - 7 * n); return tx.filter(x => x.type === 'expense' && new Date(x.date) > a && new Date(x.date) <= b); };
  const sum = (l, c) => l.filter(x => x.category === c).reduce((a, b) => a + b.amount, 0);
  const tw = wk(0), lw = wk(1);
  let best = null;
  ['transport', 'power', 'chop', 'phone', 'levy', 'staff'].forEach(c => {
    const a = sum(tw, c), b = sum(lw, c); if (!a) return;
    const pct = b ? Math.round((a - b) / b * 100) : 100;
    if (!best || Math.abs(pct) > Math.abs(best.pct)) best = { c, pct, a, b };
  });
  if (best && best.pct > 0) return { tone: 'warn', text: `You spent ${best.b ? best.pct + '% more' : ktNaira(best.a)} on ${ktCat(best.c).label.toLowerCase()} this week${best.b ? ' than last week' : ''}.`, tip: 'Sharing a keke with another trader can cut this.' };
  const top = tx.filter(x => x.type === 'sale').reduce((m, x) => { m[x.item] = (m[x.item] || 0) + x.amount; return m; }, {});
  const k = Object.keys(top).sort((a, b) => top[b] - top[a])[0];
  return { tone: 'good', text: k ? `${k} is your best seller this month.` : 'Record a few sales and I will start giving you tips.', tip: 'Keep it in stock.' };
}

// ---------- Profit hero card ----------
function ProfitCard({ wide }) {
  const { state, t } = useKT();
  const [range, setRange] = React.useState('day');
  const tot = ktTotals(state.tx, range);
  const kept = tot.sales ? Math.max(0, Math.round(tot.profit / tot.sales * 100)) : 0;
  return (
    <div style={{ position: 'relative', borderRadius: 32, padding: wide ? 28 : 22, background: 'var(--glass)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,.6)', boxShadow: 'var(--sh-2)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <span className="muted" style={{ fontWeight: 600, fontSize: 14, letterSpacing: '.04em', textTransform: 'uppercase' }}>{range === 'day' ? t('todays_profit') : t('net_profit')}</span>
        <Segmented size="sm" label="Profit period" value={range} onChange={setRange} options={[{ id: 'day', label: t('day') }, { id: 'week', label: t('week') }, { id: 'month', label: t('month') }]} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '10px 0 2px' }}>
        <CountUp value={tot.profit} format={(v) => (v < 0 ? '−' : '') + ktNaira(v)} style={{ fontSize: wide ? 56 : 44, fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.05, color: tot.profit < 0 ? 'var(--expense)' : 'var(--ink)' }} />
      </div>
      <div className="muted" style={{ fontSize: 14.5 }}>{tot.sales ? t('kept_line', { x: kept }) : 'No sales recorded yet for this period.'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
        {[['sale', t('sales'), tot.sales, 'arrowUp', 'var(--income)', 'var(--income-bg)'], ['expense', t('expenses'), tot.exp, 'arrowDown', 'var(--expense)', 'var(--expense-bg)']].map(([k, label, v, ic, fg, bg]) => (
          <div key={k} style={{ background: 'var(--card)', borderRadius: 22, padding: '12px 14px', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 28, height: 28, borderRadius: 10, background: bg, color: fg, display: 'grid', placeItems: 'center' }}><Icon name={ic} size={16} stroke={2.6} /></span>
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-2)' }}>{label}</span>
            </div>
            <CountUp value={v} format={x => (k === 'expense' ? '−' : '+') + ktNaira(x)} style={{ display: 'block', marginTop: 6, fontSize: 22, fontWeight: 700, color: fg }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickAdd({ onAdd, go, wide }) {
  const { t } = useKT();
  const items = [
    { k: 'sale', label: t('record_sale'), icon: 'arrowUp', fg: 'var(--income)', bg: 'var(--income-bg)', act: () => onAdd({ type: 'sale' }) },
    { k: 'expense', label: t('add_expense'), icon: 'arrowDown', fg: 'var(--expense)', bg: 'var(--expense-bg)', act: () => onAdd({ type: 'expense' }) },
    { k: 'credit', label: t('add_credit'), icon: 'credit', fg: 'var(--credit)', bg: 'var(--credit-bg)', act: () => onAdd({ type: 'credit' }) },
    { k: 'stock', label: t('stock'), icon: 'box', fg: 'var(--ink-2)', bg: 'var(--card-2)', act: () => go('stock') },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
      {items.map(i => (
        <button key={i.k} onClick={i.act} style={{ border: '1px solid var(--line)', background: 'var(--card)', borderRadius: 24, padding: '14px 4px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, boxShadow: 'var(--sh-1)', minHeight: 92 }}>
          <span style={{ width: 44, height: 44, borderRadius: 16, background: i.bg, color: i.fg, display: 'grid', placeItems: 'center' }}><Icon name={i.icon} size={22} stroke={2.4} /></span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{i.label}</span>
        </button>
      ))}
    </div>
  );
}

function SavingsCard({ go }) {
  const { state, t } = useKT();
  const g = state.goals; const saved = g.reduce((a, b) => a + b.saved, 0), target = g.reduce((a, b) => a + b.target, 0);
  const pct = target ? saved / target : 0;
  return (
    <button onClick={() => go('savings')} className="kt-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18, textAlign: 'left', cursor: 'pointer', width: '100%' }}>
      <Ring pct={pct} size={76} stroke={9} grad><span className="num" style={{ fontWeight: 700, fontSize: 17 }}>{Math.round(pct * 100)}%</span></Ring>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--savings)', fontWeight: 600, fontSize: 14 }}><Icon name="savings" size={16} />{t('savings')}</div>
        <div className="num" style={{ fontSize: 22, fontWeight: 700 }}>{ktNaira(saved)}</div>
        <div className="muted" style={{ fontSize: 13.5 }}>of {ktNaira(target)} · {g.length} goals</div>
      </div>
      <Icon name="chevRight" size={20} color="var(--ink-3)" />
    </button>
  );
}

function InsightCard({ go }) {
  const { state, t } = useKT();
  const ins = React.useMemo(() => ktInsight(state.tx), [state.tx]);
  return (
    <div style={{ position: 'relative', borderRadius: 28, padding: 18, background: '#16120E', color: '#fff', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: '50%', background: 'var(--grad-hot)', filter: 'blur(30px)', opacity: .55 }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', color: '#FFC08C' }}><Icon name="sparkle" size={16} color="#FFC08C" />{t('ai_helper')}</div>
      <p style={{ position: 'relative', margin: '8px 0 4px', fontSize: 18, lineHeight: 1.35, fontWeight: 600, textWrap: 'pretty' }}>{ins.text}</p>
      <p style={{ position: 'relative', margin: 0, fontSize: 14.5, opacity: .7 }}>{ins.tip}</p>
      <button onClick={() => go('ai')} style={{ position: 'relative', marginTop: 12, minHeight: 44, padding: '0 16px', borderRadius: 999, border: 0, background: 'rgba(255,255,255,.12)', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>Ask KudiTrack AI <Icon name="arrowRight" size={16} color="#fff" /></button>
    </div>
  );
}

function OwesCard({ go }) {
  const { state, t } = useKT();
  const open = state.credits.filter(c => !c.paid);
  const total = open.reduce((a, b) => a + b.amount, 0);
  return (
    <div className="kt-card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--credit)', fontWeight: 600, fontSize: 14 }}><Icon name="credit" size={18} />{t('who_owes')}</div>
        <button onClick={() => go('credit')} style={{ border: 0, background: 'none', color: 'var(--ink-3)', fontWeight: 600, cursor: 'pointer', minHeight: 40 }}>{t('see_all')}</button>
      </div>
      {open.length === 0 ? <div className="muted" style={{ padding: '10px 0' }}>{t('nobody_owes')}</div> : (
        <>
          <div className="num" style={{ fontSize: 26, fontWeight: 700, margin: '2px 0 10px' }}>{ktNaira(total)}</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {open.slice(0, 4).map((c, i) => <span key={c.id} title={c.customer} style={{ width: 36, height: 36, borderRadius: '50%', marginLeft: i ? -8 : 0, border: '2px solid var(--card)', background: ['#FFE0C2', '#E3F4E6', '#E8EFFE', '#FDF1DD'][i % 4], color: '#4F4842', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 }}>{c.customer.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>)}
            <span className="muted" style={{ marginLeft: 10, fontSize: 14 }}>{open.length} customers</span>
          </div>
        </>
      )}
    </div>
  );
}

function RecentList({ n = 5, onEdit }) {
  const { state, t, deleteTx, lang } = useKT();
  const list = [...state.tx].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, n);
  if (!list.length) return <div className="kt-card"><EmptyState art="mic" title="No records yet" body={t('no_records')} /></div>;
  return <div style={{ display: 'grid', gap: 8 }} className="kt-stagger">{list.map(x => <TxRow key={x.id} tx={x} onEdit={onEdit} onDelete={deleteTx} lang={lang} />)}</div>;
}

function MobileHeader({ go, scrollY }) {
  const { state, t, online } = useKT();
  const fade = Math.max(0, Math.min(1, scrollY / 120));
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', inset: '0 0 -140px', background: 'var(--grad-header)', opacity: 1 - fade * .6, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: 'calc(14px + env(safe-area-inset-top)) 20px 8px' }}>
        <button onClick={() => go('settings')} aria-label="Profile and settings" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid rgba(255,255,255,.8)', background: 'linear-gradient(135deg,#FFB06B,#E0442A)', color: '#fff', fontWeight: 700, fontSize: 17, cursor: 'pointer', flex: 'none' }}>{state.profile.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="muted" style={{ fontSize: 14, fontWeight: 500 }}>{ktGreeting(t)},</div>
          <div style={{ fontWeight: 700, fontSize: 19, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{state.profile.name.split(' ')[0]} <span style={{ fontWeight: 500, color: 'var(--ink-3)', fontSize: 15 }}>· {state.profile.business}</span></div>
        </div>
        <button className="kt-iconbtn" aria-label="Notifications, 2 new" onClick={() => go('notifications')}>
          <Icon name="bell" size={22} /><span style={{ position: 'absolute', top: 10, right: 11, width: 9, height: 9, borderRadius: '50%', background: 'var(--brand-500)', border: '2px solid #fff' }} />
        </button>
      </div>
      <div style={{ position: 'relative', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: online ? 'var(--income)' : 'var(--credit)' }}>
        <Icon name={online ? 'cloud' : 'cloudOff'} size={15} />{online ? t('synced') : t('offline_banner')}
      </div>
    </div>
  );
}

function HomeScreen({ go, onAdd, onEdit, wide, scrollY = 0 }) {
  const { t } = useKT();
  if (wide) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(300px,1fr)', gap: 20, alignItems: 'start' }} className="kt-stagger">
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{ position: 'relative', borderRadius: 36, padding: 8, background: 'var(--grad-header)' }}><ProfitCard wide /></div>
          <QuickAdd onAdd={onAdd} go={go} wide />
          <div className="kt-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}><h3 className="sub" style={{ fontSize: 18 }}>This week</h3><button className="kt-chip" onClick={() => go('reports')}>Open reports <Icon name="arrowRight" size={16} /></button></div>
            <WeekBars height={200} />
          </div>
          <div><SectionHead title={t('recent')} action={t('see_all')} onAction={() => go('records')} /><RecentList n={6} onEdit={onEdit} /></div>
        </div>
        <div style={{ display: 'grid', gap: 20 }}>
          <InsightCard go={go} />
          <SavingsCard go={go} />
          <OwesCard go={go} />
          <StockAlertCard go={go} />
        </div>
      </div>
    );
  }
  return (
    <div>
      <MobileHeader go={go} scrollY={scrollY} />
      <div style={{ position: 'relative', padding: '14px 16px 0', display: 'grid', gap: 14 }} className="kt-stagger">
        <ProfitCard />
        <QuickAdd onAdd={onAdd} go={go} />
        <InsightCard go={go} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
          <SavingsCard go={go} />
          <OwesCard go={go} />
        </div>
        <div><SectionHead title={t('recent')} action={t('see_all')} onAction={() => go('records')} /><RecentList n={5} onEdit={onEdit} /></div>
      </div>
    </div>
  );
}

function StockAlertCard({ go }) {
  const { state } = useKT();
  const low = state.stock.filter(s => s.qty <= s.alert);
  if (!low.length) return null;
  return (
    <button onClick={() => go('stock')} className="kt-card" style={{ padding: 18, textAlign: 'left', cursor: 'pointer', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: 'var(--expense)' }}><Icon name="box" size={18} />Running low</div>
      <div style={{ display: 'grid', gap: 6, marginTop: 10 }}>
        {low.map(s => <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}><span>{s.name}</span><span className="num" style={{ fontWeight: 700, color: s.qty ? 'var(--credit)' : 'var(--expense)' }}>{s.qty ? `${s.qty} left` : 'Finished'}</span></div>)}
      </div>
    </button>
  );
}

// ---------- Records ----------
function RecordsScreen({ onEdit, onAdd, wide, loading }) {
  const { state, t, deleteTx, lang } = useKT();
  const [q, setQ] = React.useState('');
  const [range, setRange] = React.useState('month');
  const [kind, setKind] = React.useState('all');
  const [cat, setCat] = React.useState(null);
  const [sort, setSort] = React.useState('newest');
  const [sortOpen, setSortOpen] = React.useState(false);
  const [catOpen, setCatOpen] = React.useState(false);
  const from = ktStartOf(range === 'today' ? 'day' : range);
  let list = state.tx.filter(x => new Date(x.date) >= from)
    .filter(x => kind === 'all' || x.type === kind)
    .filter(x => !cat || x.category === cat)
    .filter(x => !q || (x.item + ' ' + x.customer + ' ' + ktCat(x.category).label).toLowerCase().includes(q.toLowerCase()));
  list.sort((a, b) => sort === 'newest' ? new Date(b.date) - new Date(a.date) : sort === 'oldest' ? new Date(a.date) - new Date(b.date) : sort === 'highest' ? b.amount - a.amount : a.amount - b.amount);
  const sales = list.filter(x => x.type === 'sale').reduce((a, b) => a + b.amount, 0), exp = list.filter(x => x.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const groups = [];
  if (sort === 'newest' || sort === 'oldest') list.forEach(x => { const k = new Date(x.date).toDateString(); let g = groups.find(g => g.k === k); if (!g) { g = { k, label: ktDayLabel(x.date, t), items: [] }; groups.push(g); } g.items.push(x); });
  else groups.push({ k: 'all', label: t(sort), items: list });

  const filters = (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }}><Icon name="search" size={20} /></span>
        <input className="kt-input" type="search" aria-label={t('search_records')} placeholder={t('search_records')} value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 46, borderRadius: 999, background: 'var(--card)' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 0' }} className="no-scrollbar">
        {[['today', t('today')], ['week', t('week')], ['month', t('month')]].map(([k, l]) => <button key={k} className="kt-chip" aria-pressed={range === k} onClick={() => setRange(k)}>{l}</button>)}
        <span style={{ width: 1, background: 'var(--line-2)', margin: '6px 2px', flex: 'none' }} />
        {[['sale', t('sales'), 'arrowUp'], ['expense', t('expenses'), 'arrowDown']].map(([k, l, ic]) => <button key={k} className="kt-chip" aria-pressed={kind === k} onClick={() => setKind(kind === k ? 'all' : k)}><Icon name={ic} size={15} stroke={2.5} />{l}</button>)}
        <button className="kt-chip" aria-pressed={!!cat} onClick={() => setCatOpen(true)}><Icon name="grid" size={16} />{cat ? ktCat(cat).label : t('category')}</button>
        <button className="kt-chip" onClick={() => setSortOpen(true)}><Icon name="sort" size={16} />{t('sort')}</button>
      </div>
    </div>
  );

  const summary = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
      {[[t('sales'), sales, 'var(--income)', '+'], [t('expenses'), exp, 'var(--expense)', '−'], [t('net_profit'), sales - exp, 'var(--ink)', sales - exp < 0 ? '−' : '']].map(([l, v, c, s]) => (
        <div key={l} style={{ background: 'var(--card)', borderRadius: 20, padding: '10px 12px', border: '1px solid var(--line)' }}>
          <div className="muted" style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l}</div>
          <div className="num" style={{ fontWeight: 700, fontSize: 17, color: c, whiteSpace: 'nowrap' }}>{s}{ktNaira(v, { compact: true })}</div>
        </div>
      ))}
    </div>
  );

  const body = loading ? <SkeletonList n={6} /> : list.length === 0 ? (
    <div className="kt-card">{state.tx.length ? <EmptyState title="No matches" body={t('no_match')} action={<button className="kt-btn kt-btn-ghost" onClick={() => { setQ(''); setKind('all'); setCat(null); setRange('month'); }}>Clear filters</button>} /> : <EmptyState art="mic" title="No records yet" body={t('no_records')} action={<button className="kt-btn kt-btn-primary" onClick={() => onAdd({ type: 'sale' })}><Icon name="add" size={18} />Add first sale</button>} />}</div>
  ) : wide ? (
    <div className="kt-card" style={{ overflow: 'hidden', padding: 0 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
        <thead><tr style={{ textAlign: 'left', color: 'var(--ink-3)', fontSize: 13 }}>
          {['Item', 'Category', 'Customer', 'Date', 'Amount', ''].map((h, i) => <th key={i} scope="col" style={{ padding: '14px 16px', fontWeight: 600, borderBottom: '1px solid var(--line)', textAlign: h === 'Amount' ? 'right' : 'left' }}>{h}</th>)}
        </tr></thead>
        <tbody>{list.map(x => (
          <tr key={x.id} className="kt-tr" style={{ borderBottom: '1px solid var(--line)' }}>
            <td style={{ padding: '10px 16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><TypeBadge type={x.type} category={x.category} size={40} /><span style={{ fontWeight: 600 }}>{x.item}{x.qty > 1 && <span className="muted" style={{ fontWeight: 500 }}> ×{x.qty}</span>}</span></div></td>
            <td style={{ padding: '10px 16px', color: 'var(--ink-2)' }}>{ktCat(x.category).label}</td>
            <td style={{ padding: '10px 16px', color: 'var(--ink-2)' }}>{x.customer || '—'}</td>
            <td style={{ padding: '10px 16px', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>{ktDayLabel(x.date, t)}, {ktTime(x.date)}</td>
            <td style={{ padding: '10px 16px', textAlign: 'right' }}><AmountText type={x.type} amount={x.amount} /></td>
            <td style={{ padding: '10px 12px', width: 100 }}><div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
              <button className="kt-iconbtn" style={{ width: 40, height: 40 }} onClick={() => onEdit(x)} aria-label={`Edit ${x.item}`}><Icon name="edit" size={17} /></button>
              <button className="kt-iconbtn" style={{ width: 40, height: 40, color: 'var(--expense)' }} onClick={() => deleteTx(x.id)} aria-label={`Delete ${x.item}`}><Icon name="trash" size={17} /></button>
            </div></td>
          </tr>))}</tbody>
      </table>
    </div>
  ) : (
    <div style={{ display: 'grid', gap: 18 }}>
      {groups.map(g => {
        const net = g.items.reduce((a, b) => a + (b.type === 'expense' ? -b.amount : b.amount), 0);
        return (
          <section key={g.k}>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 6px 8px', fontSize: 14, fontWeight: 600 }}>
              <span>{g.label}</span><span className="num muted">{net < 0 ? '−' : '+'}{ktNaira(net)}</span>
            </div>
            <div style={{ display: 'grid', gap: 8 }} className="kt-stagger">{g.items.map(x => <TxRow key={x.id} tx={x} onEdit={onEdit} onDelete={deleteTx} lang={lang} />)}</div>
          </section>
        );
      })}
      <p className="muted" style={{ textAlign: 'center', fontSize: 13 }}>Tip: swipe a record left to edit or delete it.</p>
    </div>
  );

  return (
    <div style={{ padding: wide ? 0 : '0 16px' }}>
      {!wide && (
        <div style={{ position: 'relative', margin: '0 -16px', padding: 'calc(14px + env(safe-area-inset-top)) 20px 12px' }}>
          <div style={{ position: 'absolute', inset: '0 0 -60px', background: 'var(--grad-header)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 className="h">{t('records_title')}</h1>
            <button className="kt-iconbtn" aria-label="Add record" onClick={() => onAdd({ type: 'sale' })}><Icon name="add" size={22} /></button>
          </div>
        </div>
      )}
      <div style={{ position: 'relative', display: 'grid', gap: 14 }}>
        {wide ? <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'end' }}>{filters}{summary}</div> : <>{filters}{summary}</>}
        {body}
      </div>
      <Sheet open={sortOpen} onClose={() => setSortOpen(false)} title={t('sort')} maxWidth={440}>
        <SheetHeader title={t('sort')} onClose={() => setSortOpen(false)} />
        <div role="radiogroup" style={{ padding: '0 20px 24px', display: 'grid', gap: 8 }}>
          {['newest', 'oldest', 'highest', 'lowest'].map(k => (
            <button key={k} role="radio" aria-checked={sort === k} onClick={() => { setSort(k); setSortOpen(false); }} className="kt-card" style={{ minHeight: 56, padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 16, fontWeight: 600, borderRadius: 20, boxShadow: sort === k ? 'inset 0 0 0 2px var(--brand-500)' : 'none' }}>
              {t(k)}{sort === k && <Icon name="check" size={20} active />}
            </button>))}
        </div>
      </Sheet>
      <Sheet open={catOpen} onClose={() => setCatOpen(false)} title={t('category')} maxWidth={480}>
        <SheetHeader title={t('category')} onClose={() => setCatOpen(false)} right={cat && <button className="kt-chip" onClick={() => { setCat(null); setCatOpen(false); }}>Clear</button>} />
        <div style={{ padding: '0 20px 24px', display: 'grid', gap: 14 }}>
          <span className="kt-label">{t('sales')}</span>
          <CategoryTiles type="sale" value={cat} onChange={v => { setCat(v); setCatOpen(false); }} lang={lang} />
          <span className="kt-label">{t('expenses')}</span>
          <CategoryTiles type="expense" value={cat} onChange={v => { setCat(v); setCatOpen(false); }} lang={lang} />
        </div>
      </Sheet>
    </div>
  );
}

// ---------- shared mini chart: last 7 days bars ----------
function WeekBars({ height = 180 }) {
  const { state } = useKT();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const l = state.tx.filter(x => ktSameDay(x.date, d));
    return { d, s: l.filter(x => x.type === 'sale').reduce((a, b) => a + b.amount, 0), e: l.filter(x => x.type === 'expense').reduce((a, b) => a + b.amount, 0) };
  });
  return <BarChart data={days.map(x => ({ label: x.d.toLocaleDateString('en-NG', { weekday: 'short' }), a: x.s, b: x.e }))} height={height} />;
}

function BarChart({ data, height = 200 }) {
  const max = Math.max(1, ...data.map(d => Math.max(d.a, d.b)));
  const [hover, setHover] = React.useState(null);
  return (
    <div>
      <div style={{ display: 'flex', gap: 14, fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', margin: '4px 0 10px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--income)' }} />Sales ↑</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--expense)', opacity: .8 }} />Expenses ↓</span>
      </div>
      <div role="img" aria-label={'Sales and expenses: ' + data.map(d => `${d.label} sales ${ktNaira(d.a)}, expenses ${ktNaira(d.b)}`).join('; ')} style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height, position: 'relative' }}>
        {[0.25, 0.5, 0.75, 1].map(g => <span key={g} style={{ position: 'absolute', left: 0, right: 0, bottom: `calc(${g * 100}% - ${g * 24}px + 24px)`, borderTop: '1px dashed var(--line)' }} />)}
        {data.map((d, i) => (
          <div key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
            {hover === i && <div style={{ position: 'absolute', bottom: '100%', zIndex: 2, background: '#16120E', color: '#fff', borderRadius: 12, padding: '6px 10px', fontSize: 12.5, whiteSpace: 'nowrap', fontWeight: 600 }}>+{ktNaira(d.a)} · −{ktNaira(d.b)}</div>}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 'calc(100% - 24px)', width: '100%', justifyContent: 'center' }}>
              <span style={{ width: '42%', maxWidth: 22, height: `${(d.a / max) * 100}%`, minHeight: d.a ? 4 : 2, background: 'var(--income)', borderRadius: 8, transformOrigin: 'bottom', animation: `kt-grow .8s ${i * .05}s var(--ease-out) both` }} />
              <span style={{ width: '42%', maxWidth: 22, height: `${(d.b / max) * 100}%`, minHeight: d.b ? 4 : 2, background: 'var(--expense)', opacity: .8, borderRadius: 8, transformOrigin: 'bottom', animation: `kt-grow .8s ${i * .05 + .05}s var(--ease-out) both` }} />
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-3)', height: 18 }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, RecordsScreen, WeekBars, BarChart, ProfitCard, QuickAdd, SavingsCard, InsightCard, OwesCard, RecentList, StockAlertCard, ktGreeting });
