// Beta build (Vercel preview only — this file and vercel.json live on the `beta` branch, never on main).
// Takes the live index.html untouched and layers the "Send to Portal" feature on top, so main stays as-is.
import fs from 'node:fs';

let s = fs.readFileSync('index.html', 'utf8');
function patch(from, to) {
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error(`beta build: expected 1 match, found ${n}: ${from.slice(0, 80)}`);
  s = s.replace(from, to);
}
// Home: room for the Send to Portal button above Past Orders / Browse Catalog
patch('<div id="s-operator" class="screen active" style="justify-content:center;padding:0 28px 48px">',
      '<div id="s-operator" class="screen active" style="justify-content:center;padding:0 28px 130px">');
patch(`  <div style="position:absolute;bottom:60px;left:28px;right:28px;display:flex;gap:10px">
    <button class="hist-link" style="flex:1" onclick="goTo('s-history'); renderHist()">Past Orders</button>`,
`  <div style="position:absolute;bottom:60px;left:28px;right:28px">
    <button class="hr-home-send" id="hrHomeBtn" onclick="hrOpenPortal()">Send to Portal</button>
  <div style="display:flex;gap:10px">
    <button class="hist-link" style="flex:1" onclick="goTo('s-history'); renderHist()">Past Orders</button>`);
patch(`    <button class="hist-link" style="flex:1" onclick="goTo('s-catalog')">Browse Catalog</button>
  </div>`, `    <button class="hist-link" style="flex:1" onclick="goTo('s-catalog')">Browse Catalog</button>
  </div>
  </div>`);
// A preview URL must never auto-reload itself to the live version
patch('    const latest = data.version;', "    const latest = location.hostname === 'project-herald.vercel.app' ? data.version : APP_VERSION;");
patch('runStartup();\n', "if (location.hostname !== 'project-herald.vercel.app') { const b = document.getElementById('appVersionBadge'); if (b) b.textContent = APP_VERSION + ' · BETA'; }\nrunStartup();\n");
// The feature itself
const mod = fs.readFileSync('beta/portal-module.html', 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + mod + '\n' + s.slice(i);

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist');
fs.writeFileSync('dist/index.html', s);
for (const f of fs.readdirSync('.')) {
  if (/\.(png|json|ico|webmanifest)$/.test(f) && f !== 'vercel.json') fs.copyFileSync(f, 'dist/' + f);
}
console.log('beta build ok:', fs.readdirSync('dist').join(', '));
