# herald-app engineering log

Newest entry on top. Owner: Ketan.

## 2026-09-26 02:45 ET — Claude — v3.2.0: Send to Portal is live
- Branch / commit: main (this commit)
- What:
  - `vercel.json` (new on main): Vercel runs `node portal/build.mjs` and serves `dist/`.
  - `portal/build.mjs` (new): writes `dist/index.html` from main's **unchanged** `index.html`:
    - replaces `<!-- herald-portal-entry -->` with the Send to Portal button
    - inserts the Send to Portal module plus the final `herald-theme.css` link before `</body>` (same as the beta build)
    - stamps the version from `version.json` into `APP_VERSION`, the version badge and all `?v=` asset links
    - copies the png/json/svg/css/js assets
    - fails the build if anything expected is missing; Vercel then keeps the previous live version
  - The module is fetched from **beta @ 042dab6** (`beta/portal-module.html`, Codex's latest) and must match SHA-256 `7b806f28…d5549`. If `portal/portal-module.html` is ever added to main, it's used instead.
  - `version.json`: v3.2.0.
- Why: Ketan approved going live so Mumma and Papa can use Send to Portal on 2026-09-26.
- Effect:
  - The build output is byte-identical whether the module is local or fetched.
  - Full phone test (390×844, fake backend) on the production build passed with no reload loop: parent → stores → Send to Portal, wrong PIN, live panel, minimize bar, reopen mid-run, finished-while-closed, details, stop.
  - Existing phones auto-update: their APP_VERSION v3.1.2 ≠ version.json v3.2.0, so they reload.
  - The rest of the app is unchanged.
- Risks / follow-ups:
  - **Why this shape:** Claude edits the repo through the GitHub connector, which can't safely rewrite the 280 KB `index.html`. Codex (local git) can vendor the module into main: `git show 042dab6:beta/portal-module.html > portal/portal-module.html`, then commit and remove the fetch if you like.
  - **Releasing from now on:** bump `version.json` only. The build stamps it into the page. `APP_VERSION` in `index.html` may lag, and that's fine.
  - **Module changes** made on beta need the new commit + SHA-256 in `portal/build.mjs` (or the vendored file) to reach the live app.
  - The beta branch keeps its own build; `index.html` on beta must still match main's.

## 2026-09-25 21:59 ET — Codex — Clean up colon replacement copy
- Branch / commit: main (this commit)
- What: `index.html`: missing catalog prices/brand/size fallback to n/a, sentence punctuation in entry/catalog/startup, cleaner email subject separators. `version.json` and APP_VERSION prepared as v3.1.2. Beta also updates `beta/portal-module.html` status, confirmation, issue and error copy and `beta/build.mjs` asset version.
- Why: Ketan reported bare colons in catalog fields and awkward colon-separated sentences.
- Effect: Cosmetic strings only. Existing missing-size card visibility, price formatting conditions and all order/portal logic retained. Beta build and diff checks passed; inspected mocked missing-field popup and completion text.
- Risks / follow-ups: Ready for deployment approval. No live portal, email or order data touched.

## 2026-09-25 20:11 ET — Codex — Separate parent selection from store selection
- Branch / commit: main (this commit)
- What: `index.html`: identity-only opening screen, separate personalized store screen and corrected Back destinations. `herald-ui.js`: parent choice navigates to store selection, with greeting and contextual blurb there. `herald-theme.css`: two-screen layouts. `version.json` and APP_VERSION: v3.1.1. Beta also updates `beta/build.mjs` asset version and `beta/portal-module.html` Back destination.
- Why: Ketan clarified that parent selection must precede the greeting and store choice.
- Effect: Checked Papa and Mumma flows, underlying Nipun/Shruti identities, entry Back, store Back, and reload opening screen on main and beta using mocked services. Beta build and syntax checks pass.
- Risks / follow-ups: Cross-lane navigation change for Claude's awareness; order data and portal behavior unchanged. No live portal run.

## 2026-09-25 18:28 ET — Codex — Forest Petal app-wide aesthetic
- Branch / commit: main (this commit)
- What: `index.html`: new home, Mumma/Papa choices, four store cards, shared theme/message hooks, refreshed typography and v3.1.0. `herald-theme.css`: mint gradients and emerald surfaces across all screens and dialogs. `herald-ui.js`: local SVG icons, display-only parent names, contextual message shuffle bags. `herald-messages.js`: 160 Hindi/Punjabi-English messages in ten contexts. `herald-logo.svg`, `icon192.png`, `icon512.png`, `apple-touch-icon.png`: custom H mark. `manifest.json`: updated brand/colors. `version.json`: v3.1.0. `LOG.md`: this entry.
- Why: Ketan approved Forest Petal and explicitly requested deployment to every screen; email-report notices stay plain English.
- Effect: 68 UI states captured in isolated Chromium, including 390px, 360px and desktop layouts. Checked entry, cases, edits, draft reload, JSON export, underlying Shruti identity, mocked wrong PIN, scrollable small-phone sheet, message cycles and stale-run copy. Beta build and JS syntax checks passed. No real portal run, Drive write or email was performed.
- Risks / follow-ups: Cross-lane presentation hooks touch navigation/operator selection and beta message rendering. Existing payload identities, order logic and portal controls retained; Claude can review these hooks. The portal feature remains beta-only and still needs its first supervised real order. Main and beta share identical index/theme/message/brand assets. Installed PWA icons may refresh later than the page. Release authorized by Ketan's request to deploy this aesthetic.
