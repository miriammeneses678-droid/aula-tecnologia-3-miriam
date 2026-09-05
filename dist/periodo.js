(function () {
  "use strict";
  const course = window.CURSO_TECNOLOGIA;
  const key = "aulaTecnologiaMiriam";
  let state = { turno: "matutino" };
  try { state = Object.assign(state, JSON.parse(localStorage.getItem(key)) || {}); } catch (_error) {}

  const grid = document.querySelector("#module-grid");
  const turno = document.querySelector("#turno");
  const note = document.querySelector("#shift-note");

  function save() {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch (_error) {}
  }

  function statusLabel(status) {
    if (status === "realizado") return "Realizado en clase";
    if (status === "actual") return "Semana actual";
    return "Disponible";
  }

  course.modulos.forEach(function (module) {
    const article = document.createElement("article");
    article.className = `module-card ${module.estado === "actual" ? "current" : "available"}`;
    const link = module.enlace || `clase.html?tema=${module.id}`;
    article.innerHTML = `
      <div class="module-card__stripe"></div>
      <div class="module-card__body">
        <div class="module-card__meta"><span>Módulo ${module.numero} · ${module.fechas}</span><span class="module-status">${statusLabel(module.estado)}</span></div>
        <h3>${module.titulo}</h3>
        <p>${module.resumen}</p>
        <div class="module-card__actions">
          <a href="${link}">Abrir clase →</a>
        </div>
      </div>`;
    grid.appendChild(article);
  });

  function updateShift() {
    turno.value = state.turno === "vespertino" ? "vespertino" : "matutino";
    if (turno.value === "matutino") {
      note.textContent = "Turno matutino: el aprendizaje es común; en equipos compartidos se rotan los roles de operador, navegador y verificador.";
    } else {
      note.textContent = "Turno vespertino: el aprendizaje es común; Taller 1 se aprovecha para captura y prueba, y Taller 2 para preparación y revisión.";
    }
  }
  turno.addEventListener("change", function () { state.turno = turno.value; save(); updateShift(); });
  updateShift();
})();
