(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var idx = 0;
  var count = document.getElementById('count');
  var bar = document.getElementById('bar');
  var notesPanel = document.getElementById('notesPanel');
  var notesOn = false;

  function show(i) {
    idx = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, k) {
      s.classList.toggle('active', k === idx);
      s.setAttribute('aria-hidden', k === idx ? 'false' : 'true');
    });
    slides[idx].scrollTop = 0;
    count.textContent = (idx + 1) + ' / ' + slides.length;
    bar.style.width = ((idx + 1) / slides.length * 100) + '%';
    var n = slides[idx].querySelector('.notes');
    notesPanel.innerHTML = n ? '<b>Notas:</b> ' + n.innerHTML : '';
    try { history.replaceState(null, '', '#' + (idx + 1)); } catch (e) {}
  }
  function next() { show(idx + 1); }
  function prev() { show(idx - 1); }

  document.getElementById('next').addEventListener('click', next);
  document.getElementById('prev').addEventListener('click', prev);

  function toggleNotes() {
    notesOn = !notesOn;
    notesPanel.classList.toggle('show', notesOn);
  }
  function toggleFs() {
    try {
      if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); }
      else { document.exitFullscreen(); }
    } catch (e) {}
  }
  function toggleTheme() {
    var root = document.documentElement;
    var cur = root.getAttribute('data-theme');
    if (!cur) { cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
    root.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  }
  document.getElementById('notesBtn').addEventListener('click', toggleNotes);
  document.getElementById('fsBtn').addEventListener('click', toggleFs);
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); prev(); }
    else if (k === 'Home') { show(0); }
    else if (k === 'End') { show(slides.length - 1); }
    else if (k === 'f' || k === 'F') { toggleFs(); }
    else if (k === 'n' || k === 'N') { toggleNotes(); }
  });

  var sx = null, sy = null;
  document.getElementById('deck').addEventListener('touchstart', function (e) {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  document.getElementById('deck').addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { dx < 0 ? next() : prev(); }
    sx = null; sy = null;
  }, { passive: true });

  /* ---------- Ladera con casas y metrocable ---------- */
  (function buildSky() {
    var svg = document.getElementById('sky');
    var NS = 'http://www.w3.org/2000/svg';
    var seed = 11;
    function r() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var W = 1200, H = 320;
    var fills = ['var(--h1)', 'var(--h2)', 'var(--h3)'];
    function el(name, attrs, styles) {
      var e = document.createElementNS(NS, name);
      for (var a in attrs) e.setAttribute(a, attrs[a]);
      if (styles) for (var s in styles) e.style[s] = styles[s];
      return e;
    }
    function hillTop(x) { return H - 62 - (x / W) * 172; }

    var houses = el('g', {});
    var x = -10;
    while (x < W) {
      var w = 22 + r() * 20;
      var y = hillTop(x) - r() * 14;
      while (y < H) {
        var h = 20 + r() * 10;
        houses.appendChild(el('rect', { x: x, y: y, width: w - 1.5, height: h }, { fill: fills[Math.floor(r() * 3)] }));
        houses.appendChild(el('rect', { x: x, y: y, width: w - 1.5, height: 2.5 }, { fill: 'var(--roof)' }));
        if (r() < 0.5) {
          houses.appendChild(el('rect', { x: x + w * 0.25, y: y + h * 0.35, width: 4, height: 6 }, { fill: 'var(--yellow)', opacity: .9 }));
        }
        y += h;
      }
      x += w;
    }
    svg.appendChild(houses);

    var cable = el('g', {});
    cable.appendChild(el('line', { x1: 30, y1: 200, x2: 1170, y2: 20, 'stroke-width': 1.6 }, { stroke: 'var(--cable)' }));
    [200, 470, 740, 1010].forEach(function (tx) {
      var cy = 200 - (tx - 30) / 1140 * 180;
      cable.appendChild(el('line', { x1: tx, y1: cy, x2: tx, y2: hillTop(tx) + 6, 'stroke-width': 3 }, { stroke: 'var(--cable)' }));
    });
    var cab = el('g', {});
    cab.appendChild(el('line', { x1: 0, y1: 0, x2: 0, y2: 8, 'stroke-width': 1.5 }, { stroke: 'var(--cable)' }));
    cab.appendChild(el('rect', { x: -9, y: 8, width: 18, height: 13, rx: 2 }, { fill: 'var(--brick)' }));
    cab.appendChild(el('rect', { x: -6, y: 11, width: 12, height: 5 }, { fill: 'var(--yellow)' }));
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      var am = document.createElementNS(NS, 'animateMotion');
      am.setAttribute('dur', '34s');
      am.setAttribute('repeatCount', 'indefinite');
      am.setAttribute('path', 'M30,200 L1170,20');
      cab.appendChild(am);
    } else {
      cab.setAttribute('transform', 'translate(560,110)');
    }
    cable.appendChild(cab);
    svg.appendChild(cable);
  })();

  /* ---------- Onda y muestreo ---------- */
  (function buildWave() {
    var svg = document.getElementById('wave');
    var NS = 'http://www.w3.org/2000/svg';
    var base = 110, d = '';
    function f(px) {
      var t = px / 600;
      return base - 62 * Math.sin(t * 2 * Math.PI * 3) - 22 * Math.sin(t * 2 * Math.PI * 8);
    }
    for (var px = 0; px <= 600; px += 2) { d += (px === 0 ? 'M' : 'L') + px + ',' + f(px).toFixed(1) + ' '; }
    var axis = document.createElementNS(NS, 'line');
    axis.setAttribute('x1', 0); axis.setAttribute('x2', 600); axis.setAttribute('y1', base); axis.setAttribute('y2', base);
    axis.style.stroke = 'var(--line)'; axis.setAttribute('stroke-width', 1.5);
    svg.appendChild(axis);
    var path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d); path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', 3);
    path.style.stroke = 'var(--blue)';
    svg.appendChild(path);
    for (var sx2 = 12; sx2 < 600; sx2 += 24) {
      var y = f(sx2);
      var stem = document.createElementNS(NS, 'line');
      stem.setAttribute('x1', sx2); stem.setAttribute('x2', sx2); stem.setAttribute('y1', base); stem.setAttribute('y2', y);
      stem.setAttribute('stroke-width', 1.5); stem.style.stroke = 'var(--brick)';
      svg.appendChild(stem);
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', sx2); dot.setAttribute('cy', y); dot.setAttribute('r', 4.5);
      dot.style.fill = 'var(--yellow)'; dot.style.stroke = 'var(--ink)'; dot.setAttribute('stroke-width', 1.5);
      svg.appendChild(dot);
    }
  })();

  var start = parseInt((location.hash || '').replace('#', ''), 10);
  show(isNaN(start) ? 0 : start - 1);
})();
