// Desktop/tablet marketing site. No fake testimonials, user counts or awards.

function HeroDemo() {
  // Live, looping demo of voice entry: transcript types → parsed card → saved
  const lines = [
    { said: 'I sell 2 bag of rice give Iya Bisi 136k', type: 'sale', item: 'Bags of rice ×2', cat: 'grains', amt: 136000, who: 'Iya Bisi' },
    { said: 'Spent 1,500 on keke to Mile 12', type: 'expense', item: 'Keke to Mile 12', cat: 'transport', amt: 1500, who: '' },
    { said: 'Sold 3 cartons of Indomie 27,600', type: 'sale', item: 'Indomie (carton) ×3', cat: 'provisions', amt: 27600, who: '' },
  ];
  const [i, setI] = React.useState(0); const [n, setN] = React.useState(0); const [phase, setPhase] = React.useState('type');
  React.useEffect(() => {
    const L = lines[i].said.split(' ');
    if (phase === 'type') { if (n < L.length) { const id = setTimeout(() => setN(n + 1), 150); return () => clearTimeout(id); } const id = setTimeout(() => setPhase('card'), 500); return () => clearTimeout(id); }
    if (phase === 'card') { const id = setTimeout(() => setPhase('saved'), 1600); return () => clearTimeout(id); }
    if (phase === 'saved') { const id = setTimeout(() => { setI((i + 1) % lines.length); setN(0); setPhase('type'); }, 1400); return () => clearTimeout(id); }
  }, [i, n, phase]);
  const l = lines[i];
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 440, margin: '0 auto' }}>
      <div className="kt-card" style={{ borderRadius: 36, padding: 22, background: 'var(--glass)', backdropFilter: 'blur(18px)', boxShadow: 'var(--sh-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ position: 'relative', width: 52, height: 52, display: 'grid', placeItems: 'center' }}>
            {phase === 'type' && <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(246,115,0,.35)', animation: 'kt-pulse 1.4s infinite' }} />}
            <span style={{ position: 'relative', width: 52, height: 52, borderRadius: '50%', background: 'var(--grad-hot)', display: 'grid', placeItems: 'center' }}><Icon name="mic" size={24} color="#fff" /></span>
          </span>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{phase === 'type' ? 'Listening…' : 'Got it'}</div><div className="muted" style={{ fontSize: 13.5 }}>English · Pidgin</div></div>
          <Waveform active={phase === 'type'} bars={14} height={30} />
        </div>
        <p style={{ fontSize: 21, fontWeight: 500, lineHeight: 1.35, minHeight: 58, margin: '16px 0' }}>“{l.said.split(' ').slice(0, n).join(' ')}<span style={{ opacity: phase === 'type' ? 1 : 0 }}>|</span>”</p>
        <div style={{ opacity: phase === 'type' ? 0 : 1, transform: phase === 'type' ? 'translateY(10px)' : 'none', transition: 'all .45s var(--ease-spring)', background: 'var(--card)', borderRadius: 24, padding: 14, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--line)' }}>
          <TypeBadge type={l.type} category={l.cat} />
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600 }}>{l.item}</div><div className="muted" style={{ fontSize: 13.5 }}>{ktCat(l.cat).label}{l.who ? ' · ' + l.who : ''}</div></div>
          <AmountText type={l.type} amount={l.amt} size={19} />
        </div>
        <div style={{ height: 52, marginTop: 12, borderRadius: 999, background: phase === 'saved' ? 'var(--income)' : 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600, transition: 'background .3s', opacity: phase === 'type' ? .3 : 1 }}>
          <Icon name="check" size={20} color="#fff" />{phase === 'saved' ? 'Saved' : 'Save'}
        </div>
      </div>
      {/* floating cards */}
      <div className="kt-card kt-float-a" style={{ position: 'absolute', left: '-18%', top: '62%', padding: '12px 16px', borderRadius: 22, display: 'flex', gap: 10, alignItems: 'center', animation: 'kt-float 6s ease-in-out infinite' }}>
        <span style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--income-bg)', color: 'var(--income)', display: 'grid', placeItems: 'center' }}><Icon name="arrowUp" size={18} stroke={2.6} /></span>
        <div><div className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>Today's profit</div><div className="num" style={{ fontWeight: 700, fontSize: 18 }}>₦192,900</div></div>
      </div>
      <div className="kt-card kt-float-b" style={{ position: 'absolute', right: '-14%', top: '-6%', padding: '12px 14px', borderRadius: 22, display: 'flex', gap: 10, alignItems: 'center', animation: 'kt-float 7s 1s ease-in-out infinite' }}>
        <Ring pct={.61} size={44} stroke={6} grad><span style={{ fontSize: 11, fontWeight: 700 }}>61%</span></Ring>
        <div><div className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>Freezer savings</div><div className="num" style={{ fontWeight: 700 }}>₦214,000</div></div>
      </div>
      <div style={{ position: 'absolute', right: '-8%', bottom: '-8%', padding: '10px 14px', borderRadius: 999, background: '#16120E', color: '#fff', display: 'flex', gap: 8, alignItems: 'center', fontWeight: 600, fontSize: 14, animation: 'kt-float 5.5s .5s ease-in-out infinite', boxShadow: 'var(--sh-2)' }}>
        <Icon name="whatsapp" size={18} color="#4ADE80" />Reminder sent to Mama Chidi
      </div>
    </div>
  );
}

function Landing({ toApp }) {
  const { state, setPref } = useKT();
  const [sy, setSy] = React.useState(0);
  React.useEffect(() => { const f = () => setSy(window.scrollY); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const par = (k) => reduce ? 'none' : `translateY(${sy * k}px)`;
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' }); };
  const W = { maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' };
  const features = [
    ['mic', 'Voice-first records', 'Say what you sold or spent in English or Pidgin. KudiTrack fills in the item, amount, category and customer.'],
    ['naira', 'Profit, every day', 'Big, clear numbers for sales, expenses and profit — today, this week, this month.'],
    ['credit', 'Credit tracker', 'Know who owes you. Send a polite WhatsApp reminder with one tap. Mark paid when they settle.'],
    ['box', 'Stock alerts', 'Track what you have and get told when goods are running low.'],
    ['savings', 'Savings goals', 'A freezer, school fees, your ajo — set a goal and watch the ring fill up.'],
    ['chart', 'Reports & statements', 'Weekly and monthly breakdowns, profit margin, and a statement you can share or save as PDF.'],
    ['sparkle', 'AI helper', 'Ask "How is my business doing?" and get a simple answer based on your own records.'],
    ['loan', 'Loan readiness', 'See how your records could help you qualify for a business loan from Nigerian lenders.'],
    ['cloudOff', 'Works offline', 'Record in the market with no network. Everything syncs when you are back online.'],
  ];
  return (
    <div data-screen-label="Website · Landing">
      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: sy > 10 ? 'var(--glass)' : 'transparent', backdropFilter: sy > 10 ? 'blur(16px)' : 'none', borderBottom: sy > 10 ? '1px solid var(--line)' : '1px solid transparent', transition: 'background .3s, border-color .3s' }}>
        <div style={{ ...W, display: 'flex', alignItems: 'center', gap: 20, height: 76 }}>
          <a href="#/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 19, color: 'var(--ink)', textDecoration: 'none' }}><KTLogo size={36} />KudiTrack <span style={{ color: 'var(--brand-500)', marginLeft: -6 }}>AI</span></a>
          <nav aria-label="Website" className="kt-sitenav" style={{ display: 'flex', gap: 4, marginLeft: 20 }}>
            {[['how', 'How it works'], ['features', 'Features'], ['who', 'Who it’s for'], ['pricing', 'Pricing']].map(([id, l]) => <button key={id} onClick={() => scrollTo(id)} style={{ minHeight: 44, padding: '0 14px', border: 0, background: 'none', fontWeight: 500, fontSize: 15.5, cursor: 'pointer', color: 'var(--ink-2)', borderRadius: 999 }}>{l}</button>)}
          </nav>
          <div style={{ flex: 1 }} />
          <button className="kt-iconbtn" aria-label="Toggle dark mode" onClick={() => setPref('theme', state.prefs.theme === 'dark' ? 'light' : 'dark')}><Icon name={state.prefs.theme === 'dark' ? 'sun' : 'moon'} size={20} /></button>
          <button className="kt-btn kt-btn-ghost kt-hide-sm" onClick={toApp} style={{ minHeight: 48 }}>Sign in</button>
          <button className="kt-btn kt-btn-primary" onClick={toApp} style={{ minHeight: 48 }}>Open the app <Icon name="arrowRight" size={18} /></button>
        </div>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', marginTop: -76, paddingTop: 76 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-header)', transform: par(0.15) }} />
        <div style={{ position: 'absolute', width: 520, height: 520, right: '-8%', top: '8%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(246,115,0,.22), transparent 65%)', transform: par(-0.08) }} />
        <div style={{ ...W, position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', gap: 'clamp(24px,5vw,80px)', alignItems: 'center', padding: 'clamp(40px,7vw,96px) clamp(20px,4vw,48px) clamp(60px,8vw,120px)' }} className="kt-hero">
          <div className="kt-stagger">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: 'var(--glass)', border: '1px solid var(--line)', fontWeight: 600, fontSize: 14 }}><Icon name="sparkle" size={16} active />Bookkeeping for Nigerian market traders</span>
            <h1 style={{ fontSize: 'clamp(40px,5.6vw,80px)', lineHeight: 1.0, letterSpacing: '-.035em', fontWeight: 700, margin: '20px 0 18px', textWrap: 'balance' }}>
              Your business.<br />Your money.<br /><span style={{ background: 'var(--grad-hot)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Your control.</span>
            </h1>
            <p style={{ fontSize: 'clamp(17px,1.4vw,20px)', color: 'var(--ink-2)', maxWidth: 520, margin: '0 0 28px', textWrap: 'pretty' }}>Just talk. KudiTrack AI turns “I sell 2 bag of rice 136k” into a clean record — then shows your profit, who owes you, and how your savings are growing.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="kt-btn kt-btn-hot" onClick={toApp} style={{ minHeight: 58, padding: '0 28px', fontSize: 17 }}><Icon name="mic" size={22} color="#fff" />Try it free</button>
              <button className="kt-btn kt-btn-ghost" onClick={() => scrollTo('how')} style={{ minHeight: 58, padding: '0 24px', fontSize: 17 }}><Icon name="play" size={18} />See how it works</button>
            </div>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 28, fontSize: 14.5, fontWeight: 600, color: 'var(--ink-2)' }}>
              {[['globe', 'English & Pidgin'], ['cloudOff', 'Works offline'], ['phone', 'Light on data']].map(([i, l]) => <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name={i} size={18} color="var(--brand-600)" />{l}</span>)}
            </div>
          </div>
          <div style={{ transform: par(-0.06), padding: '30px 8% 40px' }}><HeroDemo /></div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" style={{ ...W, padding: 'clamp(56px,8vw,110px) clamp(20px,4vw,48px)' }}>
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <div style={{ fontWeight: 700, color: 'var(--brand-600)', fontSize: 14, letterSpacing: '.08em', textTransform: 'uppercase' }}>How it works</div>
          <h2 style={{ fontSize: 'clamp(32px,3.6vw,52px)', lineHeight: 1.05, letterSpacing: '-.025em', margin: '10px 0 0', fontWeight: 700, textWrap: 'balance' }}>Three steps. No exercise book.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>
          {[['01', 'Tap the mic', 'Press the big orange button — anywhere in the app.', <ArtMic />], ['02', 'Say it your way', '“Mama Chidi collect 2 carton Indomie on credit 18,400.” KudiTrack understands.', <ArtStall />], ['03', 'Check and save', 'See the item, amount and customer. Tap Save — or fix anything first.', <ArtNotes />]].map(([n, t, b, art]) => (
            <div key={n} className="kt-card" style={{ padding: 26, borderRadius: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}><span className="num" style={{ fontWeight: 700, fontSize: 15, padding: '6px 12px', borderRadius: 999, background: 'var(--card-2)' }}>{n}</span><div style={{ width: 120 }}>{art}</div></div>
              <h3 style={{ fontSize: 22, margin: '14px 0 6px', fontWeight: 600 }}>{t}</h3>
              <p className="muted" style={{ margin: 0, textWrap: 'pretty' }}>{b}</p>
            </div>))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: '#16120E', color: '#F5F1EC' }}>
        <div style={{ ...W, padding: 'clamp(56px,8vw,110px) clamp(20px,4vw,48px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap', marginBottom: 40 }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ fontWeight: 700, color: '#FFB06B', fontSize: 14, letterSpacing: '.08em', textTransform: 'uppercase' }}>Everything in one place</div>
              <h2 style={{ fontSize: 'clamp(32px,3.6vw,52px)', lineHeight: 1.05, letterSpacing: '-.025em', margin: '10px 0 0', fontWeight: 700, textWrap: 'balance' }}>Built for the market, not the office.</h2>
            </div>
            <p style={{ maxWidth: 380, opacity: .7, margin: 0 }}>Big buttons, simple words, icons with labels, and an Undo on every action — so nothing is ever lost by mistake.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
            {features.map(([i, t, b]) => (
              <div key={t} style={{ padding: 24, borderRadius: 28, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)' }}>
                <span style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(246,115,0,.16)', display: 'grid', placeItems: 'center' }}><Icon name={i} size={24} active /></span>
                <h3 style={{ fontSize: 19, margin: '16px 0 6px', fontWeight: 600 }}>{t}</h3>
                <p style={{ margin: 0, opacity: .68, fontSize: 15.5, textWrap: 'pretty' }}>{b}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* WHO */}
      <section id="who" style={{ ...W, padding: 'clamp(56px,8vw,110px) clamp(20px,4vw,48px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(24px,4vw,64px)', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--brand-600)', fontSize: 14, letterSpacing: '.08em', textTransform: 'uppercase' }}>Who it’s for</div>
            <h2 style={{ fontSize: 'clamp(32px,3.6vw,52px)', lineHeight: 1.05, letterSpacing: '-.025em', margin: '10px 0 16px', fontWeight: 700, textWrap: 'balance' }}>Market women, traders and small shop owners.</h2>
            <p className="muted" style={{ fontSize: 18, maxWidth: 480, textWrap: 'pretty' }}>If you sell foodstuff at Mile 12, fabric at Balogun, provisions from a kiosk or recharge cards by the roadside — KudiTrack is made for how you already work.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[['bowl', 'Foodstuff & provisions'], ['fabric', 'Fabric & fashion'], ['drink', 'Drinks & snacks'], ['phone', 'Phones & recharge'], ['shop', 'Kiosks & small shops'], ['people', 'Wholesalers']].map(([i, l]) => (
              <div key={l} className="kt-card" style={{ padding: 20, borderRadius: 26, display: 'flex', flexDirection: 'column', gap: 18 }}><Icon name={i} size={30} active /><span style={{ fontWeight: 600, fontSize: 16.5 }}>{l}</span></div>))}
          </div>
        </div>
      </section>

      {/* PRICING / CTA */}
      <section id="pricing" style={{ ...W, padding: '0 clamp(20px,4vw,48px) clamp(56px,8vw,110px)' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 40, padding: 'clamp(32px,5vw,72px)', background: 'var(--grad-header)', border: '1px solid var(--line)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 32, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px,3.6vw,52px)', lineHeight: 1.05, letterSpacing: '-.025em', margin: '0 0 12px', fontWeight: 700 }}>Start free today.</h2>
              <p style={{ fontSize: 18, color: 'var(--ink-2)', maxWidth: 440 }}>Open KudiTrack in your phone browser and add it to your home screen. No download needed.</p>
              <p style={{ fontSize: 13.5, color: 'var(--credit)', fontWeight: 600 }}>[Client to confirm pricing plans before launch]</p>
            </div>
            <div className="kt-card" style={{ padding: 28, borderRadius: 32 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}><span className="num" style={{ fontSize: 48, fontWeight: 700 }}>₦0</span><span className="muted">to get started</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 22px', display: 'grid', gap: 10 }}>
                {['Unlimited voice records', 'Daily profit & reports', 'Credit tracker with WhatsApp reminders', 'Savings goals & stock alerts', 'English & Pidgin'].map(x => <li key={x} style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 500 }}><span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--income-bg)', color: 'var(--income)', display: 'grid', placeItems: 'center' }}><Icon name="check" size={14} stroke={3} /></span>{x}</li>)}
              </ul>
              <button className="kt-btn kt-btn-primary" style={{ width: '100%', minHeight: 56 }} onClick={toApp}>Open the app <Icon name="arrowRight" size={18} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--line)' }}>
        <div style={{ ...W, padding: '36px clamp(20px,4vw,48px)', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}><KTLogo size={30} />KudiTrack AI</div>
          <span className="muted" style={{ fontSize: 14 }}>AI-powered bookkeeping for Nigerian market women and small businesses.</span>
          <div style={{ flex: 1 }} />
          <nav aria-label="Footer" style={{ display: 'flex', gap: 18, fontSize: 14.5 }}>
            {[['how', 'How it works'], ['features', 'Features'], ['pricing', 'Pricing']].map(([id, l]) => <button key={id} onClick={() => scrollTo(id)} style={{ border: 0, background: 'none', cursor: 'pointer', color: 'var(--ink-2)', minHeight: 44 }}>{l}</button>)}
            <button onClick={toApp} style={{ border: 0, background: 'none', cursor: 'pointer', color: 'var(--ink-2)', minHeight: 44 }}>Sign in</button>
          </nav>
        </div>
        <div style={{ ...W, padding: '0 clamp(20px,4vw,48px) 30px', fontSize: 13, color: 'var(--ink-3)' }}>Voice is converted to text and is not stored as audio [client to confirm]. © {new Date().getFullYear()} KudiTrack AI.</div>
      </footer>
    </div>
  );
}
window.Landing = Landing;
