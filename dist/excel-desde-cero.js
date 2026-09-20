(function(){
  "use strict";
  const grid=document.querySelector("#notebook-grid"), letters=["A","B","C","D","E","F"];
  const cell=(text,cls="")=>{const el=document.createElement("span");el.textContent=text;el.className=cls;grid.appendChild(el)};
  cell("","corner");letters.forEach((l,i)=>cell(`${l}${i===0?" · 6":""}`,"col"));
  for(let r=1;r<=10;r++){cell(`${r}${r===1?" · 7":""}`,"row");letters.forEach((l,c)=>{let cls="";if(r===1&&c===0)cls="active";else if(r===3)cls="marked-row";else if(c===5)cls="marked-column";else if(r>=6&&r<=8&&c>=1&&c<=4)cls="marked-range";cell(r===1&&c===0?"8":"",cls)})}
  const storage="excelDesdeCeroMiriamV1", boxes=[...document.querySelectorAll("[data-excel-check]")];let state={};try{state=JSON.parse(localStorage.getItem(storage))||{}}catch(_e){}
  function update(){let total=0;boxes.forEach(b=>{b.checked=Boolean(state[b.dataset.excelCheck]);if(b.checked)total++});document.querySelector("#excel-progress").textContent=`${total} de ${boxes.length} actividades marcadas`;}
  boxes.forEach(b=>b.addEventListener("change",()=>{state[b.dataset.excelCheck]=b.checked;try{localStorage.setItem(storage,JSON.stringify(state))}catch(_e){}update()}));update();
})();
