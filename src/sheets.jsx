// Voice entry + Add/Edit transaction + Add credit sheets.

const KT_SAMPLES = {
  en: ['Sold 5 bags of rice to Mama Chidi for 340,000', 'Spent 1,500 on keke to the market', 'Sold 3 cartons of Indomie 27,600', 'Paid market levy 500'],
  pid: ['I sell 2 bag of rice give Iya Bisi 136k', 'I spend 1500 for keke', 'Mama Chidi collect 2 carton Indomie on credit 18,400', 'I buy fuel 4500'],
};

// ---------- Voice sheet ----------
function VoiceSheet({ open, onClose, onEditParsed }) {
  const { t, lang, addTx, addCredit, state } = useKT();
  const [phase, setPhase] = React.useState('idle'); // idle | listening | confirm | saved | error | typing
  const [transcript, setTranscript] = React.useState('');
  const [parsed, setParsed] = React.useState(null);
  const [err, setErr] = React.useState('');
  const recRef = React.useRef(null);
  const typedRef = React.useRef(null);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  React.useEffect(() => { if (open) { setPhase('idle'); setTranscript(''); setParsed(null); setErr(''); } else { stop(); } }, [open]);

  const finish = (text) => { if (!text || !text.trim()) { setPhase('idle'); return; } setParsed(ktParseVoice(text)); setPhase('confirm'); };
  const stop = () => { try { recRef.current && recRef.current.stop(); } catch (e) {} recRef.current = null; };

  const start = () => {
    setTranscript(''); setErr('');
    if (!SR) { setErr(t('mic_unavailable')); setPhase('error'); return; }
    try {
      const r = new SR(); recRef.current = r;
      r.lang = 'en-NG'; r.interimResults = true; r.continuous = false; r.maxAlternatives = 1;
      let finalText = '';
      r.onresult = (e) => { let s = ''; for (let i = 0; i < e.results.length; i++) s += e.results[i][0].transcript; setTranscript(s); finalText = s; };
      r.onerror = (e) => { setErr(e.error === 'not-allowed' ? 'Microphone permission was blocked. Allow it in your browser, or try a sample below.' : t('mic_unavailable')); setPhase('error'); };
      r.onend = () => { recRef.current = null; setPhase(p => (p === 'listening' ? (finalText ? (finish(finalText), 'confirm') : 'idle') : p)); };
      r.start(); setPhase('listening');
    } catch (e) { setErr(t('mic_unavailable')); setPhase('error'); }
  };

  // Simulated capture for sample phrases (also used where the mic is blocked, e.g. this preview)
  const simulate = (text) => {
    setPhase('listening'); setTranscript('');
    const words = text.split(' '); let i = 0;
    const id = setInterval(() => { i++; setTranscript(words.slice(0, i).join(' ')); if (i >= words.length) { clearInterval(id); setTimeout(() => finish(text), 450); } }, 140);
  };

  const save = () => {
    const p = parsed; if (!p || !p.amount) return;
    if (p.type === 'credit') addCredit({ customer: p.customer || 'Customer', goods: p.item, amount: p.amount, phone: '' });
    else addTx({ type: p.type, item: p.item, qty: p.qty, amount: p.amount, category: p.category, customer: p.customer, note: 'Voice entry' });
    setPhase('saved'); setTimeout(onClose, 1300);
  };

  const listening = phase === 'listening';
  const samples = KT_SAMPLES[lang] || KT_SAMPLES.en;
  const typeLabel = parsed ? (parsed.type === 'expense' ? t('add_expense') : parsed.type === 'credit' ? t('credit_given') : t('record_sale')) : '';

  return (
    <Sheet open={open} onClose={onClose} title="Voice entry" maxWidth={520} desktopMode="center">
      <div style={{ position: 'relative', padding: '0 20px 24px', minHeight: 560, display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: '-40px 0 auto', height: 320, background: 'var(--grad-header)', opacity: .9, pointerEvents: 'none', borderRadius: 32 }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: 'var(--glass)', fontWeight: 600, fontSize: 14, border: '1px solid var(--line)' }}>
            <Icon name="sparkle" size={16} active /> KudiTrack AI
          </span>
          <button className="kt-iconbtn" onClick={onClose} aria-label="Close"><Icon name="close" size={20} /></button>
        </div>

        {phase === 'saved' ? (
          <div style={{ position: 'relative', flex: 1, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
            <div><SuccessBurst size={96} /><div className="sub" style={{ marginTop: 22 }}>{t('saved')}!</div>
              <div className="muted">{parsed && `${parsed.item} · ${ktNaira(parsed.amount)}`}</div></div>
          </div>
        ) : phase === 'confirm' && parsed ? (
          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 20 }} className="kt-stagger">
            <div className="muted" style={{ fontSize: 14, fontWeight: 600 }}>{t('heard')}</div>
            <p style={{ margin: '4px 0 18px', fontSize: 20, lineHeight: 1.35, fontWeight: 500 }}>“{parsed.transcript}”</p>
            <div className="kt-card" style={{ padding: 18, borderRadius: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <TypeBadge type={parsed.type} category={parsed.category} size={52} />
                <div style={{ flex: 1 }}>
                  <div className="muted" style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{typeLabel}</div>
                  <div style={{ fontWeight: 600, fontSize: 18 }}>{parsed.item}{parsed.qty > 1 ? ` ×${parsed.qty}` : ''}</div>
                </div>
              </div>
              <div className="num" style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-.02em', margin: '14px 0 10px', color: parsed.type === 'expense' ? 'var(--expense)' : parsed.type === 'credit' ? 'var(--credit)' : 'var(--income)' }}>
                {parsed.type === 'expense' ? '−' : '+'}{ktNaira(parsed.amount)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[[t('category'), (lang === 'pid' && ktCat(parsed.category).pid) || ktCat(parsed.category).label], [t('customer'), parsed.customer || '—'], [t('quantity'), parsed.qty], [t('date'), t('today') + ', ' + ktTime(new Date().toISOString())]].map(([k, v]) => (
                  <div key={k} style={{ background: 'var(--card-2)', borderRadius: 16, padding: '10px 12px' }}>
                    <div className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>{k}</div>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</div>
                  </div>
                ))}
              </div>
              {!parsed.amount && <div style={{ marginTop: 12, color: 'var(--expense)', fontWeight: 600, fontSize: 14 }}>I didn't catch the amount. Tap Edit to add it.</div>}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 10, marginTop: 18 }}>
              <button className="kt-btn kt-btn-ghost" onClick={() => { onEditParsed(parsed); }}><Icon name="edit" size={18} />{t('edit')}</button>
              <button className="kt-btn kt-btn-primary" onClick={save} disabled={!parsed.amount} style={{ opacity: parsed.amount ? 1 : .4 }}><Icon name="check" size={20} />{t('save')}</button>
            </div>
            <button onClick={() => setPhase('idle')} style={{ marginTop: 8, minHeight: 44, border: 0, background: 'none', color: 'var(--ink-3)', fontWeight: 600, cursor: 'pointer' }}>{t('try_again')}</button>
          </div>
        ) : phase === 'typing' ? (
          <form style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 24 }} onSubmit={(e) => { e.preventDefault(); finish(typedRef.current.value); }}>
            <label className="kt-label" htmlFor="kt-typed">{t('tap_to_speak')}</label>
            <textarea id="kt-typed" ref={typedRef} rows={3} className="kt-input" style={{ padding: 14, minHeight: 110, resize: 'none', fontSize: 18 }} placeholder={samples[0]} autoFocus />
            <div style={{ flex: 1 }} />
            <button className="kt-btn kt-btn-primary" type="submit" style={{ marginTop: 16 }}>Continue <Icon name="arrowRight" size={18} /></button>
          </form>
        ) : (
          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 22 }}>
            <h2 className="h" style={{ maxWidth: 320 }}>{listening ? t('listening') : 'What do you want to record?'}</h2>
            <p className="muted" style={{ margin: '6px 0 0', minHeight: 24 }}>{listening ? '' : t('tap_to_speak')}</p>
            <div style={{ minHeight: 76, margin: '14px 0 4px', fontSize: 20, fontWeight: 500, lineHeight: 1.35, maxWidth: 380, color: transcript ? 'var(--ink)' : 'var(--ink-4)' }} aria-live="polite">
              {transcript || (listening ? '…' : '')}
            </div>
            <Waveform active={listening} level={listening ? .7 : 0} height={64} />
            <div style={{ position: 'relative', margin: '22px 0 10px', width: 132, height: 132, display: 'grid', placeItems: 'center' }}>
              {listening && [0, 1].map(i => <span key={i} style={{ position: 'absolute', inset: 6, borderRadius: '50%', background: 'rgba(246,115,0,.35)', animation: `kt-pulse 1.6s ${i * .8}s infinite var(--ease-out)` }} />)}
              <button onClick={listening ? () => { stop(); } : start} aria-label={listening ? 'Stop listening' : 'Start voice entry'} aria-pressed={listening}
                style={{ position: 'relative', width: 120, height: 120, borderRadius: '50%', border: 0, background: 'var(--grad-hot)', boxShadow: '0 18px 40px rgba(246,115,0,.45), inset 0 2px 0 rgba(255,255,255,.35)', cursor: 'pointer', display: 'grid', placeItems: 'center', transform: listening ? 'scale(1.04)' : 'none', transition: 'transform .3s var(--ease-spring)' }}>
                <Icon name={listening ? 'stop' : 'mic'} size={48} color="#fff" stroke={2.2} />
              </button>
            </div>
            {phase === 'error' && <div role="alert" style={{ background: 'var(--expense-bg)', color: 'var(--expense)', fontWeight: 600, fontSize: 14, borderRadius: 16, padding: '10px 14px', margin: '4px 0 8px', maxWidth: 380 }}>{err}</div>}
            {!listening && (
              <>
                <div className="muted" style={{ fontSize: 13, fontWeight: 600, margin: '10px 0 8px' }}>{t('try_saying')}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 440 }}>
                  {samples.slice(0, 3).map(s => <button key={s} className="kt-chip" onClick={() => simulate(s)} style={{ whiteSpace: 'normal', textAlign: 'left', lineHeight: 1.25, padding: '8px 14px', fontSize: 14 }}>“{s}”</button>)}
                </div>
                <button onClick={() => setPhase('typing')} style={{ marginTop: 14, minHeight: 44, border: 0, background: 'none', color: 'var(--ink-2)', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="keyboard" size={18} />{t('type_instead')}</button>
              </>
            )}
            <div style={{ flex: 1 }} />
            <p className="muted" style={{ fontSize: 12.5, display: 'flex', gap: 6, alignItems: 'flex-start', textAlign: 'left', maxWidth: 380, margin: '14px 0 0' }}><Icon name="lock" size={14} style={{ marginTop: 2 }} />{t('voice_privacy')} <span style={{ color: 'var(--credit)' }}>[client to confirm]</span></p>
          </div>
        )}
      </div>
    </Sheet>
  );
}

// ---------- Amount keypad ----------
function Keypad({ value, onChange }) {
  const press = (k) => {
    if (k === 'back') return onChange(value.slice(0, -1));
    if (k === '000') return onChange(value ? (value + '000').slice(0, 10) : '');
    if (value.length >= 10) return;
    onChange((value + k).replace(/^0+/, ''));
  };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', 'back'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
      {keys.map(k => (
        <button key={k} type="button" onClick={() => press(k)} aria-label={k === 'back' ? 'Delete digit' : k}
          style={{ height: 56, borderRadius: 18, border: '1px solid var(--line)', background: 'var(--card)', fontSize: 22, fontWeight: 600, cursor: 'pointer', display: 'grid', placeItems: 'center' }} className="num">
          {k === 'back' ? <Icon name="backspace" size={24} /> : k}
        </button>
      ))}
    </div>
  );
}

// ---------- Category tiles 3×3 ----------
function CategoryTiles({ type, value, onChange, lang }) {
  const cats = KT_CATS[type === 'expense' ? 'expense' : 'sale'];
  return (
    <div role="radiogroup" aria-label="Category" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
      {cats.map(c => {
        const sel = c.id === value;
        return (
          <button key={c.id} type="button" role="radio" aria-checked={sel} onClick={() => onChange(c.id)}
            style={{ position: 'relative', minHeight: 84, borderRadius: 20, border: sel ? '0' : '1px solid var(--line)', background: sel ? 'var(--grad-soft)' : 'var(--card)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 8, boxShadow: sel ? 'inset 0 0 0 2px var(--brand-500)' : 'none', transition: 'background .25s, box-shadow .25s' }}>
            <Icon name={c.icon} size={26} active={sel} />
            <span style={{ fontSize: 13, fontWeight: sel ? 700 : 500, lineHeight: 1.15, textAlign: 'center' }}>{lang === 'pid' && c.pid ? c.pid : c.label}</span>
            {sel && <span style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: 'var(--brand-500)', display: 'grid', placeItems: 'center' }}><Icon name="check" size={13} color="#fff" stroke={3} /></span>}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Add / Edit transaction ----------
function Field({ id, label, children, err }) {
  return <div><label className="kt-label" htmlFor={id}>{label}</label>{children}{err && <div role="alert" style={{ color: 'var(--expense)', fontSize: 13.5, fontWeight: 600, margin: '6px 4px 0' }}>{err}</div>}</div>;
}
function TxSheet({ open, onClose, initial }) {
  const { t, lang, addTx, updateTx, addCredit } = useKT();
  const editing = initial && initial.id;
  const [f, setF] = React.useState(null);
  const [errs, setErrs] = React.useState({});
  const [step, setStep] = React.useState('amount');
  const [photo, setPhoto] = React.useState(null);
  React.useEffect(() => {
    if (!open) return;
    const base = { type: 'sale', amount: '', item: '', qty: 1, category: 'other_s', customer: '', phone: '', note: '', date: new Date().toISOString().slice(0, 10) };
    const i = initial || {};
    setF({ ...base, ...i, amount: i.amount ? String(i.amount) : '', date: (i.date || new Date().toISOString()).slice(0, 10) });
    setErrs({}); setPhoto(null); setStep('amount');
  }, [open, initial]);
  if (!f) return null;
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const setType = (ty) => setF(s => ({ ...s, type: ty, category: ty === 'expense' ? 'other_e' : 'other_s' }));
  const submit = () => {
    const e = {};
    if (!+f.amount) e.amount = 'Enter an amount';
    if (!f.item.trim() && f.type !== 'credit') e.item = 'Tell us what it was';
    if (f.type === 'credit' && !f.customer.trim()) e.customer = 'Who collected it?';
    setErrs(e); if (Object.keys(e).length) { if (e.amount) setStep('amount'); return; }
    const d = new Date(f.date); const now = new Date(); d.setHours(now.getHours(), now.getMinutes());
    if (f.type === 'credit') addCredit({ customer: f.customer, phone: f.phone, goods: f.item, amount: +f.amount, due: f.due ? new Date(f.due).toISOString() : null });
    else if (editing) updateTx({ id: f.id, type: f.type, item: f.item, qty: +f.qty || 1, amount: +f.amount, category: f.category, customer: f.customer, note: f.note, date: d.toISOString() });
    else addTx({ type: f.type, item: f.item, qty: +f.qty || 1, amount: +f.amount, category: f.category, customer: f.customer, note: f.note, date: d.toISOString() });
    onClose();
  };
  const color = f.type === 'expense' ? 'var(--expense)' : f.type === 'credit' ? 'var(--credit)' : 'var(--income)';
  return (
    <Sheet open={open} onClose={onClose} title={editing ? 'Edit record' : 'New record'} maxWidth={540}>
      <SheetHeader title={editing ? t('edit') : t('quick_add')} onClose={onClose} />
      <div style={{ padding: '0 20px 24px', display: 'grid', gap: 16 }}>
        {!editing && <Segmented full label="Record type" value={f.type} onChange={setType} options={[{ id: 'sale', label: t('record_sale'), icon: 'arrowUp' }, { id: 'expense', label: t('add_expense'), icon: 'arrowDown' }, { id: 'credit', label: t('add_credit'), icon: 'credit' }]} />}
        {/* amount display */}
        <button type="button" onClick={() => setStep(step === 'amount' ? 'details' : 'amount')} aria-label="Amount"
          style={{ border: 0, background: 'var(--card)', borderRadius: 28, padding: '16px 20px', textAlign: 'left', cursor: 'pointer', boxShadow: errs.amount ? 'inset 0 0 0 2px var(--expense)' : 'var(--sh-1)' }}>
          <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{t('amount')} (₦)</div>
          <div className="num" style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.02em', color: f.amount ? color : 'var(--ink-4)', lineHeight: 1.1 }}>
            {f.type === 'expense' ? '−' : '+'}₦{f.amount ? (+f.amount).toLocaleString('en-NG') : '0'}<span style={{ display: step === 'amount' ? 'inline-block' : 'none', width: 3, height: 36, background: 'var(--brand-500)', marginLeft: 4, verticalAlign: '-4px', animation: 'kt-pulse 1s infinite' }} />
          </div>
          {errs.amount && <div style={{ color: 'var(--expense)', fontSize: 13.5, fontWeight: 600 }}>{errs.amount}</div>}
        </button>
        {step === 'amount' ? (
          <>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{[500, 1000, 5000, 10000].map(q => <button type="button" key={q} className="kt-chip" onClick={() => set('amount', String((+f.amount || 0) + q))}>+{ktNaira(q)}</button>)}</div>
            <Keypad value={f.amount} onChange={v => set('amount', v)} />
            <button className="kt-btn kt-btn-primary" onClick={() => setStep('details')}>Next <Icon name="arrowRight" size={18} /></button>
          </>
        ) : (
          <>
            <Field id="kt-item" label={f.type === 'expense' ? t('what_spent') : t('what_sold')} err={errs.item}>
              <input id="kt-item" className="kt-input" value={f.item} onChange={e => set('item', e.target.value)} placeholder={f.type === 'expense' ? 'Transport, Rent…' : 'Rice, Soap…'} />
            </Field>
            {f.type !== 'credit' && <div><span className="kt-label">{t('category')}</span><CategoryTiles type={f.type} value={f.category} onChange={v => set('category', v)} lang={lang} /></div>}
            <div style={{ display: 'grid', gridTemplateColumns: f.type === 'expense' ? '1fr' : '1fr 1fr', gap: 10 }}>
              {f.type !== 'expense' && <Field id="kt-cust" label={t('customer') + (f.type === 'credit' ? '' : ` (${t('optional')})`)} err={errs.customer}><input id="kt-cust" className="kt-input" value={f.customer} onChange={e => set('customer', e.target.value)} placeholder="Mama Chidi" /></Field>}
              {f.type === 'credit'
                ? <Field id="kt-due" label="Due date (optional)"><input id="kt-due" type="date" className="kt-input" value={f.due || ''} onChange={e => set('due', e.target.value)} /></Field>
                : <Field id="kt-qty" label={t('quantity')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card)', border: '1px solid var(--line-2)', borderRadius: 16, padding: 2 }}>
                    <button type="button" className="kt-iconbtn" style={{ border: 0 }} onClick={() => set('qty', Math.max(1, (+f.qty || 1) - 1))} aria-label="Decrease"><Icon name="minus" size={18} /></button>
                    <input id="kt-qty" className="num" inputMode="numeric" value={f.qty} onChange={e => set('qty', e.target.value.replace(/\D/g, ''))} style={{ flex: 1, minWidth: 0, textAlign: 'center', border: 0, background: 'none', fontSize: 18, fontWeight: 600, outline: 'none' }} />
                    <button type="button" className="kt-iconbtn" style={{ border: 0 }} onClick={() => set('qty', (+f.qty || 0) + 1)} aria-label="Increase"><Icon name="add" size={18} /></button>
                  </div>
                </Field>}
            </div>
            {f.type === 'credit' && <Field id="kt-ph" label="Customer phone (optional, for WhatsApp reminder)"><input id="kt-ph" className="kt-input" inputMode="tel" value={f.phone} onChange={e => set('phone', e.target.value)} placeholder="080…" /></Field>}
            {f.type !== 'credit' && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field id="kt-date" label={t('date')}><input id="kt-date" type="date" className="kt-input" value={f.date} onChange={e => set('date', e.target.value)} /></Field>
              <div><span className="kt-label">{t('receipt_photo')}</span>
                <label style={{ minHeight: 52, borderRadius: 16, border: '1.5px dashed var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'var(--ink-2)', overflow: 'hidden', background: photo ? `center/cover url(${photo})` : 'transparent' }}>
                  <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={e => { const fl = e.target.files[0]; if (fl) setPhoto(URL.createObjectURL(fl)); }} />
                  {!photo && <><Icon name="camera" size={18} />Add</>}
                </label></div>
            </div>}
            <Field id="kt-note" label={`${t('note')} (${t('optional')})`}><input id="kt-note" className="kt-input" value={f.note} onChange={e => set('note', e.target.value)} /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 10, marginTop: 4 }}>
              <button className="kt-btn kt-btn-ghost" onClick={onClose}>{t('cancel')}</button>
              <button className="kt-btn kt-btn-primary" onClick={submit}><Icon name="check" size={20} />{t('save')}</button>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}

Object.assign(window, { Field, VoiceSheet, TxSheet, Keypad, CategoryTiles });
