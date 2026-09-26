/* Presentation only. Operator values and order payloads keep their existing names. */
(function () {
  'use strict';
  const paths = {
    check:'<path d="m5 12 4 4L19 6"/>',
    warning:'<path d="M10.3 4.5 2 19h20L13.7 4.5a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 3v.1"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    cloud:'<path d="M7 18a5 5 0 1 1 0-10 6 6 0 0 1 11 1 4.5 4.5 0 0 1 0 9Z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>',
    pause:'<path d="M8 5v14M16 5v14"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>'
  };
  function icon(name) { return '<svg class="hf-icon" viewBox="0 0 24 24" aria-hidden="true">'+(paths[name]||paths.info)+'</svg>'; }
  const messages = window.HERALD_MESSAGES || {};
  const key = 'herald_messages_v1';
  let memory = {}; try { memory = JSON.parse(localStorage.getItem(key)||'{}'); } catch {}
  if (!memory || typeof memory !== 'object' || Array.isArray(memory)) memory = {};
  function pick(context) {
    const list = messages[context]; if (!list?.length) return '';
    let m = memory[context];
    if (!m || !Array.isArray(m.bag) || !m.bag.every(i=>Number.isInteger(i)&&i>=0&&i<list.length) || new Set(m.bag).size!==m.bag.length) m = {bag:[],last:-1};
    if (!m.bag.length) {
      m.bag = list.map((_,i)=>i);
      for(let i=m.bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[m.bag[i],m.bag[j]]=[m.bag[j],m.bag[i]];}
      if(m.bag.length>1&&m.bag.at(-1)===m.last)[m.bag[0],m.bag[m.bag.length-1]]=[m.bag.at(-1),m.bag[0]];
    }
    m.last=m.bag.pop(); memory[context]=m;
    try {localStorage.setItem(key,JSON.stringify(memory));}catch{}
    return list[m.last];
  }
  let entryContext = null;
  function entryMessage() {
    const context = items.length ? "entry" : "empty";
    if (context !== entryContext) { entryContext=context; const el=document.querySelector("#s-entry [data-hf-message]"); if(el)el.textContent=pick(context); }
  }
  function screenMessage(id) {
    const context = {'s-store':'home','s-entry':items.length?'entry':'empty','s-review':'review'}[id];
    const el = document.querySelector('#'+id+' [data-hf-message]');
    if (el && context) el.textContent=pick(context);
    if (id==='s-entry') entryContext=context;
    if (id==='s-store') home();
  }
  function home() {
    if (!operator) {try{operator=localStorage.getItem('herald_operator')||'Nipun';}catch{operator='Nipun';}}
    if (!['Nipun','Shruti'].includes(operator)) operator='Nipun';
    const name=operator==='Nipun'?'Papa':'Mumma';
    document.getElementById('hfGreeting').textContent='Namaste, '+name+'.';
    document.getElementById('hfDate').textContent=new Date().toLocaleDateString('en-CA',{weekday:'short',month:'short',day:'numeric'});
    document.getElementById('hfHomeStores').innerHTML=[['Lakeshore Rd','2087'],['Lambton Mall','2356'],['Corunna','2372'],['London','2412']].map(([name,num])=>{
      const n=loadDraft(name).length;
      return '<button class="hf-store" data-hf-store="'+name+'"><small>'+num+icon('arrow')+'</small><div><strong>'+name+'</strong>'+(n?'<div class="hf-draft">'+n+' saved items</div>':'')+'</div></button>';
    }).join('');
    document.querySelectorAll('[data-hf-store]').forEach(b=>b.onclick=()=>selectStore(b.dataset.hfStore));
  }
  function choose(name) {operator=name;try{localStorage.setItem('herald_operator',name);}catch{}goTo('s-store');}
  // Decorative text symbols are rendered as a consistent, local SVG icon set.
  // Limit this to UI text nodes, never inputs, scripts, payloads, or saved orders.
  const glyphs={'⚠':'warning','🔍':'search','☁':'cloud','◷':'clock','ⓘ':'info','✅':'check','✓':'check','✕':'close','⏸':'pause','✉':'mail'};
  const glyphPattern=/[⚠🔍☁◷ⓘ✅✓✕⏸✉]\uFE0F?/gu;
  function decorate(scope) {
    if (!scope || scope.nodeType!==1 || scope.closest('script,style,svg,textarea')) return;
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);const nodes=[];
    while(walker.nextNode()){const t=walker.currentNode;if(t.parentElement?.closest('script,style,svg,textarea'))continue;if(t.data.includes('\u2014'))t.data=t.data.replace(/\u2014/g,' · ');if(/\b(Nipun|Shruti)\b/.test(t.data))t.data=t.data.replace(/\bNipun\b/g,'Papa').replace(/\bShruti\b/g,'Mumma');glyphPattern.lastIndex=0;if(glyphPattern.test(t.data))nodes.push(t);}
    for(const t of nodes){const frag=document.createDocumentFragment();let at=0;glyphPattern.lastIndex=0;for(const match of t.data.matchAll(glyphPattern)){frag.append(document.createTextNode(t.data.slice(at,match.index)));const holder=document.createElement('span');holder.innerHTML=icon(glyphs[match[0].replace(/\uFE0F/g,'')]);frag.append(holder.firstChild);at=match.index+match[0].length;}frag.append(document.createTextNode(t.data.slice(at)));t.replaceWith(frag);}
    scope.querySelectorAll('.info-btn').forEach(b=>{if(!b.getAttribute('aria-label'))b.setAttribute('aria-label','Product details');});
    scope.querySelectorAll('.del-btn,.rc-del,.hc-del').forEach(b=>{if(!b.getAttribute('aria-label'))b.setAttribute('aria-label','Remove item or saved order');});
  }
  let portalKey='';
  function portalMessage(s) {
    const el=document.getElementById('hpMessage');if(!el)return;
    if(!s){el.textContent='';portalKey='';return;}
    // Reassurance only accompanies fresh, confirmed entry. No rotation on polling.
    const age=Date.now()-Date.parse(s.updatedAt||s.lastUpdate||s.requestedAt||'');
    const fresh=Number.isFinite(age)&&age<90000;
    const context=s.stale||(!fresh&&!['done','failed','stopped'].includes(s.state))?'uncertain':s.state==='entering'?'running':s.state==='queued'||s.state==='starting'?'queued':s.state==='done'?'done':s.state==='failed'?'attention':s.state==='stopped'?(s.mode==='test'?'testStopped':'stopped'):'setup';
    const next=[s.runId,context].join(':');if(next===portalKey)return;portalKey=next;
    el.textContent=context==='setup'?(s.state==='emailing'?'The email report is being sent.':'Portal ki tayyari chal rahi hai.'):context==='uncertain'?'Checking the latest run status.':context==='testStopped'?'Test run stopped. Check the revert status below.':pick(context);
  }
  window.HeraldUI={icon,pick,screenMessage,entryMessage,home,choose,portalMessage};
  document.querySelectorAll('[data-hf-operator]').forEach(b=>b.onclick=()=>choose(b.dataset.hfOperator));
  home();screenMessage('s-operator');decorate(document.body);
  new MutationObserver(changes=>{
    const roots=new Set();for(const c of changes){if(c.type==='characterData')roots.add(c.target.parentElement);else for(const n of c.addedNodes)roots.add(n.nodeType===1?n:n.parentElement);}
    roots.forEach(decorate);
  }).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
