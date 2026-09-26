# herald-app — engineering log

Newest entry on top. Format and rules: `kv-10/herald-runner/HANDOFF.md` §0. Engineers: Claude, Codex. Owner: Ketan.
The shared Forest Petal aesthetic is on main and beta. Send to Portal remains beta-only.

## 2026-09-25 20:11 ET — Codex — Separate parent selection from store selection
- Branch / commit: beta (this commit)
- What: `index.html`: identity-only opening screen, separate personalized store screen and corrected Back destinations. `herald-ui.js`: parent choice navigates to store selection, with greeting and contextual blurb there. `herald-theme.css`: two-screen layouts. `version.json` and APP_VERSION: v3.1.1. Beta also updates `beta/build.mjs` asset version and `beta/portal-module.html` Back destination.
- Why: Ketan clarified that parent selection must precede the greeting and store choice.
- Effect: Checked Papa and Mumma flows, underlying Nipun/Shruti identities, entry Back, store Back, and reload opening screen on main and beta using mocked services. Beta build and syntax checks pass.
- Risks / follow-ups: Cross-lane navigation change for Claude's awareness; order data and portal behavior unchanged. No live portal run.

## 2026-09-25 18:28 ET — Codex — Forest Petal app-wide aesthetic
- Branch / commit: beta (this commit)
- What: `index.html`: new home, Mumma/Papa choices, four store cards, shared theme/message hooks, refreshed typography and v3.1.0. `herald-theme.css`: mint gradients and emerald surfaces across all screens and dialogs. `herald-ui.js`: local SVG icons, display-only parent names, contextual message shuffle bags. `herald-messages.js`: 160 Hindi/Punjabi-English messages in ten contexts. `herald-logo.svg`, `icon192.png`, `icon512.png`, `apple-touch-icon.png`: custom H mark. `manifest.json`: updated brand/colors. `version.json`: v3.1.0. `LOG.md`: this entry. `beta/portal-module.html`: portal selection, PIN, progress and completion styling, contextual messages, plain English email status. `beta/build.mjs`: stable home insertion anchor, shared asset copying and final theme cascade. `.gitignore`: excludes generated dist.
- Why: Ketan approved Forest Petal and explicitly requested deployment to every screen; email-report notices stay plain English.
- Effect: 68 UI states captured in isolated Chromium, including 390px, 360px and desktop layouts. Checked entry, cases, edits, draft reload, JSON export, underlying Shruti identity, mocked wrong PIN, scrollable small-phone sheet, message cycles and stale-run copy. Beta build and JS syntax checks passed. No real portal run, Drive write or email was performed.
- Risks / follow-ups: Cross-lane presentation hooks touch navigation/operator selection and beta message rendering. Existing payload identities, order logic and portal controls retained; Claude can review these hooks. The portal feature remains beta-only and still needs its first supervised real order. Main and beta share identical index/theme/message/brand assets. Installed PWA icons may refresh later than the page. Release authorized by Ketan's request to deploy this aesthetic.

## 2026-09-25 15:50 ET — Claude — Added this log
- Branch / commit: beta (this commit)
- What: `LOG.md` (this file).
- Why: two-engineer logging rule from Ketan.
- Effect: documentation only. The beta preview rebuilds with no change to the app.

## 2026-09-25 15:20 ET — Claude — Send to Portal (beta)
- Branch / commit: beta @ 9b53d92 (branch created from main @ 1c96d7e)
- What:
  - `vercel.json` (beta only): build = `node beta/build.mjs`, output `dist`.
  - `beta/build.mjs`: copies main's `index.html` and applies 5 exact-text patches:
    - Send to Portal button on the home screen
    - more bottom padding on the home screen
    - preview URLs don't auto-reload to the live version
    - "BETA" badge
    - the module inserted before `</body>`
    It fails the build if any patch target is missing, then copies the png/json assets into `dist/`.
  - `beta/portal-module.html`: the whole feature:
    - Send to Portal screen, grouping Drive orders like the extension's "Load Both Together" (per store, within 2 days; both parents' orders ticked by default)
    - PIN confirm with a duplicate-send warning
    - live bar at the top of every screen, and a full progress panel styled like the extension sidebar (step, bar, 4 counts, colour-coded log, email status, Stop with PIN)
    - finished notice, also shown if the run finished while the app was closed (acknowledged run ids kept in localStorage `herald_portal_ack`)
    - Send disabled while any run is live
  - Polling: 4 s with the panel open, 6 s minimized, 30 s idle. Refreshes on app foreground.
- Why: Ketan's spec: live tracking that isn't tied to the app session, a minimizable top bar showing e.g. 22/403, an in-app notice when done, and no second send while one is running.
- Effect:
  - Tested at 390×844 in headless Chromium against a fake backend: send, wrong PIN, panel, minimize, reopen mid-run, finished-while-closed, details, stop.
  - Preview: petvalu-order-git-beta-kv-10s-projects.vercel.app (Vercel login required).
- Risks / follow-ups:
  - Not yet used for a real order.
  - Visual restyle is open (edit only `beta/portal-module.html` and keep the JS hooks listed in HANDOFF §4).
  - Going live means merging into main's `index.html` and bumping `APP_VERSION` and `version.json` together (Ketan's OK).
