(function () {
  "use strict";
  const genericWriting = label => ({ label, name: `Tecla ${label}`, category: "writing", fn: `Escribe ${label} cuando el cursor está en un espacio de texto.`, example: `Haz clic en un documento y pulsa ${label}.` });
  const keys = {
    Esc:{label:"Esc",name:"Escape",category:"control",fn:"Cancela, cierra o sale de una acción, según el programa.",example:"Puede cerrar un menú sin elegir una opción."},
    F1:{label:"F1",name:"F1 · Ayuda",category:"function",fn:"En muchos programas abre la ayuda.",example:"Pulsa F1 cuando necesites conocer una función."},
    F2:{label:"F2",name:"F2 · Cambiar nombre",category:"function",fn:"En Windows permite cambiar el nombre del archivo seleccionado.",example:"Selecciona una carpeta y pulsa F2."},
    F3:{label:"F3",name:"F3 · Buscar",category:"function",fn:"En varios programas abre o continúa una búsqueda.",example:"Úsala para localizar una palabra o archivo."},
    F4:{label:"F4",name:"F4",category:"function",fn:"Su función cambia según el programa; con Alt puede cerrar la ventana.",example:"Alt+F4 cierra la ventana activa."},
    F5:{label:"F5",name:"F5 · Actualizar",category:"function",fn:"Actualiza la página o ventana actual.",example:"Después de guardar HTML, pulsa F5 en el navegador."},
    F6:{label:"F6",name:"F6",category:"function",fn:"En el navegador lleva el cursor a la barra de direcciones.",example:"Pulsa F6 y observa la dirección seleccionada."},
    F7:{label:"F7",name:"F7",category:"function",fn:"En algunos programas inicia la revisión ortográfica.",example:"En Word puede revisar la escritura."},
    F8:{label:"F8",name:"F8",category:"function",fn:"Su función depende del programa o del inicio de Windows.",example:"Se utiliza solo cuando la maestra lo indique."},
    F9:{label:"F9",name:"F9",category:"function",fn:"Su función depende del programa.",example:"No todas las teclas de función hacen lo mismo en todas las aplicaciones."},
    F10:{label:"F10",name:"F10",category:"function",fn:"En algunos programas activa la barra de menús.",example:"Permite recorrer menús con el teclado."},
    F11:{label:"F11",name:"F11 · Pantalla completa",category:"function",fn:"Activa o desactiva la pantalla completa en muchos navegadores.",example:"Pulsa F11 para ocultar o mostrar barras del navegador."},
    F12:{label:"F12",name:"F12",category:"function",fn:"Su función cambia según el programa.",example:"En algunos programas abre Guardar como; úsala solo con indicación."},
    Backspace:{label:"Retroceso",name:"Retroceso",category:"editing",wide:true,fn:"Borra el carácter situado a la izquierda del cursor.",example:"En ca|sa, coloca el cursor después de a y pulsa Retroceso para borrar la a."},
    Tab:{label:"Tab",name:"Tabulador",category:"navigation",wide:true,fn:"Mueve el cursor al siguiente espacio, campo o punto de tabulación.",example:"En un formulario pasa al siguiente cuadro."},
    CapsLock:{label:"Bloq Mayús",name:"Bloqueo de mayúsculas",category:"control",wider:true,fn:"Mantiene activadas las letras mayúsculas hasta volver a pulsarla.",example:"Úsala para varias letras mayúsculas, no para una sola."},
    Enter:{label:"Enter",name:"Enter · Intro",category:"control",wider:true,fn:"Acepta una instrucción o comienza un nuevo renglón.",example:"En un documento baja a otra línea; en un cuadro confirma."},
    ShiftL:{label:"Shift",name:"Shift · Mayúscula temporal",category:"control",wider:true,fn:"Se mantiene presionada para escribir una mayúscula o el símbolo superior de una tecla.",example:"Mantén Shift y pulsa m para escribir M."},
    ShiftR:{label:"Shift",name:"Shift · Mayúscula temporal",category:"control",wider:true,fn:"Se mantiene presionada para escribir una mayúscula o el símbolo superior de una tecla.",example:"Mantén Shift y pulsa 1 para escribir el símbolo superior indicado en la tecla."},
    CtrlL:{label:"Ctrl",name:"Control",category:"control",wide:true,fn:"Se combina con otra tecla para ejecutar un atajo.",example:"Ctrl+S guarda; Ctrl+C copia."},
    CtrlR:{label:"Ctrl",name:"Control",category:"control",wide:true,fn:"Se combina con otra tecla para ejecutar un atajo.",example:"Mantén Ctrl, pulsa la otra tecla y suelta ambas."},
    Win:{label:"⊞",name:"Tecla Windows",category:"control",fn:"Abre el menú Inicio y participa en atajos del sistema.",example:"Windows+E abre el Explorador de archivos."},
    Alt:{label:"Alt",name:"Alt",category:"control",wide:true,fn:"Modifica la función de otra tecla y permite usar menús.",example:"Alt+Tab cambia entre ventanas abiertas."},
    Space:{label:"Barra espaciadora",name:"Barra espaciadora",category:"writing",space:true,fn:"Inserta un espacio entre palabras.",example:"Se pulsa una vez entre una palabra y la siguiente."},
    AltGr:{label:"Alt Gr",name:"Alt Gr",category:"control",wide:true,fn:"Permite escribir el tercer símbolo de algunas teclas.",example:"Según el teclado, se usa para @, \\ o |."},
    Menu:{label:"Menú",name:"Tecla de menú",category:"control",fn:"Abre un menú parecido al clic derecho en algunos equipos.",example:"Muestra opciones del elemento seleccionado."},
    Insert:{label:"Insert",name:"Insertar",category:"editing",fn:"Cambia entre insertar y reemplazar texto en programas compatibles.",example:"Normalmente se deja desactivada."},
    Home:{label:"Inicio",name:"Inicio",category:"navigation",fn:"Lleva el cursor al comienzo de la línea o sección.",example:"En un renglón va al primer carácter."},
    PageUp:{label:"Re Pág",name:"Retroceder página",category:"navigation",fn:"Desplaza la vista una pantalla hacia arriba.",example:"Permite regresar rápidamente en un documento largo."},
    Delete:{label:"Supr",name:"Suprimir",category:"editing",fn:"Borra el carácter a la derecha del cursor o el elemento seleccionado.",example:"A diferencia de Retroceso, borra hacia la derecha."},
    End:{label:"Fin",name:"Fin",category:"navigation",fn:"Lleva el cursor al final de la línea o sección.",example:"En un renglón va después del último carácter."},
    PageDown:{label:"Av Pág",name:"Avanzar página",category:"navigation",fn:"Desplaza la vista una pantalla hacia abajo.",example:"Permite avanzar en un documento largo."},
    ArrowUp:{label:"↑",name:"Flecha arriba",category:"navigation",fn:"Mueve el cursor o la selección hacia arriba.",example:"Sirve para recorrer texto o menús."},
    ArrowLeft:{label:"←",name:"Flecha izquierda",category:"navigation",fn:"Mueve el cursor un lugar hacia la izquierda.",example:"Corrige una letra sin usar el ratón."},
    ArrowDown:{label:"↓",name:"Flecha abajo",category:"navigation",fn:"Mueve el cursor o la selección hacia abajo.",example:"Sirve para recorrer texto o menús."},
    ArrowRight:{label:"→",name:"Flecha derecha",category:"navigation",fn:"Mueve el cursor un lugar hacia la derecha.",example:"Corrige una letra sin usar el ratón."}
  };
  "1234567890QWERTYUIOPASDFGHJKLÑZXCVBNM".split("").forEach(k => { if (!keys[k]) keys[k] = genericWriting(k); });
  Object.assign(keys, {
    Quote:genericWriting("´"), Plus:genericWriting("+"), BraceL:genericWriting("{"), BraceR:genericWriting("}"),
    Comma:genericWriting(","), Period:genericWriting("."), Hyphen:genericWriting("-"), Tilde:genericWriting("°")
  });
  const rows = [
    ["Esc","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"],
    ["Tilde","1","2","3","4","5","6","7","8","9","0","Quote","Plus","Backspace"],
    ["Tab","Q","W","E","R","T","Y","U","I","O","P","BraceL","BraceR","Enter"],
    ["CapsLock","A","S","D","F","G","H","J","K","L","Ñ","Quote","Enter"],
    ["ShiftL","Z","X","C","V","B","N","M","Comma","Period","Hyphen","ShiftR"],
    ["CtrlL","Win","Alt","Space","AltGr","Menu","CtrlR"],
    ["Insert","Home","PageUp","Delete","End","PageDown","ArrowUp","ArrowLeft","ArrowDown","ArrowRight"]
  ];
  const board = document.querySelector("#keyboard");
  rows.forEach(row => {
    const line=document.createElement("div"); line.className="key-row";
    row.forEach(id => {
      const item=keys[id]; const button=document.createElement("button");
      button.type="button"; button.className=`key ${item.category}${item.wide?" wide":""}${item.wider?" wider":""}${item.space?" space":""}`;
      button.textContent=item.label; button.dataset.key=id; button.setAttribute("aria-label",item.name); line.appendChild(button);
    }); board.appendChild(line);
  });
  function show(id){
    const item=keys[id]; if(!item)return;
    document.querySelectorAll(".key.selected").forEach(k=>k.classList.remove("selected"));
    const button=document.querySelector(`[data-key="${id}"]`); if(button)button.classList.add("selected");
    document.querySelector("#key-name").textContent=item.name;
    document.querySelector("#key-function").textContent=item.fn;
    document.querySelector("#key-example").textContent=item.example;
    document.querySelector("#key-note").textContent=`${item.name}: ${item.fn}`;
  }
  board.addEventListener("click",e=>{const b=e.target.closest("[data-key]");if(b)show(b.dataset.key);});
  const answers={corregir:["Backspace","La respuesta es Retroceso: borra a la izquierda del cursor."],aceptar:["Enter","La respuesta es Enter: acepta una instrucción o crea otro renglón."],mayuscula:["ShiftL","La respuesta es Shift: se mantiene presionada para una mayúscula temporal."],mover:["ArrowLeft","La respuesta es una flecha de navegación: mueve el cursor sin borrar."],guardar:["CtrlL","La respuesta es Ctrl+S: mantén Ctrl, pulsa S y suelta ambas."]};
  document.querySelectorAll("[data-challenge]").forEach(button=>button.addEventListener("click",()=>{const a=answers[button.dataset.challenge];show(a[0]);document.querySelector("#challenge-result").textContent=a[1];}));
})();
