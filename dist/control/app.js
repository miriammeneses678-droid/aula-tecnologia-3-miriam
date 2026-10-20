const STORAGE='tecno41-control-v9-cloud';
let state=null;
function ensurePeriodData(){
  let changed=false;
  state.periods=state.periods||{
    P1:{name:'Primer periodo',weights:{activities:60,project:30,exam:10},closed:false},
    P2:{name:'Segundo periodo',weights:{activities:60,project:30,exam:10},closed:false},
    P3:{name:'Tercer periodo',weights:{activities:60,project:30,exam:10},closed:false}
  };
  ['P1','P2','P3'].forEach(pid=>{
    const p=state.periods[pid]||(state.periods[pid]={name:pid==='P1'?'Primer periodo':pid==='P2'?'Segundo periodo':'Tercer periodo'});
    if(!p.name)p.name=pid==='P1'?'Primer periodo':pid==='P2'?'Segundo periodo':'Tercer periodo';
    // Migración segura: conserva el encuadre que ya existía como el de Tecnología
    // y crea un encuadre independiente para Tutoría sin tocar actividades ni asistencias.
    if(!p.spaces){
      const oldW=p.weights||{activities:60,project:30,exam:10};
      const oldClosed=!!p.closed;
      p.spaces={
        'Tecnología':{weights:{activities:Number(oldW.activities??60),project:Number(oldW.project??30),exam:Number(oldW.exam??10)},closed:oldClosed},
        'Tutoría':{weights:{activities:80,project:20,exam:0},closed:false}
      };
      changed=true;
    }else{
      if(!p.spaces['Tecnología']){p.spaces['Tecnología']={weights:{activities:60,project:30,exam:10},closed:false};changed=true;}
      if(!p.spaces['Tutoría']){p.spaces['Tutoría']={weights:{activities:80,project:20,exam:0},closed:false};changed=true;}
    }
  });
  Object.values(state.groups||{}).forEach(g=>{
    (g.activities||[]).forEach(a=>{if(!a.period){a.period='P1';changed=true}});
    (g.students||[]).forEach(st=>{if(!st.projectScores){st.projectScores={};changed=true}if(!st.examScores){st.examScores={};changed=true}if(st.familyAccess===undefined){st.familyAccess=null;changed=true}});
  });
  // Migración v14: Proyecto y examen pasan de escala 0-10 a puntos reales del encuadre.
  // Se ejecuta una sola vez y no toca actividades, asistencia, bitácora ni seguimientos.
  state.meta=state.meta||{};
  if(!state.meta.gradePointsV14){
    Object.values(state.groups||{}).forEach(g=>{
      const course=g.course||'Tecnología';
      (g.students||[]).forEach(st=>{
        ['P1','P2','P3'].forEach(pid=>{
          const pcfg=state.periods?.[pid]?.spaces?.[course]||state.periods?.[pid]?.spaces?.['Tecnología'];
          const w=pcfg?.weights||{activities:60,project:30,exam:10};
          const pv=st.projectScores?.[pid];
          const ev=st.examScores?.[pid];
          if(pv!==undefined&&pv!==null&&pv!==''&&pv!=='NA'&&Number(w.project||0)>0){
            st.projectScores[pid]=Math.round((Number(pv)/10*Number(w.project))*10)/10;
          }
          if(ev!==undefined&&ev!==null&&ev!==''&&ev!=='NA'&&Number(w.exam||0)>0){
            st.examScores[pid]=Math.round((Number(ev)/10*Number(w.exam))*10)/10;
          }
        });
      });
    });
    state.meta.gradePointsV14=true;changed=true;
  }
  (state.journal||[]).forEach(x=>{
    if(!x.period){x.period='P1';changed=true}
    // Migración v13: conserva intacta cada bitácora existente y solo añade
    // metadatos opcionales para publicación, alcance, edición y documentos.
    if(!x.scope){x.scope='single';changed=true}
    if(!Array.isArray(x.targets)){x.targets=[];changed=true}
    if(typeof x.familyVisible!=='boolean'){x.familyVisible=!!x.publish;changed=true}
    if(typeof x.classPage!=='boolean'){x.classPage=false;changed=true}
    if(!Array.isArray(x.attachments)){x.attachments=[];changed=true}
    if(typeof x.archived!=='boolean'){x.archived=false;changed=true}
  });
  (state.studentFollowups||[]).forEach(x=>{if(!x.period){x.period='P1';changed=true}});
  return changed;
}
let ui={shift:'Matutino',group:'A',course:'Tecnología',period:'P1',view:'dashboard',projection:false};
const $=s=>document.querySelector(s); const app=$('#app');
function clone(x){return JSON.parse(JSON.stringify(x))}
function loadState(){try{const x=localStorage.getItem(STORAGE);return x?JSON.parse(x):clone(window.INITIAL_DATA)}catch(e){return clone(window.INITIAL_DATA)}}
function save(){localStorage.setItem(STORAGE,JSON.stringify(state)); if(window.CLOUD?.enabled&&window.CLOUD.currentUser()) window.CLOUD.queueSave(state);}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function groupKey(){return `${ui.shift}|3${ui.group}|${ui.course}`}
function grp(){return state.groups[groupKey()]}
// La asistencia pertenece al turno + grupo, no al espacio.
// Si existe Tecnología para ese grupo, se usa como padrón maestro de asistencia
// también cuando se consulta Tutoría. Así 3°C Matutino se pasa lista una sola vez.
function attendanceGroup(){
  const techKey=`${ui.shift}|3${ui.group}|Tecnología`;
  return state.groups[techKey]||grp();
}
function periodBase(){return state.periods[ui.period]||state.periods.P1}
function periodCfg(){const p=periodBase();return p.spaces?.[ui.course]||p.spaces?.['Tecnología']||{weights:{activities:60,project:30,exam:10},closed:false}}
function periodName(){return periodBase().name||ui.period}
function periodActivities(g=grp()){return (g?.activities||[]).filter(a=>a.active&&(a.period||'P1')===ui.period)}
function isPeriodClosed(){return !!periodCfg().closed}
function editableGuard(){if(isPeriodClosed()){toast(`Este periodo de ${ui.course} está cerrado. Reábrelo para modificar datos.`);return false}return true}
function avgActivities(st,g=grp()){const acts=periodActivities(g);const vals=acts.map(a=>st.activityScores?.[a.id]).filter(v=>v!==undefined&&v!=='NA'&&v!==null&&v!=='');return vals.length?vals.reduce((a,b)=>a+Number(b),0)/vals.length:null}
function gradeCalc(st){
  const cfg=periodCfg(),w=cfg.weights||{activities:60,project:30,exam:10};
  const a=avgActivities(st),p=st.projectScores?.[ui.period],e=st.examScores?.[ui.period];
  const activityPoints=a===null?null:Math.round((Number(a)/10*Number(w.activities||0))*10)/10;
  const all=[['activities',activityPoints,Number(w.activities||0)],['project',p,Number(w.project||0)],['exam',e,Number(w.exam||0)]];
  const required=all.filter(x=>x[2]>0);
  const evaluated=required.filter(x=>x[1]!==undefined&&x[1]!==null&&x[1]!==''&&x[1]!=='NA');
  const used=evaluated.reduce((t,x)=>t+x[2],0);
  const earned=evaluated.reduce((t,x)=>t+Number(x[1]),0);
  const provisional=used?earned/used*10:null;
  const complete=required.length>0&&required.every(x=>x[1]!==undefined&&x[1]!==null&&x[1]!==''&&x[1]!=='NA');
  const totalPoints=complete?required.reduce((t,x)=>t+Number(x[1]),0):null;
  const final=complete?totalPoints/10:null;
  return{a,activityPoints,p,e,provisional,final,totalPoints,complete,used,earned};
}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function fmtDate(s){if(!s)return 'Sin fecha';const d=new Date(s+'T12:00:00');return d.toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'})}
function refreshSelectors(){
 const gs=Object.values(state.groups).filter(g=>g.shift===ui.shift&&g.course==='Tecnología').map(g=>g.group).filter((v,i,a)=>a.indexOf(v)===i).sort();
 $('#groupSelect').innerHTML=gs.map(g=>`<option ${g===ui.group?'selected':''}>${g}</option>`).join(''); if(!gs.includes(ui.group))ui.group=gs[0]||'A';
 const courses=Object.values(state.groups).filter(g=>g.shift===ui.shift&&g.group===ui.group).map(g=>g.course).filter((v,i,a)=>a.indexOf(v)===i);
 if(!courses.includes(ui.course))ui.course=courses[0]||'Tecnología'; $('#courseSelect').innerHTML=courses.map(c=>`<option ${c===ui.course?'selected':''}>${c}</option>`).join('');
 if($('#periodSelect')) $('#periodSelect').value=ui.period;
}
function head(title,sub,actions=''){return `<div class="projection-banner">🖥️ MODO PROYECCIÓN · Información confidencial oculta</div><div class="page-head"><div><div class="eyebrow">${esc(ui.shift)} · 3°${esc(ui.group)} · ${esc(ui.course)} · ${esc(periodName())}</div><h1>${title}</h1><p>${sub}</p></div><div class="toolbar">${actions}</div></div>`}
function attendanceStats(g){let a=0,f=0,j=0,r=0;g.students.filter(s=>s.active).forEach(s=>Object.values(s.attendance||{}).forEach(v=>{if(v==='1')a++;if(v==='0')f++;if(v==='J')j++;if(v==='R')r++;}));return{a,f,j,r}}
function activityStats(g){const acts=periodActivities(g);let possible=0,done=0;g.students.filter(s=>s.active).forEach(s=>acts.forEach(a=>{let v=s.activityScores?.[a.id];if(v!==undefined&&v!=='NA'){possible++;if(Number(v)>0)done++;}}));return{acts:acts.length,done,possible}}
function renderDashboard(){const g=grp();if(!g)return;const ag=attendanceGroup()||g,at=attendanceStats(ag),ac=activityStats(g),active=g.students.filter(s=>s.active).length,flags=g.students.filter(s=>s.active&&s.privateFlag).length;
 const dw=periodCfg().weights||{activities:60,project:30,exam:10},dFormula=[`${dw.activities}% actividades`,Number(dw.project||0)>0?`${dw.project}% proyecto`:'',Number(dw.exam||0)>0?`${dw.exam}% examen`:''].filter(Boolean).join(' · ');
 app.innerHTML=head('Panel del grupo','Vista rápida de tu trabajo diario.')+`<div class="period-strip ${isPeriodClosed()?'period-closed':''}"><div><b>${esc(periodName())} · ${esc(ui.course)}</b><span>Encuadre: ${dFormula}</span></div><span class="badge ${isPeriodClosed()?'bad':'good'}">${isPeriodClosed()?'Periodo cerrado':'Periodo abierto'}</span></div><div class="cards"><div class="card metric"><strong>${active}</strong><span>Alumnos activos</span></div><div class="card metric"><strong>${ac.acts}</strong><span>Actividades registradas</span></div><div class="card metric"><strong>${ag.attendanceDates.length}</strong><span>Sesiones de asistencia</span></div><div class="card metric private-only"><strong>${flags}</strong><span>Seguimientos confidenciales</span></div></div><div class="grid-2"><section class="card"><h2>Acciones rápidas</h2><div class="toolbar"><button class="btn primary" onclick="go('attendance')">✓ Pasar asistencia</button><button class="btn primary" onclick="go('activities')">▦ Registrar actividad</button><button class="btn gold private-only" onclick="openJournal()">✎ Bitácora de hoy</button></div><div class="notice">La lista se genera desde una sola base maestra. Un alumno nuevo aparecerá automáticamente en asistencia y actividades.</div></section><section class="card"><h2>Asistencia acumulada</h2><p><b>${at.a}</b> asistencias · <b>${at.f}</b> faltas · <b>${at.j}</b> justificadas · <b>${at.r}</b> retardos/retiros</p><div class="progress"><span style="width:${at.a+at.f+at.j+at.r?Math.round((at.a+at.j)/(at.a+at.f+at.j+at.r)*100):0}%"></span></div></section></div>`;
}
function latestDateId(g){return g.attendanceDates.length?g.attendanceDates[g.attendanceDates.length-1].id:''}
function renderAttendance(){
 const g=attendanceGroup();if(!g)return;
 const mode=window._attMode||'daily';window._attMode=mode;
 const modeBtns=`<div class="view-switch"><button class="btn ${mode==='daily'?'primary':'secondary'}" onclick="setAttendanceMode('daily')">Vista diaria</button><button class="btn ${mode==='monthly'?'primary':'secondary'}" onclick="setAttendanceMode('monthly')">Vista mensual</button></div>`;
 if(mode==='monthly'){renderAttendanceMonthly(g,modeBtns);return;}
 let dateId=window._attDate||latestDateId(g);window._attDate=dateId;
 const options=g.attendanceDates.map(d=>`<option value="${esc(d.id)}" ${d.id===dateId?'selected':''}>${fmtDate(d.date)}${d.id.includes('#')?' · sesión 2':''}</option>`).join('');
 app.innerHTML=head('Asistencia','1 = asistencia · 0 = falta · J = justificada · R = retardo · — = no aplica'+(ui.course!=='Tecnología'?' · Asistencia compartida con Tecnología':''),`<button class="btn primary private-only" onclick="newAttendanceDate()">+ Nueva fecha</button>`)+modeBtns+`<div class="toolbar"><label class="field" style="min-width:230px;margin:0"><span>Fecha/sesión</span><select id="attDate">${options||'<option>Sin fechas registradas</option>'}</select></label>${dateId?'<button class="btn secondary private-only" onclick="markAllPresent()">Todos = 1</button>':''}</div>${dateId?`<div class="table-wrap"><table><thead><tr><th class="num">N.º</th><th>Alumno</th><th>Estado</th></tr></thead><tbody>${g.students.filter(s=>s.active).map(s=>rowAttendance(s,dateId)).join('')}</tbody></table></div>`:'<div class="empty card">Aún no has creado una fecha de asistencia para este grupo.</div>'}`;
 $('#attDate')?.addEventListener('change',e=>{window._attDate=e.target.value;renderAttendance()});
}
function setAttendanceMode(mode){window._attMode=mode;renderAttendance()}
function attendanceMonthDefault(g){
 const dates=g.attendanceDates.map(d=>d.date).filter(Boolean).sort();
 return window._attMonth||(dates.length?dates[dates.length-1].slice(0,7):new Date().toISOString().slice(0,7));
}
function sessionHasAttendance(g, session){
 return g.students.some(s=>{const v=s.attendance?.[session.id];return ['1','0','J','R'].includes(v)});
}
function renderAttendanceMonthly(g,modeBtns){
 const month=attendanceMonthDefault(g);window._attMonth=month;
 const view=window._attMonthView||'classes';window._attMonthView=view;
 const [year,mon]=month.split('-').map(Number),days=new Date(year,mon,0).getDate();
 const sessions={};
 g.attendanceDates.filter(d=>d.date&&d.date.startsWith(month)).forEach(d=>{if(!sessions[d.date])sessions[d.date]=[];sessions[d.date].push(d)});
 const registeredDates=Object.keys(sessions).filter(date=>sessions[date].some(session=>sessionHasAttendance(g,session))).sort();
 const columns=view==='classes'
   ? registeredDates
   : Array.from({length:days},(_,i)=>`${month}-${String(i+1).padStart(2,'0')}`);
 const dayHeaders=columns.map(key=>{
   const has=!!sessions[key]&&sessions[key].some(session=>sessionHasAttendance(g,session)),day=Number(key.slice(-2));
   const label=view==='classes'?`${day}<small>${new Date(key+'T12:00:00').toLocaleDateString('es-MX',{weekday:'short'}).replace('.','')}</small>`:`${day}`;
   return `<th class="attendance-day-head ${has?'registered':'unregistered'}" title="${has?'Asistencia registrada':'Sin registro para este grupo'}">${label}</th>`;
 }).join('');
 const students=g.students.filter(s=>s.active);
 const rows=students.map(s=>{
   let a=0,f=0,j=0,r=0;
   const cells=columns.map(key=>{
     const ses=(sessions[key]||[]).filter(session=>sessionHasAttendance(g,session));
     if(!ses.length)return `<td class="attendance-month-cell no-session" title="Sin clase/registro">—</td>`;
     const id=ses[0].id,v=s.attendance?.[id]??'NA';
     if(v==='1')a++;else if(v==='0')f++;else if(v==='J')j++;else if(v==='R')r++;
     const shown=v==='NA'?'—':v;
     return `<td class="attendance-month-cell att-${String(v).toLowerCase()}" title="${fmtDate(key)} · clic para cambiar" onclick="cycleMonthlyAttendance('${s.id}','${id}')">${shown}${ses.length>1?'<sup>+</sup>':''}</td>`;
   }).join('');
   return `<tr><td class="num sticky-col sticky-num">${s.listNo}</td><td class="student-name sticky-col sticky-name">${esc(s.name)}${s.privateFlag?'<span class="private-flag private-only">⚑</span>':''}</td>${cells}<td class="summary-cell">${a}</td><td class="summary-cell">${f}</td><td class="summary-cell">${j}</td><td class="summary-cell">${r}</td></tr>`;
 }).join('');
 const empty=view==='classes'&&!registeredDates.length?'<div class="empty card">No hay fechas de asistencia registradas para este grupo en este mes.</div>':'';
 const table=columns.length?`<div class="table-wrap attendance-month-wrap"><table class="attendance-month-table"><thead><tr><th class="num sticky-col sticky-num">N.º</th><th class="sticky-col sticky-name">Alumno</th>${dayHeaders}<th>Asist.</th><th>Faltas</th><th>Just.</th><th>Ret.</th></tr></thead><tbody>${rows}</tbody></table></div>`:'';
 app.innerHTML=head('Asistencia','Vista mensual del grupo. En modo Solo clases aparecen únicamente las fechas donde realmente capturaste asistencia.'+(ui.course!=='Tecnología'?' Esta asistencia es la misma de Tecnología.':''),`<button class="btn primary private-only" onclick="newAttendanceDate()">+ Nueva fecha</button>`)+modeBtns+`<div class="toolbar monthly-toolbar"><label class="field" style="min-width:210px;margin:0"><span>Mes</span><input id="attMonth" type="month" value="${month}"></label><div class="view-switch compact"><button class="btn ${view==='classes'?'primary':'secondary'}" onclick="setAttendanceMonthView('classes')">Solo clases</button><button class="btn ${view==='all'?'primary':'secondary'}" onclick="setAttendanceMonthView('all')">Todos los días</button></div><span class="badge neutral">${view==='classes'?'Solo días con asistencia capturada':'— gris = sin clase / sin registro'}</span></div>${empty}${table}`;
 $('#attMonth')?.addEventListener('change',e=>{window._attMonth=e.target.value;renderAttendance()});
}
function setAttendanceMonthView(view){window._attMonthView=view;renderAttendance()}
function cycleMonthlyAttendance(studentId,dateId){
 const s=attendanceGroup().students.find(x=>x.id===studentId);if(!s)return;
 s.attendance=s.attendance||{};const order=['1','0','J','R','NA'],cur=s.attendance[dateId]??'NA',next=order[(order.indexOf(cur)+1)%order.length];
 s.attendance[dateId]=next;save();renderAttendance();
}
function rowAttendance(s,dateId){const v=s.attendance?.[dateId]??'';return `<tr><td class="num">${s.listNo}</td><td class="student-name">${esc(s.name)}${s.privateFlag?'<span class="private-flag private-only" title="Seguimiento confidencial">⚑</span>':''}</td><td><div class="status-pills">${['1','0','J','R','NA'].map(x=>`<button class="pill ${v===x?'active':''}" data-status="${x}" onclick="setAttendance('${s.id}','${dateId}','${x}')">${x==='NA'?'—':x}</button>`).join('')}</div></td></tr>`}
function setAttendance(id,dateId,v){const s=attendanceGroup().students.find(x=>x.id===id);if(!s)return;s.attendance=s.attendance||{};s.attendance[dateId]=v;save();renderAttendance()}
function markAllPresent(){const ag=attendanceGroup();const d=window._attDate||latestDateId(ag);ag.students.filter(s=>s.active).forEach(s=>{s.attendance=s.attendance||{};s.attendance[d]='1'});save();renderAttendance();toast('Asistencia marcada en 1 para el grupo')}
function newAttendanceDate(){const today=new Date().toISOString().slice(0,10);modal(`<h2>Nueva asistencia</h2><div class="field"><label>Fecha</label><input id="newAttDate" type="date" value="${today}"></div><div class="notice">Al crearla, todos quedarán inicialmente en <b>1</b>. Solo cambias faltas, justificadas o retardos.</div>`,`<button class="btn secondary" onclick="closeModal()">Cancelar</button><button class="btn primary" onclick="createAttendanceDate()">Crear</button>`)}
function createAttendanceDate(){const d=$('#newAttDate').value;if(!d)return;const g=attendanceGroup();let id=d,n=2;while(g.attendanceDates.some(x=>x.id===id)){id=`${d}#${n++}`};g.attendanceDates.push({id,date:d});g.students.filter(s=>s.active).forEach(s=>{s.attendance=s.attendance||{};s.attendance[id]='1'});window._attDate=id;save();closeModal();renderAttendance();toast('Nueva sesión creada')}
function renderActivities(){
 const g=grp();if(!g)return;const acts=periodActivities(g),students=g.students.filter(s=>s.active);
 app.innerHTML=head('Actividades','Vista completa para revisar varios sellos del mismo alumno sin cambiar de actividad.',`${isPeriodClosed()?'':`<button class="btn primary private-only" onclick="newActivity()">+ Nueva actividad</button>`}`)+
 `<div class="activity-help private-only"><b>Captura rápida:</b> escribe <b>10</b>, <b>5</b>, <b>0</b> o <b>—</b>. Presiona <b>Tab</b> para brincar a la siguiente actividad del alumno. También puedes tocar su nombre para abrir la revisión individual.</div>
 <div class="toolbar activity-toolbar private-only"><span class="badge good">10 = entregada</span><span class="badge warn">5 = parcial</span><span class="badge bad">0 = pendiente</span><span class="badge neutral">— = no aplica / sin registrar</span><span class="spacer"></span><button class="btn secondary" onclick="manageActivities()">⚙ Administrar actividades</button><button class="btn secondary" onclick="openBulkActivity()">✓ Todos = 10 por actividad</button></div>
 ${acts.length?`<div class="table-wrap activity-matrix-wrap"><table class="activity-matrix"><thead><tr><th class="num sticky-col sticky-num">N.º</th><th class="sticky-col sticky-name">Alumno</th>${acts.map(a=>`<th class="activity-head" title="${esc(a.name)}"><span>${esc(a.name)}</span></th>`).join('')}<th class="sticky-right">Avance</th></tr></thead><tbody>${students.map(s=>rowActivityMatrix(s,acts)).join('')}</tbody></table></div>`:'<div class="empty card">Aún no hay actividades.</div>'}`;
 document.querySelectorAll('.score-input').forEach(inp=>{
   inp.addEventListener('focus',e=>e.target.select());
   inp.addEventListener('keydown',e=>{
     if(e.key==='Enter'){e.preventDefault();const all=[...document.querySelectorAll('.score-input')],i=all.indexOf(e.target);all[i+1]?.focus();}
   });
   inp.addEventListener('change',e=>commitScoreInput(e.target));
 });
}
function rowActivityMatrix(s,acts){
 const done=acts.filter(a=>{const v=s.activityScores?.[a.id];return v!==undefined&&v!=='NA'&&Number(v)>0}).length;
 return `<tr><td class="num sticky-col sticky-num">${s.listNo}</td><td class="student-name sticky-col sticky-name"><button class="student-review" onclick="reviewStudentActivities('${s.id}')">${esc(s.name)}</button>${s.privateFlag?'<span class="private-flag private-only">⚑</span>':''}</td>${acts.map(a=>scoreCell(s,a)).join('')}<td class="sticky-right"><span class="badge ${done===acts.length?'good':done/Math.max(acts.length,1)>=.7?'warn':'bad'}">${done}/${acts.length}</span></td></tr>`
}
function scoreCell(s,a){const raw=s.activityScores?.[a.id],v=(raw===undefined||raw==='NA')?'—':raw;const cls=v===10||v==='10'?'score-10':v===5||v==='5'?'score-5':v===0||v==='0'?'score-0':'score-na';return `<td class="score-td"><input class="score-input ${cls}" inputmode="numeric" data-student="${s.id}" data-activity="${a.id}" value="${v}" aria-label="${esc(s.name)} · ${esc(a.name)}" title="${esc(a.name)}"></td>`}
function normalizeScore(v){v=String(v??'').trim().toUpperCase();if(v===''||v==='-'||v==='—'||v==='NA'||v==='N/A')return 'NA';if(v==='10')return 10;if(v==='5')return 5;if(v==='0')return 0;return null}
function commitScoreInput(inp){if(!editableGuard()){renderActivities();return}const v=normalizeScore(inp.value);if(v===null){toast('Usa 10, 5, 0 o —');const s=grp().students.find(x=>x.id===inp.dataset.student);const old=s?.activityScores?.[inp.dataset.activity];inp.value=(old===undefined||old==='NA')?'—':old;return}const s=grp().students.find(x=>x.id===inp.dataset.student);if(!s)return;s.activityScores=s.activityScores||{};s.activityScores[inp.dataset.activity]=v;save();const shown=v==='NA'?'—':v;inp.value=shown;inp.className='score-input '+(v===10?'score-10':v===5?'score-5':v===0?'score-0':'score-na')}
function reviewStudentActivities(id){const g=grp(),s=g.students.find(x=>x.id===id),acts=periodActivities(g);if(!s)return;modal(`<h2>Revisión rápida</h2><div class="student-review-title">${esc(s.name)}</div><p class="small-note">Todas sus actividades en una sola vista. Toca el valor correspondiente.</p><div class="review-grid">${acts.map(a=>{const v=s.activityScores?.[a.id];return `<div class="review-item"><div><b>${esc(a.name)}</b>${a.date?`<small>${fmtDate(a.date)}</small>`:''}</div><div class="status-pills">${[10,5,0,'NA'].map(x=>`<button class="pill ${String(v)===String(x)?'active':''}" data-score="${x}" onclick="setScoreQuick('${s.id}','${a.id}','${x}',this)">${x==='NA'?'—':x}</button>`).join('')}</div></div>`}).join('')}</div>`,`<button class="btn primary" onclick="closeModal();renderActivities()">Terminar revisión</button>`)}
function setScoreQuick(id,aid,v,btn){if(!editableGuard())return;const s=grp().students.find(x=>x.id===id);if(!s)return;s.activityScores=s.activityScores||{};s.activityScores[aid]=v==='NA'?'NA':Number(v);save();btn.parentElement.querySelectorAll('.pill').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}
function openBulkActivity(){const acts=periodActivities(grp());modal(`<h2>Marcar grupo completo</h2><p>Elige la actividad que quieres poner en <b>10 para todos</b>. Se pedirá confirmación antes de aplicar.</p><div class="field"><label>Actividad</label><select id="bulkActivity">${acts.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join('')}</select></div>`,`<button class="btn secondary" onclick="closeModal()">Cancelar</button><button class="btn danger" onclick="confirmBulkActivity()">Todos = 10</button>`)}
function confirmBulkActivity(){if(!editableGuard())return;const aid=$('#bulkActivity').value,a=grp().activities.find(x=>x.id===aid);if(!a)return;if(!confirm(`¿Poner 10 a TODOS los alumnos en "${a.name}"?`))return;grp().students.filter(s=>s.active).forEach(s=>{s.activityScores=s.activityScores||{};s.activityScores[aid]=10});save();closeModal();renderActivities();toast('Actividad marcada en 10 para el grupo')}
function setScore(id,aid,v){if(!editableGuard())return;const s=grp().students.find(x=>x.id===id);s.activityScores=s.activityScores||{};s.activityScores[aid]=v==='NA'?'NA':Number(v);save();renderActivities()}
function markActivityAll(v){if(!editableGuard())return;const aid=window._activityId;if(!aid)return;grp().students.filter(s=>s.active).forEach(s=>{s.activityScores=s.activityScores||{};s.activityScores[aid]=v});save();renderActivities();toast('Actividad actualizada para el grupo')}
function activityTargetOptions(){
  const entries=Object.entries(state.groups||{}).filter(([,g])=>g.course===ui.course).sort((a,b)=>`${a[1].shift}${a[1].group}`.localeCompare(`${b[1].shift}${b[1].group}`,'es'));
  return entries.map(([key,g])=>`<label class="check-row"><input type="checkbox" class="act-target" value="${esc(key)}" ${key===groupKey()?'checked':''}> <span>${esc(g.shift)} · 3°${esc(g.group)} · ${esc(g.course)}</span></label>`).join('');
}
function toggleActivityTargets(){const box=$('#actTargets');if(box)box.style.display=$('#actScope')?.value==='selected'?'grid':'none'}
function newActivity(){if(!editableGuard())return;modal(`<h2>Nueva actividad</h2><div class="field"><label>Nombre</label><input id="actName" placeholder="Ej. Práctica 5 — Función SI"></div><div class="form-grid"><div class="field"><label>Fecha</label><input id="actDate" type="date" value="${new Date().toISOString().slice(0,10)}"></div><div class="field"><label>Valor máximo</label><input id="actMax" type="number" value="10" min="1"></div></div><div class="field"><label>Crear actividad para</label><select id="actScope" onchange="toggleActivityTargets()"><option value="single">Solo este grupo</option><option value="shiftCourse">Todos los grupos de ${esc(ui.course)} del turno ${esc(ui.shift)}</option><option value="allCourse">Todos los grupos de ${esc(ui.course)}</option><option value="selected">Varios grupos de ${esc(ui.course)}</option></select></div><div id="actTargets" class="target-grid" style="display:none">${activityTargetOptions()}</div><div class="field"><label>¿Qué debe realizar el alumno?</label><textarea id="actDetail" placeholder="Descripción breve para usar después en el portal familiar y la página de clase."></textarea></div><div class="notice"><b>Importante:</b> se crea la misma actividad en los grupos seleccionados, pero las calificaciones de cada alumno siguen siendo independientes.</div>`,`<button class="btn secondary" onclick="closeModal()">Cancelar</button><button class="btn primary" onclick="createActivity()">Guardar actividad</button>`)}
function createActivity(){
  const n=$('#actName').value.trim();if(!n)return toast('Escribe el nombre');
  const scope=$('#actScope')?.value||'single';
  let targets=[];
  if(scope==='single')targets=[groupKey()];
  if(scope==='shiftCourse')targets=Object.entries(state.groups||{}).filter(([,g])=>g.course===ui.course&&g.shift===ui.shift).map(([k])=>k);
  if(scope==='allCourse')targets=Object.entries(state.groups||{}).filter(([,g])=>g.course===ui.course).map(([k])=>k);
  if(scope==='selected')targets=[...document.querySelectorAll('.act-target:checked')].map(x=>x.value);
  targets=[...new Set(targets)].filter(k=>state.groups[k]);
  if(!targets.length)return toast('Selecciona al menos un grupo');
  const id='act-'+Date.now(),date=$('#actDate').value,maxScore=Number($('#actMax').value||10),detail=$('#actDetail').value.trim();
  targets.forEach(k=>{
    const g=state.groups[k];
    g.activities=g.activities||[];
    if(!g.activities.some(a=>a.id===id))g.activities.push({id,name:n,date,maxScore,detail,category:'Actividad',period:ui.period,active:true,sharedActivity:true});
    (g.students||[]).forEach(s=>{s.activityScores=s.activityScores||{};if(s.activityScores[id]===undefined)s.activityScores[id]='NA'});
  });
  window._activityId=id;save();closeModal();renderActivities();
  const label=targets.length===1?'1 grupo':`${targets.length} grupos`;
  toast(`Actividad creada en ${label}`);
}

function activityCopies(id){
  const out=[];
  Object.entries(state.groups||{}).forEach(([key,g])=>{
    (g.activities||[]).forEach(a=>{if(a.id===id)out.push({key,g,a})});
  });
  return out;
}
function manageActivities(){
  const g=grp();if(!g)return;
  const items=(g.activities||[]).filter(a=>(a.period||'P1')===ui.period);
  const rows=items.length?items.map(a=>{
    const copies=activityCopies(a.id).length;
    const archived=a.active===false;
    return `<div class="review-item"><div><b>${esc(a.name)}</b><small>${a.date?fmtDate(a.date):'Sin fecha'} · ${copies===1?'1 grupo':copies+' grupos'} · ${archived?'Archivada':'Activa'}</small></div><div class="status-pills"><button class="btn secondary small" onclick="editActivity('${a.id}')">Editar actividad</button><button class="btn secondary small" onclick="toggleArchiveActivity('${a.id}')">${archived?'Reactivar actividad':'Archivar actividad'}</button><button class="btn danger small" onclick="deleteActivity('${a.id}')">Eliminar actividad</button></div></div>`;
  }).join(''):'<div class="empty">No hay actividades en este periodo.</div>';
  modal(`<h2>Administrar actividades</h2><p class="small-note">Editar, archivar o eliminar una actividad. Si fue creada para varios grupos, la acción se aplica a todas sus copias.</p><div class="review-grid">${rows}</div>`,`<button class="btn primary" onclick="closeModal();renderActivities()">Cerrar</button>`)
}
function editActivity(id){
  const copies=activityCopies(id);if(!copies.length)return toast('Actividad no encontrada');
  const a=copies[0].a;
  modal(`<h2>Editar actividad</h2><div class="field"><label>Nombre</label><input id="editActName" value="${esc(a.name||'')}"></div><div class="form-grid"><div class="field"><label>Fecha</label><input id="editActDate" type="date" value="${esc(a.date||'')}"></div><div class="field"><label>Valor máximo</label><input id="editActMax" type="number" min="1" value="${Number(a.maxScore||10)}"></div></div><div class="field"><label>¿Qué debe realizar el alumno?</label><textarea id="editActDetail">${esc(a.detail||'')}</textarea></div><div class="notice">Los cambios se aplicarán a ${copies.length===1?'este grupo':copies.length+' grupos'} porque comparten la misma actividad.</div>`,`<button class="btn secondary" onclick="manageActivities()">Cancelar</button><button class="btn primary" onclick="saveActivityEdit('${id}')">Guardar cambios</button>`)
}
function saveActivityEdit(id){
  if(!editableGuard())return;
  const name=$('#editActName')?.value.trim();if(!name)return toast('Escribe el nombre');
  const date=$('#editActDate')?.value||'';
  const maxScore=Math.max(1,Number($('#editActMax')?.value||10));
  const detail=$('#editActDetail')?.value.trim()||'';
  const copies=activityCopies(id);if(!copies.length)return toast('Actividad no encontrada');
  copies.forEach(({a})=>{a.name=name;a.date=date;a.maxScore=maxScore;a.detail=detail});
  save();manageActivities();toast('Actividad actualizada en todos sus grupos')
}
function toggleArchiveActivity(id){
  if(!editableGuard())return;
  const copies=activityCopies(id);if(!copies.length)return toast('Actividad no encontrada');
  const next=!(copies[0].a.active!==false);
  copies.forEach(({a})=>a.active=next);
  save();manageActivities();toast(next?'Actividad reactivada':'Actividad archivada')
}
function deleteActivity(id){
  if(!editableGuard())return;
  const copies=activityCopies(id);if(!copies.length)return toast('Actividad no encontrada');
  if(!confirm('¿Seguro que deseas eliminar esta actividad de todos los grupos donde fue creada? Esta acción no se puede deshacer.'))return;
  copies.forEach(({g})=>{
    g.activities=(g.activities||[]).filter(a=>a.id!==id);
    (g.students||[]).forEach(st=>{if(st.activityScores&&Object.prototype.hasOwnProperty.call(st.activityScores,id))delete st.activityScores[id]});
  });
  save();closeModal();renderActivities();toast('Actividad eliminada de todos los grupos donde fue creada')
}
function journalTargetKey(shift,group,course){return `${shift}|3${group}|${course}`}
function journalScopeLabel(j){
  if(j.scope==='allTechnology')return 'Todos los grupos de Tecnología';
  if(j.scope==='all')return 'Todos los grupos';
  if(j.scope==='tutoring')return 'Tutoría';
  if(j.scope==='selected')return 'Grupos seleccionados';
  return `${j.shift||ui.shift} · 3°${j.group||ui.group} · ${j.course||ui.course}`;
}
function journalApplies(j){
  if(j.archived)return false;
  if((j.period||'P1')!==ui.period)return false;
  const key=journalTargetKey(ui.shift,ui.group,ui.course);
  if(j.scope==='all')return true;
  if(j.scope==='allTechnology')return ui.course==='Tecnología';
  if(j.scope==='tutoring')return ui.course==='Tutoría';
  if(j.scope==='selected')return (j.targets||[]).includes(key);
  return j.shift===ui.shift&&j.group===ui.group&&j.course===ui.course;
}
function journalAttachmentHtml(j){
  const at=(j.attachments||[]).filter(a=>a?.url);
  if(!at.length)return '';
  return `<div class="journal-files"><b>Material adjunto</b>${at.map(a=>`<a class="journal-file" href="${esc(a.url)}" target="_blank" rel="noopener">📄 ${esc(a.title||'Abrir documento')}</a>`).join('')}</div>`;
}
function renderJournal(){
 const entries=(state.journal||[]).filter(journalApplies).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));
 app.innerHTML=head('Bitácora de clase','Registra una vez, edita cuando lo necesites y decide si aplica a un grupo, varios grupos o a todos.',`<button class="btn primary private-only" onclick="openJournal()">+ Nueva publicación</button>`)+
 `${entries.length?entries.map(j=>`<article class="card journal-card" style="margin-bottom:1rem">
   <div class="journal-card-head"><div><div class="eyebrow">${fmtDate(j.date)} · ${esc(journalScopeLabel(j))}</div><h2>${esc(j.title||'Clase')}</h2></div><div class="toolbar private-only"><button class="btn secondary small" onclick="editJournal('${j.id}')">✏️ Editar</button><button class="btn ghost small" onclick="archiveJournal('${j.id}')">Archivar</button></div></div>
   <div class="journal-grid">
    <div class="public-box"><b>Información para alumnos y familias</b><p class="journal-text">${nl2br(j.publicText||'Sin texto público')}</p>${j.pending?`<div class="journal-pending"><b>Pendiente / tarea</b><p>${nl2br(j.pending)}</p></div>`:''}${journalAttachmentHtml(j)}<div class="journal-flags"><span class="badge ${j.familyVisible?'good':'neutral'}">${j.familyVisible?'Visible para familias':'No publicado a familias'}</span>${j.classPage?'<span class="badge good">Aula pública</span>':''}</div></div>
    <div class="private-box private-only"><b>Nota docente privada</b><p class="journal-text">${nl2br(j.privateText||'Sin observaciones')}</p>${j.rawText?`<details><summary>Notas rápidas originales</summary><p class="journal-text">${nl2br(j.rawText)}</p></details>`:''}</div>
   </div>
 </article>`).join(''):'<div class="empty card">Aún no hay bitácoras aplicables a este grupo y periodo.</div>'}`;
}
function nl2br(s=''){return esc(s).replace(/\n/g,'<br>')}
function improveFamilyDraft(){
 const raw=$('#jRaw')?.value.trim()||$('#jPublic')?.value.trim()||'';
 const pending=$('#jPending')?.value.trim()||'';
 if(!raw){toast('Escribe primero tus notas rápidas de la clase');return}
 let text=raw.replace(/\s+/g,' ').trim();
 text=text.charAt(0).toUpperCase()+text.slice(1);
 if(!/[.!?]$/.test(text))text+='.';
 let out=`Durante la clase de hoy, ${text.charAt(0).toLowerCase()+text.slice(1)}`;
 if(pending)out+=` Como seguimiento, queda pendiente: ${pending.charAt(0).toLowerCase()+pending.slice(1).replace(/[.!?]+$/,'')}.`;
 out+=' Se agradece el acompañamiento de las familias para dar continuidad al trabajo y favorecer el avance del grupo.';
 $('#jPublic').value=out;
 previewJournal();toast('Borrador preparado. Revísalo antes de publicar.');
}
function journalTargetOptions(existing){
 const keys=Object.entries(state.groups||{}).map(([key,g])=>({key,g})).sort((a,b)=>`${a.g.shift}${a.g.group}${a.g.course}`.localeCompare(`${b.g.shift}${b.g.group}${b.g.course}`,'es'));
 const selected=new Set(existing?.targets||[]);
 return keys.map(({key,g})=>`<label class="target-check"><input type="checkbox" class="jTarget" value="${esc(key)}" ${selected.has(key)?'checked':''}> <span>${esc(g.shift)} · 3°${esc(g.group)} · ${esc(g.course)}</span></label>`).join('');
}
function attachmentRows(existing=[]){
 const arr=[...(existing||[])]; while(arr.length<2)arr.push({title:'',url:''});
 return arr.slice(0,4).map((a,i)=>`<div class="attachment-row"><input class="jAttTitle" placeholder="Nombre visible, ej. Actividades por incapacidad" value="${esc(a?.title||'')}"><input class="jAttUrl" type="url" placeholder="Pega aquí el enlace de Google Drive" value="${esc(a?.url||'')}"></div>`).join('');
}
function scopeOptions(j={}){const v=j.scope||'single';return `<option value="single" ${v==='single'?'selected':''}>Solo este grupo</option><option value="selected" ${v==='selected'?'selected':''}>Varios grupos seleccionados</option><option value="allTechnology" ${v==='allTechnology'?'selected':''}>Todos los grupos de Tecnología</option><option value="all" ${v==='all'?'selected':''}>Todos los grupos</option><option value="tutoring" ${v==='tutoring'?'selected':''}>Solo Tutoría</option>`}
function openJournal(id=''){
 const j=id?(state.journal||[]).find(x=>x.id===id):null;window._journalEditId=id||'';
 const date=j?.date||new Date().toISOString().slice(0,10),title=j?.title||'',raw=j?.rawText||'',pending=j?.pending||'',pub=j?.publicText||'',priv=j?.privateText||'';
 modal(`<h2>${j?'Editar publicación':'Nueva bitácora / publicación'}</h2>
 <div class="form-grid"><div class="field"><label>Fecha</label><input id="jDate" type="date" value="${esc(date)}"></div><div class="field"><label>Título / tema</label><input id="jTitle" value="${esc(title)}" placeholder="Ej. Actividades por incapacidad"></div></div>
 <div class="field"><label>¿Dónde debe aparecer?</label><select id="jScope" onchange="toggleJournalTargets()">${scopeOptions(j||{})}</select><div id="jTargetsWrap" class="target-box" style="display:none"><b>Selecciona los grupos</b><div class="target-grid">${journalTargetOptions(j)}</div></div></div>
 <div class="field"><label>Notas rápidas de lo ocurrido</label><textarea id="jRaw" placeholder="Escribe como te salga; después puedes mejorar la redacción.">${esc(raw)}</textarea></div>
 <div class="field"><label>Pendiente / tarea</label><textarea id="jPending" placeholder="Ej. Realizar las actividades del PDF durante esta semana.">${esc(pending)}</textarea></div>
 <div class="public-box"><div class="toolbar" style="margin-bottom:.55rem"><b>Texto para alumnos/padres</b><button type="button" class="btn gold small" onclick="improveFamilyDraft()">✨ Mejorar redacción</button><button type="button" class="btn secondary small" onclick="previewJournal()">👁 Vista previa</button></div><textarea id="jPublic" style="width:100%;min-height:145px" placeholder="Texto formal que podrán leer las familias.">${esc(pub)}</textarea>
 <div class="publish-options"><label><input id="jFamilyVisible" type="checkbox" ${j?.familyVisible?'checked':''}> Visible en el seguimiento de familias</label><label><input id="jClassPage" type="checkbox" ${j?.classPage?'checked':''}> Publicar también en mi Aula de Tecnología</label></div></div>
 <div class="field"><label>📎 Documentos de Google Drive</label><div id="jAttachments">${attachmentRows(j?.attachments||[])}</div><div class="small-note">En Drive usa “Compartir → Cualquier persona con el enlace → Lector”. El sistema solo guarda el enlace; no modifica tu archivo.</div></div>
 <div class="field private-box"><label>Nota interna docente · NO se publica</label><textarea id="jPrivate" placeholder="Observaciones internas, desvíos de planeación, acuerdos, etc.">${esc(priv)}</textarea></div>
 <div id="jPreview" class="journal-preview" style="display:none"></div>`,
 `<button class="btn secondary" onclick="closeModal()">Cancelar</button><button class="btn primary" onclick="saveJournal()">${j?'Guardar cambios':'Guardar publicación'}</button>`);
 toggleJournalTargets();
}
function editJournal(id){openJournal(id)}
function toggleJournalTargets(){const w=$('#jTargetsWrap'),s=$('#jScope');if(w&&s)w.style.display=s.value==='selected'?'block':'none'}
function readAttachments(){return [...document.querySelectorAll('.attachment-row')].map(r=>({title:r.querySelector('.jAttTitle')?.value.trim()||'',url:r.querySelector('.jAttUrl')?.value.trim()||''})).filter(a=>a.url)}
function previewJournal(){const box=$('#jPreview');if(!box)return;const title=$('#jTitle')?.value.trim()||'Clase',pub=$('#jPublic')?.value.trim()||'Sin texto público',pending=$('#jPending')?.value.trim(),atts=readAttachments();box.style.display='block';box.innerHTML=`<div class="eyebrow">Vista previa para familias</div><h3>${esc(title)}</h3><p>${nl2br(pub)}</p>${pending?`<div class="journal-pending"><b>Pendiente / tarea</b><p>${nl2br(pending)}</p></div>`:''}${atts.length?`<div class="journal-files">${atts.map(a=>`<span class="journal-file">📄 ${esc(a.title||'Documento adjunto')}</span>`).join('')}</div>`:''}`}
function saveJournal(){
 const editId=window._journalEditId||'',existing=editId?(state.journal||[]).find(x=>x.id===editId):null;
 const scope=$('#jScope').value,targets=scope==='selected'?[...document.querySelectorAll('.jTarget:checked')].map(x=>x.value):[];
 if(scope==='selected'&&!targets.length)return toast('Selecciona al menos un grupo');
 const classPage=$('#jClassPage').checked,familyVisible=$('#jFamilyVisible').checked||classPage;
 const obj={
   id:existing?.id||'j-'+Date.now(),shift:existing?.shift||ui.shift,group:existing?.group||ui.group,course:existing?.course||ui.course,period:existing?.period||ui.period,
   date:$('#jDate').value,title:$('#jTitle').value.trim(),rawText:$('#jRaw').value.trim(),publicText:$('#jPublic').value.trim(),pending:$('#jPending').value.trim(),privateText:$('#jPrivate').value.trim(),
   scope,targets,familyVisible,classPage,attachments:readAttachments(),publish:familyVisible,archived:false,createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()
 };
 if(existing)Object.assign(existing,obj);else state.journal.push(obj);
 save();window.CLOUD?.syncPublicJournal?.(state.journal).catch(()=>{});closeModal();renderJournal();toast(existing?'Publicación actualizada':'Bitácora guardada');
}
function archiveJournal(id){const j=(state.journal||[]).find(x=>x.id===id);if(!j)return;if(!confirm('¿Archivar esta publicación? No se borrará y podrás recuperarla desde un respaldo.'))return;j.archived=true;j.updatedAt=new Date().toISOString();save();window.CLOUD?.syncPublicJournal?.(state.journal).catch(()=>{});renderJournal();toast('Publicación archivada')}
function normalizePoints(v,max){
  v=String(v??'').trim().replace(',','.');
  if(v===''||v==='—'||v==='-'||v.toUpperCase()==='NA')return 'NA';
  const n=Number(v),m=Number(max||0);
  return Number.isFinite(n)&&n>=0&&n<=m?Math.round(n*10)/10:null;
}
function gradeInput(st,type){
  const map=type==='project'?st.projectScores:st.examScores,raw=map?.[ui.period],v=(raw===undefined||raw==='NA')?'—':raw;
  const w=periodCfg().weights||{},max=type==='project'?Number(w.project||0):Number(w.exam||0);
  return `<input class="grade-input" inputmode="decimal" value="${v}" data-student="${st.id}" data-type="${type}" data-max="${max}" min="0" max="${max}" title="Captura de 0 a ${max} puntos" ${isPeriodClosed()?'disabled':''}>`;
}
function renderGrades(){
 const g=grp();if(!g)return;const cfg=periodCfg(),w=cfg.weights||{activities:60,project:30,exam:10};
 const showProject=Number(w.project||0)>0,showExam=Number(w.exam||0)>0;
 const rows=g.students.filter(s=>s.active).map(s=>{
   const c=gradeCalc(s),a=c.a===null?'—':`${c.activityPoints.toFixed(1)} / ${w.activities}<small class="grade-state">Promedio ${c.a.toFixed(1)}/10</small>`,p=(c.p===undefined||c.p==='NA')?'—':c.p,e=(c.e===undefined||c.e==='NA')?'—':c.e,shown=c.complete?c.final.toFixed(1):(c.provisional===null?'—':c.provisional.toFixed(1));
   const total=c.complete?`${c.totalPoints.toFixed(1)} / 100`:`${c.earned.toFixed(1)} / ${c.used}`;
   return `<tr><td class="num">${s.listNo}</td><td class="student-name">${esc(s.name)}${s.privateFlag?'<span class="private-flag private-only">⚑</span>':''}</td><td><b>${a}</b></td>${showProject?`<td>${gradeInput(s,'project')}<small class="grade-state">de ${w.project} puntos</small></td>`:''}${showExam?`<td>${gradeInput(s,'exam')}<small class="grade-state">de ${w.exam} puntos</small></td>`:''}<td><b>${total}</b><small class="grade-state">Puntos</small></td><td><b>${shown}</b><small class="grade-state">${c.complete?'Final':'Provisional'}</small></td></tr>`
 }).join('');
 const formula=[`${w.activities} puntos actividades/tareas/prácticas`,showProject?`${w.project} puntos proyecto`:'',showExam?`${w.exam} puntos examen`:''].filter(Boolean).join(' · ');
 app.innerHTML=head('Calificaciones',`${periodName()} · ${ui.course} · ${formula}`,`<button class="btn secondary private-only" onclick="configurePeriod()">⚙ Encuadre</button><button class="btn ${isPeriodClosed()?'gold':'danger'} private-only" onclick="togglePeriodClosed()">${isPeriodClosed()?'Reabrir periodo':'Cerrar periodo'}</button>`)+`<div class="period-strip ${isPeriodClosed()?'period-closed':''}"><div><b>${esc(periodName())} · ${esc(ui.course)}</b><span>${isPeriodClosed()?'Las calificaciones de este espacio están protegidas contra cambios.':'Las actividades se calculan automáticamente. Proyecto y examen se capturan directamente en puntos del encuadre.'}</span></div><span class="badge ${isPeriodClosed()?'bad':'good'}">${isPeriodClosed()?'Cerrado':'Abierto'}</span></div><div class="notice"><b>Captura por puntos:</b> actividades hasta ${w.activities}, ${showProject?`proyecto hasta ${w.project}`:''}${showProject&&showExam?' y ':''}${showExam?`examen hasta ${w.exam}`:''}. <b>Vacío (—)</b> significa aún no evaluado; <b>0</b> significa evaluado sin puntos. La calificación final es puntos totales ÷ 10.</div><div class="table-wrap"><table><thead><tr><th>N.º</th><th>Alumno</th><th>Actividades<br><small>máx. ${w.activities}</small></th>${showProject?`<th>Proyecto<br><small>0–${w.project}</small></th>`:''}${showExam?`<th>Examen<br><small>0–${w.exam}</small></th>`:''}<th>Total</th><th>Calificación</th></tr></thead><tbody>${rows}</tbody></table></div>`;
 document.querySelectorAll('.grade-input').forEach(i=>{i.addEventListener('change',()=>commitGrade(i));i.addEventListener('keydown',e=>{if(e.key==='Enter'){i.blur()}})});
}
function commitGrade(inp){
  if(!editableGuard())return;
  const max=Number(inp.dataset.max||0),v=normalizePoints(inp.value,max);
  if(v===null){toast(`Usa un valor de 0 a ${max} o —`);renderGrades();return}
  const st=grp().students.find(s=>s.id===inp.dataset.student);if(!st)return;
  const map=inp.dataset.type==='project'?st.projectScores:st.examScores;map[ui.period]=v;save();renderGrades();
}
function configurePeriod(){const c=periodCfg(),w=c.weights;modal(`<h2>Encuadre · ${esc(periodName())} · ${esc(ui.course)}</h2><div class="form-grid"><div class="field"><label>Actividades, tareas y prácticas (%)</label><input id="wActivities" type="number" min="0" max="100" value="${w.activities}"></div><div class="field"><label>Proyecto (%)</label><input id="wProject" type="number" min="0" max="100" value="${w.project}"></div><div class="field"><label>Examen (%)</label><input id="wExam" type="number" min="0" max="100" value="${w.exam}"></div></div><div class="notice">Los tres porcentajes deben sumar 100. Cada <b>periodo y espacio</b> conserva su propio encuadre. Cambiar estos porcentajes no modifica las actividades que ya capturaste.</div>`,`<button class="btn secondary" onclick="closeModal()">Cancelar</button><button class="btn primary" onclick="savePeriodConfig()">Guardar encuadre</button>`)}
function savePeriodConfig(){const a=Number($('#wActivities').value),p=Number($('#wProject').value),e=Number($('#wExam').value);if(a+p+e!==100)return toast('Los porcentajes deben sumar 100');periodCfg().weights={activities:a,project:p,exam:e};save();closeModal();renderGrades();toast(`Encuadre de ${ui.course} actualizado`)}
function togglePeriodClosed(){const c=periodCfg(),name=`${periodName()} de ${ui.course}`;if(c.closed){if(!confirm(`¿Reabrir ${name}? Volverás a poder modificar sus calificaciones.`))return;c.closed=false}else{if(!confirm(`¿Cerrar ${name}? Se bloqueará la edición de actividades, proyecto y examen de este espacio hasta que lo reabras.`))return;c.closed=true}save();renderGrades();toast(c.closed?'Periodo cerrado':'Periodo reabierto')}
function renderStudents(){const g=grp();app.innerHTML=head('Alumnos','Base maestra única del grupo. Alta, baja y seguimiento confidencial.',`<button class="btn primary" onclick="newStudent()">+ Nuevo alumno</button>`)+`<div class="table-wrap"><table><thead><tr><th>N.º</th><th>Alumno</th><th>Estado</th><th>Ingreso</th><th>Privado</th><th></th></tr></thead><tbody>${g.students.map(s=>`<tr><td>${s.listNo}</td><td class="student-name">${esc(s.name)}</td><td><span class="badge ${s.active?'good':'neutral'}">${s.active?'Activo':'Baja'}</span></td><td>${fmtDate(s.entryDate)}</td><td>${s.privateFlag?`<span class="badge warn">⚑ ${esc(s.privateCode||'Seguimiento')}</span>`:'—'}</td><td><button class="btn small secondary" onclick="editStudent('${s.id}')">Abrir</button></td></tr>`).join('')}</tbody></table></div>`}
function newStudent(){modal(`<h2>Alta de alumno en 3°${esc(ui.group)} ${esc(ui.shift)}</h2><div class="field"><label>Apellidos y nombre(s)</label><input id="sName" placeholder="APELLIDO PATERNO APELLIDO MATERNO NOMBRE(S)"></div><div class="field"><label>Fecha de ingreso</label><input id="sDate" type="date" value="${new Date().toISOString().slice(0,10)}"></div><div class="notice"><b>Destino:</b> 3°${esc(ui.group)} · ${esc(ui.shift)} · ${esc(ui.course)}<br>Se ordenará automáticamente por apellidos y aparecerá en asistencia y actividades. Lo anterior a su ingreso quedará como “—”.</div>`,`<button class="btn secondary" onclick="closeModal()">Cancelar</button><button class="btn primary" onclick="createStudent()">Dar de alta</button>`)}
function reNumber(g){g.students.sort((a,b)=>a.name.localeCompare(b.name,'es',{sensitivity:'base'}));g.students.forEach((s,i)=>s.listNo=i+1)}
function createStudent(){const name=$('#sName').value.trim().replace(/\s+/g,' ').toUpperCase();if(!name)return toast('Escribe el nombre');if(!confirm(`¿Agregar a ${name} a 3°${ui.group} ${ui.shift}?`))return;const g=grp(),id='s-'+Date.now();const s={id,name,active:true,entryDate:$('#sDate').value,privateFlag:false,privateCode:'',privateNotes:'',activityScores:{},attendance:{},projectScores:{},examScores:{},familyAccess:null};g.activities.forEach(a=>s.activityScores[a.id]='NA');g.attendanceDates.forEach(d=>s.attendance[d.id]='NA');g.students.push(s);reNumber(g);save();closeModal();renderStudents();toast(`Alumno agregado a 3°${ui.group} ${ui.shift}`)}
function editStudent(id){const s=grp().students.find(x=>x.id===id);modal(`<h2>${esc(s.name)}</h2><div class="form-grid"><div class="field"><label>Estado</label><select id="eActive"><option value="1" ${s.active?'selected':''}>Activo</option><option value="0" ${!s.active?'selected':''}>Baja</option></select></div><div class="field"><label>Fecha de ingreso</label><input id="eDate" type="date" value="${s.entryDate||''}"></div></div><div class="private-box"><div class="field"><label>Código confidencial</label><input id="eCode" value="${esc(s.privateCode||'')}" placeholder="Ej. ** / SE / código interno"></div><div class="field"><label>Nota confidencial</label><textarea id="eNotes" placeholder="Solo hechos necesarios y orientaciones docentes. No visible en proyección ni portal familiar.">${esc(s.privateNotes||'')}</textarea></div></div>`,`<button class="btn secondary" onclick="closeModal()">Cancelar</button><button class="btn primary" onclick="saveStudent('${id}')">Guardar</button>`)}
function saveStudent(id){const s=grp().students.find(x=>x.id===id);s.active=$('#eActive').value==='1';s.entryDate=$('#eDate').value;s.privateCode=$('#eCode').value.trim();s.privateNotes=$('#eNotes').value.trim();s.privateFlag=!!(s.privateCode||s.privateNotes);save();closeModal();renderStudents();toast('Ficha actualizada')}
function followupsForStudent(studentId){return (state.studentFollowups||[]).filter(x=>x.studentId===studentId&&x.shift===ui.shift&&x.group===ui.group&&x.course===ui.course&&(x.period||'P1')===ui.period).sort((a,b)=>(b.date||'').localeCompare(a.date||'')||(b.createdAt||'').localeCompare(a.createdAt||''))}
function renderFollowup(){
 const g=grp(),students=g.students.filter(s=>s.active),selected=window._followStudent||students[0]?.id||'';window._followStudent=selected;
 const sel=students.map(s=>`<option value="${s.id}" ${s.id===selected?'selected':''}>${esc(s.name)}</option>`).join('');
 const st=students.find(s=>s.id===selected),entries=st?followupsForStudent(st.id):[];
 const history=entries.length?entries.map(e=>`<article class="card followup-card" style="margin-bottom:.75rem"><div class="followup-card-head"><div><div class="eyebrow">${fmtDate(e.date)} · ${esc(e.category||'Seguimiento')}</div><h3>${esc(e.title||'Registro individual')}</h3></div><div class="toolbar"><span class="badge ${e.familyPublished?'good':'neutral'}">${e.familyPublished?'Visible para familia':'Borrador / interno'}</span>${e.requiresFollowup?'<span class="badge warn">Requiere seguimiento</span>':''}</div></div>${e.familyText?`<div class="public-box"><b>Comunicación para familia</b><p>${esc(e.familyText)}</p></div>`:''}${e.privateText?`<div class="private-box private-only" style="margin-top:.65rem"><b>Nota privada docente</b><p>${esc(e.privateText)}</p></div>`:''}<div class="followup-meta private-only">${e.notifiedSchool?'<span>✓ Dirección/prefectura informada</span>':''}${e.familyPublished?'<span>✓ Familia informada</span>':''}</div></article>`).join(''):'<div class="empty card">Este alumno aún no tiene registros individuales.</div>';
 app.innerHTML=head('Seguimiento individual','Registra avisos para familia y conserva por separado tus notas privadas.',`<button class="btn primary private-only" onclick="newStudentFollowup()">+ Nuevo registro</button>`)+`<div class="notice private-only"><b>Importante:</b> la parte “Comunicación para familia” podrá mostrarse en el portal del padre cuando esté publicada. La nota privada docente nunca se mostrará a la familia ni en modo proyección.</div><div class="followup-picker private-only"><label class="field"><span>Alumno</span><select id="followStudent">${sel}</select></label>${st?.privateFlag?`<div class="badge warn">⚑ Seguimiento confidencial: ${esc(st.privateCode||'marca interna')}</div>`:''}</div>${st?`<section class="card student-summary private-only"><div><div class="eyebrow">3°${g.group} · ${g.shift}</div><h2>${esc(st.name)}</h2></div><button class="btn secondary small" onclick="editStudent('${st.id}')">Abrir ficha confidencial</button></section>`:''}<div class="followup-history private-only">${history}</div>`;
 $('#followStudent')?.addEventListener('change',e=>{window._followStudent=e.target.value;renderFollowup()});
}
function newStudentFollowup(){
 const g=grp(),students=g.students.filter(s=>s.active),selected=window._followStudent||students[0]?.id||'';
 const opts=students.map(s=>`<option value="${s.id}" ${s.id===selected?'selected':''}>${esc(s.name)}</option>`).join('');
 modal(`<h2>Nuevo seguimiento individual</h2><div class="form-grid"><div class="field"><label>Alumno</label><select id="fStudent">${opts}</select></div><div class="field"><label>Fecha</label><input id="fDate" type="date" value="${new Date().toISOString().slice(0,10)}"></div><div class="field"><label>Categoría</label><select id="fCategory"><option>Puntualidad</option><option>Conducta</option><option>Trabajo académico</option><option>Material</option><option>Convivencia</option><option>Asistencia</option><option>Otro</option></select></div><div class="field"><label>Título breve</label><input id="fTitle" placeholder="Ej. Ingreso tardío después del receso"></div></div><div class="field"><label>Lo ocurrido / borrador rápido</label><textarea id="fRaw" placeholder="Ej. Llegó 20 min tarde después del receso, se llamó la atención. Favor de abordar en casa la importancia de la puntualidad."></textarea></div><div class="public-box"><div class="toolbar" style="margin-bottom:.45rem"><b>Comunicación para familia</b><button type="button" class="btn gold small" onclick="improveStudentFamilyDraft()">✨ Mejorar redacción</button></div><textarea id="fFamily" style="width:100%;min-height:120px" placeholder="Aquí aparecerá el texto formal para la familia. Revísalo antes de publicarlo."></textarea><label class="check-row"><input id="fPublish" type="checkbox"> <span>Publicar / dejar visible para la familia</span></label><div class="small-note">En este prototipo el botón hace una mejora local. La versión en línea conectará la IA real.</div></div><div class="private-box private-only" style="margin-top:.8rem"><div class="field"><label>Nota privada docente · NO visible para familia</label><textarea id="fPrivate" placeholder="Ej. Segunda ocasión en el mes. Dar seguimiento si vuelve a presentarse."></textarea></div><div class="check-grid"><label><input id="fFollow" type="checkbox"> Requiere seguimiento</label><label><input id="fSchool" type="checkbox"> Se informó a dirección/prefectura</label></div></div>`,`<button class="btn secondary" onclick="closeModal()">Cancelar</button><button class="btn primary" onclick="saveStudentFollowup()">Guardar registro</button>`)
}
function improveStudentFamilyDraft(){
 const raw=$('#fRaw')?.value.trim()||'',cat=$('#fCategory')?.value||'seguimiento';
 if(!raw){toast('Escribe primero lo ocurrido');return}
 let cleaned=raw.replace(/\s+/g,' ').trim().replace(/\s*\.+\s*/g,'. ');
 cleaned=cleaned.charAt(0).toUpperCase()+cleaned.slice(1);
 if(!/[.!?]$/.test(cleaned))cleaned+='.';
 let out='Se informa que '+cleaned.charAt(0).toLowerCase()+cleaned.slice(1);
 if(/puntual|tarde|receso/i.test(cleaned))out+=' Se solicita el apoyo de la familia para reforzar en casa la importancia de la puntualidad y el cumplimiento de los horarios escolares.';
 else if(/vocabulario|lenguaje|palabra|insulto/i.test(cleaned))out+=' Se solicita el apoyo de la familia para reforzar el uso de un lenguaje respetuoso y adecuado dentro del entorno escolar.';
 else out+=' Agradecemos el acompañamiento de la familia para dar seguimiento y favorecer el desempeño del estudiante.';
 $('#fFamily').value=out;
 toast('Borrador formal preparado. Revísalo antes de publicar.');
}
function saveStudentFollowup(){
 const sid=$('#fStudent').value,st=grp().students.find(s=>s.id===sid);if(!st)return toast('Selecciona un alumno');
 const family=$('#fFamily').value.trim(),priv=$('#fPrivate').value.trim(),raw=$('#fRaw').value.trim();
 if(!raw&&!family&&!priv)return toast('Escribe al menos un registro');
 state.studentFollowups.push({id:'sf-'+Date.now(),studentId:sid,shift:ui.shift,group:ui.group,course:ui.course,period:ui.period,date:$('#fDate').value,category:$('#fCategory').value,title:$('#fTitle').value.trim(),rawText:raw,familyText:family,privateText:priv,familyPublished:$('#fPublish').checked,requiresFollowup:$('#fFollow').checked,notifiedSchool:$('#fSchool').checked,createdAt:new Date().toISOString()});
 window._followStudent=sid;save();closeModal();renderFollowup();toast($('#fPublish').checked?'Registro guardado y marcado para familia':'Registro guardado');
}
function normalizeFamilySecret(v=''){return String(v).toUpperCase().replace(/[^A-Z0-9]/g,'')}
function randomChars(n){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',a=new Uint32Array(n);crypto.getRandomValues(a);return Array.from(a,x=>chars[x%chars.length]).join('')}
function randomPin(){const a=new Uint32Array(1);crypto.getRandomValues(a);return String(1000+(a[0]%9000))}
async function familyDocId(code,pin){const raw=`${normalizeFamilySecret(code)}|${String(pin).trim()}`;const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('')}
function familyMasterGroup(){return state.groups[`${ui.shift}|3${ui.group}|Tecnología`]||grp()}
function sameStudentByName(g,name){const n=String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toUpperCase();return (g?.students||[]).find(s=>String(s.name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toUpperCase()===n)}
function periodGradeFor(st,g,pid,course){
  const cfg=state.periods?.[pid]?.spaces?.[course]||state.periods?.[pid]?.spaces?.['Tecnología']||{weights:{activities:60,project:30,exam:10}};
  const w=cfg.weights||{activities:60,project:30,exam:10};
  const acts=(g?.activities||[]).filter(a=>a.active&&(a.period||'P1')===pid);
  const vals=acts.map(a=>st?.activityScores?.[a.id]).filter(v=>v!==undefined&&v!=='NA'&&v!==null&&v!=='');
  const avg=vals.length?vals.reduce((a,b)=>a+Number(b),0)/vals.length:null;
  const ap=avg===null?null:Math.round((avg/10*Number(w.activities||0))*10)/10;
  const rawP=st?.projectScores?.[pid],rawE=st?.examScores?.[pid];
  const pp=(rawP===undefined||rawP===null||rawP===''||rawP==='NA')?null:Number(rawP);
  const ep=(rawE===undefined||rawE===null||rawE===''||rawE==='NA')?null:Number(rawE);
  const parts=[[ap,Number(w.activities||0)],[pp,Number(w.project||0)],[ep,Number(w.exam||0)]].filter(x=>x[1]>0);
  const evaluated=parts.filter(x=>x[0]!==undefined&&x[0]!==null&&x[0]!==''&&x[0]!=='NA');
  const earned=evaluated.reduce((t,x)=>t+Number(x[0]),0),used=evaluated.reduce((t,x)=>t+x[1],0);
  const complete=parts.length>0&&parts.every(x=>x[0]!==undefined&&x[0]!==null&&x[0]!==''&&x[0]!=='NA');
  return {weights:w,activityPoints:ap,activityAverage:avg,project:pp,exam:ep,earned,used,complete,grade:complete?earned/10:(used?earned/used*10:null)};
}
function journalAppliesTo(j,shift,group,course,pid){
  if(j.archived||!j.familyVisible||(j.period||'P1')!==pid)return false;
  const key=journalTargetKey(shift,group,course);
  if(j.scope==='all')return true;
  if(j.scope==='allTechnology')return course==='Tecnología';
  if(j.scope==='tutoring')return course==='Tutoría';
  if(j.scope==='selected')return (j.targets||[]).includes(key);
  return j.shift===shift&&j.group===group&&j.course===course;
}
function familyCoursePayload(course,masterSt,pid){
  const g=state.groups[`${ui.shift}|3${ui.group}|${course}`];if(!g)return null;
  const st=course==='Tecnología'?masterSt:sameStudentByName(g,masterSt.name);if(!st)return null;
  const acts=(g.activities||[]).filter(a=>a.active&&(a.period||'P1')===pid).map(a=>{const raw=st.activityScores?.[a.id];return {name:a.name,date:a.date||'',score:raw===undefined||raw==='NA'?null:Number(raw),max:Number(a.maxScore||10),detail:a.detail||''}});
  const grade=periodGradeFor(st,g,pid,course);
  const followups=(state.studentFollowups||[]).filter(x=>x.familyPublished&&(x.period||'P1')===pid&&x.shift===ui.shift&&x.group===ui.group&&x.course===course&&(x.studentId===st.id||String(x.studentName||'')===String(st.name||''))).map(x=>({date:x.date||'',category:x.category||'Seguimiento',title:x.title||'Aviso',text:x.familyText||''})).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  const journal=(state.journal||[]).filter(j=>journalAppliesTo(j,ui.shift,ui.group,course,pid)).map(j=>({date:j.date||'',title:j.title||'Aviso',text:j.publicText||'',pending:j.pending||'',attachments:(j.attachments||[]).filter(a=>a?.url).map(a=>({title:a.title||'Documento',url:a.url}))})).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  return {course,activities:acts,grade,followups,journal};
}
function buildFamilyView(masterSt){
  const ag=familyMasterGroup();let present=0,absent=0,justified=0,late=0;
  (ag.attendanceDates||[]).forEach(d=>{const v=masterSt.attendance?.[d.id];if(v==='1')present++;else if(v==='0')absent++;else if(v==='J')justified++;else if(v==='R')late++;});
  const attendanceTotal=present+absent+justified+late;
  const periods={};['P1','P2','P3'].forEach(pid=>{const courses={};['Tecnología','Tutoría'].forEach(c=>{const x=familyCoursePayload(c,masterSt,pid);if(x)courses[c]=x});periods[pid]={name:state.periods?.[pid]?.name||pid,courses}});
  return {student:{name:masterSt.name,group:`3°${ui.group}`,shift:ui.shift},attendance:{present,absent,justified,late,total:attendanceTotal,percentage:attendanceTotal?Math.round((present+justified)/attendanceTotal*100):null},periods,cycle:'2026–2027',updatedLabel:new Date().toLocaleString('es-MX')};
}
async function generateFamilyAccess(studentId,regenerate=false){
  const g=familyMasterGroup(),st=g.students.find(s=>s.id===studentId);if(!st)return;
  const old=st.familyAccess?.docId||'';
  if(old&&!regenerate){toast('Este alumno ya tiene clave familiar');return}
  if(old&&regenerate&&!confirm(`¿Regenerar la clave de ${st.name}? La clave anterior dejará de funcionar.`))return;
  const code=`M41-${ui.group}-${randomChars(6)}`,pin=randomPin(),docId=await familyDocId(code,pin);
  st.familyAccess={code,pin,docId,createdAt:new Date().toISOString()};save();
  if(old&&window.CLOUD?.deleteFamilyPortal)await window.CLOUD.deleteFamilyPortal(old).catch(()=>{});
  await syncOneFamily(studentId,false);renderFamilies();toast('Clave familiar generada');
}
async function generateMissingFamilyAccess(){
  const g=familyMasterGroup();for(const st of g.students.filter(s=>s.active&&!s.familyAccess)){const code=`M41-${ui.group}-${randomChars(6)}`,pin=randomPin(),docId=await familyDocId(code,pin);st.familyAccess={code,pin,docId,createdAt:new Date().toISOString()}}save();await syncFamilyGroup(false);renderFamilies();toast('Claves generadas y portal actualizado');
}
async function syncOneFamily(studentId,show=true){
  const g=familyMasterGroup(),st=g.students.find(s=>s.id===studentId);if(!st?.familyAccess?.docId)return;
  const data=buildFamilyView(st);await window.CLOUD.syncFamilyPortal([{docId:st.familyAccess.docId,data}]);st.familyAccess.lastSync=new Date().toISOString();save();if(show)toast('Ficha familiar actualizada');
}
async function syncFamilyGroup(show=true){
  const g=familyMasterGroup(),active=g.students.filter(s=>s.active&&s.familyAccess?.docId),views=active.map(st=>({docId:st.familyAccess.docId,data:buildFamilyView(st)}));
  if(!views.length){if(show)toast('Primero genera las claves familiares');return}
  await window.CLOUD.syncFamilyPortal(views);const now=new Date().toISOString();active.forEach(st=>st.familyAccess.lastSync=now);save();if(show)toast(`${views.length} fichas familiares actualizadas`);
}
function familyPortalUrl(){return location.href.replace(/\/control\/?(?:#.*)?$/,'/familias/').replace(/\/control\/.*$/,'/familias/')}
async function copyFamilyCredentials(id){const st=familyMasterGroup().students.find(s=>s.id===id);if(!st?.familyAccess)return;const text=`Aula de Tecnología 3.º\nAlumno(a): ${st.name}\nPortal: ${familyPortalUrl()}\nClave: ${st.familyAccess.code}\nPIN: ${st.familyAccess.pin}`;try{await navigator.clipboard.writeText(text);toast('Datos de acceso copiados')}catch(e){prompt('Copia estos datos:',text)}}

function openFamilyAccessExport(){
  const g=familyMasterGroup(),ready=g.students.filter(s=>s.active&&s.familyAccess);
  const missing=g.students.filter(s=>s.active&&!s.familyAccess);
  if(!ready.length){toast('Primero genera las claves familiares');return}
  modal(`<h2>Accesos del grupo 3°${esc(ui.group)} · ${esc(ui.shift)}</h2><p>Se prepararán <b>${ready.length}</b> fichas individuales. ${missing.length?`<span class="badge warn">${missing.length} sin clave</span>`:''}</p><div class="notice"><b>Imprimir / Guardar PDF:</b> abre una hoja lista para imprimir. En la ventana de impresión puedes elegir <b>Guardar como PDF</b>.<br><b>CSV:</b> descarga la lista de alumno, clave y PIN para tu respaldo privado.</div>`,`<button class="btn secondary" onclick="closeModal()">Cancelar</button><button class="btn secondary" onclick="downloadFamilyAccessCSV()">Descargar CSV</button><button class="btn primary" onclick="printFamilyAccessCards()">Imprimir / Guardar PDF</button>`);
}
function familyAccessRows(){return familyMasterGroup().students.filter(s=>s.active&&s.familyAccess).map(st=>({listNo:st.listNo,name:st.name,code:st.familyAccess.code,pin:st.familyAccess.pin}))}
function printFamilyAccessCards(){
  const rows=familyAccessRows();if(!rows.length){toast('No hay claves para imprimir');return}
  const portal=familyPortalUrl();
  const cards=rows.map(r=>`<section class="card"><div class="brand">Aula de Tecnología 3.º</div><div class="sub">Seguimiento para familias · Ciclo 2026–2027</div><hr><div class="student">${esc(r.name)}</div><div class="meta">3°${esc(ui.group)} · ${esc(ui.shift)} · N.º ${r.listNo}</div><div class="access"><div><span>CLAVE</span><b>${esc(r.code)}</b></div><div><span>PIN</span><b>${esc(r.pin)}</b></div></div><div class="url">${esc(portal)}</div><div class="note">Acceso personal. No compartir esta clave ni PIN con otros alumnos o familias.</div></section>`).join('');
  const w=window.open('','_blank');if(!w){alert('El navegador bloqueó la ventana de impresión. Permite ventanas emergentes e inténtalo de nuevo.');return}
  w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Accesos 3°${esc(ui.group)} ${esc(ui.shift)}</title><style>@page{size:A4;margin:10mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#12385d;margin:0}.top{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:8mm}.top h1{font-size:18px;margin:0}.top p{margin:2px 0 0;font-size:11px;color:#52697d}.grid{display:grid;grid-template-columns:1fr 1fr;gap:6mm}.card{border:1.4px solid #9fb6c9;border-radius:10px;padding:7mm;min-height:58mm;break-inside:avoid;position:relative}.brand{font-weight:800;font-size:15px}.sub{font-size:10px;color:#60778b;margin-top:2px}.card hr{border:0;border-top:2px solid #d7a52a;margin:5mm 0}.student{font-weight:800;font-size:14px;line-height:1.15}.meta{font-size:10px;color:#60778b;margin-top:2px}.access{display:grid;grid-template-columns:1fr .65fr;gap:5mm;margin:5mm 0}.access div{border:1px solid #ccd9e3;border-radius:8px;padding:4mm;background:#f6f9fb}.access span{display:block;font-size:9px;color:#60778b;font-weight:700}.access b{display:block;font-size:16px;margin-top:2px;letter-spacing:.4px}.url{font-size:9px;word-break:break-all;background:#eef5f7;border-radius:6px;padding:3mm}.note{font-size:8.5px;color:#6f4d00;margin-top:4mm}.footer{margin-top:8mm;font-size:9px;color:#667;text-align:center}@media print{.no-print{display:none!important}}</style></head><body><div class="top"><div><h1>Accesos del Portal de Familias</h1><p>3°${esc(ui.group)} · ${esc(ui.shift)} · ${rows.length} alumnos</p></div><button class="no-print" onclick="window.print()">Imprimir / Guardar PDF</button></div><main class="grid">${cards}</main><div class="footer">Documento de uso escolar. Entregar cada ficha únicamente a la familia correspondiente.</div><script>setTimeout(()=>window.print(),350)<\/script></body></html>`);
  w.document.close();closeModal();
}
function downloadFamilyAccessCSV(){
  const rows=familyAccessRows();if(!rows.length){toast('No hay claves para descargar');return}
  const q=v=>`"${String(v??'').replace(/"/g,'""')}"`;
  const lines=[['No.','Alumno','Grupo','Turno','Clave','PIN','Portal'].map(q).join(',')];
  rows.forEach(r=>lines.push([r.listNo,r.name,`3°${ui.group}`,ui.shift,r.code,r.pin,familyPortalUrl()].map(q).join(',')));
  const blob=new Blob(['\ufeff'+lines.join('\n')],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`accesos-familias-3${ui.group}-${String(ui.shift).toLowerCase()}-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(a.href);closeModal();toast('Lista de accesos descargada');
}
function renderFamilies(){
  const g=familyMasterGroup(),students=g.students.filter(s=>s.active);
  const rows=students.map(st=>{const a=st.familyAccess;return `<tr><td class="num">${st.listNo}</td><td class="student-name">${esc(st.name)}</td><td>${a?`<code>${esc(a.code)}</code>`:'—'}</td><td>${a?`<b>${esc(a.pin)}</b>`:'—'}</td><td>${a?.lastSync?`<span class="badge good">Actualizado</span><small class="grade-state">${new Date(a.lastSync).toLocaleString('es-MX')}</small>`:'<span class="badge neutral">Sin sincronizar</span>'}</td><td><div class="toolbar family-actions">${!a?`<button class="btn primary small" onclick="generateFamilyAccess('${st.id}')">Generar</button>`:`<button class="btn secondary small" onclick="copyFamilyCredentials('${st.id}')">Copiar acceso</button><button class="btn secondary small" onclick="syncOneFamily('${st.id}')">Actualizar</button><button class="btn ghost small" onclick="generateFamilyAccess('${st.id}',true)">Regenerar</button>`}</div></td></tr>`}).join('');
  app.innerHTML=head('Portal de familias','Cada familia recibe una clave y PIN únicos. La ficha pública nunca incluye notas privadas ni códigos confidenciales.',`<a class="btn secondary private-only" href="${esc(familyPortalUrl())}" target="_blank" rel="noopener">Abrir portal familiar</a>`)+`<div class="notice private-only"><b>Seguridad:</b> las familias solo pueden consultar una ficha si conocen la combinación exacta de clave + PIN. Firestore no permite listar estas fichas públicamente.</div><div class="toolbar private-only" style="margin-top:1rem"><button class="btn primary" onclick="generateMissingFamilyAccess()">Generar claves faltantes</button><button class="btn gold" onclick="syncFamilyGroup()">Actualizar portal del grupo</button><button class="btn secondary" onclick="openFamilyAccessExport()">🖨️ Imprimir / descargar accesos del grupo</button></div><div class="table-wrap"><table><thead><tr><th>N.º</th><th>Alumno</th><th>Clave</th><th>PIN</th><th>Portal</th><th>Acciones</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function go(v){ui.view=v;document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===v));render()}
function render(){refreshSelectors();if(ui.view==='dashboard')renderDashboard();if(ui.view==='attendance')renderAttendance();if(ui.view==='activities')renderActivities();if(ui.view==='grades')renderGrades();if(ui.view==='journal')renderJournal();if(ui.view==='students')renderStudents();if(ui.view==='followup')renderFollowup();if(ui.view==='families')renderFamilies();}
function modal(body,actions=''){const b=document.createElement('div');b.className='modal-backdrop';b.id='modal';b.innerHTML=`<div class="modal">${body}<div class="modal-actions">${actions}</div></div>`;document.body.appendChild(b)}function closeModal(){$('#modal')?.remove()}
function exportBackup(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`respaldo-tecnologia-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);toast('Respaldo descargado. Guárdalo en una carpeta segura.')}
function importBackup(file){if(!file)return;const r=new FileReader();r.onload=()=>{try{const incoming=JSON.parse(r.result);if(!incoming||typeof incoming!=='object'||!incoming.groups)throw new Error('Formato inválido');if(!confirm('¿Restaurar este respaldo? Los datos actuales de este navegador serán reemplazados.'))return;state=incoming;ensurePeriodData();save();window._attDate='';window._activityId='';window._followStudent='';render();toast('Respaldo restaurado correctamente');}catch(e){alert('No se pudo restaurar el archivo. Verifica que sea un respaldo generado por este sistema.');}};r.readAsText(file);}
$('#shiftSelect').addEventListener('change',e=>{ui.shift=e.target.value;ui.course='Tecnología';ui.group='A';window._attDate='';window._activityId='';render()});
$('#groupSelect').addEventListener('change',e=>{ui.group=e.target.value;ui.course='Tecnología';window._attDate='';window._activityId='';render()});
$('#courseSelect').addEventListener('change',e=>{ui.course=e.target.value;window._attDate='';window._activityId='';render()});
$('#periodSelect').addEventListener('change',e=>{ui.period=e.target.value;window._activityId='';window._followStudent='';render()});
$('#nav').addEventListener('click',e=>{const b=e.target.closest('button[data-view]');if(b)go(b.dataset.view)});
$('#projectionBtn').addEventListener('click',()=>{ui.projection=!ui.projection;document.body.classList.toggle('projection-mode',ui.projection);$('#projectionBtn').textContent=ui.projection?'🔒 Salir de proyección':'🖥️ Modo proyección';if(ui.projection&&(ui.view==='students'||ui.view==='followup'||ui.view==='families'))go('dashboard');else render()});
$('#exportBtn').addEventListener('click',exportBackup);
$('#importBtn').addEventListener('click',()=>$('#importFile').click());
$('#importFile').addEventListener('change',e=>{const f=e.target.files?.[0];if(f)importBackup(f);e.target.value='';});
window.go=go;window.manageActivities=manageActivities;window.editActivity=editActivity;window.saveActivityEdit=saveActivityEdit;window.toggleArchiveActivity=toggleArchiveActivity;window.deleteActivity=deleteActivity;window.openFamilyAccessExport=openFamilyAccessExport;window.printFamilyAccessCards=printFamilyAccessCards;window.downloadFamilyAccessCSV=downloadFamilyAccessCSV;window.generateFamilyAccess=generateFamilyAccess;window.generateMissingFamilyAccess=generateMissingFamilyAccess;window.syncOneFamily=syncOneFamily;window.syncFamilyGroup=syncFamilyGroup;window.copyFamilyCredentials=copyFamilyCredentials;window.configurePeriod=configurePeriod;window.savePeriodConfig=savePeriodConfig;window.togglePeriodClosed=togglePeriodClosed;window.setAttendance=setAttendance;window.setAttendanceMode=setAttendanceMode;window.setAttendanceMonthView=setAttendanceMonthView;window.cycleMonthlyAttendance=cycleMonthlyAttendance;window.markAllPresent=markAllPresent;window.newAttendanceDate=newAttendanceDate;window.createAttendanceDate=createAttendanceDate;window.setScore=setScore;window.markActivityAll=markActivityAll;window.reviewStudentActivities=reviewStudentActivities;window.setScoreQuick=setScoreQuick;window.openBulkActivity=openBulkActivity;window.confirmBulkActivity=confirmBulkActivity;window.newActivity=newActivity;window.createActivity=createActivity;window.openJournal=openJournal;window.improveFamilyDraft=improveFamilyDraft;window.previewJournal=previewJournal;window.toggleJournalTargets=toggleJournalTargets;window.editJournal=editJournal;window.archiveJournal=archiveJournal;window.saveJournal=saveJournal;window.newStudent=newStudent;window.createStudent=createStudent;window.editStudent=editStudent;window.saveStudent=saveStudent;window.newStudentFollowup=newStudentFollowup;window.improveStudentFamilyDraft=improveStudentFamilyDraft;window.saveStudentFollowup=saveStudentFollowup;window.closeModal=closeModal;
async function bootOnline(){
  const cloudStatus=$('#cloudStatus'),userEmail=$('#userEmail'),logoutBtn=$('#logoutBtn');
  function setCloud(kind,text){if(!cloudStatus)return;cloudStatus.textContent=(kind==='online'?'☁️ ':kind==='error'?'⚠️ ':kind==='sync'?'↻ ':'☁️ ')+text;cloudStatus.dataset.kind=kind;}
  window.CLOUD?.onStatus?.(({kind,text})=>setCloud(kind,text));
  if(!window.CLOUD?.enabled){state=loadState();ensurePeriodData();refreshSelectors();render();setCloud('error','Sin conexión Firebase');return;}
  let user=await window.CLOUD.waitForAuthState();
  if(!user){
    await new Promise(resolve=>{
      modal(`<div class="login-brand"><img src="assets/logo-miriam.png" alt=""><div><div class="eyebrow">Aula de Tecnología 3.º</div><h2>Acceso docente</h2></div></div><p>Inicia sesión para trabajar con la base de datos en línea.</p><div class="field"><label>Correo</label><input id="loginEmail" type="email" autocomplete="username" placeholder="tu correo"></div><div class="field"><label>Contraseña</label><input id="loginPass" type="password" autocomplete="current-password" placeholder="••••••••"></div><div id="loginError" class="login-error"></div>`,`<button id="loginDo" class="btn primary">Entrar</button>`);
      const attempt=async()=>{const e=$('#loginEmail').value.trim(),pw=$('#loginPass').value;$('#loginError').textContent='';try{const r=await window.CLOUD.login(e,pw);user=r.user;closeModal();resolve();}catch(err){$('#loginError').textContent='No se pudo iniciar sesión. Revisa correo y contraseña.';}};
      $('#loginDo').onclick=attempt;$('#loginPass').addEventListener('keydown',ev=>{if(ev.key==='Enter')attempt()});
    });
  }
  userEmail.textContent=user.email||'';logoutBtn.style.display='inline-flex';
  logoutBtn.onclick=async()=>{if(confirm('¿Cerrar sesión en este equipo?')){await window.CLOUD.logout();location.reload();}};
  try{
    const cloudState=await window.CLOUD.loadState();
    if(cloudState){state=cloudState;localStorage.setItem(STORAGE,JSON.stringify(state));}
    else{
      state=loadState();ensurePeriodData();
      if(confirm('La base en línea está vacía. ¿Cargar ahora los alumnos, asistencias y actividades que trae esta versión como base inicial?')){await window.CLOUD.seedState(state);toast('Base inicial cargada en Firebase');}
    }
  }catch(e){console.error(e);state=loadState();setCloud('error','Usando copia local');}
  const migrated=ensurePeriodData();
  if(migrated&&window.CLOUD?.currentUser()){save();toast('Actualización aplicada sin modificar tus registros existentes');}
  refreshSelectors();render();
}
bootOnline();
