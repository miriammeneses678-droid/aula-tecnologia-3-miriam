(function(){
  "use strict";
  const key="aulaTecnologiaMiriam";
  let state={turno:"matutino"};
  try{state=Object.assign(state,JSON.parse(localStorage.getItem(key))||{});}catch(_error){}
  const picker=document.querySelector("#turno");
  const title=document.querySelector("#shift-title");
  const detail=document.querySelector("#shift-detail");
  function update(){
    picker.value=state.turno==="vespertino"?"vespertino":"matutino";
    if(picker.value==="vespertino"){
      title.textContent="Turno vespertino";
      detail.textContent="En Taller 1 trabaja cada estudiante en una computadora. Guarda tus archivos individualmente y muéstralos al terminar.";
    }else{
      title.textContent="Turno matutino";
      detail.textContent="Cuando se comparta equipo, trabajen con roles rotativos y cada alumno conserve su evidencia en el cuaderno.";
    }
  }
  picker.addEventListener("change",function(){state.turno=picker.value;try{localStorage.setItem(key,JSON.stringify(state));}catch(_error){}update();});
  update();
})();
