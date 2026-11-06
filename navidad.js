/* DAYMAR · Detalles navideños. Se activa solo del 1 de noviembre al 6 de enero y se apaga solo.
   Para quitarlo antes: borrar la línea <script src="navidad.js"> de index.html. */
(function () {
  'use strict';
  var d = new Date(), m = d.getMonth(), dia = d.getDate();
  var temporada = m === 10 || m === 11 || (m === 0 && dia <= 6);
  if (!temporada) return;
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = '' +
    '.nv-guirnalda{position:absolute;left:0;right:0;top:100%;height:34px;pointer-events:none;z-index:2;overflow:hidden}' +
    '.nv-guirnalda svg{display:block;width:100%;height:34px;overflow:visible}' +
    '.nv-luz{filter:drop-shadow(0 0 4px currentColor)}' +
    '.nv-luz{animation:nv-brilla 2.6s ease-in-out infinite}' +
    '.nv-luz:nth-child(3n+2){animation-delay:.8s}.nv-luz:nth-child(3n){animation-delay:1.6s}' +
    '@keyframes nv-brilla{0%,100%{opacity:.45}50%{opacity:1}}' +
    '.nv-chip{display:none}' +
    '.nv-chip-old{display:inline-flex;align-items:center;gap:8px;margin:0 0 16px;padding:7px 14px;border-radius:999px;background:rgba(201,151,63,.14);border:1px solid rgba(201,151,63,.45);color:var(--wine,#6b2d3e);font:800 11.5px/1 var(--font-ui,inherit);letter-spacing:.14em;text-transform:uppercase}' +
    '.nv-chip b{color:var(--gold,#c9973f);font-size:13px}' +

    '.nv-banner{position:relative;overflow:hidden;margin:32px auto 6px;max-width:1180px;width:calc(100% - 28px);border-radius:20px;padding:26px 22px 24px;text-align:center;color:#f4efe5;' +
      'background:radial-gradient(ellipse 70% 120% at 50% 0%,rgba(201,151,63,.28),transparent 65%),linear-gradient(160deg,#7a3249,#4e1f31);border:1.5px solid rgba(232,214,172,.6);box-shadow:0 10px 30px rgba(78,31,49,.28)}' +
    '.nv-banner:before,.nv-banner:after{content:"";position:absolute;inset:7px;border:1px solid rgba(232,214,172,.28);border-radius:14px;pointer-events:none}' +
    '.nv-banner:after{display:none}' +
    '.nv-banner small{display:block;font:800 11.5px/1 var(--font-ui,inherit);letter-spacing:.24em;color:#e8d6ac;margin-bottom:10px;text-transform:uppercase}' +
    '.nv-banner h2{margin:0;font:italic 600 clamp(34px,8.5vw,64px)/1.02 var(--font-display,Georgia,serif);color:#fff}' +
    '.nv-banner h2 em{color:#e8c777;font-style:italic}' +
    '.nv-banner p{margin:10px auto 16px;max-width:520px;font-size:15px;line-height:1.45;color:rgba(244,239,229,.9)}' +
    '.nv-banner a{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:999px;background:#e8c777;color:#4e1f31;font:800 13px var(--font-ui,inherit);letter-spacing:.06em;text-decoration:none}' +
    '.nv-bola{position:absolute;top:0;width:2px;background:rgba(232,214,172,.55);pointer-events:none}' +
    '.nv-bola i{position:absolute;left:50%;bottom:-17px;width:30px;height:30px;margin-left:-15px;border-radius:50%;box-shadow:inset -5px -6px 10px rgba(0,0,0,.22),inset 4px 4px 8px rgba(255,255,255,.35),0 4px 10px rgba(0,0,0,.3);animation:nv-mece 3.6s ease-in-out infinite;transform-origin:50% -20px}' +
    '.nv-bola i:before{content:"";position:absolute;left:50%;top:-6px;width:10px;height:7px;margin-left:-5px;background:#e8c777;border-radius:2px}' +
    '@keyframes nv-mece{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}' +
    '@media(max-width:600px){.nv-banner{padding:24px 14px 20px}.nv-bola.b3,.nv-bola.b4{display:none}.nv-bola i{width:24px;height:24px;margin-left:-12px}}' +

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
      var W = 1200, n = 26, colores = ['#e8b84a', '#e2564f', '#f3ead2', '#3fae6a', '#e8b84a', '#d7487a'], luces = '';
      for (var i = 0; i < n; i++) {
        var x = (i + .5) * (W / n), u = (x % (W / 4)) / (W / 4), y = (1 - u) * (1 - u) * 4 + 2 * (1 - u) * u * 28 + u * u * 4 + 6;
        luces += '<circle class="nv-luz" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5" fill="' + colores[i % colores.length] + '" style="color:' + colores[i % colores.length] + '"/>';
      }
      var g = document.createElement('div'); g.className = 'nv-guirnalda'; g.setAttribute('aria-hidden', 'true');
      g.innerHTML = '<svg viewBox="0 0 ' + W + ' 34" preserveAspectRatio="none"><path d="M0,4 ' + (function () { var s = ''; for (var k = 0; k < 4; k++) s += 'Q' + (W / 8 + k * W / 4) + ',28 ' + ((k + 1) * W / 4) + ',4 '; return s; })() + '" fill="none" stroke="rgba(90,60,40,.6)" stroke-width="1.6"/>' + luces + '</svg>';
      hd.appendChild(g);
    }

    /* 3) Banner navideño grande al inicio */
    var hero = document.querySelector('section.hero');
    if (hero && !document.querySelector('.nv-banner')) {
      var bn = document.createElement('div'); bn.className = 'nv-banner'; bn.setAttribute('role', 'note'); bn.setAttribute('aria-label', 'Navidad DAYMAR');
      var bolas = [['b1', '9%', 22, '#e2564f'], ['b2', '24%', 34, '#e8c777'], ['b3', '76%', 30, '#3fae6a'], ['b4', '91%', 20, '#d7487a']];
      bn.innerHTML = bolas.map(function (b) { return '<span class="nv-bola ' + b[0] + '" style="left:' + b[1] + ';height:' + b[2] + 'px"><i style="background:radial-gradient(circle at 35% 30%,#fff8,' + b[3] + ' 55%)"></i></span>'; }).join('') +
        '<small>✦ Temporada navideña ✦</small><h2>Regala <em>Navidad</em></h2><p>Joyería, relojes y accesorios para sorprender a quien más quieres. Envíos a todo El Salvador.</p><a href="#catalogo">Ver regalos <span aria-hidden="true">→</span></a>';
      hero.insertBefore(bn, hero.firstChild);
    }

    /* 3b) (reservado) */
    var ey = null;
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
    var N = (window.innerWidth < 700) ? 26 : 48, tonos = ['214,160,60', '226,86,79', '63,174,106', '232,184,74', '215,72,122'];
    function medir() { w = window.innerWidth; h = window.innerHeight; cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    medir(); window.addEventListener('resize', medir);
    for (var j = 0; j < N; j++) fl.push({ x: Math.random() * w, y: Math.random() * h, r: 2 + Math.random() * 3.4, v: .45 + Math.random() * .9, o: Math.random() * 6.28, a: .5 + Math.random() * .4, c: tonos[j % tonos.length], e: Math.random() < .5 });
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
