(function () {
  "use strict";
  const editor = document.querySelector("#html-editor");
  const preview = document.querySelector("#html-preview");
  const message = document.querySelector("#save-message");
  const key = "aulaTecnologiaHtmlBorrador";
  const starter = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mi portafolio de Tecnología</title>
</head>
<body>
  <h1>Mi primera web tecnológica</h1>
  <p>Soy estudiante de tercer grado.</p>

  <h2>Lo que aprenderé</h2>
  <ul>
    <li>Herramientas y máquinas</li>
    <li>Algoritmos</li>
    <li>HTML</li>
  </ul>
</body>
</html>`;

  function render() {
    preview.srcdoc = editor.value;
    try { localStorage.setItem(key, editor.value); message.textContent = "Borrador guardado en este dispositivo."; } catch (_error) { message.textContent = "Guarda descargando el archivo."; }
  }

  let saved = "";
  try { saved = localStorage.getItem(key) || ""; } catch (_error) {}
  editor.value = saved || starter;
  render();

  let timer;
  editor.addEventListener("input", function () {
    message.textContent = "Escribiendo…";
    clearTimeout(timer);
    timer = setTimeout(render, 350);
  });
  editor.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      event.preventDefault();
      const start = editor.selectionStart;
      editor.value = editor.value.slice(0, start) + "  " + editor.value.slice(editor.selectionEnd);
      editor.selectionStart = editor.selectionEnd = start + 2;
      render();
    }
  });
  document.querySelector("#run-code").addEventListener("click", render);
  document.querySelector("#reset-code").addEventListener("click", function () {
    if (confirm("¿Quieres borrar tu borrador y volver al ejemplo inicial?")) { editor.value = starter; render(); }
  });
  document.querySelector("#download-code").addEventListener("click", function () {
    const blob = new Blob([editor.value], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "index.html"; link.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    message.textContent = "Archivo index.html descargado. Muévelo a tu carpeta de proyecto.";
  });
})();
