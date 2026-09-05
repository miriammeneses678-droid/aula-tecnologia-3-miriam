window.CURSO_TECNOLOGIA = {
  modulos: [
    {
      id: "inicio", numero: "00", fechas: "31 ago.–2 sep.", titulo: "Encuadre y diagnóstico", estado: "realizado",
      resumen: "Reglas, espacios de trabajo, saberes previos y diagnósticos formativos.", enlace: "index.html#inicio"
    },
    {
      id: "firewall", numero: "01", fechas: "7 sep.", titulo: "Firewall de protección", estado: "actual",
      resumen: "Algoritmo de una ruta segura y prototipo de pantalla de ayuda.", enlace: "index.html#clase-7"
    },
    {
      id: "diagnostico", numero: "02", fechas: "8–9 sep.", titulo: "Cierre diagnóstico", estado: "actual",
      resumen: "Aplicaciones pendientes y glosario técnico inicial.", enlace: "index.html#clase-8"
    },
    {
      id: "nivelacion", numero: "03", fechas: "14–15 sep.", titulo: "Conceptos esenciales", estado: "disponible",
      resumen: "Técnica, tecnología, algoritmo, máquina, herramienta, instrumento y material."
    },
    {
      id: "teclado", numero: "04", fechas: "21–23 sep.", titulo: "El teclado como instrumento", estado: "disponible",
      resumen: "Ubicación, clasificación y función de las teclas principales."
    },
    {
      id: "atajos", numero: "05", fechas: "28–30 sep.", titulo: "Atajos y secuencias", estado: "disponible",
      resumen: "Combinaciones de teclado y primer pseudocódigo cotidiano."
    },
    {
      id: "algoritmos", numero: "06", fechas: "5–7 oct.", titulo: "Algoritmos desde cero", estado: "disponible",
      resumen: "Entrada, proceso, salida, orden, decisión y repetición."
    },
    {
      id: "vscode", numero: "GUÍA", fechas: "Antes del 12 oct.", titulo: "Preparar Visual Studio Code", estado: "disponible",
      resumen: "Abrir una carpeta, crear index.html, guardar, usar Go Live y recuperar el trabajo.", enlace: "configurar-vscode.html"
    },
    {
      id: "html", numero: "07", fechas: "12–14 oct.", titulo: "Mi primera página HTML", estado: "disponible",
      resumen: "Carpeta, index.html, estructura base, encabezados, párrafos y listas."
    },
    {
      id: "herramientas", numero: "08", fechas: "15 y 19–21 oct.", titulo: "Herramientas y tecnología", estado: "disponible",
      resumen: "Libro pp. 22–28 y tabla HTML de herramientas y máquinas."
    },
    {
      id: "proyecto", numero: "09", fechas: "26–28 oct.", titulo: "Portafolio web", estado: "disponible",
      resumen: "Integración, prueba, depuración y entrega del proyecto del periodo."
    },
    {
      id: "evaluacion", numero: "10", fechas: "3–4 nov.", titulo: "Examen y regularización", estado: "disponible",
      resumen: "Repaso, examen teórico-práctico y corrección documentada."
    },
    {
      id: "cierre", numero: "11", fechas: "9–11 nov.", titulo: "Cierre formativo", estado: "disponible",
      resumen: "Resultados, autoevaluación, orden del portafolio y meta de mejora."
    }
  ],
  clases: {
    nivelacion: {
      numero: "03", fechas: "14–15 de septiembre", titulo: "Conceptos esenciales de Tecnología",
      contenido: "Diagnóstico y nivelación · C1/C3", duracion: "50 minutos", modalidad: "Individual con revisión grupal",
      objetivo: "Explicar con palabras propias siete conceptos fundamentales y distinguir herramienta, máquina e instrumento mediante ejemplos cotidianos.",
      explicacion: "La técnica es la manera organizada de hacer algo; la tecnología estudia y transforma esas técnicas para resolver necesidades. Las herramientas, máquinas e instrumentos ayudan a realizar acciones, mientras que un algoritmo ordena los pasos del proceso.",
      materiales: ["Cuaderno", "Lápiz o pluma", "Colores", "Regla"],
      pasos: [
        "Escribe el encabezado completo: fecha, tema y objetivo.",
        "Divide una hoja en tres columnas: concepto, explicación con tus palabras y ejemplo.",
        "Incluye técnica, tecnología, algoritmo, máquina, herramienta, instrumento y material.",
        "Agrega un dibujo pequeño o un ejemplo cercano para cada concepto.",
        "Compara herramienta, máquina e instrumento: escribe una diferencia clara entre ellos.",
        "Aplica el semáforo de dominio: verde si lo explicas, amarillo si dudas y rojo si necesitas apoyo.",
        "Cierra la bitácora con dos oraciones que expliquen qué hicimos."
      ],
      ejemplo: "Ejemplo: un destornillador es una herramienta porque amplía la fuerza y el movimiento de la mano. Una licuadora es una máquina porque utiliza energía y combina mecanismos para transformar alimentos. Un termómetro es un instrumento porque permite medir.",
      evidencia: ["Glosario de siete conceptos", "Ejemplos o dibujos", "Comparación de tres conceptos", "Semáforo de dominio"],
      criterios: ["Explica sin copiar palabras que no entiende", "Incluye los siete conceptos", "Los ejemplos corresponden", "Distingue herramienta, máquina e instrumento", "Registra la bitácora"],
      sinEquipo: "Esta clase está diseñada para realizarse completamente en el aula. Si faltaste, elabora el glosario y preséntalo al regresar.",
      cuaderno: "Construimos un glosario ilustrado, comparamos herramientas, máquinas e instrumentos y marcamos los conceptos que necesitamos reforzar.",
      docente: [
        ["Inicio", "8 min", "Muestra tres objetos o imágenes y pregunta qué son y para qué sirven.", "Propone respuestas breves sin consultar apuntes."],
        ["Explicación", "10 min", "Aclara los siete conceptos con ejemplos de la comunidad y del taller.", "Escucha, compara y corrige ideas previas."],
        ["Práctica", "25 min", "Modela una fila del glosario y acompaña sin dictar todas las definiciones.", "Completa su tabla y ejemplos."],
        ["Cierre", "7 min", "Solicita una comparación y aplica semáforo de dominio.", "Explica un concepto y registra su color."]
      ]
    },
    teclado: {
      numero: "04", fechas: "21–23 de septiembre", titulo: "El teclado como instrumento de interacción",
      contenido: "C1 / PDA1 · Herramientas e instrumentos", duracion: "50 minutos", modalidad: "Individual y reto grupal",
      objetivo: "Ubicar y explicar la función de las teclas principales para escribir, corregir, navegar y ejecutar instrucciones con mayor autonomía.",
      explicacion: "El teclado es un instrumento de entrada: convierte la presión de las teclas en señales que la computadora interpreta. No todas las teclas escriben letras; algunas modifican acciones, desplazan el cursor, corrigen o ejecutan funciones.",
      materiales: ["Teclado interactivo proyectado", "Cinco colores", "Cuaderno", "Teclado físico cuando esté disponible"],
      pasos: [
        "Escribe el encabezado completo en tu cuaderno.",
        "Observa el teclado interactivo proyectado. Ubica primero la barra espaciadora y la fila de letras.",
        "Traza en el cuaderno una tabla con cuatro columnas: tecla, familia, función y ejemplo.",
        "Cuando la maestra pulse una tecla, localízala en el teclado físico y completa una fila de tu tabla.",
        "Incluye Enter, Tab, Bloq Mayús, Shift, Ctrl, Alt, Alt Gr, Retroceso, Supr, flechas, Inicio, Fin, Re Pág, Av Pág y por lo menos cuatro teclas F.",
        "Usa un color por familia: escritura, control, edición, navegación y función. Incluye una leyenda.",
        "Participa en “Tecla detective”: escucha una función, señala la tecla proyectada y explica cómo se usa.",
        "Revisa precisión y completa la bitácora."
      ],
      ejemplo: "Retroceso elimina el carácter situado a la izquierda del cursor; Supr elimina el carácter situado a la derecha o un elemento seleccionado. Shift se mantiene presionada para escribir una mayúscula momentánea o el símbolo superior de una tecla.",
      evidencia: ["Tabla de teclas completa", "Leyenda de cinco familias", "Ejemplos de uso", "Bitácora"],
      criterios: ["Ubica correctamente las teclas solicitadas", "Clasifica cada tecla por familia", "Explica funciones con claridad", "Distingue Retroceso y Supr", "Trabajo limpio y completo"],
      sinEquipo: "Observa la proyección, localiza cada tecla en el teclado físico cuando sea posible y completa la tabla en el cuaderno.",
      cuaderno: "Exploramos el teclado interactivo, clasificamos las teclas por función y explicamos cómo escribir, corregir y navegar con mayor autonomía.",
      recursos: [{ texto: "Explorar teclado interactivo", url: "teclado-interactivo.html" }],
      docente: [
        ["Inicio", "7 min", "Presenta la pregunta: ¿qué teclas no escriben letras y para qué sirven?", "Señala ejemplos en el teclado proyectado o físico."],
        ["Modelado", "10 min", "Pulsa una tecla de cada familia y demuestra su función.", "Observa, localiza y anticipa resultados."],
        ["Práctica", "25 min", "Dirige la exploración interactiva y la tabla; revisa primero precisión, después presentación.", "Completa y colorea las filas de su tabla."],
        ["Cierre", "8 min", "Realiza cinco rondas de “Tecla detective”.", "Identifica y justifica la tecla."]
      ]
    },
    atajos: {
      numero: "05", fechas: "28–30 de septiembre", titulo: "Atajos del teclado y secuencias",
      contenido: "C1/C3 · Pensamiento computacional", duracion: "50 minutos", modalidad: "Práctica guiada individual",
      objetivo: "Ejecutar atajos básicos con precisión y representarlos como secuencias ordenadas antes de escribir un primer pseudocódigo.",
      explicacion: "Un atajo combina teclas para ejecutar una orden sin recorrer menús. La tecla de control se mantiene presionada y después se pulsa la segunda tecla. Un atajo también es una pequeña secuencia: entrada, acción y resultado.",
      tablaTitulo: "Tabla de atajos para copiar en el cuaderno",
      tabla: [
        ["Ctrl + C", "Copiar", "Duplica el texto o elemento seleccionado sin borrar el original."],
        ["Ctrl + V", "Pegar", "Coloca en el lugar elegido lo que se copió o cortó."],
        ["Ctrl + X", "Cortar", "Retira el elemento seleccionado para moverlo a otro lugar."],
        ["Ctrl + Z", "Deshacer", "Revierte la última acción realizada."],
        ["Ctrl + Y", "Rehacer", "Recupera una acción que se acaba de deshacer."],
        ["Ctrl + A", "Seleccionar todo", "Selecciona todo el contenido de la ventana o documento."],
        ["Ctrl + S", "Guardar", "Guarda los cambios realizados en el archivo."],
        ["Ctrl + F", "Buscar", "Localiza una palabra o dato dentro del documento o página."],
        ["Ctrl + P", "Vista de impresión", "Abre las opciones de impresión; no se imprime sin indicación de la maestra."]
      ],
      materiales: ["Computadora o teclado proyectado", "Tabla de atajos visible en esta clase", "Cuaderno", "Texto de práctica proyectado"],
      pasos: [
        "Registra fecha, tema y objetivo.",
        "Copia la tabla de atajos: Ctrl+C copiar, Ctrl+V pegar, Ctrl+X cortar, Ctrl+Z deshacer, Ctrl+Y rehacer, Ctrl+A seleccionar todo, Ctrl+S guardar, Ctrl+F buscar y Ctrl+P imprimir.",
        "Predice qué ocurrirá antes de ejecutar cada combinación.",
        "Practica con un texto breve: selecciona, copia, pega, corta, deshaz y guarda.",
        "Si todavía no tienes equipo, observa la demostración proyectada y escribe el orden de las teclas y el resultado esperado.",
        "Escribe un pseudocódigo para copiar una frase y pegarla en otro lugar.",
        "Completa el reto final sin competir por velocidad: importa la precisión.",
        "Anota en la bitácora tres atajos que ya dominas y uno por practicar."
      ],
      ejemplo: "Pseudocódigo: INICIO → seleccionar texto → mantener Ctrl → pulsar C → colocar cursor en el destino → mantener Ctrl → pulsar V → verificar resultado → FIN.",
      evidencia: ["Tabla de nueve atajos", "Reto práctico explicado", "Primer pseudocódigo", "Bitácora"],
      criterios: ["Relaciona cada combinación con su función", "Mantiene el orden correcto", "Verifica el resultado", "Pseudocódigo comprensible", "Cuida el equipo"],
      sinEquipo: "Observa la demostración proyectada. Escribe la predicción y el resultado de cada atajo para practicarlo en cuanto tengas acceso a la computadora.",
      cuaderno: "Practicamos nueve atajos, anticipamos sus resultados y convertimos una acción del teclado en una secuencia de pseudocódigo.",
      recursos: [{ texto: "Explorar teclado interactivo", url: "teclado-interactivo.html" }],
      docente: [
        ["Inicio", "6 min", "Demuestra copiar y pegar sin nombrar las teclas; pide inferencias.", "Describe lo que observó."],
        ["Explicación", "9 min", "Aclara tecla modificadora, selección y diferencia entre copiar y cortar.", "Registra tabla mínima."],
        ["Práctica", "27 min", "Marca retos progresivos y observa precisión.", "Ejecuta o representa cada combinación."],
        ["Cierre", "8 min", "Solicita pseudocódigo y una autoevaluación breve.", "Entrega secuencia y bitácora."]
      ]
    },
    algoritmos: {
      numero: "06", fechas: "5–7 de octubre", titulo: "Algoritmos desde cero",
      contenido: "C3 / PDA3 · Procesos técnicos", duracion: "50 minutos", modalidad: "Parejas con evidencia individual",
      objetivo: "Diseñar un algoritmo con entrada, proceso y salida, e incluir por lo menos una decisión y una repetición para resolver una tarea técnica.",
      explicacion: "Un algoritmo es una secuencia finita y ordenada de instrucciones. Recibe datos o condiciones de entrada, realiza un proceso y produce una salida. Las decisiones cambian la ruta; las repeticiones evitan escribir la misma instrucción muchas veces.",
      materiales: ["Cuaderno", "Modelo de diagrama proyectado", "Lápiz y regla", "Reto técnico visible en esta clase"],
      retosTitulo: "Retos técnicos para asignar a las parejas",
      retos: [
        ["Reto 1", "Guardar un archivo con el nombre correcto dentro de la carpeta indicada y comprobar que abre."],
        ["Reto 2", "Organizar cinco archivos en carpetas separadas por materia y verificar que ninguno quede fuera."],
        ["Reto 3", "Buscar una palabra dentro de un documento, corregirla y guardar el cambio."],
        ["Reto 4", "Encender, usar y apagar una computadora siguiendo una secuencia segura."],
        ["Reto 5", "Limpiar de forma segura un teclado sin dañar el equipo ni mover teclas."],
        ["Reto 6", "Crear una carpeta, cambiarle el nombre y verificar en qué ubicación quedó guardada."],
        ["Reto 7", "Abrir una página HTML, localizar un error sencillo y comprobar la corrección en el navegador."],
        ["Reto 8", "Copiar información autorizada de un documento a otro y confirmar que conserva el orden."]
      ],
      pasos: [
        "Escribe el encabezado.",
        "Define el problema en una sola oración: qué necesitas resolver.",
        "Anota la entrada: materiales, datos o condiciones disponibles.",
        "Ordena entre cinco y ocho acciones del proceso usando verbos.",
        "Agrega una decisión con SI… ENTONCES… DE LO CONTRARIO…",
        "Agrega una repetición: REPETIR HASTA QUE se cumpla una condición.",
        "Define la salida o resultado esperado.",
        "Transforma la secuencia en diagrama de flujo y pruébala con un compañero.",
        "Corrige una instrucción ambigua y documenta el cambio."
      ],
      ejemplo: "Para guardar un archivo: ENTRADA nombre y carpeta → escribir contenido → SI el nombre está completo, ENTONCES guardar; DE LO CONTRARIO corregirlo → REPETIR revisión HASTA QUE el archivo abra correctamente → SALIDA archivo guardado.",
      evidencia: ["Definición del problema", "Algoritmo con 5–8 pasos", "Decisión y repetición", "Diagrama de flujo", "Corrección documentada"],
      criterios: ["El orden es lógico", "La entrada y salida son claras", "Incluye decisión", "Incluye repetición", "Se probó y corrigió"],
      sinEquipo: "No requiere computadora. El algoritmo se diseña primero en el cuaderno porque programar sin plan es como armar un mueble sin instrucciones: posible, pero con tornillos de sobra.",
      cuaderno: "Diseñamos un algoritmo con entrada, proceso y salida; añadimos una decisión, una repetición y corregimos una instrucción después de probarla.",
      docente: [
        ["Inicio", "7 min", "Da instrucciones incompletas para una tarea y provoca que el grupo detecte la ambigüedad.", "Identifica el paso que falta."],
        ["Explicación", "10 min", "Modela entrada, proceso, salida, decisión y repetición.", "Clasifica ejemplos."],
        ["Construcción", "25 min", "Asigna a cada pareja uno de los retos visibles y acompaña la prueba entre pares.", "Escribe, diagrama, prueba y corrige."],
        ["Cierre", "8 min", "Pide explicar la corrección realizada.", "Registra cambio y resultado."]
      ]
    },
    html: {
      numero: "07", fechas: "12–14 de octubre", titulo: "Mi primera página HTML",
      contenido: "C1/C3 · Proyecto integrador", duracion: "50 minutos", modalidad: "Parejas, con turnos operador–navegador",
      objetivo: "Crear una carpeta de proyecto y un archivo index.html con estructura básica, encabezado, párrafo y lista que abra correctamente en el navegador.",
      explicacion: "HTML organiza el contenido de una página mediante etiquetas. La mayoría tiene apertura y cierre. Visual Studio Code sirve para escribir el archivo; el navegador interpreta el código y muestra el resultado. Son tareas distintas: editar y visualizar.",
      materiales: ["Computadora cuando corresponda", "Visual Studio Code o Bloc de notas", "Navegador", "Cuaderno", "Modelo proyectado"],
      pasos: [
        "Abre la clase HTML desde cero. Haz clic en cada línea y explica qué pertenece a head, qué pertenece a body y qué etiquetas necesitan cierre.",
        "Crea una carpeta llamada 3A_Apellido_Nombre_Web. Cambia 3A por tu grupo.",
        "Abre Visual Studio Code y elige Archivo → Abrir carpeta. Selecciona tu carpeta.",
        "Crea un archivo nuevo llamado exactamente index.html. Revisa que no termine en .txt.",
        "Escribe la estructura base siguiendo el modelo. No copies solo una parte.",
        "Dentro de body agrega un título h1, un párrafo p y una lista ul con tres elementos li.",
        "Guarda con Ctrl+S.",
        "Abre index.html en el navegador y compara código con resultado.",
        "Si no aparece algo, revisa cierres, signos < > y ubicación dentro de body.",
        "En el cuaderno explica con tus palabras para qué sirven title y body."
      ],
      codigo: "<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Mi portafolio de Tecnología</title>\n</head>\n<body>\n  <h1>Mi primera web tecnológica</h1>\n  <p>Soy estudiante de tercer grado.</p>\n  <h2>Lo que aprenderé</h2>\n  <ul>\n    <li>Herramientas y máquinas</li>\n    <li>Algoritmos</li>\n    <li>HTML</li>\n  </ul>\n</body>\n</html>",
      ejemplo: "Si el navegador muestra las palabras <h1> en vez del título grande, probablemente el archivo no se guardó como HTML o la etiqueta está escrita incorrectamente.",
      evidencia: ["Carpeta con nombre correcto", "Archivo index.html", "Página visible en navegador", "Código base comentado o explicado en cuaderno"],
      criterios: ["Nombre de carpeta y archivo correctos", "Estructura completa", "Incluye h1, p, ul y li", "Guarda y abre en navegador", "Explica dos etiquetas"],
      sinEquipo: "Copia el modelo del editor en el cuaderno, marca apertura y cierre de etiquetas y simula el resultado. Captura el código en la siguiente sesión de taller.",
      cuaderno: "Creamos la carpeta del proyecto y el archivo index.html, escribimos la estructura básica y comprobamos en el navegador un encabezado, un párrafo y una lista.",
      recursos: [{ texto: "Aprender HTML desde cero", url: "html-desde-cero.html" }, { texto: "Configurar Visual Studio Code", url: "configurar-vscode.html" }, { texto: "Abrir laboratorio HTML", url: "laboratorio-html.html" }],
      docente: [
        ["Inicio", "5 min", "Distingue editor y navegador con una comparación visible.", "Nombra la función de cada programa."],
        ["Modelado", "12 min", "Crea carpeta e index.html desde cero, verbalizando cada acción.", "Sigue la demostración sin adelantarse."],
        ["Práctica", "25 min", "Detiene el grupo en tres puntos de verificación: archivo, estructura y resultado.", "Operador escribe; navegador verifica y explica."],
        ["Cierre", "8 min", "Solicita explicar dos etiquetas y guardar el archivo localmente.", "Explica, registra y verifica archivo."]
      ]
    },
    herramientas: {
      numero: "08", fechas: "15 y 19–21 de octubre", titulo: "Herramientas y tecnología en una tabla HTML",
      contenido: "C1 / PDA1 · Libro Tecnología 3, pp. 22–28", duracion: "Cuatro sesiones", modalidad: "Individual en libro; captura por parejas",
      objetivo: "Identificar y clasificar herramientas o máquinas según su descripción, uso y accionamiento, y organizar la información en una tabla HTML.",
      explicacion: "Una tabla permite comparar información usando filas y columnas. En HTML, table contiene toda la tabla; tr crea una fila; th crea un encabezado y td crea una celda de datos.",
      materiales: ["Libro Tecnología 3", "Páginas 22–28", "Cuaderno", "Proyecto HTML", "Computadora cuando corresponda"],
      libroTitulo: "Ruta del libro para terminar las páginas 22–28",
      libro: [
        ["15 de octubre", "22–23", "Lee el tema, anota tres ideas importantes y una palabra por aclarar."],
        ["19 de octubre", "24–26", "Continúa la lectura; localiza herramienta, máquina e instrumento y explica su accionamiento."],
        ["20 de octubre", "27", "Responde individualmente la identificación y clasificación; revisa que no haya espacios vacíos."],
        ["21 de octubre", "28", "Termina, corrige con el grupo y elige cinco ejemplos para la tabla HTML."]
      ],
      pasos: [
        "Lee el tema “Herramientas y tecnología” de las páginas 22 a 28.",
        "Realiza individualmente la actividad de identificación y clasificación de las páginas 27–28.",
        "Selecciona cinco herramientas, máquinas o instrumentos.",
        "Prepara una tabla con cuatro columnas: nombre, descripción, uso y accionamiento.",
        "Revisa que la información sea técnica, breve y correcta.",
        "Abre tu index.html y agrega la tabla dentro de body.",
        "Crea una fila de encabezados con th y cinco filas de información con td.",
        "Guarda, abre en el navegador y corrige filas o cierres faltantes.",
        "Cada integrante valida y firma una fila en su cuaderno."
      ],
      codigo: "<h2>Herramientas y máquinas</h2>\n<table border=\"1\">\n  <tr>\n    <th>Nombre</th>\n    <th>Descripción</th>\n    <th>Uso</th>\n    <th>Accionamiento</th>\n  </tr>\n  <tr>\n    <td>Destornillador</td>\n    <td>Herramienta manual</td>\n    <td>Girar tornillos</td>\n    <td>Fuerza humana</td>\n  </tr>\n</table>",
      ejemplo: "No escribas “sirve para cosas”. Una descripción útil sería: “Herramienta manual con punta diseñada para girar tornillos”.",
      evidencia: ["Actividad del libro pp. 27–28", "Tabla previa en cuaderno", "Tabla HTML con cinco elementos", "Fila individual validada"],
      criterios: ["Incluye cinco elementos", "Descripción y uso son correctos", "Identifica el accionamiento", "La tabla abre sin romper la página", "Cada integrante acredita una fila"],
      sinEquipo: "Completa la tabla en el cuaderno con todas las etiquetas necesarias. Debe quedar lista para capturarse sin volver a investigar.",
      cuaderno: "Leímos y clasificamos herramientas y máquinas del libro; organizamos cinco ejemplos por descripción, uso y accionamiento y los convertimos en una tabla HTML.",
      docente: [
        ["15 oct.", "50 min", "Guía la lectura de las pp. 22–23 y aclara vocabulario.", "Lee y registra tres ideas y una duda."],
        ["19 oct.", "50 min", "Guía las pp. 24–26 y modela la clasificación.", "Localiza ejemplos y explica su accionamiento."],
        ["20 oct.", "50 min", "Acompaña y revisa la actividad individual de la p. 27.", "Responde, revisa y muestra el libro."],
        ["21 oct.", "50 min", "Corrige la p. 28 y modela la tabla HTML.", "Termina el libro y captura cinco ejemplos."]
      ]
    },
    proyecto: {
      numero: "09", fechas: "26–28 de octubre", titulo: "Integración del portafolio web",
      contenido: "Integración C1/C3 · Proyecto 30%", duracion: "Dos o tres sesiones", modalidad: "Parejas",
      objetivo: "Integrar, probar y mejorar un portafolio web básico que comunique evidencias del periodo y funcione al abrir index.html en el navegador.",
      explicacion: "Integrar no significa pegar todo sin orden. El portafolio debe tener una estructura clara, contenido curricular correcto y archivos organizados. Depurar es localizar un error, formular una posible causa, corregir y volver a probar.",
      materiales: ["Carpeta del proyecto", "index.html", "Cuaderno y bitácora", "Evidencias del periodo", "Computadora o modelo proyectado"],
      pasos: [
        "Verifica que la carpeta y el archivo index.html tengan nombres correctos.",
        "Ordena la página: título, presentación, sección de Jornada, tabla de herramientas y bitácora.",
        "Revisa la estructura base y el cierre de cada etiqueta.",
        "Incluye una sección breve de la ruta segura sin nombres ni datos personales.",
        "Comprueba que la tabla tenga cinco herramientas o máquinas.",
        "Intercambia revisión con otra pareja: una persona navega y otra observa el código.",
        "Documenta por lo menos un error: qué ocurrió, qué cambiaste y cuál fue el resultado.",
        "Guarda con Ctrl+S, abre de nuevo y muestra a la maestra que el proyecto funciona.",
        "Cada integrante completa su autoevaluación de rol."
      ],
      ejemplo: "Registro de depuración: “El título no aparecía. Encontramos que h1 estaba escrito fuera de body. Movimos la etiqueta, guardamos y al actualizar el navegador se mostró correctamente”.",
      evidencia: ["Carpeta y archivo funcional", "Estructura HTML", "Sección de ruta segura", "Tabla de cinco herramientas", "Bitácora de depuración", "Proyecto guardado localmente"],
      criterios: ["Organización del proyecto: 5 puntos", "Estructura HTML: 8", "Contenido curricular: 7", "Ruta segura: 4", "Prueba y mejora: 3", "Colaboración responsable: 3"],
      sinEquipo: "Integra el código de manera continua en el cuaderno, señala cada sección y realiza la revisión por lectura. Se digitaliza cuando corresponda la práctica en el taller.",
      cuaderno: "Integramos las secciones del portafolio, probamos index.html, corregimos un error y guardamos el proyecto en la computadora.",
      recursos: [{ texto: "Practicar en laboratorio HTML", url: "laboratorio-html.html" }],
      docente: [
        ["Verificación 1", "10 min", "Revisa carpeta, index.html y apertura en navegador.", "Muestra ruta y registra nombre."],
        ["Integración", "20 min", "Solicita secciones mínimas y revisa contenido, no decoración.", "Ordena e integra evidencias."],
        ["Prueba cruzada", "12 min", "Organiza revisión entre parejas con criterios visibles.", "Detecta y documenta un error."],
        ["Cierre", "8 min", "Verifica el guardado local y revisa una muestra de equipos.", "Guarda, muestra el resultado y registra."]
      ]
    },
    evaluacion: {
      numero: "10", fechas: "3–4 de noviembre", titulo: "Evaluación y regularización técnica",
      contenido: "Evaluación del primer periodo", duracion: "50 minutos", modalidad: "Individual",
      objetivo: "Demostrar el dominio básico de teclado, atajos, conceptos tecnológicos, algoritmos y lectura de HTML, y corregir fallos técnicos cuando corresponda.",
      explicacion: "La evaluación combina reconocimiento y aplicación. No basta memorizar una tecla: debes explicar qué hace y elegirla en una situación. Tampoco necesitas escribir una página completa de memoria, pero sí leer una estructura HTML y localizar errores básicos.",
      materiales: ["Lápiz o pluma", "Cuaderno cerrado durante el examen", "Evidencia autorizada para regularización"],
      retosTitulo: "Preguntas visibles para repasar antes del examen",
      retos: [
        ["Teclado", "¿Cuál es la diferencia entre Retroceso y Supr? Escribe un ejemplo de cada una."],
        ["Atajo", "¿Qué combinación permite deshacer la última acción y cuándo la usarías?"],
        ["Clasificación", "Clasifica destornillador, licuadora y termómetro como herramienta, máquina o instrumento."],
        ["Proceso", "Identifica la entrada, el proceso y la salida al guardar correctamente un archivo."],
        ["Decisión", "Escribe una instrucción que use SI… ENTONCES… para comprobar el nombre de un archivo."],
        ["HTML", "Explica qué contenido pertenece a head y cuál pertenece a body."],
        ["Error HTML", "¿Qué puede ocurrir si se escribe <p> sin su etiqueta de cierre </p>?"],
        ["Lista", "¿Qué función tienen ul y li y cómo trabajan juntas?"],
        ["Tabla", "Explica para qué sirven table, tr, th y td."]
      ],
      pasos: [
        "Antes del examen, repasa funciones de Enter, Tab, Shift, Ctrl, retroceso y Supr.",
        "Relaciona nueve atajos con una situación de uso.",
        "Explica técnica, tecnología, herramienta, máquina, instrumento, material y algoritmo.",
        "Practica entrada, proceso, salida y una decisión SI–ENTONCES.",
        "Lee un fragmento HTML e identifica head, title, body, h1, p, ul, li, table, tr, th y td.",
        "Durante el examen, lee primero toda la pregunta y después las opciones.",
        "El 4 de noviembre, si tienes recuperación autorizada, corrige el fallo y documenta antes–cambio–resultado."
      ],
      ejemplo: "Pregunta de práctica: ¿Qué combinación permite deshacer la última acción? Respuesta: Ctrl+Z. Explicación: revierte la acción más reciente y permite corregir un error.",
      evidencia: ["Examen resuelto", "Corrección o recuperación autorizada", "Registro de fallo técnico, cuando aplique"],
      criterios: ["Responde de manera individual", "Lee y sigue instrucciones", "Justifica cuando se solicita", "En regularización documenta la corrección"],
      sinEquipo: "El examen puede resolverse en el cuaderno. La lectura de HTML se evalúa con un fragmento proyectado y copiado.",
      cuaderno: "Repasamos los aprendizajes del periodo y realizamos la evaluación teórico-práctica. Cuando correspondió, documentamos una corrección técnica.",
      docente: [
        ["Preparación", "5 min", "Explica estructura, tiempo y reglas sin adelantar respuestas.", "Organiza material y escucha."],
        ["Examen", "35 min", "Supervisa y aclara únicamente instrucciones.", "Resuelve individualmente."],
        ["Verificación", "10 min", "Solicita revisar nombre, reactivos y respuestas pendientes.", "Relee y entrega."],
        ["Regularización 4 nov.", "Según caso", "Autoriza evidencia y exige corrección documentada.", "Corrige con la misma rúbrica."]
      ]
    },
    cierre: {
      numero: "11", fechas: "9–11 de noviembre", titulo: "Cierre formativo y meta de mejora",
      contenido: "Cierre del primer periodo", duracion: "50 minutos", modalidad: "Individual",
      objetivo: "Interpretar los resultados del periodo, organizar el portafolio y establecer una meta concreta de mejora para el siguiente periodo.",
      explicacion: "Una calificación resume evidencias, pero la autoevaluación explica el proceso. Una meta útil debe indicar qué mejorarás, cómo lo practicarás y cómo sabrás que avanzaste.",
      materiales: ["Cuaderno", "Portafolio del periodo", "Resultados entregados por la docente"],
      pasos: [
        "Registra fecha, tema y objetivo.",
        "Ordena las evidencias del periodo por fecha.",
        "Marca tres logros: uno de uso del teclado, uno de algoritmos y uno de HTML.",
        "Identifica una dificultad concreta, sin escribir frases generales como “todo”.",
        "Completa: antes pensaba…, ahora comprendo…, todavía necesito…",
        "Escribe una meta para el siguiente periodo con acción y frecuencia.",
        "Verifica que tu carpeta digital abra y contenga todos los archivos trabajados.",
        "Completa la bitácora final."
      ],
      ejemplo: "Meta débil: “mejorar HTML”. Meta útil: “practicaré 15 minutos dos veces por semana escribiendo una etiqueta nueva y comprobaré el resultado en el navegador”.",
      evidencia: ["Portafolio ordenado", "Autoevaluación", "Tres logros", "Una dificultad", "Meta concreta"],
      criterios: ["Reflexión específica", "Relaciona evidencias reales", "Meta posible y verificable", "Portafolio guardado y verificable", "Bitácora completa"],
      sinEquipo: "Organiza y autoevalúa las evidencias del cuaderno. La carpeta digital se verifica cuando haya acceso al taller.",
      cuaderno: "Organizamos el portafolio, identificamos logros y dificultades y establecimos una meta concreta para el siguiente periodo.",
      docente: [
        ["Resultados", "10 min", "Entrega y explica tendencias sin exhibir públicamente casos individuales.", "Revisa sus resultados."],
        ["Organización", "15 min", "Proporciona orden esperado del portafolio.", "Clasifica evidencias."],
        ["Autoevaluación", "18 min", "Modela diferencia entre frase general y reflexión específica.", "Escribe logros, dificultad y cambio."],
        ["Meta", "7 min", "Valida que incluya acción y forma de comprobar avance.", "Redacta y comparte solo si desea."]
      ]
    }
  }
};
