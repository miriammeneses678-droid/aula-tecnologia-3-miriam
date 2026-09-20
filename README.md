# Aula de Tecnología 3.º · Mtra. Miriam

Sitio web estático para la Escuela Secundaria Mixta 41. Está diseñado para funcionar en celular y computadora, sin base de datos y sin solicitar cuentas al alumnado.

## Qué contiene esta versión actualizada

- Inicio tipo muro de publicaciones: la actividad actual aparece primero y el alumnado no necesita recorrer toda la plataforma.
- Selector de turno matutino o vespertino; el contenido académico está homologado.
- Clases completas del primer periodo, del 31 de agosto al 11 de noviembre de 2026.
- Módulos actualizados conforme a la planeación: teclado aplicado a Excel, tabla de herramientas, análisis de datos, algoritmos y HTML con Bloc de notas.
- Práctica interactiva de 20 pasos para Enter, Tab, Shift, Retroceso, Supr, flechas, Inicio, Fin, Esc, F2 y atajos Ctrl+A/C/V/X/Z/Y/F/S/P.
- Excel desde cero con modelo para copiar en el cuaderno, identificación de diez partes, práctica de celda/fila/columna/rango, tabla, bordes, operaciones y funciones SUMA, PROMEDIO, MIN y MAX.
- Tabla de herramientas completamente guiada: títulos exactos de A1 a G1, significado de cada columna, ejemplo del destornillador y formato del rango A1:G6.
- Navegación unificada: todas las actividades regresan directamente al inicio tipo muro mediante el botón “Inicio del aula”.
- Formato obligatorio para registrar fecha, tema, objetivo y “qué hicimos” en el cuaderno.
- Laboratorio HTML: editor, vista previa y descarga de `index.html`.
- Guía desde cero para crear `index.html` con Bloc de notas, sin instalar programas ni depender de Go Live.
- Teclado interactivo para proyectar: cada tecla muestra función, ejemplo y registro para el cuaderno.
- Actividades proyectables para que el alumnado trabaje en el cuaderno o en la computadora.
- Guía docente accesible mediante una dirección directa que no aparece en los menús del alumnado.
- Clase interactiva “HTML desde cero” sobre head, body, etiquetas, listas y tablas.
- Casillas de los pasos de las clases del 7 al 9 de septiembre, guardadas únicamente en el dispositivo.
- Botones del 7, 8 y 9 de septiembre conectados con su clase y con un ejemplo de bitácora diferente para cada día.
- Veinticuatro casos ficticios visibles para proyectar en la actividad “Firewall de protección”.
- Ticket de salida individual visible en la clase del 7 de septiembre, con cuatro respuestas para copiar en el cuaderno.
- Tabla completa de nueve atajos, retos de algoritmos y preguntas de repaso visibles dentro de sus clases.
- Ruta del libro Tecnología 3, páginas 22–30, distribuida del 21 de septiembre al 7 de octubre y vinculada con las prácticas de Excel.
- Selector de fecha dentro de cada módulo: muestra actividades, evidencia y bitácora específicas para cada día.

## Abrir la página localmente

Entre a `dist` y abra `index.html` en el navegador. No necesita instalar programas adicionales. Para la práctica del alumnado, la guía principal está en `dist/html-bloc-notas.html`: editar en Bloc de notas, guardar con Ctrl+S y actualizar el navegador con F5.

## Archivos que se editan

- `dist/index.html`: inicio sencillo tipo muro y acceso a la actividad actual.
- `dist/primer-periodo.html`: portada y módulos completos del periodo.
- `dist/clase.html`: plantilla automática de cada clase.
- `dist/planeacion-actualizada.js`: secuencia, clases y actividades por día de la planeación vigente.
- `dist/periodo.js` y `dist/clase.js`: creación automática de tarjetas y clases.
- `dist/laboratorio-html.html`: práctica interactiva de HTML.
- `dist/practica-teclado-atajos.html`: práctica comprobable de teclas especiales y atajos.
- `dist/excel-desde-cero.html`: ruta visual y progresiva de Excel para cuaderno y computadora.
- `dist/html-bloc-notas.html`: guía principal para crear HTML sin instalar programas.
- `dist/clases-septiembre.html`: archivo histórico de las actividades del 7, 8 y 9 de septiembre.
- `dist/descargas/Plantilla_HTML_Tecnologia3.zip`: carpeta base para repartir al alumnado.
- `dist/styles.css`: colores, tamaños y distribución.
- `dist/script.js`: pestañas, selector de turno y casillas de los pasos de las clases iniciales.
- `dist/teclado-interactivo.html`: actividad proyectable para reconocer funciones de las teclas.
- `dist/assets/`: logotipos e imágenes.
- `dist/html-desde-cero.html`: explicación interactiva, línea por línea, de la estructura HTML.
- `dist/guia-docente-miriam.html`: guía docente sin enlace desde el portal estudiantil. No debe contener datos personales porque también queda publicada.

## Cómo agregar una clase nueva

La forma más segura es copiar una de las pestañas y su bloque de clase:

1. En `dist/index.html`, busque `class-tabs`.
2. Copie un botón que tenga la clase `class-tab` y cambie la fecha, el título, `data-class` y `aria-controls`.
3. Copie un bloque completo `<article class="lesson" ...>`.
4. Cambie su `id` para que sea exactamente igual al nuevo `data-class` del botón.
5. Cambie fecha, objetivo, explicación, pasos, evidencia y materiales.
6. Guarde y actualice el navegador.

Ejemplo de coincidencia necesaria:

```html
<button class="class-tab" data-class="clase-14" aria-controls="clase-14">...</button>
<article class="lesson" id="clase-14" hidden>...</article>
```

## Publicar en GitHub Pages

Este proyecto incluye una configuración automática para publicar únicamente la carpeta `dist`.

1. Cree un repositorio nuevo en GitHub.
2. Suba **toda esta carpeta**, incluida `.github`.
3. En GitHub vaya a **Settings → Pages**.
4. En **Build and deployment**, elija **GitHub Actions**.
5. Abra la pestaña **Actions** y espere a que termine “Publicar aula en GitHub Pages”.
6. GitHub mostrará el enlace público en **Settings → Pages**.

Cada vez que cambie un archivo dentro de `dist` y lo guarde en GitHub, la página se actualizará automáticamente.

## Recomendaciones de uso escolar

- No publicar nombres, calificaciones, diagnósticos ni datos personales.
- No pedir al alumnado testimonios personales en actividades de protección.
- Mantener la misma actividad y criterios para ambos turnos; cambiar solamente indicaciones de organización cuando sea necesario.
- Probar cada enlace antes de compartirlo con los grupos.

## Trabajo local del alumnado

No se utilizarán cuentas, correos ni celulares. Cada estudiante o pareja trabaja en la carpeta local que indique la maestra, guarda con `Ctrl+S` y muestra el resultado directamente durante la clase. El portal del alumno contiene solamente las explicaciones y actividades que necesita el grupo; los guiones docentes se conservan por separado.
