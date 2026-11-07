/* DAYMAR · Detalle navideño minimalista. Se activa del 1 de noviembre al 6 de enero y se apaga solo.
   Para quitarlo antes: borrar la línea <script src="navidad.js"> de index.html. */
(function () {
  'use strict';
  var d = new Date(), m = d.getMonth(), dia = d.getDate();
  if (!(m === 10 || m === 11 || (m === 0 && dia <= 6))) return;
  var anio = m === 0 ? d.getFullYear() : d.getFullYear() + 1;
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = '' +
    '.nv-banner{position:relative;margin:30px auto 8px;max-width:1180px;width:calc(100% - 28px);border-radius:18px;padding:30px 20px 28px;text-align:center;background:#fbf6ee;border:1px solid rgba(201,151,63,.55);color:#3a1624}' +
    '.nv-banner:before{content:"";position:absolute;inset:6px;border:1px solid rgba(201,151,63,.25);border-radius:13px;pointer-events:none}' +
    '.nv-banner small{display:block;font:800 11.5px/1 var(--font-ui,inherit);letter-spacing:.3em;color:#b78528;text-transform:uppercase;margin-bottom:12px}' +
    '.nv-banner h2{margin:0;font:italic 600 clamp(32px,7.5vw,58px)/1.08 var(--font-display,Georgia,serif);color:#3a1624}' +
    '.nv-banner h2 em{color:#b78528;font-style:italic}' +
    '.nv-banner p{margin:12px auto 0;max-width:480px;font-size:15px;line-height:1.5;color:#6a5057}' +
    '.nv-linea{display:flex;align-items:center;justify-content:center;gap:12px;margin:14px auto 0;color:#c9973f;font-size:13px}.nv-linea:before,.nv-linea:after{content:"";width:60px;height:1px;background:linear-gradient(90deg,transparent,#c9973f)}.nv-linea:after{transform:scaleX(-1)}' +
    '.nv-canvas{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:40}' +
    '.nv-pie{text-align:center;padding:16px 12px;font:600 13px var(--font-ui,inherit);letter-spacing:.08em;color:var(--gold,#b78528)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function listo(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  listo(function () {
    document.querySelectorAll('.atelier-topline-copy').forEach(function (c) {
      var s = document.createElement('span'); s.textContent = '✦ Feliz Navidad y próspero ' + anio; c.appendChild(s);
    });

    var hero = document.querySelector('section.hero');
    if (hero && !document.querySelector('.nv-banner')) {
      var bn = document.createElement('div'); bn.className = 'nv-banner'; bn.setAttribute('role', 'note');
      bn.innerHTML = '<small>Temporada de fiestas</small><h2>Feliz Navidad<br>y próspero <em>' + anio + '</em></h2><div class="nv-linea">✦</div><p>Gracias por acompañarnos este año. Que cada detalle sea un motivo para celebrar.</p>';
      hero.insertBefore(bn, hero.firstChild);
    }

    var ft = document.querySelector('footer');
    if (ft) { var pie = document.createElement('div'); pie.className = 'nv-pie'; pie.textContent = '✦ Felices fiestas y feliz ' + anio + ' · DAYMAR ✦'; ft.appendChild(pie); }

    /* Destellos dorados, pocos y visibles */
    if (reducir) return;
    var cv = document.createElement('canvas'); cv.className = 'nv-canvas'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv);
    var cx = cv.getContext('2d'), w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), fl = [], corriendo = true, N = window.innerWidth < 700 ? 14 : 24;
    function medir() { w = window.innerWidth; h = window.innerHeight; cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    medir(); window.addEventListener('resize', medir);
    for (var j = 0; j < N; j++) fl.push({ x: Math.random() * w, y: Math.random() * h, r: 2.2 + Math.random() * 2.6, v: .3 + Math.random() * .6, o: Math.random() * 6.28 });
    function estrella(x, y, r) { cx.beginPath(); for (var k = 0; k < 4; k++) { var a = k * Math.PI / 2; cx.lineTo(x + Math.cos(a) * r * 2.2, y + Math.sin(a) * r * 2.2); cx.lineTo(x + Math.cos(a + Math.PI / 4) * r * .5, y + Math.sin(a + Math.PI / 4) * r * .5); } cx.closePath(); cx.fill(); }
    function paso(t) {
      if (!corriendo) return;
      cx.clearRect(0, 0, w, h);
      fl.forEach(function (f) {
        f.y += f.v; f.x += Math.sin(t / 2000 + f.o) * .3;
        if (f.y > h + 10) { f.y = -10; f.x = Math.random() * w; }
        cx.fillStyle = 'rgba(201,151,63,' + (.55 + .35 * Math.sin(t / 700 + f.o)).toFixed(2) + ')';
        estrella(f.x, f.y, f.r * .8);
      });
      requestAnimationFrame(paso);
    }
    document.addEventListener('visibilitychange', function () { var v = !document.hidden; if (v && !corriendo) { corriendo = true; requestAnimationFrame(paso); } else if (!v) corriendo = false; });
    requestAnimationFrame(paso);
  });
})();
