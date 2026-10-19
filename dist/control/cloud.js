(function(){
  const cfg=window.FIREBASE_CONFIG;
  let app, auth, db, saveTimer=null, saving=false, pending=null;
  const statusListeners=[];
  function emitStatus(kind,text){statusListeners.forEach(fn=>{try{fn({kind,text})}catch(e){}})}
  function init(){
    if(!window.firebase||!cfg){console.warn('Firebase no disponible');return false;}
    try{
      app=firebase.apps.length?firebase.app():firebase.initializeApp(cfg);
      auth=firebase.auth();
      db=firebase.firestore();
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{});
      return true;
    }catch(e){console.error(e);return false;}
  }
  const enabled=init();
  function waitForAuthState(){return new Promise(resolve=>{
    if(!enabled)return resolve(null);
    const unsub=auth.onAuthStateChanged(user=>{unsub();resolve(user||null)},()=>resolve(null));
  })}
  function login(email,password){return auth.signInWithEmailAndPassword(email,password)}
  function logout(){return auth.signOut()}
  function currentUser(){return auth?.currentUser||null}
  function safeDocId(k){return encodeURIComponent(k).replace(/%/g,'_')}
  async function loadState(){
    if(!enabled||!auth.currentUser) return null;
    emitStatus('sync','Cargando datos en línea…');
    const cfgSnap=await db.collection('system').doc('config').get();
    if(!cfgSnap.exists){emitStatus('empty','Base en línea vacía');return null;}
    const base=cfgSnap.data()||{};
    const state={meta:base.meta||{},periods:base.periods||{},groups:{},journal:[],studentFollowups:[]};
    const [groupsSnap,jSnap,fSnap]=await Promise.all([
      db.collection('groups').get(),
      db.collection('journal').get(),
      db.collection('followups').get()
    ]);
    groupsSnap.forEach(d=>{const x=d.data(); if(x&&x.groupKey&&x.data) state.groups[x.groupKey]=x.data;});
    jSnap.forEach(d=>state.journal.push(d.data()));
    fSnap.forEach(d=>state.studentFollowups.push(d.data()));
    state.journal.sort((a,b)=>String(a.createdAt||a.date||'').localeCompare(String(b.createdAt||b.date||'')));
    state.studentFollowups.sort((a,b)=>String(a.createdAt||a.date||'').localeCompare(String(b.createdAt||b.date||'')));
    emitStatus('online','Datos sincronizados');
    return state;
  }
  async function saveStateNow(state){
    if(!enabled||!auth.currentUser) return;
    if(saving){pending=JSON.parse(JSON.stringify(state));return;}
    saving=true;
    emitStatus('sync','Guardando…');
    try{
      const snap=JSON.parse(JSON.stringify(state));
      const batch=db.batch();
      batch.set(db.collection('system').doc('config'),{meta:snap.meta||{},periods:snap.periods||{},updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:auth.currentUser.email||auth.currentUser.uid},{merge:true});
      Object.entries(snap.groups||{}).forEach(([key,g])=>{
        batch.set(db.collection('groups').doc(safeDocId(key)),{groupKey:key,data:g,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
      });
      (snap.journal||[]).forEach(x=>{if(x?.id)batch.set(db.collection('journal').doc(String(x.id)),x,{merge:true})});
      (snap.studentFollowups||[]).forEach(x=>{if(x?.id)batch.set(db.collection('followups').doc(String(x.id)),x,{merge:true})});
      await batch.commit();
      emitStatus('online','Guardado en línea');
    }catch(e){
      console.error('Error al guardar en Firestore',e);
      emitStatus('error','No se pudo guardar en línea');
      throw e;
    }finally{
      saving=false;
      if(pending){const p=pending;pending=null;saveStateNow(p).catch(()=>{});}
    }
  }
  function queueSave(state){
    pending=JSON.parse(JSON.stringify(state));
    clearTimeout(saveTimer);
    saveTimer=setTimeout(()=>{const p=pending;pending=null;if(p)saveStateNow(p).catch(()=>{});},650);
  }
  async function seedState(state){
    if(!enabled) throw new Error('Firebase no disponible');
    // En algunos navegadores auth.currentUser tarda un instante en reflejarse
    // después del inicio de sesión. Esperamos explícitamente antes de sembrar.
    let user=auth.currentUser;
    if(!user) user=await waitForAuthState();
    if(!user) throw new Error('No hay sesión autenticada');
    emitStatus('sync','Subiendo base inicial…');
    const snap=JSON.parse(JSON.stringify(state));
    // Guardamos el documento de configuración primero. Así podemos verificar
    // inmediatamente que Firestore aceptó la escritura.
    await db.collection('system').doc('config').set({
      meta:snap.meta||{},
      periods:snap.periods||{},
      updatedAt:firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy:user.email||user.uid,
      seededAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});

    // Los grupos se escriben por separado para evitar que un error de un lote
    // deje toda la carga inicial sin guardar y para facilitar la verificación.
    for(const [key,g] of Object.entries(snap.groups||{})){
      await db.collection('groups').doc(safeDocId(key)).set({
        groupKey:key,
        data:g,
        updatedAt:firebase.firestore.FieldValue.serverTimestamp()
      },{merge:true});
    }
    for(const x of (snap.journal||[])){
      if(x?.id) await db.collection('journal').doc(String(x.id)).set(x,{merge:true});
    }
    for(const x of (snap.studentFollowups||[])){
      if(x?.id) await db.collection('followups').doc(String(x.id)).set(x,{merge:true});
    }
    // Verificación real de lectura después de sembrar.
    const check=await db.collection('system').doc('config').get({source:'server'});
    if(!check.exists) throw new Error('La verificación de la carga inicial falló');
    emitStatus('online','Base en línea lista');
    return true;
  }

  function publicJournalDoc(x){
    return {
      id:String(x.id),date:x.date||'',title:x.title||'',publicText:x.publicText||'',pending:x.pending||'',
      scope:x.scope||'single',targets:Array.isArray(x.targets)?x.targets:[],shift:x.shift||'',group:x.group||'',course:x.course||'',period:x.period||'P1',
      attachments:Array.isArray(x.attachments)?x.attachments.filter(a=>a&&a.url).map(a=>({title:a.title||'Documento adjunto',url:a.url})):[],
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    };
  }
  async function syncPublicJournal(journal){
    if(!enabled||!auth.currentUser)return;
    const desired=(journal||[]).filter(x=>x&&x.id&&x.classPage&&!x.archived);
    const existing=await db.collection('public_journal').get();
    const desiredIds=new Set(desired.map(x=>String(x.id)));
    const batch=db.batch();
    existing.forEach(d=>{if(!desiredIds.has(d.id))batch.delete(d.ref)});
    desired.forEach(x=>batch.set(db.collection('public_journal').doc(String(x.id)),publicJournalDoc(x),{merge:true}));
    await batch.commit();
  }
  function onStatus(fn){statusListeners.push(fn)}
  window.CLOUD={enabled,waitForAuthState,login,logout,currentUser,loadState,queueSave,saveStateNow,seedState,syncPublicJournal,onStatus};
})();
