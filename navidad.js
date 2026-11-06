/* DAYMAR · Detalles navideños. Se activa solo del 1 de noviembre al 6 de enero y se apaga solo.
   Para quitarlo antes: borrar la línea <script src="navidad.js"> de index.html. */
(function () {
  'use strict';
  var d = new Date(), m = d.getMonth(), dia = d.getDate();
  var temporada = m === 10 || m === 11 || (m === 0 && dia <= 6);
  if (!temporada) return;
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = '' +
    '.nv-guirnalda{position:absolute;left:0;right:0;top:100%;height:18px;pointer-events:none;z-index:2;overflow:hidden}' +
    '.nv-guirnalda svg{display:block;width:100%;height:18px}' +
    '.nv-luz{animation:nv-brilla 2.6s ease-in-out infinite}' +
    '.nv-luz:nth-child(3n+2){animation-delay:.8s}.nv-luz:nth-child(3n){animation-delay:1.6s}' +
    '@keyframes nv-brilla{0%,100%{opacity:.35}50%{opacity:1}}' +
    '.nv-chip{display:inline-flex;align-items:center;gap:8px;margin:0 0 16px;padding:7px 14px;border-radius:999px;background:rgba(201,151,63,.14);border:1px solid rgba(201,151,63,.45);color:var(--wine,#6b2d3e);font:800 11.5px/1 var(--font-ui,inherit);letter-spacing:.14em;text-transform:uppercase}' +
    '.nv-chip b{color:var(--gold,#c9973f);font-size:13px}' +
    '.nv-nieve{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:40}' +
    '.nv-pie{text-align:center;padding:16px 12px;font:600 13px var(--font-ui,inherit);letter-spacing:.06em;color:var(--gold,#c9973f)}' +
    '@media (prefers-reduced-motion:reduce){.nv-luz{animation:none;opacity:.9}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function listo(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  listo(function () {
    /* 1) Frase navideña en la cinta de arriba */
    document.querySelectorAll('.atelier-topline-copy').forEach(function (c) {
      var s = document.createElement('span'); s.textContent = '✦ Feliz Navidad · regalos con cariño'; c.appendChild(s);
    });

    /* 2) Guirnalda de luces bajo la barra */
    var hd = document.querySelector('.atelier-header');
    if (hd) {
      var W = 1200, n = 32, colores = ['#c9973f', '#e8d6ac', '#a24560', '#c9973f', '#f3ead2'], luces = '';
      for (var i = 0; i < n; i++) {
        var x = (i + .5) * (W / n), u = (x % (W / 4)) / (W / 4), y = (1 - u) * (1 - u) * 3 + 2 * (1 - u) * u * 17 + u * u * 3 + 3;
        luces += '<circle class="nv-luz" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.2" fill="' + colores[i % colores.length] + '"/>';
      }
      var g = document.createElement('div'); g.className = 'nv-guirnalda'; g.setAttribute('aria-hidden', 'true');
      g.innerHTML = '<svg viewBox="0 0 ' + W + ' 18" preserveAspectRatio="none"><path d="M0,3 ' + (function () { var s = ''; for (var k = 0; k < 4; k++) s += 'Q' + (W / 8 + k * W / 4) + ',17 ' + ((k + 1) * W / 4) + ',3 '; return s; })() + '" fill="none" stroke="rgba(120,90,50,.45)" stroke-width="1.2"/>' + luces + '</svg>';
      hd.appendChild(g);
    }

    /* 3) Etiqueta navideña sobre el título principal */
    var ey = document.querySelector('.atelier-hero-copy .eyebrow');
    if (ey && !document.querySelector('.nv-chip')) {
      var chip = document.createElement('div'); chip.className = 'nv-chip'; chip.innerHTML = '<b>✦</b> Especial Navidad <b>✦</b>';
      ey.parentNode.insertBefore(chip, ey);
    }

    /* 4) Mensaje al final */
    var ft = document.querySelector('footer');
    if (ft) { var pie = document.createElement('div'); pie.className = 'nv-pie'; pie.textContent = '✦ Felices fiestas de parte de DAYMAR ✦'; ft.appendChild(pie); }

    /* 5) Destellos dorados cayendo (suaves; se pausan con la pestaña oculta) */
    if (reducir) return;
    var cv = document.createElement('canvas'); cv.className = 'nv-nieve'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv);
    var cx = cv.getContext('2d'), w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), fl = [], corriendo = true;
    var N = (window.innerWidth < 700) ? 16 : 30, tonos = ['201,151,63', '219,184,110', '162,69,96', '232,214,172'];
    function medir() { w = window.innerWidth; h = window.innerHeight; cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    medir(); window.addEventListener('resize', medir);
    for (var j = 0; j < N; j++) fl.push({ x: Math.random() * w, y: Math.random() * h, r: 1.4 + Math.random() * 2.6, v: .35 + Math.random() * .7, o: Math.random() * 6.28, a: .25 + Math.random() * .4, c: tonos[j % tonos.length], e: Math.random() < .3 });
    function estrella(x, y, r) { cx.beginPath(); for (var k = 0; k < 4; k++) { var a = k * Math.PI / 2; cx.lineTo(x + Math.cos(a) * r * 2.2, y + Math.sin(a) * r * 2.2); cx.lineTo(x + Math.cos(a + Math.PI / 4) * r * .6, y + Math.sin(a + Math.PI / 4) * r * .6); } cx.closePath(); cx.fill(); }
    function paso(t) {
      if (!corriendo) return;
      cx.clearRect(0, 0, w, h);
      fl.forEach(function (f) {
        f.y += f.v; f.x += Math.sin(t / 1800 + f.o) * .35;
        if (f.y > h + 8) { f.y = -8; f.x = Math.random() * w; }
        cx.fillStyle = 'rgba(' + f.c + ',' + f.a + ')';
        if (f.e) estrella(f.x, f.y, f.r * .8); else { cx.beginPath(); cx.arc(f.x, f.y, f.r, 0, 6.283); cx.fill(); }
      });
      requestAnimationFrame(paso);
    }
    document.addEventListener('visibilitychange', function () { var v = !document.hidden; if (v && !corriendo) { corriendo = true; requestAnimationFrame(paso); } else if (!v) corriendo = false; });
    requestAnimationFrame(paso);
  });
})();
