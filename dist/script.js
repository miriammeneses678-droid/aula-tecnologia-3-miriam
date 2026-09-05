(function () {
  "use strict";

  const storageKey = "aulaTecnologiaMiriam";
  const state = readState();

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || { turno: "matutino", checks: {} };
    } catch (_error) {
      return { turno: "matutino", checks: {} };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (_error) {
      // La página sigue funcionando aunque el navegador bloquee el almacenamiento local.
    }
  }

  const shiftSelect = document.querySelector("#turno");
  const shiftMessage = document.querySelector("#shift-message");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector("#nav-links");

  function updateShift() {
    const label = state.turno === "vespertino" ? "vespertino" : "matutino";
    shiftSelect.value = label;
    shiftMessage.textContent = `Contenido homologado para el turno ${label}. Las actividades y criterios son los mismos.`;
  }

  shiftSelect.addEventListener("change", function () {
    state.turno = shiftSelect.value;
    saveState();
    updateShift();
  });

  navToggle.addEventListener("click", function () {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll("#nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  const notebookExamples = {
    "clase-7": {
      date: "7 de septiembre de 2026",
      topic: "Firewall de protección: programa una ruta segura",
      objective: "Reconocer señales de alerta y ordenar una ruta segura mediante un algoritmo.",
      work: "Analizamos un caso ficticio, construimos un diagrama de flujo y diseñamos una pantalla de ayuda con tres redes de apoyo."
    },
    "clase-8": {
      date: "8 de septiembre de 2026",
      topic: "Diagnóstico inicial y glosario técnico",
      objective: "Completar el diagnóstico inicial y recuperar conceptos fundamentales de Tecnología mediante un glosario y ejemplos.",
      work: "Completamos el diagnóstico correspondiente y elaboramos un glosario de conceptos tecnológicos con explicaciones y ejemplos cotidianos."
    },
    "clase-9": {
      date: "9 de septiembre de 2026",
      topic: "Cierre diagnóstico y conceptos esenciales",
      objective: "Concluir el diagnóstico y relacionar técnica, tecnología, herramientas y algoritmos mediante un ejemplo.",
      work: "Concluimos las actividades pendientes, relacionamos conceptos tecnológicos en un ejemplo y marcamos lo que dominamos o necesitamos reforzar."
    }
  };

  const projectedCases = [
    ["Mensaje insistente", "Una cuenta desconocida envía mensajes repetidos y solicita una imagen privada.", "¿Qué detectas? ¿Qué haces primero?"],
    ["Petición de secreto", "Una persona pide guardar un secreto que provoca incomodidad y dice que nadie debe enterarse.", "¿A quién se puede pedir ayuda?"],
    ["Enlace sospechoso", "En un chat llega un enlace acompañado de una amenaza para obligar a abrirlo.", "¿Cómo se detiene la interacción?"],
    ["Contacto incómodo", "Durante una actividad, alguien invade el espacio personal de otra persona aunque ya se le pidió detenerse.", "¿Qué acción protege sin confrontar?"],
    ["Cuenta falsa", "Una cuenta que parece pertenecer a un compañero solicita datos personales y ubicación.", "¿Qué dato nunca se comparte?"],
    ["Broma que lastima", "En un grupo digital difunden una imagen editada para humillar a un estudiante.", "¿Qué se hace sin volver a difundirla?"],
    ["Ayuda no escuchada", "Un estudiante pide apoyo a una persona adulta, pero siente que no fue escuchado.", "¿Qué significa insistir de forma segura?"],
    ["Reto peligroso", "Alguien presiona a un compañero para participar en un reto que puede dañarlo.", "¿Cómo puede negarse y alejarse?"],
    ["Contraseña solicitada", "Una persona dice que necesita la contraseña de otra para demostrar confianza.", "¿Qué regla de seguridad se aplica?"],
    ["Encuentro a solas", "Una persona conocida por internet insiste en encontrarse sin informar a una persona adulta.", "¿Cuál es la ruta segura?"],
    ["Amenaza de difusión", "Alguien amenaza con publicar información para obligar a otra persona a responder.", "¿Cómo se pide ayuda sin ceder?"],
    ["Apodo constante", "Un grupo usa un apodo ofensivo pese a que la persona ya pidió que dejaran de hacerlo.", "¿Qué apoyos pueden intervenir?"],
    ["Fotografía sin permiso", "Alguien toma una fotografía de un estudiante y pretende publicarla sin autorización.", "¿Qué decisión protege la privacidad?"],
    ["Pasillo sin supervisión", "Un estudiante observa que otro está siendo intimidado en un pasillo.", "¿Cómo ayuda sin ponerse en riesgo?"],
    ["Expulsión del grupo", "Un chat excluye y ridiculiza de forma repetida a una compañera.", "¿Qué evidencia no debe difundirse?"],
    ["Premio engañoso", "Un mensaje promete un premio a cambio de información personal y fotografías.", "¿Cómo se verifica y se bloquea?"],
    ["Presión del grupo", "Varios compañeros presionan a alguien para compartir un video humillante.", "¿Cómo se rompe la cadena?"],
    ["Solicitud de ubicación", "Una cuenta nueva insiste en conocer la ubicación en tiempo real de un estudiante.", "¿Qué ajustes y apoyos se activan?"],
    ["Comentario incómodo", "Una persona realiza comentarios sobre el cuerpo de un estudiante y continúa después de que se le pidió parar.", "¿Qué límites y apoyos corresponden?"],
    ["Suplantación", "Crean un perfil usando el nombre y fotografías de otra persona.", "¿Qué se conserva y a quién se informa?"],
    ["Mensaje de madrugada", "Una persona adulta desconocida escribe con frecuencia y pide mantener la conversación en secreto.", "¿Qué señales de alerta aparecen?"],
    ["Compañero preocupado", "Un amigo dice que se siente inseguro, pero pide que nadie se entere.", "¿Cómo se acompaña y se busca apoyo?"],
    ["Bloqueo insuficiente", "Después de bloquear una cuenta, aparecen otras cuentas con mensajes semejantes.", "¿Por qué es importante insistir?"],
    ["Salida escolar", "Un estudiante nota que alguien lo sigue al salir y se siente en riesgo.", "¿A qué lugar seguro puede dirigirse?"]
  ];
  let currentCase = 0;
  const caseNumbers = document.querySelector("#case-numbers");
  function showCase(index) {
    currentCase = (index + projectedCases.length) % projectedCases.length;
    const item = projectedCases[currentCase];
    document.querySelector("#case-number").textContent = `Caso ${currentCase + 1}`;
    document.querySelector("#case-title").textContent = item[0];
    document.querySelector("#case-text").textContent = item[1];
    document.querySelector("#case-question").textContent = item[2];
    document.querySelectorAll("#case-numbers button").forEach((button, position) => button.classList.toggle("active", position === currentCase));
  }
  projectedCases.forEach(function (_item, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(index + 1);
    button.setAttribute("aria-label", `Mostrar caso ${index + 1}`);
    button.addEventListener("click", function () { showCase(index); });
    caseNumbers.appendChild(button);
  });
  document.querySelector("#previous-case").addEventListener("click", function () { showCase(currentCase - 1); });
  document.querySelector("#next-case").addEventListener("click", function () { showCase(currentCase + 1); });
  showCase(0);

  function updateNotebook(lessonId) {
    const example = notebookExamples[lessonId];
    if (!example) return;
    document.querySelector("#notebook-date").textContent = example.date;
    document.querySelector("#notebook-topic").textContent = example.topic;
    document.querySelector("#notebook-objective").textContent = example.objective;
    document.querySelector("#notebook-work").textContent = example.work;
    document.querySelector("#notebook-day").textContent = `Ejemplo correspondiente al ${example.date}`;
  }

  function activateLesson(lessonId, shouldScroll) {
    const tab = document.querySelector(`[data-class="${lessonId}"]`);
    if (!tab) return;
    document.querySelectorAll(".class-tab").forEach(function (item) {
        const selected = item.dataset.class === lessonId;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
    document.querySelectorAll(".lesson").forEach(function (lesson) {
        const selected = lesson.id === lessonId;
        lesson.classList.toggle("active", selected);
        lesson.hidden = !selected;
      });
    updateNotebook(lessonId);
    history.replaceState(null, "", `#${lessonId}`);
    if (shouldScroll) document.querySelector(`#${lessonId}`).scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelectorAll(".class-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      activateLesson(tab.dataset.class, true);
    });
  });

  document.querySelectorAll('a[href^="#clase-"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const lessonId = link.getAttribute("href").slice(1);
      if (!document.querySelector(`[data-class="${lessonId}"]`)) return;
      event.preventDefault();
      activateLesson(lessonId, true);
    });
  });

  document.querySelectorAll("[data-route]").forEach(function (choice) {
    choice.addEventListener("click", function () {
      const route = choice.dataset.route;
      document.querySelectorAll("[data-route]").forEach(function (item) {
        item.classList.toggle("active", item === choice);
      });
      document.querySelectorAll("[data-panel]").forEach(function (panel) {
        const selected = panel.dataset.panel === route;
        panel.classList.toggle("active", selected);
        panel.hidden = !selected;
      });
    });
  });

  document.querySelectorAll("[data-progress]").forEach(function (checkbox) {
    const id = checkbox.dataset.progress;
    checkbox.checked = Boolean(state.checks[id]);
    checkbox.addEventListener("change", function () {
      state.checks[id] = checkbox.checked;
      saveState();
    });
  });

  function openLessonFromHash() {
    const id = window.location.hash.slice(1);
    activateLesson(id, true);
  }

  updateShift();
  updateNotebook("clase-7");
  if (["clase-7", "clase-8", "clase-9"].includes(window.location.hash.slice(1))) {
    setTimeout(openLessonFromHash, 0);
  }
})();
