// The beta uses the exact main app source, adding only its portal module.
import fs from 'node:fs';
let s = fs.readFileSync('index.html', 'utf8');
function patch(from,to){const n=s.split(from).length-1;if(n!==1)throw new Error(`beta build: expected 1 match, found ${n}: ${from.slice(0,80)}`);s=s.replace(from,to);}
patch('<!-- herald-portal-entry -->','<button class="hr-home-send" id="hrHomeBtn" onclick="hrOpenPortal()">Send to Portal</button>');
patch('    const latest = data.version;',"    const latest = location.hostname === 'project-herald.vercel.app' ? data.version : APP_VERSION;");
patch('runStartup();\n',"if (location.hostname !== 'project-herald.vercel.app') { const b = document.getElementById('appVersionBadge'); if (b) b.textContent = APP_VERSION + ' · BETA'; }\nrunStartup();\n");
const mod=fs.readFileSync('beta/portal-module.html','utf8');
patch('</body>',mod+'\n<link rel="stylesheet" href="herald-theme.css?v=3.1.2">\n</body>');

fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist');fs.writeFileSync('dist/index.html',s);
for(const f of fs.readdirSync('.'))if(/\.(png|json|ico|webmanifest|svg|css|js)$/.test(f)&&f!=='vercel.json')fs.copyFileSync(f,'dist/'+f);
console.log('beta build ok:',fs.readdirSync('dist').join(', '));
