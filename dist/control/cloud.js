(function(){
  const cfg=window.FIREBASE_CONFIG;
  const PENDING_KEY='tecno41-cloud-pending-v23';
  const LEGACY_PENDING_KEY='tecno41-cloud-pending-v22';
  const CONFIRMED_KEY='tecno41-cloud-last-confirmed-v20';
  const SAVE_DEBOUNCE=1800;
  let app,auth,db,saveTimer=null,saving=false,pending=null,warningTimer=null,reconnectTimer=null,syncedState=null;
  const statusListeners=[];
  function emitStatus(kind,text){statusListeners.forEach(fn=>{try{fn({kind,text})}catch(e){}})}
  function fmtWhen(iso){if(!iso)return 'sin guardado confirmado';try{return new Date(iso).toLocaleString('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit'})}catch(e){return iso}}
  function lastConfirmed(){return localStorage.getItem(CONFIRMED_KEY)||''}
  function clone(x){return JSON.parse(JSON.stringify(x))}
  function signature(x){try{return JSON.stringify(x??null)}catch(e){return String(Date.now())}}
  function setSyncedState(x){syncedState=clone(x)}
  function timeoutPromise(ms){return new Promise((_,reject)=>setTimeout(()=>{const e=new Error('Firebase tardó demasiado en confirmar el guardado');e.code='save-timeout';reject(e)},ms))}
  function withTimeout(promise,ms=15000){return Promise.race([promise,timeoutPromise(ms)])}
  function storePending(state){try{localStorage.setItem(PENDING_KEY,JSON.stringify({queuedAt:new Date().toISOString(),state:clone(state)}));localStorage.removeItem(LEGACY_PENDING_KEY)}catch(e){console.warn('No se pudo guardar copia pendiente local',e)}}
  function getPendingSnapshot(){try{const raw=localStorage.getItem(PENDING_KEY)||localStorage.getItem(LEGACY_PENDING_KEY);return raw?JSON.parse(raw):null}catch(e){return null}}
  function clearPendingSnapshot(){try{localStorage.removeItem(PENDING_KEY);localStorage.removeItem(LEGACY_PENDING_KEY)}catch(e){}}
  function init(){
    if(!window.firebase||!cfg){console.warn('Firebase no disponible');return false;}
    try{
      app=firebase.apps.length?firebase.app():firebase.initializeApp(cfg);auth=firebase.auth();db=firebase.firestore();
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{});
      // Persistencia local de Firestore: si la red cae, el SDK conserva su propia cola además de nuestra copia local.
      if(db.enablePersistence)db.enablePersistence({synchronizeTabs:true}).catch(e=>console.warn('Persistencia Firestore no disponible en esta pestaña',e?.code||e));
      return true;
    }catch(e){console.error(e);return false;}
  }
  const enabled=init();
  function waitForAuthState(){return new Promise(resolve=>{if(!enabled)return resolve(null);const unsub=auth.onAuthStateChanged(user=>{unsub();resolve(user||null)},()=>resolve(null));})}
  function login(email,password){return auth.signInWithEmailAndPassword(email,password)}
  function logout(){return auth.signOut()}
  function currentUser(){return auth?.currentUser||null}
  function safeDocId(k){return encodeURIComponent(k).replace(/%/g,'_')}
  async function loadState(){
    if(!enabled||!auth.currentUser)return null;
    emitStatus('sync','Cargando datos en línea…');
    const cfgSnap=await db.collection('system').doc('config').get();
    if(!cfgSnap.exists){emitStatus('empty','Base en línea vacía');return null;}
    const base=cfgSnap.data()||{},state={meta:base.meta||{},periods:base.periods||{},groups:{},journal:[],studentFollowups:[]};
    const [groupsSnap,jSnap,fSnap]=await Promise.all([db.collection('groups').get(),db.collection('journal').get(),db.collection('followups').get()]);
    groupsSnap.forEach(d=>{const x=d.data();if(x&&x.groupKey&&x.data)state.groups[x.groupKey]=x.data;});
    jSnap.forEach(d=>state.journal.push(d.data()));fSnap.forEach(d=>state.studentFollowups.push(d.data()));
    state.journal.sort((a,b)=>String(a.createdAt||a.date||'').localeCompare(String(b.createdAt||b.date||'')));
    state.studentFollowups.sort((a,b)=>String(a.createdAt||a.date||'').localeCompare(String(b.createdAt||b.date||'')));
    setSyncedState(state);
    emitStatus('online',`Datos sincronizados${lastConfirmed()?` · último guardado confirmado ${fmtWhen(lastConfirmed())}`:''}`);return state;
  }
  function buildDiffBatch(snap){
    const batch=db.batch();let writes=0;const changed=[];
    const prev=syncedState||{meta:null,periods:null,groups:{},journal:[],studentFollowups:[]};
    if(signature({meta:snap.meta||{},periods:snap.periods||{}})!==signature({meta:prev.meta||{},periods:prev.periods||{}})){
      batch.set(db.collection('system').doc('config'),{meta:snap.meta||{},periods:snap.periods||{},updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:auth.currentUser.email||auth.currentUser.uid},{merge:true});writes++;changed.push('configuración');
    }
    Object.entries(snap.groups||{}).forEach(([key,g])=>{
      if(signature(g)!==signature(prev.groups?.[key])){
        batch.set(db.collection('groups').doc(safeDocId(key)),{groupKey:key,data:g,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});writes++;changed.push(key);
      }
    });
    const prevJournal=new Map((prev.journal||[]).filter(x=>x?.id).map(x=>[String(x.id),x]));
    (snap.journal||[]).forEach(x=>{if(x?.id&&signature(x)!==signature(prevJournal.get(String(x.id)))){batch.set(db.collection('journal').doc(String(x.id)),x,{merge:true});writes++;changed.push('bitácora')}});
    const prevFollow=new Map((prev.studentFollowups||[]).filter(x=>x?.id).map(x=>[String(x.id),x]));
    (snap.studentFollowups||[]).forEach(x=>{if(x?.id&&signature(x)!==signature(prevFollow.get(String(x.id)))){batch.set(db.collection('followups').doc(String(x.id)),x,{merge:true});writes++;changed.push('seguimiento')}});
    return{batch,writes,changed};
  }
  function scheduleWarning(){
    clearTimeout(warningTimer);clearTimeout(reconnectTimer);
    warningTimer=setTimeout(()=>emitStatus('warning',`SIN CONFIRMACIÓN de Firebase · último guardado: ${fmtWhen(lastConfirmed())}. Tus cambios están protegidos localmente. Haz clic aquí para reintentar.`),10000);
    reconnectTimer=setTimeout(()=>{if(saving)retryPending(true)},25000);
  }
  async function saveStateNow(state){
    if(!enabled||!auth.currentUser)return;
    const snap=clone(state);pending=snap;storePending(snap);
    if(saving)return;
    if(typeof navigator!=='undefined'&&navigator.onLine===false){emitStatus('warning',`SIN INTERNET · cambios protegidos localmente · último guardado ${fmtWhen(lastConfirmed())}`);return;}
    saving=true;const sending=clone(pending);pending=null;storePending(sending);
    const diff=buildDiffBatch(sending);
    if(!diff.writes){
      const now=new Date().toISOString();localStorage.setItem(CONFIRMED_KEY,now);setSyncedState(sending);if(!pending)clearPendingSnapshot();saving=false;emitStatus('online',`Sin cambios pendientes ✓ · ${fmtWhen(now)}`);return;
    }
    emitStatus('sync',`Guardando ${diff.writes} cambio${diff.writes===1?'':'s'}…`);scheduleWarning();
    try{
      await withTimeout(diff.batch.commit(),15000);
      clearTimeout(warningTimer);clearTimeout(reconnectTimer);
      setSyncedState(sending);
      const now=new Date().toISOString();localStorage.setItem(CONFIRMED_KEY,now);
      emitStatus('online',`Guardado en línea ✓ · ${fmtWhen(now)} · ${diff.writes} cambio${diff.writes===1?'':'s'}`);
      // Solo se borra la copia local si no entraron cambios nuevos mientras se enviaba este lote.
      if(!pending)clearPendingSnapshot();
    }catch(e){
      clearTimeout(warningTimer);clearTimeout(reconnectTimer);console.error('Error al guardar en Firestore',e);
      if(!pending)pending=sending;storePending(pending);
      emitStatus('error',`No se pudo confirmar en Firebase · cambios protegidos localmente · último confirmado ${fmtWhen(lastConfirmed())}. Haz clic para reintentar.`);
    }finally{
      saving=false;
      if(pending){const latest=clone(pending);clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveStateNow(latest),900);}
    }
  }
  function queueSave(state){
    pending=clone(state);storePending(pending);clearTimeout(saveTimer);
    if(typeof navigator!=='undefined'&&navigator.onLine===false){emitStatus('warning',`SIN INTERNET · cambios protegidos localmente · último guardado ${fmtWhen(lastConfirmed())}`);return;}
    saveTimer=setTimeout(()=>{const p=clone(pending);saveStateNow(p)},SAVE_DEBOUNCE);
  }
  async function retryPending(forceNetwork=false){
    const local=getPendingSnapshot();if(local?.state){pending=clone(local.state);storePending(pending)}
    emitStatus('sync','Reintentando conexión con Firebase…');
    if(forceNetwork&&db?.disableNetwork&&db?.enableNetwork){try{await db.disableNetwork();await new Promise(r=>setTimeout(r,350));await db.enableNetwork()}catch(e){console.warn(e)}}
    if(!saving&&pending)saveStateNow(pending);
    else if(saving&&db?.enableNetwork){try{await db.enableNetwork()}catch(e){}}
  }
  async function seedState(state){
    if(!enabled)throw new Error('Firebase no disponible');let user=auth.currentUser;if(!user)user=await waitForAuthState();if(!user)throw new Error('No hay sesión autenticada');
    emitStatus('sync','Subiendo base inicial…');const snap=clone(state);storePending(snap);
    await db.collection('system').doc('config').set({meta:snap.meta||{},periods:snap.periods||{},updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:user.email||user.uid,seededAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    for(const [key,g] of Object.entries(snap.groups||{}))await db.collection('groups').doc(safeDocId(key)).set({groupKey:key,data:g,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    for(const x of (snap.journal||[])){if(x?.id)await db.collection('journal').doc(String(x.id)).set(x,{merge:true});}
    for(const x of (snap.studentFollowups||[])){if(x?.id)await db.collection('followups').doc(String(x.id)).set(x,{merge:true});}
    const check=await db.collection('system').doc('config').get({source:'server'});if(!check.exists)throw new Error('La verificación de la carga inicial falló');
    setSyncedState(snap);const now=new Date().toISOString();localStorage.setItem(CONFIRMED_KEY,now);clearPendingSnapshot();emitStatus('online',`Base en línea lista ✓ · ${fmtWhen(now)}`);return true;
  }
  function publicJournalDoc(x){return{id:String(x.id),date:x.date||'',title:x.title||'',publicText:x.publicText||'',pending:x.pending||'',scope:x.scope||'single',targets:Array.isArray(x.targets)?x.targets:[],shift:x.shift||'',group:x.group||'',course:x.course||'',period:x.period||'P1',attachments:Array.isArray(x.attachments)?x.attachments.filter(a=>a&&a.url).map(a=>({title:a.title||'Documento adjunto',url:a.url})):[],updatedAt:firebase.firestore.FieldValue.serverTimestamp()}}
  async function syncPublicJournal(journal){if(!enabled||!auth.currentUser)return;const desired=(journal||[]).filter(x=>x&&x.id&&x.classPage&&!x.archived),existing=await db.collection('public_journal').get(),desiredIds=new Set(desired.map(x=>String(x.id))),batch=db.batch();existing.forEach(d=>{if(!desiredIds.has(d.id))batch.delete(d.ref)});desired.forEach(x=>batch.set(db.collection('public_journal').doc(String(x.id)),publicJournalDoc(x),{merge:true}));await batch.commit();}
  async function syncFamilyPortal(views){if(!enabled||!auth.currentUser)throw new Error('No hay sesión autenticada');const list=Array.isArray(views)?views.filter(v=>v&&v.docId&&v.data):[];for(let i=0;i<list.length;i+=350){const batch=db.batch();list.slice(i,i+350).forEach(v=>batch.set(db.collection('family_portal').doc(String(v.docId)),{...v.data,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:false}));await batch.commit();}return list.length;}
  async function deleteFamilyPortal(docId){if(!enabled||!auth.currentUser||!docId)return;await db.collection('family_portal').doc(String(docId)).delete();}
  function onStatus(fn){statusListeners.push(fn)}
  if(typeof window!=='undefined'){
    window.addEventListener('online',()=>{emitStatus('sync','Internet restablecido · reintentando guardado…');retryPending(false)});
    window.addEventListener('offline',()=>emitStatus('warning',`SIN INTERNET · cambios protegidos localmente · último guardado ${fmtWhen(lastConfirmed())}`));
  }
  window.CLOUD={enabled,waitForAuthState,login,logout,currentUser,loadState,queueSave,saveStateNow,seedState,syncPublicJournal,syncFamilyPortal,deleteFamilyPortal,onStatus,getPendingSnapshot,clearPendingSnapshot,lastConfirmed,retryPending};
})();
