(function () {
  "use strict";
  const params = new URLSearchParams(location.search);
  const id = params.get("tema");
  const course = window.CURSO_TECNOLOGIA;
  const lesson = course && course.clases[id];
  const lessonDays = (window.DIAS_MODULOS && window.DIAS_MODULOS[id]) || [];
  const output = document.querySelector("#lesson-output");

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
    });
  }
  function list(items, className) {
    return `<ul${className ? ` class="${className}"` : ""}>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  if (!lesson) {
    output.innerHTML = `<section class="error-card"><p class="eyebrow">No encontramos esta clase</p><h2>Elige un módulo del primer periodo</h2><p>El enlace puede estar incompleto o la clase todavía no se encuentra disponible.</p><a class="button button--primary" href="primer-periodo.html">Ver módulos</a></section>`;
    return;
  }

  document.title = `${lesson.titulo} · Tecnología 3.º`;
  const resources = (lesson.recursos || []).map(r => `<a href="${r.url}">${escapeHtml(r.texto)}</a>`).join("");
  const code = lesson.codigo ? `<div class="code-panel"><pre><code>${escapeHtml(lesson.codigo)}</code></pre></div>` : "";
  const tableHeadings = lesson.tablaEncabezados || ["Combinación", "Función", "¿Qué hace?"];
  const dataTable = lesson.tabla ? `<section class="lesson-table-section"><p class="eyebrow">Información para copiar</p><h3>${escapeHtml(lesson.tablaTitulo || "Tabla de apoyo")}</h3><p class="table-instruction">${escapeHtml(lesson.tablaInstruccion || "Traza tres columnas en tu cuaderno y copia cada fila. Después realiza la práctica.")}</p><div class="table-scroll"><table class="lesson-data-table"><thead><tr>${tableHeadings.map(heading => `<th>${escapeHtml(heading)}</th>`).join("")}</tr></thead><tbody>${lesson.tabla.map(row => `<tr>${row.map((cell, index) => `<td>${!lesson.tablaEncabezados && index === 0 ? `<kbd>${escapeHtml(cell)}</kbd>` : index === 0 ? `<strong>${escapeHtml(cell)}</strong>` : escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>` : "";
  const challenges = lesson.retos ? `<section class="visible-material"><p class="eyebrow">Material visible para proyectar</p><h3>${escapeHtml(lesson.retosTitulo || "Retos de la clase")}</h3><p class="table-instruction">La maestra asignará o leerá uno de estos retos. No necesitas una hoja impresa.</p><div class="visible-challenge-grid">${lesson.retos.map(item => `<article><strong>${escapeHtml(item[0])}</strong><p>${escapeHtml(item[1])}</p></article>`).join("")}</div></section>` : "";
  const bookRoute = lesson.libro ? `<section class="lesson-table-section"><p class="eyebrow">Seguimiento del libro</p><h3>${escapeHtml(lesson.libroTitulo || "Páginas del periodo")}</h3><p class="table-instruction">Al terminar cada fecha, revisa que las páginas indicadas estén completas y muestra el libro a la maestra.</p><div class="table-scroll"><table class="lesson-data-table"><thead><tr><th>Fecha</th><th>Páginas</th><th>Trabajo que debe quedar terminado</th></tr></thead><tbody>${lesson.libro.map(row => `<tr><td><strong>${escapeHtml(row[0])}</strong></td><td>${escapeHtml(row[1])}</td><td>${escapeHtml(row[2])}</td></tr>`).join("")}</tbody></table></div></section>` : "";
  const shiftPlan = lesson.turnos ? `<section class="shift-plan"><h3>Organización por turno</h3><p><strong>Matutino:</strong> ${escapeHtml(lesson.turnos.matutino)}</p><p><strong>Vespertino:</strong> ${escapeHtml(lesson.turnos.vespertino)}</p></section>` : "";
  const requestedDay = Number(params.get("dia"));
  const initialDay = Number.isInteger(requestedDay) && requestedDay >= 1 && requestedDay <= lessonDays.length ? requestedDay - 1 : 0;
  const dailyRoute = lessonDays.length ? `<section class="daily-route" aria-labelledby="daily-route-title">
      <div class="daily-route__heading"><div><p class="eyebrow">Actividades organizadas por fecha</p><h2 id="daily-route-title">Elige el día de tu clase</h2></div><p>Realiza solamente lo que aparece en la fecha indicada por la maestra.</p></div>
      <div class="day-tabs" role="tablist" aria-label="Fechas de este módulo">${lessonDays.map((day, index) => `<button type="button" role="tab" class="day-tab${index === initialDay ? " active" : ""}" aria-selected="${index === initialDay}" data-day-button="${index}"><span>Día ${index + 1}</span><strong>${escapeHtml(day.fecha.replace(" de 2026", ""))}</strong></button>`).join("")}</div>
      ${lessonDays.map((day, index) => `<article class="day-panel${index === initialDay ? " active" : ""}" role="tabpanel" data-day-panel="${index}"${index === initialDay ? "" : " hidden"}>
        <header><p class="eyebrow">${escapeHtml(day.fecha)}</p><h3>${escapeHtml(day.titulo)}</h3></header>
        <div class="day-objective"><strong>Objetivo del día</strong><p>${escapeHtml(day.objetivo)}</p></div>
        <h4>Actividades que debes realizar</h4>
        <ol class="day-activities">${day.actividades.map((activity, activityIndex) => `<li><label><input type="checkbox" data-check="dia-${id}-${index}-${activityIndex}"><span>${escapeHtml(activity)}</span></label></li>`).join("")}</ol>
        <div class="day-evidence"><strong>Esto debes mostrar al terminar</strong><p>${escapeHtml(day.evidencia)}</p></div>
        <div class="day-notebook"><h4>Así debe quedar el registro de hoy</h4><p><strong>Fecha:</strong> ${escapeHtml(day.fecha)}</p><p><strong>Tema:</strong> ${escapeHtml(day.titulo)}</p><p><strong>Objetivo:</strong> ${escapeHtml(day.objetivo)}</p><p><strong>¿Qué hicimos?</strong> ${escapeHtml(day.bitacora)}</p></div>
      </article>`).join("")}
    </section>` : "";

  output.innerHTML = `
    <section class="class-banner">
      <div><p class="eyebrow">Módulo ${escapeHtml(lesson.numero)} · ${escapeHtml(lesson.fechas)}</p><h2>${escapeHtml(lesson.titulo)}</h2><p>${escapeHtml(lesson.contenido)} · ${escapeHtml(lesson.duracion)} · ${escapeHtml(lesson.modalidad)}</p></div>
      <div class="class-number" aria-hidden="true">${escapeHtml(lesson.numero)}</div>
    </section>
    <div class="class-tools">
      <button type="button" data-go-back>← Regresar</button>
      ${resources}
    </div>
    ${dailyRoute}
    <div class="student-roadmap" aria-label="Ruta de trabajo"><span><b>1</b> Copia el encabezado</span><span><b>2</b> Lee la explicación</span><span><b>3</b> Haz la actividad</span><span><b>4</b> Muestra tu evidencia</span></div>
    <div class="class-layout">
      <article class="class-content">
        <section><p class="eyebrow">Meta de la clase</p><h3>Objetivo</h3><div class="objective-box">${escapeHtml(lesson.objetivo)}</div></section>
        <section><p class="eyebrow">Primera explicación</p><h3>Entiende antes de hacer</h3><p>${escapeHtml(lesson.explicacion)}</p><div class="example-panel"><strong>Ejemplo:</strong> ${escapeHtml(lesson.ejemplo)}</div></section>${dataTable}${bookRoute}${challenges}
        <section><p class="eyebrow">Segunda explicación</p><h3>Hazlo paso a paso</h3><ol class="class-steps">${lesson.pasos.map(step => `<li><span>${escapeHtml(step)}</span></li>`).join("")}</ol>${code}</section>
        <section><p class="eyebrow">Registro obligatorio</p><h3>Así termina tu bitácora</h3><div class="notebook-mini"><p><strong>Fecha:</strong> ${escapeHtml(lesson.fechas)} de 2026</p><p><strong>Tema:</strong> ${escapeHtml(lesson.titulo)}</p><p><strong>Objetivo:</strong> ${escapeHtml(lesson.objetivo)}</p><p><strong>¿Qué hicimos?</strong> ${escapeHtml(lesson.cuaderno)}</p></div></section>
      </article>
      <aside class="class-sidebar">
        ${shiftPlan}
        <section><h3>Materiales</h3>${list(lesson.materiales)}</section>
        <section><h3>Evidencia</h3>${list(lesson.evidencia)}</section>
        <section><h3>Antes de entregar</h3><div class="check-list">${lesson.criterios.map((criterion, index) => `<label><input type="checkbox" data-check="${id}-${index}"><span>${escapeHtml(criterion)}</span></label>`).join("")}</div></section>
        <section class="absence-box"><h3>Si faltaste o no hay equipo</h3><p>${escapeHtml(lesson.sinEquipo)}</p></section>
      </aside>
    </div>`;

  const storageKey = "aulaTecnologiaMiriam";
  let state = { lessonChecks: {} };
  try { state = Object.assign(state, JSON.parse(localStorage.getItem(storageKey)) || {}); } catch (_error) {}
  document.querySelectorAll("[data-day-button]").forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedIndex = Number(button.dataset.dayButton);
      document.querySelectorAll("[data-day-button]").forEach(function (item) {
        const selected = Number(item.dataset.dayButton) === selectedIndex;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      document.querySelectorAll("[data-day-panel]").forEach(function (panel) {
        const selected = Number(panel.dataset.dayPanel) === selectedIndex;
        panel.classList.toggle("active", selected);
        panel.hidden = !selected;
      });
      const nextUrl = new URL(location.href);
      nextUrl.searchParams.set("dia", String(selectedIndex + 1));
      history.replaceState(null, "", nextUrl);
    });
  });
  document.querySelectorAll("[data-check]").forEach(function (box) {
    box.checked = Boolean(state.lessonChecks[box.dataset.check]);
    box.addEventListener("change", function () {
      state.lessonChecks[box.dataset.check] = box.checked;
      try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (_error) {}
    });
  });
})();
