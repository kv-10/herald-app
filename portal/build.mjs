// Production build (Vercel, project petvalu-order): the live app = main's index.html + the Send to Portal module.
// index.html itself is never modified by this script's output in git; the combined page is written to dist/.
//   - Send to Portal: portal/portal-module.html is inserted before </body>, button at <!-- herald-portal-entry -->
//   - Version: taken from version.json and stamped into APP_VERSION, the version badge and ?v= asset links,
//     so the app's update check and the served page can never disagree. To release: bump version.json only.
// Fails the build (and Vercel keeps the previous live version) if any expected text is missing.
import fs from 'node:fs';
import crypto from 'node:crypto';

const version = JSON.parse(fs.readFileSync('version.json', 'utf8')).version;           // e.g. "v3.2.0"
if (!/^v\d+\.\d+\.\d+$/.test(version)) throw new Error('build: bad version.json: ' + version);
let s = fs.readFileSync('index.html', 'utf8');
function patch(from, to) {
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error(`build: expected 1 match, found ${n}: ${from.slice(0, 80)}`);
  s = s.replace(from, to);
}

// Version stamping
const m = s.match(/const APP_VERSION = '(v[\d.]+)';/);
if (!m) throw new Error('build: APP_VERSION not found');
const old = m[1];
patch(`const APP_VERSION = '${old}';`, `const APP_VERSION = '${version}';`);
s = s.split(`id="appVersionBadge">${old}<`).join(`id="appVersionBadge">${version}<`);
s = s.split(`?v=${old.slice(1)}"`).join(`?v=${version.slice(1)}"`);

// Send to Portal
patch('<!-- herald-portal-entry -->', '<button class="hr-home-send" id="hrHomeBtn" onclick="hrOpenPortal()">Send to Portal</button>');
// The Send to Portal module is taken from the beta branch at a pinned commit and checked by SHA-256,
// so the live app gets exactly the tested file. To ship a new module version: update both constants.
// (If portal/portal-module.html exists in this branch it is used instead, e.g. once it's vendored in with git.)
const MODULE_COMMIT = '042dab62012d774091c8b71ed83ecde2e944f2ec';
const MODULE_SHA256 = '7b806f286a80d8530603d64f30eb2a507ca82870919cce24424a169b789d5549';
let mod;
if (fs.existsSync('portal/portal-module.html')) mod = fs.readFileSync('portal/portal-module.html', 'utf8');
else {
  const r = await fetch(`https://raw.githubusercontent.com/kv-10/herald-app/${MODULE_COMMIT}/beta/portal-module.html`);
  if (!r.ok) throw new Error('build: could not fetch portal module: HTTP ' + r.status);
  mod = await r.text();
  const got = crypto.createHash('sha256').update(mod, 'utf8').digest('hex');
  if (got !== MODULE_SHA256) throw new Error('build: portal module checksum mismatch: ' + got);
}
patch('</body>', mod + `\n<link rel="stylesheet" href="herald-theme.css?v=${version.slice(1)}">\n</body>`);

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist');
fs.writeFileSync('dist/index.html', s);
for (const f of fs.readdirSync('.')) {
  if (/\.(png|json|ico|webmanifest|svg|css|js)$/.test(f) && f !== 'vercel.json') fs.copyFileSync(f, 'dist/' + f);
}
console.log(`build ok (${version}):`, fs.readdirSync('dist').join(', '));
