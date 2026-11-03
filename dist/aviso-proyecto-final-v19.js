(() => {
  const NOTICE_ID = "aviso-evaluacion-proyecto-final-incapacidad";
  if (document.getElementById(NOTICE_ID)) return;

  const style = document.createElement("style");
  style.textContent = `
    #${NOTICE_ID}{
      max-width:1100px;
      margin:22px auto 28px;
      padding:0 16px;
      font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
      box-sizing:border-box;
    }
    #${NOTICE_ID} *{box-sizing:border-box}
    #${NOTICE_ID} .pf-card{
      background:#fff;
      border:1px solid #d8e3ee;
      border-top:6px solid #0b4a78;
      border-radius:18px;
      box-shadow:0 8px 28px rgba(15,44,68,.10);
      overflow:hidden;
    }
    #${NOTICE_ID} .pf-head{
      padding:20px 24px 16px;
      background:linear-gradient(135deg,#eef7ff,#ffffff);
    }
    #${NOTICE_ID} .pf-kicker{
      display:inline-block;
      margin-bottom:8px;
      padding:5px 10px;
      border-radius:999px;
      background:#fff0c7;
      color:#7a5100;
      font-size:.82rem;
      font-weight:800;
      letter-spacing:.02em;
    }
    #${NOTICE_ID} h2{
      margin:0;
      color:#0b3a63;
      font-size:clamp(1.35rem,2.6vw,2rem);
      line-height:1.15;
    }
    #${NOTICE_ID} .pf-sub{
      margin:10px 0 0;
      color:#40566b;
      font-size:1rem;
      line-height:1.55;
    }
    #${NOTICE_ID} .pf-body{padding:20px 24px 24px}
    #${NOTICE_ID} .pf-alert{
      margin:0 0 18px;
      padding:14px 16px;
      border-radius:12px;
      background:#fff8e6;
      border:1px solid #f0d38b;
      color:#4d3a10;
      line-height:1.5;
    }
    #${NOTICE_ID} .pf-grid{
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:12px;
      margin:18px 0;
    }
    #${NOTICE_ID} .pf-box{
      padding:15px;
      border-radius:14px;
      background:#f6f9fc;
      border:1px solid #dbe5ef;
    }
    #${NOTICE_ID} .pf-box strong{
      display:block;
      color:#0b4a78;
      font-size:1.3rem;
      margin-bottom:3px;
    }
    #${NOTICE_ID} .pf-box span{
      color:#4b6072;
      font-size:.92rem;
      line-height:1.35;
    }
    #${NOTICE_ID} h3{
      color:#0b3a63;
      margin:22px 0 10px;
      font-size:1.05rem;
    }
    #${NOTICE_ID} ul{
      margin:0;
      padding-left:22px;
      color:#283e52;
      line-height:1.55;
    }
    #${NOTICE_ID} li{margin:7px 0}
    #${NOTICE_ID} .pf-example{
      overflow-x:auto;
      margin-top:12px;
    }
    #${NOTICE_ID} table{
      width:100%;
      border-collapse:collapse;
      min-width:540px;
      font-size:.92rem;
    }
    #${NOTICE_ID} th,#${NOTICE_ID} td{
      padding:10px 12px;
      border-bottom:1px solid #dfe7ef;
      text-align:center;
    }
    #${NOTICE_ID} th{
      background:#0b4a78;
      color:#fff;
      font-weight:800;
    }
    #${NOTICE_ID} td:first-child,#${NOTICE_ID} th:first-child{text-align:left}
    #${NOTICE_ID} .pf-note{
      margin-top:18px;
      padding:13px 15px;
      border-left:4px solid #138a8a;
      background:#effafa;
      color:#234c4c;
      line-height:1.5;
    }
    #${NOTICE_ID} .pf-foot{
      margin-top:16px;
      color:#607286;
      font-size:.86rem;
      line-height:1.45;
    }
    @media(max-width:760px){
      #${NOTICE_ID}{padding:0 10px;margin-top:14px}
      #${NOTICE_ID} .pf-head,#${NOTICE_ID} .pf-body{padding:16px}
      #${NOTICE_ID} .pf-grid{grid-template-columns:1fr}
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement("section");
  section.id = NOTICE_ID;
  section.setAttribute("aria-label", "Aviso de evaluación del Proyecto Final");
  section.innerHTML = `
    <div class="pf-card">
      <div class="pf-head">
        <span class="pf-kicker">AVISO IMPORTANTE · PRIMER PERIODO</span>
        <h2>¿Cómo se evaluarán las actividades del Proyecto Final?</h2>
        <p class="pf-sub">
          Este aviso aplica a las actividades de Tecnología asignadas durante el periodo de incapacidad docente.
          Su propósito es que alumnos y familias sepan con claridad cómo serán consideradas en la calificación.
        </p>
      </div>

      <div class="pf-body">
        <div class="pf-alert">
          <strong>Las actividades del Proyecto Final se revisarán una por una.</strong>
          Cada entrega contará para formar la calificación del Proyecto Final; por ello es importante realizar
          y entregar la mayor cantidad posible, de manera completa y cuidada.
        </div>

        <div class="pf-grid">
          <div class="pf-box">
            <strong>60%</strong>
            <span>Actividades ordinarias del primer periodo.</span>
          </div>
          <div class="pf-box">
            <strong>30%</strong>
            <span>Proyecto Final: se obtiene con las actividades asignadas por incapacidad.</span>
          </div>
          <div class="pf-box">
            <strong>10%</strong>
            <span>Examen: se acreditará proporcionalmente al resultado obtenido en el Proyecto Final.</span>
          </div>
        </div>

        <h3>¿Qué significa esto?</h3>
        <ul>
          <li>Las actividades del Proyecto Final aparecen <strong>de manera individual</strong> y cada una será revisada.</li>
          <li>El avance de todas ellas se convierte automáticamente en los <strong>30 puntos del Proyecto Final</strong>.</li>
          <li>Debido al periodo de incapacidad docente, <strong>no se aplicará un examen adicional</strong>.</li>
          <li>Los <strong>10 puntos de examen</strong> se obtendrán de manera proporcional al resultado alcanzado en el Proyecto Final.</li>
          <li>Mientras mayor sea el cumplimiento y la calidad de las entregas, mayor será la aportación del Proyecto Final y del componente de examen.</li>
        </ul>

        <h3>Ejemplos sencillos</h3>
        <div class="pf-example">
          <table aria-label="Ejemplos de equivalencia del Proyecto Final y examen">
            <thead>
              <tr>
                <th>Resultado del Proyecto Final</th>
                <th>Proyecto (30%)</th>
                <th>Examen (10%)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>100% de cumplimiento</td><td>30 / 30</td><td>10 / 10</td></tr>
              <tr><td>80% de cumplimiento</td><td>24 / 30</td><td>8 / 10</td></tr>
              <tr><td>70% de cumplimiento</td><td>21 / 30</td><td>7 / 10</td></tr>
              <tr><td>50% de cumplimiento</td><td>15 / 30</td><td>5 / 10</td></tr>
            </tbody>
          </table>
        </div>

        <div class="pf-note">
          <strong>Importante para alumnos:</strong> no dejen las actividades para el final. Revisen cuáles tienen pendientes
          y avancen en orden. Cada actividad entregada correctamente suma al Proyecto Final y, al mismo tiempo,
          mejora la parte proporcional correspondiente al examen.
        </div>

        <p class="pf-foot">
          La calificación final del primer periodo se integra con: actividades ordinarias (60 puntos),
          Proyecto Final (30 puntos) y componente de examen acreditado proporcionalmente mediante el Proyecto Final (10 puntos).
        </p>
      </div>
    </div>
  `;

  const candidates = [
    document.querySelector("main"),
    document.querySelector(".feed"),
    document.querySelector(".container"),
    document.querySelector("#app"),
    document.body
  ].filter(Boolean);

  const host = candidates[0] || document.body;

  if (host === document.body) {
    const header = document.querySelector("header");
    if (header && header.nextSibling) {
      header.parentNode.insertBefore(section, header.nextSibling);
    } else {
      document.body.insertBefore(section, document.body.firstChild);
    }
  } else {
    host.insertBefore(section, host.firstChild);
  }
})();