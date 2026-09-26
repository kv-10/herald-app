# herald-app engineering log

Newest entry on top. Owner: Ketan.

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

