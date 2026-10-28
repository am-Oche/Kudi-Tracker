# KudiTrack AI — Redesign (P1 complete, P2/P3 partly in place)

Open **`KudiTrack Redesign.html`**.
- Width ≥ 640px → website (`#/`) with marketing landing page; **Open the app** → web dashboard (`#/app/home`).
- Width < 640px → native-feeling phone app (gradient header, floating pill nav, centre mic, bottom sheets).
- Force a layout: `?layout=phone` or `?layout=desktop`, or use the **Tweaks** toggle (Preview as / Theme / Header gradient / Language).

---

## 0. Audit of the live app (kuditrackai.lovable.app)

Taken from the production bundle (string table, styles and manifest), because the app sits behind sign-in.

**Stack:** React + Vite + Tailwind (Lovable), TanStack Router, Inter, light/dark theme saved in `localStorage('kuditrack-theme')`, PWA manifest.
**Brand:** primary `#F67300`, primary-dark `#D05400`, accent terracotta `#B8492E`, success `#23A136`, destructive `#F22A36`, navy dark background `#0F182B`. Logo: orange naira sign with a rising arrow.
**Languages:** English + Pidgin (full string table).

| Area | What exists today | Where it is in the redesign |
|---|---|---|
| Auth / onboarding | Sign up (name, business, phone, email, password), phone OTP (demo code 1234), "What do you sell?", business age, how you track now, market location, preferences (payment reminders, daily sales reminder), Finish setup | `onboarding.jsx`: 3 slides → language → business type → first voice demo. *Auth forms not redesigned yet (P2).* |
| Home | Greeting, TODAY'S PROFIT, Sales / Expenses / Credit given, Who owes me, This month, Quick Add (Record Sale / Add Expense / Add Credit / Stock / Invoice), tips | `HomeScreen`: profit hero with Day/Week/Month, quick add, AI tip, savings ring, who owes me, recent records |
| Voice capture | "What do you want to record?", Listening…, "Heard:", Confirm; also handles credit collected | `VoiceSheet`: full sheet, waveform, live transcript, parsed confirm card, Edit / Save / Try again, type instead, samples |
| Records | Transaction History, Total Sales/Expenses/Net Profit, search, Today/Yesterday groups, delete | `RecordsScreen`: search, filter chips, category sheet, sort sheet, grouped by day, swipe edit/delete, table on desktop |
| Credit tracker | Who Owes Me / Paid History, Total Outstanding, Mark Paid, WhatsApp reminder | `CreditScreen` |
| Stock | My Stock, total value, add product, low stock alerts (Plenty / Running Low / Finished) | `StockScreen` (list; add-product form in P2) |
| Reports | Weekly stats, This/Last week, net profit, "For every ₦100…", financial statement, monthly/weekly breakdown, profit margin, best month | `ReportsScreen`: Day/Week/Month tabs (URL `?range=`), KPIs, bars + profit trend, list view, top categories, share sheet (WhatsApp / PDF) |
| Invoices | Items, unit price, tax, subtotal/total, Save draft, Share on WhatsApp, Mark sent | `InvoiceScreen` placeholder. *Full builder in P2.* |
| AI Helper | Chat with suggested questions | `AIScreen` (live answers in the demo) |
| Loan eligibility | Score / 100, breakdown, tips, lenders (OPay, Moniepoint, PalmPay, LAPO), disclaimer | `LoanScreen` |
| Bank sync | Coming soon + notify me | Settings row "Coming soon" |
| Notifications | Payment due, low stock, daily reminder | `NotificationsScreen` |
| Settings | Account, language, theme, data & backup, download my data, version, sign out | `SettingsScreen` |
| PWA / offline | Install prompt, offline banner, sync status | Sync pill + offline banner (real `online/offline` events) |

**Not in the live app, added because the brief asked for it:** savings goals (none found in the current bundle — please confirm), Yoruba / Igbo / Hausa (wired up, marked "Soon").

**What works today:** strong voice-first idea, warm Pidgin copy, a useful credit tracker with WhatsApp, offline/PWA basics.
**What feels dated:** generic shadcn look (small radius, Inter, flat cards), emoji used as icons, a crowded home screen, small tap targets in lists, no strong visual centre for the mic, colour-only meaning in places.
**What changed:** Urbanist type, 24–32px rounded glass cards, a signature warm gradient taken from the brand orange, floating pill nav with a large mic button, +/− signs and arrows next to every amount (colour is never the only cue), 48px+ tap targets, Undo on every action, sheets in place of full pages, and numbers that count up.

---

## How to edit

| What | Where |
|---|---|
| Brand colours, gradients, radius, type scale, dark tokens | `src/tokens.css` (`:root` and `[data-theme="dark"]`) |
| Logo | `KTLogo` in `src/icons.jsx` (vector redraw of the current mark — **confirm with client**) |
| Icons | `KT_ICON_PATHS` in `src/icons.jsx` (24px grid, 2px stroke; `active` = gradient) |
| Bottom nav items | `KT_NAV` in `src/shells.jsx` |
| Desktop sidebar items | `mainNav` in `DesktopApp` (`src/shells.jsx`) |
| Tabs / segmented controls | `<Segmented options value onChange urlKey>` in `src/ui.jsx` (sliding pill, arrow keys, ARIA tablist, `?key=` URL sync) |
| Languages / copy | `src/i18n.js`: add a `yo`/`ig`/`ha` value to any key; remove `pending` in `KT_LANGS` |
| Currency | `ktNaira()` in `src/store.jsx` |
| Categories | `KT_CATS` in `src/store.jsx` |
| Demo data | `ktSeed()` in `src/store.jsx` (Settings → Reset demo data) |

**Production port:** the files are written as plain React components so they can move into the existing Lovable repo with little change: `store.jsx` → Zustand `persist` store hydrated by the existing data calls; `Sheet` → Radix Dialog with the same styles; `BarChart` → Recharts. **Leave the existing voice/AI pipeline as it is.** `ktParseVoice` is only a front-end fallback used for the demo.

`.env.example` (production):
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_AI_ENDPOINT=
```

---

## Phase status

**P1 — done:** audit, tokens (light + dark), Urbanist, icon set, Tabs, nav config, both layouts, Home, Voice entry, Records.
**P2 — mostly done:** Add/Edit sheet (keypad, 3×3 category tiles, date, receipt photo, note), Savings (goals, milestones, add-money sheet, new goal), Reports, Credit, Stock list, Settings, Onboarding, AI helper, Loan checker, Notifications.
**P3 — partly done:** marketing landing page (hero voice demo, parallax, floating cards), web dashboard and records table, motion.

**Not finished / not matched exactly**
- Invoice builder and stock "Add product" form are placeholders.
- Sign-up, sign-in and OTP screens are not redesigned yet.
- Live mic works where the browser allows it (Chrome on Android). Inside this preview the mic is blocked, so use the sample phrases.
- Lighthouse and real-device testing need the production build. This file is a Babel-in-browser prototype.

## Client to confirm
- [ ] Redrawn vector logo is OK (or send the original SVG)
- [ ] Savings goals as a new feature
- [ ] Voice privacy line: "converted to text, not stored as audio"
- [ ] Pricing (landing page shows ₦0 to start)
- [ ] Yoruba, Igbo and Hausa translations (who supplies them?)
- [ ] Lender list and loan disclaimer wording
- [ ] Any AI accuracy or security claims (none are made right now)
- [ ] Reference-board images are for pitching only and are not used in the product
