// KudiTrack store — single persisted store shared by phone + desktop layouts.
// (In the production repo this maps 1:1 to a Zustand `persist` store; the existing Supabase/Lovable
//  data calls stay where they are and hydrate this store.)
const KT_STORE_KEY = 'kt-redesign-v1';

const KT_CATS = {
  sale: [
    { id: 'grains', label: 'Rice & grains', pid: 'Rice & grains', icon: 'bag' },
    { id: 'provisions', label: 'Provisions', pid: 'Provisions', icon: 'box' },
    { id: 'food', label: 'Foodstuff', pid: 'Foodstuff', icon: 'bowl' },
    { id: 'drinks', label: 'Drinks', pid: 'Drinks', icon: 'drink' },
    { id: 'fabric', label: 'Fabric', pid: 'Cloth', icon: 'fabric' },
    { id: 'recharge', label: 'Recharge', pid: 'Recharge', icon: 'phone' },
    { id: 'services', label: 'Services', pid: 'Service', icon: 'shop' },
    { id: 'wholesale', label: 'Wholesale', pid: 'Wholesale', icon: 'people' },
    { id: 'other_s', label: 'Other', pid: 'Other', icon: 'dots' },
  ],
  expense: [
    { id: 'stock', label: 'Restock', pid: 'Buy goods', icon: 'box' },
    { id: 'transport', label: 'Transport', pid: 'Transport', icon: 'bus' },
    { id: 'levy', label: 'Market levy', pid: 'Market levy', icon: 'levy' },
    { id: 'rent', label: 'Shop rent', pid: 'Shop rent', icon: 'shop' },
    { id: 'power', label: 'Fuel & power', pid: 'Fuel & light', icon: 'bolt' },
    { id: 'chop', label: 'Food', pid: 'Chop', icon: 'bowl' },
    { id: 'phone', label: 'Airtime & data', pid: 'Airtime', icon: 'phone' },
    { id: 'staff', label: 'Helper pay', pid: 'Helper pay', icon: 'people' },
    { id: 'other_e', label: 'Other', pid: 'Other', icon: 'dots' },
  ],
};
function ktCat(id) { return [...KT_CATS.sale, ...KT_CATS.expense].find(c => c.id === id) || { id, label: 'Other', icon: 'dots' }; }

function ktDaysAgo(n, h = 10, m = 0) { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(h, m, 0, 0); return d.toISOString(); }
let ktSeq = 1000; const ktId = () => 't' + (ktSeq++) + Math.random().toString(36).slice(2, 6);

function ktSeed() {
  const S = (d, h, item, qty, amount, category, customer) => ({ id: ktId(), type: 'sale', item, qty, amount, category, customer: customer || '', date: ktDaysAgo(d, h), note: '' });
  const E = (d, h, item, amount, category) => ({ id: ktId(), type: 'expense', item, qty: 1, amount, category, customer: '', date: ktDaysAgo(d, h), note: '' });
  const tx = [
    S(0, 8, 'Bags of rice (50kg)', 2, 136000, 'grains', 'Iya Bisi'),
    E(0, 7, 'Keke to Mile 12', 1500, 'transport'),
    S(0, 10, 'Garri (paint bucket)', 6, 13800, 'food'),
    S(0, 11, 'Indomie (carton)', 3, 27600, 'provisions', 'Mama Chidi'),
    E(0, 12, 'Market levy', 500, 'levy'),
    S(0, 13, 'Groundnut oil (5L)', 2, 19000, 'food'),
    S(1, 9, 'Beans (mudu)', 10, 18000, 'grains'),
    E(1, 8, 'Restock tomatoes', 22000, 'stock'),
    S(1, 14, 'Peak milk (tin)', 12, 9600, 'provisions'),
    E(1, 18, 'Keke home', 1200, 'transport'),
    S(2, 10, 'Bag of rice (50kg)', 1, 68000, 'grains', 'Alhaji Musa'),
    E(2, 9, 'Generator fuel', 4500, 'power'),
    S(2, 15, 'Coke & Fanta crate', 2, 16000, 'drinks'),
    E(3, 7, 'Restock rice (3 bags)', 186000, 'stock'),
    S(3, 12, 'Palm oil (25L keg)', 1, 42000, 'food', 'Mrs Okafor'),
    E(3, 13, 'Lunch', 1500, 'chop'),
    S(4, 11, 'Ankara (6 yards)', 2, 24000, 'fabric', 'Aunty Funke'),
    E(4, 10, 'Airtime', 1000, 'phone'),
    S(5, 10, 'Semovita (10kg)', 4, 30000, 'food'),
    E(5, 17, 'Helper pay', 5000, 'staff'),
    S(6, 9, 'Sugar (bag)', 1, 72000, 'provisions', 'Iya Bisi'),
    E(6, 8, 'Transport to Oyingbo', 3000, 'transport'),
    E(8, 9, 'Shop rent (part)', 25000, 'rent'),
    S(9, 12, 'Rice (mudu)', 20, 30000, 'grains'),
    S(12, 12, 'Indomie (carton)', 5, 46000, 'provisions'),
    E(15, 7, 'Restock provisions', 60000, 'stock'),
    S(18, 10, 'Beans (bag)', 1, 95000, 'grains'),
  ];
  return {
    tx,
    credits: [
      { id: ktId(), customer: 'Mama Chidi', phone: '08031234567', goods: '2 cartons Indomie', amount: 18400, given: ktDaysAgo(9), due: ktDaysAgo(-2), paid: false },
      { id: ktId(), customer: 'Mr Adewale', phone: '', goods: 'Half bag rice', amount: 34000, given: ktDaysAgo(14), due: ktDaysAgo(3), paid: false },
      { id: ktId(), customer: 'Aunty Nkechi', phone: '08097654321', goods: 'Palm oil keg', amount: 42000, given: ktDaysAgo(5), due: ktDaysAgo(-6), paid: false },
      { id: ktId(), customer: 'Baba Tunde', phone: '08022223333', goods: 'Sugar (paint)', amount: 6500, given: ktDaysAgo(20), due: ktDaysAgo(10), paid: true, paidOn: ktDaysAgo(7) },
    ],
    goals: [
      { id: 'g1', name: 'New freezer', target: 350000, saved: 214000, icon: 'bolt' },
      { id: 'g2', name: "Children's school fees", target: 180000, saved: 63000, icon: 'user' },
      { id: 'g3', name: 'Ajo / esusu (weekly)', target: 50000, saved: 50000, icon: 'people' },
    ],
    stock: [
      { id: 's1', name: 'Rice (50kg bag)', qty: 4, cost: 62000, price: 68000, alert: 3 },
      { id: 's2', name: 'Indomie (carton)', qty: 2, cost: 8400, price: 9200, alert: 4 },
      { id: 's3', name: 'Groundnut oil (5L)', qty: 11, cost: 8200, price: 9500, alert: 4 },
      { id: 's4', name: 'Sugar (bag)', qty: 0, cost: 66000, price: 72000, alert: 1 },
    ],
    profile: { name: 'Ngozi Okeke', business: 'Mama Ngozi Foods', market: 'Mile 12 Market, Lagos', type: 'Foodstuff & provisions', phone: '0803 000 0000' },
    prefs: { lang: 'en', theme: 'light', voiceOn: true, dailyReminder: true, paymentReminders: true, onboarded: false },
  };
}

const KTStoreCtx = React.createContext(null);

function KTStoreProvider({ children }) {
  const [state, setState] = React.useState(() => {
    try { const s = JSON.parse(localStorage.getItem(KT_STORE_KEY)); if (s && s.tx) return s; } catch (e) {}
    return ktSeed();
  });
  const [toast, setToast] = React.useState(null); // {msg, undo, kind}
  const [online, setOnline] = React.useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const lastRef = React.useRef(null);

  React.useEffect(() => { try { localStorage.setItem(KT_STORE_KEY, JSON.stringify(state)); } catch (e) {} }, [state]);
  React.useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const t = React.useCallback((k, v) => window.ktT(state.prefs.lang, k, v), [state.prefs.lang]);

  // every mutation snapshots the previous state so "Undo" works for every action
  const commit = React.useCallback((fn, msg, kind = 'ok') => {
    setState(prev => { lastRef.current = prev; return fn(prev); });
    if (msg) setToast({ msg, kind, id: Date.now(), canUndo: true });
  }, []);
  const undo = React.useCallback(() => {
    if (lastRef.current) { const p = lastRef.current; lastRef.current = null; setState(p); }
    setToast(null);
  }, []);

  const api = React.useMemo(() => ({
    addTx: (tx) => commit(s => ({ ...s, tx: [{ id: ktId(), date: new Date().toISOString(), qty: 1, note: '', customer: '', ...tx }, ...s.tx] }), window.ktT(state.prefs.lang, 'saved')),
    updateTx: (tx) => commit(s => ({ ...s, tx: s.tx.map(x => x.id === tx.id ? { ...x, ...tx } : x) }), window.ktT(state.prefs.lang, 'saved')),
    deleteTx: (id) => commit(s => ({ ...s, tx: s.tx.filter(x => x.id !== id) }), window.ktT(state.prefs.lang, 'deleted'), 'del'),
    addCredit: (c) => commit(s => ({ ...s, credits: [{ id: ktId(), given: new Date().toISOString(), paid: false, ...c }, ...s.credits] }), 'Credit saved'),
    markPaid: (id) => commit(s => ({ ...s, credits: s.credits.map(c => c.id === id ? { ...c, paid: true, paidOn: new Date().toISOString() } : c) }), 'Marked as paid'),
    addToGoal: (id, amt) => commit(s => ({ ...s, goals: s.goals.map(g => g.id === id ? { ...g, saved: Math.min(g.target, g.saved + amt) } : g) }), 'Added to savings'),
    addGoal: (g) => commit(s => ({ ...s, goals: [...s.goals, { id: ktId(), saved: 0, icon: 'target', ...g }] }), 'Goal created'),
    setPref: (k, v) => setState(s => ({ ...s, prefs: { ...s.prefs, [k]: v } })),
    setProfile: (p) => commit(s => ({ ...s, profile: { ...s.profile, ...p } }), 'Profile updated'),
    reset: () => { setState(ktSeed()); },
    clearAll: () => commit(s => ({ ...s, tx: [], credits: [] }), 'All records cleared', 'del'),
    undo, dismissToast: () => setToast(null),
  }), [commit, undo, state.prefs.lang]);

  const value = { state, ...api, t, toast, online, lang: state.prefs.lang };
  return <KTStoreCtx.Provider value={value}>{children}</KTStoreCtx.Provider>;
}
const useKT = () => React.useContext(KTStoreCtx);

// ---------- helpers ----------
const ktNaira = (n, opts = {}) => {
  const v = Math.round(Math.abs(n));
  if (opts.compact && v >= 1000000) return '₦' + (v / 1e6).toFixed(v >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'm';
  if (opts.compact && v >= 10000) return '₦' + Math.round(v / 1000) + 'k';
  return '₦' + v.toLocaleString('en-NG');
};
const ktSameDay = (a, b) => { const x = new Date(a), y = new Date(b); return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate(); };
const ktStartOf = (range) => {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  if (range === 'week') d.setDate(d.getDate() - 6);
  if (range === 'month') d.setDate(d.getDate() - 29);
  return d;
};
function ktTotals(tx, range = 'day') {
  const from = ktStartOf(range);
  const inR = tx.filter(x => new Date(x.date) >= from);
  const sales = inR.filter(x => x.type === 'sale').reduce((a, b) => a + b.amount, 0);
  const exp = inR.filter(x => x.type === 'expense').reduce((a, b) => a + b.amount, 0);
  return { sales, exp, profit: sales - exp, count: inR.length, list: inR };
}
function ktDayLabel(iso, t) {
  const d = new Date(iso); const now = new Date(); const y = new Date(); y.setDate(now.getDate() - 1);
  if (ktSameDay(d, now)) return t('today');
  if (ktSameDay(d, y)) return t('yesterday');
  return d.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' });
}
const ktTime = (iso) => new Date(iso).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' });

// ---------- voice parser (front-end fallback; the existing AI pipeline stays the source of truth) ----------
const KT_NUMWORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12, twenty: 20, half: 0.5 };
function ktParseAmount(text) {
  const s = text.toLowerCase().replace(/naira|₦|n(?=\d)/g, ' ').replace(/,/g, '');
  let m = s.match(/(\d+(?:\.\d+)?)\s*(k|thousand|m|million)\b/);
  if (m) return Math.round(parseFloat(m[1]) * (m[2][0] === 'm' ? 1e6 : 1000));
  const nums = [...s.matchAll(/\d+(?:\.\d+)?/g)].map(x => parseFloat(x[0]));
  if (!nums.length) return 0;
  return Math.max(...nums);
}
function ktParseVoice(text) {
  const s = text.toLowerCase();
  let type = 'sale';
  if (/(spent|spend|pay for|paid for|i pay|bought|buy|transport|levy|rent|fuel|restock|expense)/.test(s)) type = 'expense';
  if (/(credit|owe|go pay|will pay|collect.*(later|credit)|on credit)/.test(s)) type = 'credit';
  const amount = ktParseAmount(s);
  // quantity: first small number or number-word before a unit
  let qty = 1;
  const qm = s.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty|half)\s+(bags?|cartons?|crates?|tins?|kegs?|mudu|yards?|pieces?|packs?|buckets?|paint|litres?|bottles?)/);
  if (qm) qty = KT_NUMWORDS[qm[1]] || parseInt(qm[1], 10) || 1;
  // customer: "to X", "X collect", "for X"
  let customer = '';
  const cm = text.match(/(?:to|for)\s+((?:mama|baba|iya|aunty|auntie|mr|mrs|alhaji|oga|madam)\s+[A-Z]?[a-z]+)/i) || text.match(/^((?:mama|baba|iya|aunty|auntie|mr|mrs|alhaji|oga|madam)\s+[A-Za-z]+)/i);
  if (cm) customer = cm[1].replace(/\b\w/g, c => c.toUpperCase());
  // item: words after quantity/unit or after "on"
  let item = '';
  const im = s.match(/(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty|half)\s+((?:bags?|cartons?|crates?|tins?|kegs?|mudu|yards?|pieces?|packs?|buckets?|litres?|bottles?)\s+(?:of\s+)?[a-z ]+?)(?=\s+(?:for|to|at|₦|n?\d|naira|on credit)|$)/);
  if (im) item = im[1];
  else { const om = s.match(/(?:on|for)\s+([a-z ]+?)(?=\s+(?:₦|\d|naira)|$)/); if (om) item = om[1]; }
  item = item.trim().replace(/\b\w/g, c => c.toUpperCase()) || (type === 'expense' ? 'Expense' : 'Sale');
  // category guess
  const guess = [
    [/rice|beans|garri|grain|maize|corn/, 'grains', 'stock'], [/indomie|milk|sugar|provision|noodle|soap|milo/, 'provisions', 'stock'],
    [/oil|yam|pepper|tomato|onion|semo|food/, 'food', 'stock'], [/coke|fanta|drink|water|malt/, 'drinks', 'stock'],
    [/ankara|fabric|cloth|lace/, 'fabric', 'stock'], [/recharge|card|data/, 'recharge', 'phone'],
    [/keke|okada|bus|transport|danfo|uber|bolt/, 'other_s', 'transport'], [/levy|ticket|union/, 'other_s', 'levy'],
    [/rent|shop/, 'other_s', 'rent'], [/fuel|diesel|nepa|light|power|generator/, 'other_s', 'power'],
    [/lunch|chop|food/, 'food', 'chop'], [/airtime/, 'recharge', 'phone'], [/helper|boy|girl|staff|pay/, 'services', 'staff'],
  ];
  let category = type === 'expense' ? 'other_e' : 'other_s';
  for (const [re, sc, ec] of guess) { if (re.test(s)) { category = type === 'expense' ? ec : sc; break; } }
  if (type === 'expense' && /restock|bought|buy/.test(s)) category = 'stock';
  return { type, amount, qty, item, customer, category, transcript: text };
}

Object.assign(window, { KTStoreProvider, useKT, KT_CATS, ktCat, ktNaira, ktTotals, ktSameDay, ktStartOf, ktDayLabel, ktTime, ktParseVoice, ktDaysAgo });
