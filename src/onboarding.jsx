// Onboarding: 3 slides → language → business type → first voice demo.
function Onboarding({ onDone }) {
  const { t, state, setPref, setProfile } = useKT();
  const [step, setStep] = React.useState(0);
  const [biz, setBiz] = React.useState(state.profile.type);
  const [demo, setDemo] = React.useState('idle');
  const slides = [
    { art: <ArtMic />, title: 'Just talk. We write it down.', body: 'Say "I sell 2 bags of rice 136k" and KudiTrack records it for you.' },
    { art: <ArtStall />, title: 'See your profit every day', body: 'Sales minus expenses, in big clear numbers. Know if today was a good day.' },
    { art: <ArtJar />, title: 'Track credit and savings', body: 'Remember who owes you, send WhatsApp reminders, and grow your savings.' },
  ];
  const total = 6;
  const next = () => step < total - 1 ? setStep(step + 1) : (setPref('onboarded', true), onDone());
  const bizTypes = [['Foodstuff & provisions', 'bowl'], ['Fabric & fashion', 'fabric'], ['Drinks & snacks', 'drink'], ['Phones & recharge', 'phone'], ['Services', 'shop'], ['Something else', 'dots']];
  const runDemo = () => { setDemo('listening'); setTimeout(() => setDemo('done'), 2200); };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }} role="dialog" aria-label="Welcome to KudiTrack">
      <div style={{ position: 'absolute', inset: '0 0 45%', background: 'var(--grad-header)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(16px + env(safe-area-inset-top)) 20px 0', maxWidth: 520, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}><KTLogo size={34} />KudiTrack AI</div>
        <button onClick={() => { setPref('onboarded', true); onDone(); }} style={{ minHeight: 44, padding: '0 14px', border: 0, background: 'var(--glass)', borderRadius: 999, fontWeight: 600, cursor: 'pointer' }}>Skip</button>
      </div>
      <div key={step} style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px', maxWidth: 520, width: '100%', margin: '0 auto', overflow: 'auto' }} className="kt-stagger">
        {step < 3 && <>
          <div style={{ width: 'min(260px,70%)', margin: '20px auto 10px', animation: 'kt-float 5s ease-in-out infinite' }}>{slides[step].art}</div>
          <h1 className="h" style={{ fontSize: 30, textAlign: 'center', margin: '18px 0 8px' }}>{slides[step].title}</h1>
          <p className="muted" style={{ textAlign: 'center', fontSize: 17, maxWidth: 360, margin: '0 auto', textWrap: 'pretty' }}>{slides[step].body}</p>
        </>}
        {step === 3 && <>
          <h1 className="h" style={{ fontSize: 28, margin: '20px 0 6px' }}>Which language do you prefer?</h1>
          <p className="muted" style={{ margin: '0 0 18px' }}>You can change this later in Settings.</p>
          <div role="radiogroup" style={{ display: 'grid', gap: 10 }}>
            {window.KT_LANGS.map(l => { const sel = state.prefs.lang === l.id; return (
              <button key={l.id} role="radio" aria-checked={sel} onClick={() => setPref('lang', l.id)} className="kt-card" style={{ minHeight: 64, padding: '0 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left', boxShadow: sel ? 'inset 0 0 0 2px var(--brand-500)' : 'var(--sh-1)', background: sel ? 'var(--grad-soft)' : 'var(--card)' }}>
                <Icon name="globe" size={22} active={sel} /><span style={{ flex: 1, fontWeight: 600, fontSize: 17 }}>{l.native}</span>{l.native !== l.label && <span className="muted">{l.label}</span>}{l.pending && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--credit)', background: 'var(--credit-bg)', padding: '3px 8px', borderRadius: 999 }}>Soon</span>}
              </button>); })}
          </div>
        </>}
        {step === 4 && <>
          <h1 className="h" style={{ fontSize: 28, margin: '20px 0 6px' }}>What do you sell?</h1>
          <p className="muted" style={{ margin: '0 0 18px' }}>We'll set up categories that fit your business.</p>
          <div role="radiogroup" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {bizTypes.map(([b, ic]) => { const sel = biz === b; return (
              <button key={b} role="radio" aria-checked={sel} onClick={() => setBiz(b)} className="kt-card" style={{ minHeight: 100, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left', boxShadow: sel ? 'inset 0 0 0 2px var(--brand-500)' : 'var(--sh-1)', background: sel ? 'var(--grad-soft)' : 'var(--card)' }}>
                <Icon name={ic} size={28} active={sel} /><span style={{ fontWeight: 600, fontSize: 15.5 }}>{b}</span>
              </button>); })}
          </div>
        </>}
        {step === 5 && <div style={{ textAlign: 'center' }}>
          <h1 className="h" style={{ fontSize: 28, margin: '20px 0 6px' }}>Try your first voice record</h1>
          <p className="muted" style={{ margin: '0 0 8px' }}>Tap the mic and say:</p>
          <p style={{ fontSize: 22, fontWeight: 600, margin: '0 0 20px' }}>“Sold 3 cartons of Indomie 27,600”</p>
          {demo !== 'done' ? <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto', display: 'grid', placeItems: 'center' }}>
            {demo === 'listening' && [0, 1].map(i => <span key={i} style={{ position: 'absolute', inset: 10, borderRadius: '50%', background: 'rgba(246,115,0,.35)', animation: `kt-pulse 1.6s ${i * .8}s infinite` }} />)}
            <button onClick={runDemo} aria-label="Try voice demo" style={{ position: 'relative', width: 120, height: 120, borderRadius: '50%', border: 0, background: 'var(--grad-hot)', boxShadow: 'var(--sh-hot)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="mic" size={48} color="#fff" /></button>
          </div> : <div className="kt-card" style={{ padding: 18, textAlign: 'left', animation: 'kt-pop .5s var(--ease-spring) both' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><TypeBadge type="sale" category="provisions" /><div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>Indomie (carton) ×3</div><div className="muted" style={{ fontSize: 14 }}>Provisions · just now</div></div><AmountText type="sale" amount={27600} size={20} /></div>
            <div style={{ marginTop: 12, color: 'var(--income)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={18} />That's it! This is how every record works.</div>
          </div>}
          {demo === 'listening' && <div style={{ marginTop: 14 }}><Waveform active height={40} /></div>}
        </div>}
      </div>
      <div style={{ position: 'relative', padding: '12px 24px calc(20px + env(safe-area-inset-bottom))', maxWidth: 520, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }} aria-label={`Step ${step + 1} of ${total}`}>
          {Array.from({ length: total }).map((_, i) => <span key={i} style={{ height: 6, width: i === step ? 28 : 6, borderRadius: 6, background: i <= step ? 'var(--ink)' : 'var(--line-2)', transition: 'width .4s var(--ease-spring)' }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: step ? '1fr 2fr' : '1fr', gap: 10 }}>
          {step > 0 && <button className="kt-btn kt-btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}
          <button className="kt-btn kt-btn-primary" onClick={() => { if (step === 4) setProfile({ type: biz }); next(); }}>{step === 0 ? "Let's get started" : step === total - 1 ? 'Finish setup' : 'Continue'}<Icon name="arrowRight" size={18} /></button>
        </div>
      </div>
    </div>
  );
}
window.Onboarding = Onboarding;
