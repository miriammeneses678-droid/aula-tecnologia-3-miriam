(function(){
  'use strict';
  const cfg={
    apiKey:'AIzaSyBM67W0OKF2oqTZOgyWrxSLuIOpRgHS1Ls',
    authDomain:'aula-tecnologia-3.firebaseapp.com',
    projectId:'aula-tecnologia-3',
    storageBucket:'aula-tecnologia-3.firebasestorage.app',
    messagingSenderId:'164057522960',
    appId:'1:164057522960:web:a0f6aa905e481939b37b95'
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fmt=s=>{if(!s)return'';try{return new Date(s+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'})}catch(_){return s}};
  let posts=[],group='Todos';
  function shiftName(){const v=document.querySelector('#turno')?.value||'matutino';return v==='vespertino'?'Vespertino':'Matutino'}
  function applies(p){
    const shift=shiftName();
    if(p.period&&p.period!=='P1')return false;
    if(p.scope==='allTechnology'||p.scope==='all')return true;
    if(p.scope==='tutoring')return false;
    const key=`${shift}|3${group}|Tecnología`;
    if(p.scope==='selected'){
      if(group==='Todos')return (p.targets||[]).some(t=>t.startsWith(shift+'|')&&t.endsWith('|Tecnología'));
      return (p.targets||[]).includes(key);
    }
    if(p.course&&p.course!=='Tecnología')return false;
    if(p.shift&&p.shift!==shift)return false;
    if(group!=='Todos'&&p.group&&p.group!==group)return false;
    return true;
  }
  function scopeLabel(p){
    if(p.scope==='allTechnology')return 'Todos los grupos de Tecnología';
    if(p.scope==='all')return 'Aviso general';
    if(p.scope==='selected')return 'Grupos seleccionados';
    return `${p.shift||''}${p.group?` · 3°${p.group}`:''}`;
  }
  function render(){
    const host=document.querySelector('#bitacora-publica-feed'); if(!host)return;
    const list=posts.filter(applies).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).slice(0,12);
    host.innerHTML=list.length?list.map(p=>`<article class="feed-post feed-post--current bitacora-publica-post"><header class="post-author"><img src="assets/logo-miriam.png" alt=""><div><strong>Mtra. Miriam publicó un aviso</strong><span>${esc(fmt(p.date))} · ${esc(scopeLabel(p))}</span></div><span class="post-badge">AVISO</span></header><div class="post-content"><h2>${esc(p.title||'Información de clase')}</h2><p>${esc(p.publicText||'').replace(/\n/g,'<br>')}</p>${p.pending?`<div class="note-box"><strong>Pendiente / tarea:</strong> ${esc(p.pending).replace(/\n/g,'<br>')}</div>`:''}${(p.attachments||[]).length?`<div class="post-actions">${p.attachments.map(a=>`<a class="primary-action" href="${esc(a.url)}" target="_blank" rel="noopener">📄 ${esc(a.title||'Abrir documento')}</a>`).join('')}</div>`:''}</div></article>`).join(''):'<div class="right-card"><b>No hay avisos nuevos para este turno y grupo.</b></div>';
  }
  function installUi(){
    const turno=document.querySelector('#turno');
    if(turno&&!document.querySelector('#grupo-publico')){
      const lab=document.createElement('label');lab.className='social-shift';lab.innerHTML='<span>Grupo</span><select id="grupo-publico"><option>Todos</option><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option></select>';
      turno.closest('.social-shift')?.after(lab);
      lab.querySelector('select').addEventListener('change',e=>{group=e.target.value;render()});
      turno.addEventListener('change',()=>render());
    }
    if(!document.querySelector('#bitacora-publica-feed')){
      const section=document.createElement('section');section.id='bitacora-publica-section';section.innerHTML='<div class="section-heading"><p class="eyebrow">Información actualizada</p><h2>Avisos recientes</h2><p>Publicaciones registradas por la maestra desde la bitácora de clase.</p></div><div id="bitacora-publica-feed"><div class="right-card">Cargando avisos…</div></div>';
      const anchor=document.querySelector('#actividades-realizadas');
      if(anchor)anchor.parentNode.insertBefore(section,anchor);else document.querySelector('main')?.prepend(section);
    }
  }
  function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
  async function start(){
    installUi();
    try{
      if(!window.firebase)await loadScript('https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js');
      if(!window.firebase.firestore)await loadScript('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore-compat.js');
      const app=window.firebase.apps?.find(a=>a.name==='public-aula')||window.firebase.initializeApp(cfg,'public-aula');
      const db=app.firestore();
      const snap=await db.collection('public_journal').get();
      posts=[];snap.forEach(d=>posts.push(d.data()));render();
    }catch(e){console.warn('No se pudieron cargar avisos públicos',e);const h=document.querySelector('#bitacora-publica-feed');if(h)h.innerHTML='<div class="right-card"><b>Los avisos recientes no están disponibles en este momento.</b></div>';}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
