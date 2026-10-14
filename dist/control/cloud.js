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
  async function seedState(state){await saveStateNow(state)}
  function onStatus(fn){statusListeners.push(fn)}
  window.CLOUD={enabled,waitForAuthState,login,logout,currentUser,loadState,queueSave,saveStateNow,seedState,onStatus};
})();
