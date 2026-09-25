# herald-app — engineering log

Newest entry on top. Format and rules: `kv-10/herald-runner/HANDOFF.md` §0. Engineers: Claude, Codex. Owner: Ketan.
This log lives on the `beta` branch while the Send to Portal work is in beta. `main` (the live app) has not been changed.

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
