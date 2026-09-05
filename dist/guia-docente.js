(function(){
  "use strict";
  const course=window.CURSO_TECNOLOGIA;
  const out=document.querySelector("#teacher-classes");
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  if(!course||!course.clases){out.innerHTML="<p>No se pudo cargar el contenido del periodo.</p>";return;}
  Object.entries(course.clases).forEach(([id,lesson])=>{
    const rows=lesson.docente.map(row=>`<tr><td><strong>${esc(row[0])}</strong><br>${esc(row[1])}</td><td>${esc(row[2])}</td><td>${esc(row[3])}</td></tr>`).join("");
    const list=items=>items.map(x=>`<li>${esc(x)}</li>`).join("");
    const details=document.createElement("details");details.className="teacher-class";
    details.innerHTML=`<summary>Módulo ${esc(lesson.numero)} · ${esc(lesson.fechas)} · ${esc(lesson.titulo)}</summary><div class="teacher-body"><div class="meta"><span>${esc(lesson.duracion)}</span><span>${esc(lesson.modalidad)}</span><span>${esc(lesson.contenido)}</span></div><h3>Propósito y explicación</h3><p class="objective">${esc(lesson.objetivo)}</p><p>${esc(lesson.explicacion)}</p><p><strong>Ejemplo para modelar:</strong> ${esc(lesson.ejemplo)}</p><div class="coverage"><article><h2>Materiales</h2><ul class="check">${list(lesson.materiales)}</ul></article><article><h2>Evidencia</h2><ul class="check">${list(lesson.evidencia)}</ul></article><article><h2>Criterios</h2><ul class="check">${list(lesson.criterios)}</ul></article></div><h3>Secuencia para impartir</h3><table class="teacher-table"><thead><tr><th>Momento y tiempo</th><th>Lo que hace la maestra</th><th>Lo que hace el alumno</th></tr></thead><tbody>${rows}</tbody></table><p><strong>Cierre para el cuaderno:</strong> ${esc(lesson.cuaderno)}</p><a class="project-link" href="clase.html?tema=${encodeURIComponent(id)}">Abrir versión proyectable →</a></div>`;
    out.appendChild(details);
  });
})();
