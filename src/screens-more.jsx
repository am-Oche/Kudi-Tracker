// Reports, Savings, Credit tracker, Stock, Settings, AI helper, Loan checker, Invoices, Notifications.

function PageHead({ title, wide, onBack, right, sub }) {
  if (wide) return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
      <div><h1 className="h" style={{ fontSize: 32 }}>{title}</h1>{sub && <div className="muted">{sub}</div>}</div>{right}
    </div>
  );
  return (
    <div style={{ position: 'relative', margin: '0 -16px 6px', padding: 'calc(14px + env(safe-area-inset-top)) 20px 12px' }}>
      <div style={{ position: 'absolute', inset: '0 0 -80px', background: 'var(--grad-header)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
        {onBack && <button className="kt-iconbtn" onClick={onBack} aria-label="Back"><Icon name="chevLeft" size={22} /></button>}
        <div style={{ flex: 1, minWidth: 0 }}><h1 className="h">{title}</h1>{sub && <div className="muted" style={{ fontSize: 14 }}>{sub}</div>}</div>
        {right}
      </div>
    </div>
  );
}

// ---------- Reports ----------
function ReportsScreen({ wide, go }) {
  const { state, t } = useKT();
  const [range, setRange] = React.useState('week');
  const [view, setView] = React.useState('chart');
  const [shareOpen, setShareOpen] = React.useState(false);
  const tot = ktTotals(state.tx, range);
  const margin = tot.sales ? Math.round(tot.profit / tot.sales * 100) : 0;
  const health = margin >= 30 ? ['Excellent! Your business is very healthy.', 'var(--income)'] : margin >= 15 ? ['Good work — solid profit margins.', 'var(--income)'] : margin >= 0 ? ['Low margins. Watch your expenses carefully.', 'var(--credit)'] : ['You are running at a loss. Review pricing and costs.', 'var(--expense)'];
  // series
  const nb = range === 'day' ? 6 : range === 'week' ? 7 : 4;
  const series = Array.from({ length: nb }).map((_, i) => {
    let from, to, label;
    if (range === 'day') { from = new Date(); from.setHours(6 + i * 2, 0, 0, 0); to = new Date(from); to.setHours(from.getHours() + 2); label = from.toLocaleTimeString('en-NG', { hour: 'numeric' }); }
    else if (range === 'week') { from = new Date(); from.setDate(from.getDate() - (6 - i)); from.setHours(0, 0, 0, 0); to = new Date(from); to.setDate(to.getDate() + 1); label = from.toLocaleDateString('en-NG', { weekday: 'short' }); }
    else { from = new Date(); from.setDate(from.getDate() - 28 + i * 7); from.setHours(0, 0, 0, 0); to = new Date(from); to.setDate(to.getDate() + 7); label = 'Wk ' + (i + 1); }
    const l = state.tx.filter(x => new Date(x.date) >= from && new Date(x.date) < to);
    return { label, a: l.filter(x => x.type === 'sale').reduce((s, x) => s + x.amount, 0), b: l.filter(x => x.type === 'expense').reduce((s, x) => s + x.amount, 0) };
  });
  const byCat = (type) => { const m = {}; tot.list.filter(x => x.type === type).forEach(x => { m[x.category] = (m[x.category] || 0) + x.amount; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5); };
  const topS = byCat('sale'), topE = byCat('expense');
  const CatList = ({ rows, type }) => {
    const max = Math.max(1, ...rows.map(r => r[1]));
    if (!rows.length) return <div className="muted" style={{ padding: '8px 0' }}>Nothing yet.</div>;
    return <div style={{ display: 'grid', gap: 12 }}>{rows.map(([c, v]) => (
      <div key={c} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 10, alignItems: 'center' }}>
        <span style={{ width: 36, height: 36, borderRadius: 12, background: type === 'sale' ? 'var(--income-bg)' : 'var(--expense-bg)', color: type === 'sale' ? 'var(--income)' : 'var(--expense)', display: 'grid', placeItems: 'center' }}><Icon name={ktCat(c).icon} size={18} /></span>
        <div><div style={{ fontWeight: 600, fontSize: 15 }}>{ktCat(c).label}</div><div style={{ height: 6, borderRadius: 6, background: 'var(--card-2)', marginTop: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: `${v / max * 100}%`, background: type === 'sale' ? 'var(--income)' : 'var(--expense)', borderRadius: 6, transformOrigin: 'left', animation: 'kt-grow-x .9s var(--ease-out) both' }} /></div></div>
        <span className="num" style={{ fontWeight: 700 }}>{ktNaira(v)}</span>
      </div>))}</div>;
  };
  const kpis = [[t('sales'), tot.sales, 'var(--income)', 'arrowUp', '+'], [t('expenses'), tot.exp, 'var(--expense)', 'arrowDown', '−'], [t('net_profit'), tot.profit, tot.profit < 0 ? 'var(--expense)' : 'var(--ink)', 'naira', tot.profit < 0 ? '−' : ''], ['Profit margin', margin, 'var(--savings)', 'chart', '']];
  return (
    <div style={{ padding: wide ? 0 : '0 16px' }}>
      <PageHead wide={wide} title={t('nav_reports')} right={<button className="kt-btn kt-btn-primary" style={{ minHeight: 48 }} onClick={() => setShareOpen(true)}><Icon name="share" size={18} />Share</button>} />
      <div style={{ position: 'relative', display: 'grid', gap: 14 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Segmented urlKey="range" label="Report period" value={range} onChange={setRange} full={!wide} options={[{ id: 'day', label: t('day') }, { id: 'week', label: t('week') }, { id: 'month', label: t('month') }]} />
          {wide && <Segmented label="View" value={view} onChange={setView} options={[{ id: 'chart', label: 'Chart', icon: 'chart' }, { id: 'list', label: 'List', icon: 'list' }]} />}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: wide ? 'repeat(4,1fr)' : '1fr 1fr', gap: 10 }} className="kt-stagger">
          {kpis.map(([l, v, c, ic, s]) => (
            <div key={l} className="kt-card" style={{ padding: 16, borderRadius: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: 'var(--ink-3)' }}><Icon name={ic} size={16} color={c} />{l}</div>
              <CountUp value={v} format={x => l === 'Profit margin' ? Math.round(x) + '%' : s + ktNaira(x)} style={{ display: 'block', fontSize: wide ? 28 : 22, fontWeight: 700, color: c, marginTop: 4 }} />
            </div>))}
        </div>
        <div style={{ borderRadius: 24, padding: '14px 16px', background: 'var(--card)', border: '1px solid var(--line)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: health[1], flex: 'none' }} />
          <span style={{ fontWeight: 600 }}>{health[0]}</span>
          <span className="muted" style={{ marginLeft: 'auto', fontSize: 14 }}>{t('kept_line', { x: Math.max(0, margin) })}</span>
        </div>
        {!wide && <Segmented full label="View" value={view} onChange={setView} options={[{ id: 'chart', label: 'Chart', icon: 'chart' }, { id: 'list', label: 'List', icon: 'list' }]} />}
        <div style={{ display: 'grid', gridTemplateColumns: wide ? '1.6fr 1fr' : '1fr', gap: 14 }}>
          <div className="kt-card" style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 600 }}>Sales vs expenses</h3>
            {view === 'chart' ? <><BarChart data={series} height={wide ? 260 : 200} /><ProfitLine data={series} /></> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, marginTop: 8 }}>
                <thead><tr style={{ color: 'var(--ink-3)', fontSize: 13, textAlign: 'right' }}><th style={{ textAlign: 'left', padding: 8 }}>Period</th><th style={{ padding: 8 }}>Sales</th><th style={{ padding: 8 }}>Expenses</th><th style={{ padding: 8 }}>Profit</th></tr></thead>
                <tbody>{series.map(r => <tr key={r.label} style={{ borderTop: '1px solid var(--line)', textAlign: 'right' }} className="num"><td style={{ textAlign: 'left', padding: 8, fontWeight: 600 }}>{r.label}</td><td style={{ padding: 8, color: 'var(--income)' }}>+{ktNaira(r.a)}</td><td style={{ padding: 8, color: 'var(--expense)' }}>−{ktNaira(r.b)}</td><td style={{ padding: 8, fontWeight: 700 }}>{r.a - r.b < 0 ? '−' : ''}{ktNaira(r.a - r.b)}</td></tr>)}</tbody>
              </table>)}
          </div>
          <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
            <div className="kt-card" style={{ padding: 20 }}><h3 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 600 }}>Top sales</h3><CatList rows={topS} type="sale" /></div>
            <div className="kt-card" style={{ padding: 20 }}><h3 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 600 }}>Top expenses</h3><CatList rows={topE} type="expense" /></div>
          </div>
        </div>
        <button className="kt-card" onClick={() => go('loan')} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 18, cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--savings-bg)', color: 'var(--savings)', display: 'grid', placeItems: 'center' }}><Icon name="loan" size={24} /></span>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>Loan eligibility checker</div><div className="muted" style={{ fontSize: 14 }}>See how your records could help you qualify for a business loan.</div></div>
          <Icon name="chevRight" size={20} color="var(--ink-3)" />
        </button>
      </div>
      <Sheet open={shareOpen} onClose={() => setShareOpen(false)} title="Share report" maxWidth={460}>
        <SheetHeader title="Share report" sub={`${state.profile.business} · ${range === 'day' ? 'Today' : range === 'week' ? 'This week' : 'This month'}`} onClose={() => setShareOpen(false)} />
        <div style={{ padding: '0 20px 24px', display: 'grid', gap: 10 }}>
          <div style={{ borderRadius: 24, padding: 18, background: 'var(--grad-soft)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}><KTLogo size={26} />Financial statement</div>
            <div className="num" style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>{tot.profit < 0 ? '−' : ''}{ktNaira(tot.profit)}</div>
            <div className="muted" style={{ fontSize: 14 }}>Net profit · {margin}% margin</div>
          </div>
          <a className="kt-btn" style={{ background: '#1FA855', color: '#fff', textDecoration: 'none' }} target="_blank" rel="noopener" href={`https://wa.me/?text=${encodeURIComponent(`${state.profile.business} — ${range} report\nSales: ${ktNaira(tot.sales)}\nExpenses: ${ktNaira(tot.exp)}\nNet profit: ${ktNaira(tot.profit)}\nGenerated by KudiTrack AI`)}`}><Icon name="whatsapp" size={20} color="#fff" />Share on WhatsApp</a>
          <button className="kt-btn kt-btn-ghost" onClick={() => { setShareOpen(false); setTimeout(() => window.print(), 300); }}><Icon name="download" size={20} />Save as PDF</button>
        </div>
      </Sheet>
    </div>
  );
}
function ProfitLine({ data }) {
  const pts = data.map(d => d.a - d.b); const max = Math.max(1, ...pts.map(Math.abs));
  const w = 100, h = 40; const xy = pts.map((p, i) => [i / (pts.length - 1 || 1) * w, h / 2 - p / max * (h / 2 - 3)]);
  const d = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return (
    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 6 }}>Profit trend</div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: 70, display: 'block' }} aria-hidden>
        <line x1="0" x2={w} y1={h / 2} y2={h / 2} stroke="var(--line-2)" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke="#F67300" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" pathLength="1" strokeDasharray="1" style={{ animation: 'kt-line 1.2s var(--ease-out) both' }} />
      </svg>
    </div>
  );
}

// ---------- Savings ----------
function SavingsScreen({ wide, onBack }) {
  const { state, addToGoal, addGoal, t } = useKT();
  const [addFor, setAddFor] = React.useState(null);
  const [amt, setAmt] = React.useState('');
  const [newOpen, setNewOpen] = React.useState(false);
  const [ng, setNg] = React.useState({ name: '', target: '' });
  const saved = state.goals.reduce((a, b) => a + b.saved, 0);
  return (
    <div style={{ padding: wide ? 0 : '0 16px' }}>
      <PageHead wide={wide} onBack={onBack} title={t('savings')} sub={`${ktNaira(saved)} saved across ${state.goals.length} goals`} right={<button className="kt-btn kt-btn-primary" style={{ minHeight: 48 }} onClick={() => setNewOpen(true)}><Icon name="add" size={18} />{wide ? 'New goal' : 'New'}</button>} />
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: wide ? 'repeat(auto-fill,minmax(300px,1fr))' : '1fr', gap: 14 }} className="kt-stagger">
        {state.goals.length === 0 && <div className="kt-card"><EmptyState art="jar" title="No savings goals yet" body="Set a goal — a freezer, school fees, your ajo — and add a little each day." action={<button className="kt-btn kt-btn-primary" onClick={() => setNewOpen(true)}>Create a goal</button>} /></div>}
        {state.goals.map(g => {
          const p = g.saved / g.target, done = p >= 1;
          return (
            <div key={g.id} className="kt-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Ring pct={p} size={84} stroke={10} grad><Icon name={done ? 'check' : g.icon} size={28} color={done ? 'var(--income)' : 'var(--savings)'} /></Ring>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>{g.name}</div>
                  <div className="num" style={{ fontSize: 24, fontWeight: 700 }}>{ktNaira(g.saved)}</div>
                  <div className="muted" style={{ fontSize: 14 }}>{done ? 'Goal reached!' : `${ktNaira(g.target - g.saved)} to go · ${Math.round(p * 100)}%`}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, margin: '16px 0 14px' }} aria-label="Milestones">
                {[.25, .5, .75, 1].map(m => <div key={m} style={{ flex: 1 }}><div style={{ height: 8, borderRadius: 8, background: p >= m ? 'linear-gradient(90deg,#B7E35A,#2563EB)' : 'var(--savings-bg)' }} /><div style={{ fontSize: 12, fontWeight: 600, color: p >= m ? 'var(--savings)' : 'var(--ink-4)', marginTop: 4 }}>{m * 100}%</div></div>)}
              </div>
              {!done && <button className="kt-btn kt-btn-ghost" style={{ width: '100%' }} onClick={() => { setAddFor(g); setAmt(''); }}><Icon name="add" size={18} />Add money</button>}
            </div>);
        })}
      </div>
      <Sheet open={!!addFor} onClose={() => setAddFor(null)} title="Add money" maxWidth={460}>
        {addFor && <>
          <SheetHeader title={`Add to ${addFor.name}`} onClose={() => setAddFor(null)} />
          <div style={{ padding: '0 20px 24px', display: 'grid', gap: 14 }}>
            <div className="num" style={{ fontSize: 44, fontWeight: 700, color: amt ? 'var(--savings)' : 'var(--ink-4)', textAlign: 'center' }}>₦{amt ? (+amt).toLocaleString('en-NG') : '0'}</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>{[1000, 2000, 5000, 10000].map(q => <button key={q} className="kt-chip" onClick={() => setAmt(String(q))}>{ktNaira(q)}</button>)}</div>
            <Keypad value={amt} onChange={setAmt} />
            <button className="kt-btn kt-btn-primary" disabled={!+amt} style={{ opacity: +amt ? 1 : .4 }} onClick={() => { addToGoal(addFor.id, +amt); setAddFor(null); }}><Icon name="savings" size={20} />Save {amt ? ktNaira(+amt) : ''}</button>
          </div></>}
      </Sheet>
      <Sheet open={newOpen} onClose={() => setNewOpen(false)} title="New goal" maxWidth={460}>
        <SheetHeader title="New savings goal" onClose={() => setNewOpen(false)} />
        <div style={{ padding: '0 20px 24px', display: 'grid', gap: 14 }}>
          <Field id="ng-n" label="What are you saving for?"><input id="ng-n" className="kt-input" value={ng.name} onChange={e => setNg({ ...ng, name: e.target.value })} placeholder="New freezer" /></Field>
          <Field id="ng-t" label="Target amount (₦)"><input id="ng-t" className="kt-input num" inputMode="numeric" value={ng.target} onChange={e => setNg({ ...ng, target: e.target.value.replace(/\D/g, '') })} placeholder="200000" /></Field>
          <button className="kt-btn kt-btn-primary" disabled={!ng.name || !+ng.target} style={{ opacity: ng.name && +ng.target ? 1 : .4 }} onClick={() => { addGoal({ name: ng.name, target: +ng.target }); setNg({ name: '', target: '' }); setNewOpen(false); }}>Create goal</button>
        </div>
      </Sheet>
    </div>
  );
}

// ---------- Credit tracker ----------
function CreditScreen({ wide, onBack, onAdd }) {
  const { state, markPaid, t } = useKT();
  const [tab, setTab] = React.useState('owes');
  const open = state.credits.filter(c => !c.paid), paid = state.credits.filter(c => c.paid);
  const list = tab === 'owes' ? open : paid;
  const total = open.reduce((a, b) => a + b.amount, 0);
  const overdue = (c) => c.due && new Date(c.due) < new Date();
  return (
    <div style={{ padding: wide ? 0 : '0 16px' }}>
      <PageHead wide={wide} onBack={onBack} title="Credit tracker" right={<button className="kt-btn kt-btn-primary" style={{ minHeight: 48 }} onClick={() => onAdd({ type: 'credit' })}><Icon name="add" size={18} />{wide ? 'Add credit' : 'Add'}</button>} />
      <div style={{ position: 'relative', display: 'grid', gap: 14 }}>
        <div style={{ borderRadius: 28, padding: 20, background: '#16120E', color: '#fff' }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#F6B45A' }}>Total outstanding</div>
          <CountUp value={total} style={{ fontSize: 40, fontWeight: 700, display: 'block' }} />
          <div style={{ opacity: .7, fontSize: 14 }}>{open.length} customers · {open.filter(overdue).length} overdue</div>
        </div>
        <Segmented full label="Credit view" value={tab} onChange={setTab} options={[{ id: 'owes', label: `Who owes me (${open.length})` }, { id: 'paid', label: `Paid (${paid.length})` }]} />
        {list.length === 0 ? <div className="kt-card"><EmptyState title={tab === 'owes' ? t('nobody_owes') : 'No paid credits yet'} body={tab === 'owes' ? 'When a customer takes goods and pays later, record it here.' : ''} /></div> : (
          <div style={{ display: 'grid', gridTemplateColumns: wide ? 'repeat(auto-fill,minmax(320px,1fr))' : '1fr', gap: 10 }} className="kt-stagger">
            {list.map(c => (
              <div key={c.id} className="kt-card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--credit-bg)', color: 'var(--credit)', display: 'grid', placeItems: 'center', fontWeight: 700 }}>{c.customer.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{c.customer}</div>
                    <div className="muted" style={{ fontSize: 13.5 }}>{c.goods}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="num" style={{ fontWeight: 700, fontSize: 18, color: c.paid ? 'var(--income)' : 'var(--credit)' }}>{ktNaira(c.amount)}</div>
                    {c.paid ? <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--income)' }}>✓ Paid</div> : c.due && <div style={{ fontSize: 12.5, fontWeight: 600, color: overdue(c) ? 'var(--expense)' : 'var(--ink-3)' }}>{overdue(c) ? '! Overdue' : 'Due ' + new Date(c.due).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</div>}
                  </div>
                </div>
                {!c.paid && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
                  {c.phone ? <a className="kt-btn kt-btn-ghost" style={{ minHeight: 48, fontSize: 15, textDecoration: 'none' }} target="_blank" rel="noopener" href={`https://wa.me/234${c.phone.replace(/^0/, '')}?text=${encodeURIComponent(`Hello ${c.customer}, this is a friendly reminder from ${state.profile.business} about ${ktNaira(c.amount)} for ${c.goods}. Thank you!`)}`}><Icon name="whatsapp" size={18} />Remind</a>
                    : <button className="kt-btn kt-btn-ghost" style={{ minHeight: 48, fontSize: 14 }} disabled title="Add phone number to send reminder"><Icon name="phone" size={18} />Add phone</button>}
                  <button className="kt-btn kt-btn-primary" style={{ minHeight: 48, fontSize: 15 }} onClick={() => markPaid(c.id)}><Icon name="check" size={18} />Mark paid</button>
                </div>}
              </div>))}
          </div>)}
      </div>
    </div>
  );
}

// ---------- Stock ----------
function StockScreen({ wide, onBack }) {
  const { state } = useKT();
  const value = state.stock.reduce((a, b) => a + b.qty * b.cost, 0);
  const status = (s) => s.qty === 0 ? ['Finished', 'var(--expense)', 'var(--expense-bg)'] : s.qty <= s.alert ? ['Running low', 'var(--credit)', 'var(--credit-bg)'] : ['Plenty', 'var(--income)', 'var(--income-bg)'];
  return (
    <div style={{ padding: wide ? 0 : '0 16px' }}>
      <PageHead wide={wide} onBack={onBack} title="My stock" sub={`Total stock value ${ktNaira(value)}`} />
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: wide ? 'repeat(auto-fill,minmax(280px,1fr))' : '1fr', gap: 10 }} className="kt-stagger">
        {state.stock.map(s => { const [l, fg, bg] = status(s); return (
          <div key={s.id} className="kt-card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--card-2)', display: 'grid', placeItems: 'center' }}><Icon name="box" size={24} /></span>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600 }}>{s.name}</div><div className="muted" style={{ fontSize: 13.5 }}>Sell {ktNaira(s.price)} · Cost {ktNaira(s.cost)}</div></div>
            <div style={{ textAlign: 'right' }}><div className="num" style={{ fontWeight: 700, fontSize: 20 }}>{s.qty}</div><span style={{ fontSize: 12, fontWeight: 700, color: fg, background: bg, padding: '3px 8px', borderRadius: 999 }}>{l}</span></div>
          </div>); })}
      </div>
    </div>
  );
}

// ---------- AI helper (uses the existing chat backend in production; demo uses built-in model) ----------
function AIScreen({ wide, onBack }) {
  const { state } = useKT();
  const [msgs, setMsgs] = React.useState([{ r: 'ai', text: `Hi ${state.profile.name.split(' ')[0]}! Ask me anything about your business, sales, credit, or how to use KudiTrack.` }]);
  const [q, setQ] = React.useState(''); const [busy, setBusy] = React.useState(false);
  const ask = async (text) => {
    if (!text.trim() || busy) return; setMsgs(m => [...m, { r: 'me', text }]); setQ(''); setBusy(true);
    const tw = ktTotals(state.tx, 'week'); const owe = state.credits.filter(c => !c.paid);
    const ctx = `You are KudiTrack AI, a warm, simple-English bookkeeping helper for a Nigerian market trader (${state.profile.business}). Data this week: sales ${ktNaira(tw.sales)}, expenses ${ktNaira(tw.exp)}, profit ${ktNaira(tw.profit)}. Customers owing: ${owe.map(c => c.customer + ' ' + ktNaira(c.amount)).join(', ') || 'none'}. Low stock: ${state.stock.filter(s => s.qty <= s.alert).map(s => s.name).join(', ') || 'none'}. Answer in 2-3 short sentences, use ₦.`;
    let ans;
    try { ans = await (window.genspark || window.claude).complete({ messages: [{ role: 'user', content: ctx + '\n\nQuestion: ' + text }] }); }
    catch (e) { ans = 'Sorry, something went wrong. Try again.'; }
    setMsgs(m => [...m, { r: 'ai', text: ans }]); setBusy(false);
  };
  const sugg = ['How is my business doing?', 'Who owes me the most?', 'How can I make more profit?', 'Should I restock my goods?'];
  return (
    <div style={{ padding: wide ? 0 : '0 16px', display: 'flex', flexDirection: 'column', minHeight: wide ? 600 : 'calc(100vh - 140px)' }}>
      <PageHead wide={wide} onBack={onBack} title="KudiTrack AI" sub="Ask about your business" />
      <div style={{ position: 'relative', flex: 1, display: 'grid', gap: 10, alignContent: 'start', maxWidth: 720 }} aria-live="polite">
        {msgs.map((m, i) => <div key={i} style={{ justifySelf: m.r === 'me' ? 'end' : 'start', maxWidth: '85%', padding: '12px 16px', borderRadius: m.r === 'me' ? '22px 22px 6px 22px' : '22px 22px 22px 6px', background: m.r === 'me' ? 'var(--ink)' : 'var(--card)', color: m.r === 'me' ? 'var(--bg)' : 'var(--ink)', border: m.r === 'me' ? 0 : '1px solid var(--line)', animation: 'kt-rise .4s var(--ease-out) both', textWrap: 'pretty' }}>{m.text}</div>)}
        {busy && <div className="kt-card" style={{ justifySelf: 'start', padding: '14px 18px', borderRadius: 22, display: 'flex', gap: 5 }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ink-3)', animation: `kt-float 1s ${i * .15}s infinite` }} />)}</div>}
        {msgs.length === 1 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>{sugg.map(s => <button key={s} className="kt-chip" onClick={() => ask(s)}>{s}</button>)}</div>}
      </div>
      <form onSubmit={e => { e.preventDefault(); ask(q); }} style={{ position: 'sticky', bottom: wide ? 0 : 112, display: 'flex', gap: 8, marginTop: 14, maxWidth: 720, background: 'var(--bg)', padding: '8px 0' }}>
        <input className="kt-input" style={{ borderRadius: 999 }} aria-label="Message" placeholder="Type a message…" value={q} onChange={e => setQ(e.target.value)} />
        <button className="kt-iconbtn" style={{ width: 52, height: 52, background: 'var(--grad-hot)', border: 0 }} aria-label="Send"><Icon name="send" size={20} color="#fff" /></button>
      </form>
    </div>
  );
}

// ---------- Loan eligibility ----------
function LoanScreen({ wide, onBack }) {
  const { state } = useKT();
  const [score, setScore] = React.useState(null); const [calc, setCalc] = React.useState(false);
  const run = () => { setCalc(true); setScore(null); setTimeout(() => {
    const m = ktTotals(state.tx, 'month'); const days = new Set(state.tx.map(x => new Date(x.date).toDateString())).size;
    const rev = Math.min(30, m.sales / 1500000 * 30), cons = Math.min(30, days / 20 * 30), er = m.sales ? Math.max(0, 20 - (m.exp / m.sales) * 20) : 0;
    const cr = state.credits.length ? state.credits.filter(c => c.paid).length / state.credits.length * 20 : 10;
    setScore({ total: Math.round(rev + cons + er + cr), parts: [['Monthly revenue', rev, 30], ['Consistency', cons, 30], ['Expense ratio', er, 20], ['Credit history', cr, 20]] }); setCalc(false);
  }, 1200); };
  const verdict = score && (score.total >= 70 ? ['Likely eligible', 'var(--income)'] : score.total >= 45 ? ['Possibly eligible', 'var(--credit)'] : ['Not yet eligible', 'var(--expense)']);
  return (
    <div style={{ padding: wide ? 0 : '0 16px' }}>
      <PageHead wide={wide} onBack={onBack} title="Loan eligibility" sub="Based only on your KudiTrack records" />
      <div style={{ position: 'relative', display: 'grid', gap: 14, maxWidth: 720 }}>
        <div className="kt-card" style={{ padding: 22, textAlign: 'center' }}>
          {calc ? <div style={{ padding: 30 }}><Ring pct={.3} size={120} stroke={12} grad><span className="muted">…</span></Ring><p className="muted">Calculating your score…</p></div>
            : score ? <><Ring pct={score.total / 100} size={140} stroke={14} grad><div><div className="num" style={{ fontSize: 38, fontWeight: 700 }}>{score.total}</div><div className="muted" style={{ fontSize: 13 }}>/ 100</div></div></Ring>
              <div style={{ fontWeight: 700, fontSize: 18, color: verdict[1], marginTop: 10 }}>{verdict[0]}</div>
              <div style={{ display: 'grid', gap: 10, textAlign: 'left', marginTop: 18 }}>{score.parts.map(([l, v, mx]) => <div key={l}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600 }}><span>{l}</span><span className="num">{Math.round(v)}/{mx}</span></div><div style={{ height: 8, background: 'var(--savings-bg)', borderRadius: 8, marginTop: 4 }}><div style={{ height: '100%', width: `${v / mx * 100}%`, background: 'linear-gradient(90deg,#B7E35A,#2563EB)', borderRadius: 8 }} /></div></div>)}</div>
              <button className="kt-btn kt-btn-ghost" style={{ marginTop: 18 }} onClick={run}>Recalculate</button></>
              : <><div style={{ width: 160, margin: '0 auto' }}><ArtNotes /></div><p className="muted" style={{ maxWidth: 380, margin: '8px auto 16px' }}>See how likely you are to qualify for a business loan based on your KudiTrack records.</p><button className="kt-btn kt-btn-primary" onClick={run}>Check my eligibility</button></>}
        </div>
        <p className="muted" style={{ fontSize: 13, display: 'flex', gap: 8 }}><Icon name="help" size={16} />This score is an estimate based only on your KudiTrack records. It is not an official credit score. Visit a lender for a real assessment.</p>
        <h3 style={{ margin: '6px 4px 0', fontSize: 17 }}>Recommended lenders</h3>
        {[['OPay', '#00B140', 'Quick business loans through your OPay account.'], ['Moniepoint', '#0052CC', 'Working capital for small businesses with active transaction history.'], ['PalmPay', '#00A84F', 'Instant loans and financial services through PalmPay.']].map(([n, c, d]) => (
          <div key={n} className="kt-card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ width: 44, height: 44, borderRadius: 14, background: c, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14 }}>{n.slice(0, 2).toUpperCase()}</span>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{n}</div><div className="muted" style={{ fontSize: 13.5 }}>{d}</div></div>
          </div>))}
      </div>
    </div>
  );
}

// ---------- Invoices (existing feature; redesign kept minimal in P1) ----------
function InvoiceScreen({ wide, onBack }) {
  return (
    <div style={{ padding: wide ? 0 : '0 16px' }}>
      <PageHead wide={wide} onBack={onBack} title="Invoices" />
      <div className="kt-card" style={{ position: 'relative' }}><EmptyState title="No invoices yet" body="Create an invoice with items, tax and total, then share it on WhatsApp. Full invoice builder redesign is scheduled for Phase 2." action={<button className="kt-btn kt-btn-primary"><Icon name="invoice" size={18} />New invoice</button>} /></div>
    </div>
  );
}

// ---------- Notifications ----------
function NotificationsScreen({ wide, onBack }) {
  const { state } = useKT();
  const items = [
    ...state.credits.filter(c => !c.paid && c.due && new Date(c.due) < new Date()).map(c => ({ ic: 'credit', c: 'var(--credit)', t: 'Payment due', b: `${c.customer} owes ${ktNaira(c.amount)} for ${c.goods}.` })),
    ...state.stock.filter(s => s.qty <= s.alert).map(s => ({ ic: 'box', c: 'var(--expense)', t: 'Low stock', b: `${s.name}: ${s.qty ? s.qty + ' left' : 'finished'}.` })),
    { ic: 'bell', c: 'var(--brand-500)', t: 'Daily reminder', b: "Don't forget to record today's sales before you close shop!" },
  ];
  return (
    <div style={{ padding: wide ? 0 : '0 16px' }}>
      <PageHead wide={wide} onBack={onBack} title="Notifications" />
      <div style={{ position: 'relative', display: 'grid', gap: 10, maxWidth: 720 }} className="kt-stagger">
        {items.map((n, i) => <div key={i} className="kt-card" style={{ padding: 16, display: 'flex', gap: 12 }}><span style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--card-2)', color: n.c, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={n.ic} size={22} /></span><div><div style={{ fontWeight: 600 }}>{n.t}</div><div className="muted" style={{ fontSize: 14.5 }}>{n.b}</div></div></div>)}
      </div>
    </div>
  );
}

// ---------- Settings ----------
function SettingsScreen({ wide, go, onReplayOnboarding }) {
  const { state, setPref, t, reset, setProfile } = useKT();
  const [editOpen, setEditOpen] = React.useState(false);
  const [p, setP] = React.useState(state.profile);
  const Row = ({ icon, label, value, onClick, right, danger }) => (
    <button onClick={onClick} style={{ width: '100%', minHeight: 60, border: 0, background: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: '8px 16px', cursor: onClick ? 'pointer' : 'default', textAlign: 'left', color: danger ? 'var(--expense)' : 'var(--ink)' }}>
      <span style={{ width: 40, height: 40, borderRadius: 14, background: danger ? 'var(--expense-bg)' : 'var(--card-2)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={icon} size={20} /></span>
      <span style={{ flex: 1, fontWeight: 600 }}>{label}</span>
      {value && <span className="muted" style={{ fontSize: 14.5 }}>{value}</span>}
      {right || (onClick && <Icon name="chevRight" size={18} color="var(--ink-3)" />)}
    </button>
  );
  const Group = ({ title, children }) => <div><div className="kt-label" style={{ margin: '0 0 8px 8px' }}>{title}</div><div className="kt-card" style={{ padding: '6px 0', borderRadius: 26 }}>{children}</div></div>;
  const Toggle = ({ on, onChange, label }) => <button role="switch" aria-checked={on} aria-label={label} onClick={(e) => { e.stopPropagation(); onChange(!on); }} style={{ width: 52, height: 32, borderRadius: 999, border: 0, background: on ? 'var(--income)' : 'var(--line-2)', position: 'relative', cursor: 'pointer', flex: 'none', transition: 'background .2s' }}><span style={{ position: 'absolute', top: 3, left: 3, width: 26, height: 26, borderRadius: '50%', background: '#fff', transform: on ? 'translateX(20px)' : 'none', transition: 'transform .3s var(--ease-spring)', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} /></button>;
  return (
    <div style={{ padding: wide ? 0 : '0 16px' }}>
      <PageHead wide={wide} title={t('nav_settings')} />
      <div style={{ position: 'relative', display: 'grid', gap: 18, gridTemplateColumns: wide ? '1fr 1fr' : '1fr', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 18 }}>
          <div className="kt-card" style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'center', background: 'var(--grad-soft)' }}>
            <span style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#FFB06B,#E0442A)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 22 }}>{state.profile.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 18 }}>{state.profile.name}</div><div className="muted" style={{ fontSize: 14 }}>{state.profile.business} · {state.profile.market}</div></div>
            <button className="kt-iconbtn" aria-label="Edit profile" onClick={() => { setP(state.profile); setEditOpen(true); }}><Icon name="edit" size={18} /></button>
          </div>
          <Group title={t('language')}>
            <div style={{ padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {window.KT_LANGS.map(l => <button key={l.id} className="kt-chip" aria-pressed={state.prefs.lang === l.id} onClick={() => setPref('lang', l.id)} style={{ minHeight: 48 }}>{l.native}{l.pending && <span style={{ fontSize: 11, opacity: .6 }}>soon</span>}</button>)}
            </div>
          </Group>
          <Group title={t('appearance')}>
            <div style={{ padding: '10px 14px' }}><Segmented full label="Theme" value={state.prefs.theme} onChange={v => setPref('theme', v)} options={[{ id: 'light', label: t('light'), icon: 'sun' }, { id: 'dark', label: t('dark'), icon: 'moon' }]} /></div>
          </Group>
          <Group title="Business tools">
            <Row icon="savings" label={t('savings')} onClick={() => go('savings')} />
            <Row icon="credit" label="Credit tracker" onClick={() => go('credit')} />
            <Row icon="box" label="My stock" onClick={() => go('stock')} />
            <Row icon="invoice" label="Invoices" onClick={() => go('invoice')} />
            <Row icon="loan" label="Loan eligibility" onClick={() => go('loan')} />
            <Row icon="bank" label="Sync bank account" value="Coming soon" />
          </Group>
        </div>
        <div style={{ display: 'grid', gap: 18 }}>
          <Group title="Notifications">
            <Row icon="bell" label="Daily sales reminder" right={<Toggle label="Daily sales reminder" on={state.prefs.dailyReminder} onChange={v => setPref('dailyReminder', v)} />} />
            <Row icon="credit" label="Payment reminders" right={<Toggle label="Payment reminders" on={state.prefs.paymentReminders} onChange={v => setPref('paymentReminders', v)} />} />
            <Row icon="mic" label="Voice replies" right={<Toggle label="Voice replies" on={state.prefs.voiceOn} onChange={v => setPref('voiceOn', v)} />} />
          </Group>
          <Group title="Data & backup">
            <Row icon="cloud" label="Last synced" value="Just now" />
            <Row icon="naira" label="Currency" value="Naira (₦)" />
            <Row icon="download" label="Download my data" onClick={() => { const b = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'kuditrack-data.json'; a.click(); }} />
          </Group>
          <Group title="Help">
            <Row icon="play" label="Replay welcome tour" onClick={onReplayOnboarding} />
            <Row icon="phone" label="Install KudiTrack on your phone" onClick={() => {}} />
            <Row icon="help" label="Help & support" onClick={() => {}} />
            <Row icon="undo" label="Reset demo data" onClick={reset} />
            <Row icon="logout" label="Sign out" danger onClick={() => {}} />
          </Group>
          <div className="muted" style={{ textAlign: 'center', fontSize: 13 }}>KudiTrack AI · redesign preview</div>
        </div>
      </div>
      <Sheet open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile" maxWidth={480}>
        <SheetHeader title="Edit profile" onClose={() => setEditOpen(false)} />
        <div style={{ padding: '0 20px 24px', display: 'grid', gap: 12 }}>
          {[['name', 'Full name'], ['business', 'Business name'], ['type', 'What do you sell?'], ['market', 'Market location'], ['phone', 'Phone number']].map(([k, l]) => <Field key={k} id={'pf-' + k} label={l}><input id={'pf-' + k} className="kt-input" value={p[k]} onChange={e => setP({ ...p, [k]: e.target.value })} /></Field>)}
          <button className="kt-btn kt-btn-primary" onClick={() => { setProfile(p); setEditOpen(false); }}>{t('save')}</button>
        </div>
      </Sheet>
    </div>
  );
}

Object.assign(window, { PageHead, ReportsScreen, SavingsScreen, CreditScreen, StockScreen, AIScreen, LoanScreen, InvoiceScreen, NotificationsScreen, SettingsScreen });
