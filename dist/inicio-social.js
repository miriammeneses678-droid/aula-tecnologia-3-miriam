(function(){
  "use strict";
  const key="aulaTecnologiaMiriam";
  let state={turno:"matutino"};
  try{state=Object.assign(state,JSON.parse(localStorage.getItem(key))||{});}catch(_error){}
  const picker=document.querySelector("#turno");
  const title=document.querySelector("#shift-title");
  const detail=document.querySelector("#shift-detail");
  const patrioticGroups=document.querySelector("#patriotic-groups");
  function update(){
    if(!picker)return;
    picker.value=state.turno==="vespertino"?"vespertino":"matutino";
    if(picker.value==="vespertino"){
      if(title)title.textContent="Vespertino";
      if(detail)detail.textContent="En Taller 1 trabaja cada estudiante en una computadora. Las evidencias digitales se guardan individualmente.";
      if(patrioticGroups)patrioticGroups.innerHTML="<strong>Turno vespertino:</strong> correspondió a 3.º A, 3.º B, 3.º C, 3.º D y 3.º E.";
    }else{
      if(title)title.textContent="Matutino";
      if(detail)detail.textContent="En grupos grandes puede compartirse computadora; cada alumno conserva evidencia individual en el cuaderno.";
      if(patrioticGroups)patrioticGroups.innerHTML="<strong>Turno matutino:</strong> correspondió a 3.º A, 3.º B, 3.º C y 3.º E. En 3.º D no se considera faltante.";
    }
  }
  if(picker)picker.addEventListener("change",function(){state.turno=picker.value;try{localStorage.setItem(key,JSON.stringify(state));}catch(_error){}update();});
  document.querySelectorAll(".social-menu a[href^='#']").forEach(function(link){
    link.addEventListener("click",function(){
      document.querySelectorAll(".social-menu a").forEach(function(item){item.classList.remove("active");});
      link.classList.add("active");
    });
  });
  update();
})();
