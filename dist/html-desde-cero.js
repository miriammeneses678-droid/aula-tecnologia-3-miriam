(function(){
  "use strict";
  const lines=[
    ["<!DOCTYPE html>","DOCTYPE","Avisa al navegador que el documento utiliza HTML5.","No. Es una instrucción para el navegador.","Se escribe una sola vez y siempre va al principio."],
    ["<html lang=\"es\">","html","Abre el documento completo y señala que el idioma principal es español.","No aparece como texto.","Todo el código de la página queda dentro de html."],
    ["<head>","head","Abre la zona de información para el navegador.","No se ve dentro de la página.","head va antes de body."],
    ["  <meta charset=\"UTF-8\">","meta charset","Permite mostrar correctamente acentos, la letra ñ y otros caracteres.","No.","meta no necesita etiqueta de cierre en HTML5."],
    ["  <title>Mi portafolio de Tecnología</title>","title","Define el texto que aparece en la pestaña del navegador.","Se ve en la pestaña, no dentro de la hoja.","title se abre y se cierra dentro de head."],
    ["</head>","Cierre de head","Cierra la información para el navegador.","No.","La diagonal / significa cerrar."],
    ["<body>","body","Abre la zona visible de la página.","Su contenido sí se ve.","Títulos, textos, listas y tablas van dentro de body."],
    ["  <h1>Mi primera web tecnológica</h1>","h1","Crea el título principal de la página.","Sí, aparece grande y destacado.","Normalmente se usa un h1 principal por página."],
    ["  <p>Soy estudiante de tercer grado.</p>","p","Crea un párrafo de texto.","Sí.","Cada párrafo abre con p y cierra con /p."],
    ["  <h2>Lo que aprenderé</h2>","h2","Crea un subtítulo o una sección.","Sí.","h2 organiza temas que dependen del título h1."],
    ["  <ul>","ul","Abre una lista con viñetas.","Las viñetas y sus elementos sí se ven.","Los elementos li deben quedar dentro de ul."],
    ["    <li>Herramientas y máquinas</li>","li","Crea un elemento de la lista.","Sí, como una viñeta.","Cada idea distinta utiliza su propio li."],
    ["    <li>Algoritmos</li>","li","Crea otro elemento dentro de la misma lista.","Sí.","No cierres ul hasta terminar todos los li."],
    ["    <li>HTML</li>","li","Crea el tercer elemento de la lista.","Sí.","li también necesita apertura y cierre."],
    ["  </ul>","Cierre de ul","Indica que la lista terminó.","No se ve como texto.","Se cierra después del último li."],
    ["</body>","Cierre de body","Indica que terminó el contenido visible.","No.","Después de cerrar body no agregues contenido visible."],
    ["</html>","Cierre de html","Finaliza todo el documento HTML.","No.","Debe ser la última etiqueta de la estructura."],
  ];
  const out=document.querySelector("#code-lines");
  lines.forEach((line,index)=>{const b=document.createElement("button");b.type="button";b.className="code-line";b.dataset.line=index;b.innerHTML=`<span>${index+1}</span><span></span>`;b.lastElementChild.textContent=line[0];out.appendChild(b);});
  function show(index){const line=lines[index];document.querySelectorAll(".code-line.selected").forEach(x=>x.classList.remove("selected"));document.querySelector(`[data-line="${index}"]`).classList.add("selected");document.querySelector("#line-name").textContent=line[1];document.querySelector("#line-function").textContent=line[2];document.querySelector("#line-visible").textContent=line[3];document.querySelector("#line-rule").textContent=line[4];}
  out.addEventListener("click",event=>{const line=event.target.closest("[data-line]");if(line)show(Number(line.dataset.line));});
  show(0);
})();
