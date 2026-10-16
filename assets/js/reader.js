/* Leitor de webnovel: tema, fonte, progresso, atalhos, comentários, fontes especiais */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };

  /* ---------- armazenamento seguro ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- opções do leitor ---------- */
  var FONTS = { georgia: 'Georgia', literata: 'Literata', lora: 'Lora', outfit: 'Outfit', inter: 'Inter', spectral: 'Spectral' };
  var SPACINGS = { compact: '⬍ Fair', normal: '⬍ Normal', relaxed: '⬍ Wide' };
  var THEMES = { mocha: '☕ Mocha', 'dark-pure': '🌙 Dark', sepia: '📜 Sepia', sepia2: '🪶 Sepia2', light: '☀️ Light', nordic: '❄ Nordic', emerald: '🍀 Emerald', gruvbox: '📦 Gruvbox' };
  var GISCUS_THEME = { mocha: 'catppuccin_mocha', 'dark-pure': 'dark', sepia: 'light_high_contrast', sepia2: 'gruvbox', light: 'light', nordic: 'dark_dimmed', emerald: 'dark_dimmed', gruvbox: 'gruvbox' };

  function pick(map, v, d) { return Object.prototype.hasOwnProperty.call(map, v) ? v : d; }
  function nextKey(map, cur) { var k = Object.keys(map); return k[(k.indexOf(cur) + 1) % k.length]; }

  var state = {
    size: parseFloat(store.get('reader_font_size', '1.18')) || 1.18,
    font: pick(FONTS, store.get('reader_font_family', 'literata'), 'literata'),
    spacing: pick(SPACINGS, store.get('reader_spacing', 'normal'), 'normal'),
    theme: pick(THEMES, store.get('reader_theme', 'mocha'), 'mocha')
  };

  function setText(id, t) { var el = document.getElementById(id); if (el) el.textContent = t; }

  function apply() {
    root.dataset.theme = state.theme;
    root.dataset.font = state.font;
    root.dataset.spacing = state.spacing;
    root.style.setProperty('--reader-size', state.size + 'rem');
    setText('btnFont', FONTS[state.font]);
    setText('btnSpacing', SPACINGS[state.spacing]);
    setText('btnTheme', THEMES[state.theme]);
    giscusTheme();
  }

  /* ---------- comentários (Giscus, carrega só quando chega perto) ---------- */
  function giscusTheme() {
    var f = $('iframe.giscus-frame');
    if (f) f.contentWindow.postMessage({ giscus: { setConfig: { theme: GISCUS_THEME[state.theme] } } }, 'https://giscus.app');
  }
  function loadGiscus() {
    var box = $('.giscus');
    if (!box || box.dataset.loaded) return;
    box.dataset.loaded = '1';
    var s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    var a = {
      'data-repo': 'soleumn/soleumn.github.io',
      'data-repo-id': 'R_kgDOUW772g',
      'data-category': 'Announcements',
      'data-category-id': 'DIC_kwDOUW772s4DFZrd',
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'top',
      'data-theme': GISCUS_THEME[state.theme],
      'data-lang': 'en'
    };
    Object.keys(a).forEach(function (k) { s.setAttribute(k, a[k]); });
    s.crossOrigin = 'anonymous';
    s.async = true;
    box.appendChild(s);
  }
  function initComments() {
    var box = $('.giscus');
    if (!box) return;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { io.disconnect(); loadGiscus(); }
      }, { rootMargin: '400px' });
      io.observe(box);
    } else { loadGiscus(); }
  }

  /* ---------- fontes especiais: só baixa as que o capítulo usa ---------- */
  var SPECIAL = [
    ['f-special', 'Special Elite'], ['f-syne', 'Syne Mono'], ['f-xanh', 'Xanh Mono'],
    ['f-bitcount', 'Bitcount Grid Single'], ['font-system', 'Bitcount Grid Single'],
    ['f-iceland', 'Iceland'], ['f-silkscreen', 'Silkscreen', 1], ['f-sixtyfour', 'Sixtyfour'], ['f-vt323', 'VT323'],
    ['f-crafty', 'Crafty Girls'], ['f-grape', 'Grape Nuts'], ['f-indie', 'Indie Flower'], ['font-handwriting', 'Indie Flower'],
    ['f-schoolbell', 'Schoolbell'], ['f-shadows', 'Shadows Into Light Two'], ['f-unkempt', 'Unkempt', 1],
    ['f-tangerine', 'Tangerine', 1], ['f-satisfy', 'Satisfy'], ['f-allura', 'Allura'],
    ['f-dirt', 'Rubik Dirt'], ['f-distressed', 'Rubik Distressed'], ['f-glitch', 'Rubik Glitch'],
    ['f-hatch', 'Rubik Marker Hatch'], ['f-vinyl', 'Rubik Vinyl'], ['f-paint', 'Rubik Wet Paint'],
    ['f-freckle', 'Freckle Face'], ['f-fredericka', 'Fredericka the Great'], ['f-frijole', 'Frijole'],
    ['f-workbench', 'Workbench'], ['f-bahiana', 'Bahiana'], ['f-blackwhite', 'Black And White Picture'],
    ['f-chelsea', 'Chelsea Market'], ['f-cormorant', 'Cormorant Unicase', 1], ['f-candy', 'Emilys Candy'],
    ['f-lifesavers', 'Life Savers', 1], ['f-sofadi', 'Sofadi One'], ['f-vast', 'Vast Shadow'], ['notebook', 'Indie Flower']
  ];
  function loadSpecialFonts() {
    var c = $('.post-content');
    if (!c) return;
    var html = c.innerHTML, seen = {}, params = [];
    SPECIAL.forEach(function (f) {
      if (seen[f[1]]) return;
      if (c.querySelector('.' + f[0]) || html.indexOf(f[1]) > -1) {
        seen[f[1]] = 1;
        params.push('family=' + f[1].replace(/ /g, '+') + (f[2] ? ':wght@400;700' : ''));
      }
    });
    if (!params.length) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?' + params.join('&') + '&display=swap';
    document.head.appendChild(l);
  }

  /* ---------- progresso de leitura (mesmas chaves do site antigo) ---------- */
  function saveProgress(rootEl) {
    var slug = rootEl.dataset.slug;
    if (!slug) return;
    store.set(slug + '_progresso_url', location.pathname);
    store.set(slug + '_progresso_titulo', rootEl.dataset.title || '');
  }
  function initContinueButton(rootEl) {
    var btn = $('#btn-continue'), slug = rootEl.dataset.slug;
    if (!btn || !slug) return;
    var url = store.get(slug + '_progresso_url', ''), title = store.get(slug + '_progresso_titulo', '');
    if (url) {
      btn.href = url;
      btn.textContent = title ? 'Continue Reading: ' + title : 'Continue Reading';
    }
  }

  /* ---------- barra superior: esconde ao rolar (celular) + barra de progresso ---------- */
  function initScroll() {
    var nav = $('.reader-navbar'), bar = $('.read-progress'), modal = $('#formatModal'), last = 0;
    if (!nav && !bar) return;
    window.addEventListener('scroll', function () {
      var y = Math.max(window.pageYOffset || 0, 0);
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? Math.min(y / h, 1) * 100 : 0) + '%';
      }
      if (nav) {
        if (window.innerWidth <= 768) {
          if (Math.abs(last - y) <= 10) return;
          if (y > last && y > 55) { nav.classList.add('nav-hidden'); if (modal) modal.classList.remove('active'); }
          else nav.classList.remove('nav-hidden');
        } else nav.classList.remove('nav-hidden');
        last = y;
      }
    }, { passive: true });
  }

  /* ---------- setas do teclado ---------- */
  function initKeys() {
    document.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      var t = (e.target.tagName || '').toLowerCase();
      if (t === 'input' || t === 'select' || t === 'textarea') return;
      var link = e.key === 'ArrowLeft' ? $('a[rel="prev"]') : e.key === 'ArrowRight' ? $('a[rel="next"]') : null;
      if (link) location.href = link.href;
    });
  }

  /* ---------- página da história ---------- */
  function initSynopsis() {
    var box = $('#synopsisBox'), btn = $('#btnSynopsis');
    if (!box || !btn) return;
    if (box.scrollHeight <= box.clientHeight + 4) { box.classList.add('fits'); return; }
    btn.hidden = false;
  }
  function initChapterSearch() {
    var input = $('#chapterSearch'), list = $('#lista-capitulos');
    if (!input || !list) return;
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      Array.prototype.forEach.call(list.children, function (li) {
        li.style.display = !q || li.textContent.toLowerCase().indexOf(q) > -1 ? '' : 'none';
      });
    });
  }

  /* ---------- cliques (data-action) ---------- */
  var actions = {
    'toggle-format': function () { var m = $('#formatModal'); if (m) m.classList.toggle('active'); },
    'size-down': function () { setSize(-0.1); },
    'size-up': function () { setSize(0.1); },
    'cycle-font': function () { state.font = nextKey(FONTS, state.font); store.set('reader_font_family', state.font); apply(); },
    'cycle-spacing': function () { state.spacing = nextKey(SPACINGS, state.spacing); store.set('reader_spacing', state.spacing); apply(); },
    'cycle-theme': function () { state.theme = nextKey(THEMES, state.theme); store.set('reader_theme', state.theme); apply(); },
    'toggle-synopsis': function (el) {
      var box = $('#synopsisBox'); box.classList.toggle('expanded');
      el.textContent = box.classList.contains('expanded') ? 'Read Less...' : 'Read More...';
    },
    'reverse-chapters': function () {
      var list = $('#lista-capitulos');
      Array.prototype.slice.call(list.children).reverse().forEach(function (li) { list.appendChild(li); });
    }
  };
  function setSize(d) {
    state.size = Math.round(Math.min(Math.max(state.size + d, 0.9), 1.8) * 100) / 100;
    store.set('reader_font_size', state.size);
    apply();
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (el && actions[el.dataset.action]) actions[el.dataset.action](el);
  });

  window.addEventListener('message', function (e) {
    if (e.origin === 'https://giscus.app' && e.data && typeof e.data === 'object' && e.data.giscus) giscusTheme();
  });

  /* ---------- início ---------- */
  apply();
  var rootEl = $('#reader-root');
  if (rootEl && rootEl.dataset.kind === 'chapter') { saveProgress(rootEl); loadSpecialFonts(); initScroll(); initKeys(); initComments(); }
  if (rootEl && rootEl.dataset.kind === 'novel') { initContinueButton(rootEl); initChapterSearch(); }
  window.addEventListener('load', initSynopsis);
})();
