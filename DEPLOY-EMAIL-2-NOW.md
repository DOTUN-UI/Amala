# Email 2 still shows old “SAVE YOUR APPLICATION REFERENCE” box?

**That text is not in this repo anymore.** It only exists in the **live Google Apps Script** project on Google’s servers. Editing files on your computer or pushing to GitHub does **not** change Email 2 until someone updates **that** script.

Your careers site calls this URL after each application:

```
https://script.google.com/macros/s/AKfycbxHATyBoGmfaWeNnx6Q42EK6sIVGrakQ5TX7ZOlUgGWpT4XVaS7HNr653Q1bHeHL6p1/exec
```

---

## Step 1 — Check what is live right now

After the updated `Apps Script.js` is deployed (see Step 2), open this in a browser:

```
https://script.google.com/macros/s/AKfycbxHATyBoGmfaWeNnx6Q42EK6sIVGrakQ5TX7ZOlUgGWpT4XVaS7HNr653Q1bHeHL6p1/exec
```

You should see JSON like:

```json
{
  "ok": true,
  "scriptVersion": "2026-06-12-complete",
  "emailDesign": "venue-check-in-pass"
}
```

If you see an error page, or `scriptVersion` is missing / different → **old script is still deployed.**

---

## Step 2 — Update the script (you or your partner)

### Who has access?

- Go to [script.google.com](https://script.google.com)
- Find the project that deploys to the URL above (ask partner which project, or check **Deploy → Manage deployments** on each project)

### Full replace (required)

1. Open **Code.gs** (delete extra old files like `Email.gs` if they duplicate email logic).
2. **Select all → Delete** (entire contents).
3. Open `Apps Script.js` from this folder → copy **everything**.
4. Paste into Code.gs → **Save**.
5. **Deploy** → **Manage deployments** → pencil icon on the web app → **New version** → **Deploy**.
6. **Do not** create a new deployment URL unless you also update `VITE_FOLLOWUP_SCRIPT_URL` on the careers Netlify site.

### Verify in editor

1. Run **`testSetup`** → Execution log shows `Script version: 2026-06-12-complete`.
2. Open the `/exec` URL in browser (Step 1) → same version in JSON.
3. Wait for delay (`FOLLOWUP_DELAY_MS` = 5 min for testing) → new test email should show **Venue Check-In Pass** (navy header), not dashed blue box.

### Search test

In Code.gs, search for `SAVE YOUR APPLICATION`. **Zero results** = correct file. If found = still old code.

---

## Step 3 — Trigger (if emails never send)

Apps Script → **Triggers** → add:

- Function: `sendDueFollowUpEmails`
- Every hour

---

## If partner insists they deployed

Ask for screenshot of:

1. Code.gs first line showing `SCRIPT_VERSION: 2026-06-12-complete`
2. Deploy → Manage deployments → **Version** number and date
3. Browser open on the `/exec` URL showing JSON from Step 1

If their Code.gs still contains `Save your application reference` or dashed-box HTML → they did not full-replace.

---

## What the new email block looks like

- Navy bar: **VENUE CHECK-IN PASS**
- Applicant name + APP-ID in solid box
- Amber: **SCREENSHOT THIS ENTIRE CARD**
- Not a light-blue dashed rectangle
