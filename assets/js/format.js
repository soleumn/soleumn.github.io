/* Botão "Format" do cabeçalho (arquivo NOVO: assets/js/format.js)
   - estilo do site: Classic ou Cyber
   - tamanho do texto (home e páginas das histórias)
   - efeitos neon do Cyber (ligar/desligar) */
(function () {
  'use strict';
  var root = document.documentElement;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var SIZES = ['sm', 'md', 'lg', 'xl'];
  var SIZE_LABEL = { sm: '94%', md: '100%', lg: '108%', xl: '116%' };
  var FONT_URL = 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Pixelify+Sans:wght@400;700&display=swap';

  var btn = $('#siteFormatBtn');   /* só existe na home e nas páginas das histórias */
  var nav = $('.site-nav');
  var panel = null;

  var savedSize = get('site_size', 'md');
  var state = {
    style: get('site_style', 'classic') === 'cyber' ? 'cyber' : 'classic',
    size: SIZES.indexOf(savedSize) > -1 ? savedSize : 'md',
    fx: get('site_fx', 'on') === 'off' ? 'off' : 'on'
  };

  function loadFonts() {
    if (!btn || state.style !== 'cyber' || document.getElementById('cyberFonts')) return;
    var l = document.createElement('link');
    l.id = 'cyberFonts';
    l.rel = 'stylesheet';
    l.href = FONT_URL;
    document.head.appendChild(l);
  }

  function paint() {
    root.dataset.siteStyle = state.style;
    root.dataset.siteSize = state.size;
    root.dataset.siteFx = state.fx;
    loadFonts();
    if (!panel) return;
    $$('[data-fmt="style"]', panel).forEach(function (b) {
      var on = b.dataset.val === state.style;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $$('[data-fmt="fx"]', panel).forEach(function (b) {
      var on = b.dataset.val === state.fx;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var v = $('#fmtSizeVal', panel);
    if (v) v.textContent = SIZE_LABEL[state.size];
  }

  function setStyle(v) { state.style = v === 'cyber' ? 'cyber' : 'classic'; set('site_style', state.style); paint(); }
  function setFx(v) { state.fx = v === 'off' ? 'off' : 'on'; set('site_fx', state.fx); paint(); }
  function step(d) {
    var i = Math.max(0, Math.min(SIZES.length - 1, SIZES.indexOf(state.size) + d));
    state.size = SIZES[i];
    set('site_size', state.size);
    paint();
  }
  function reset() {
    state = { style: 'classic', size: 'md', fx: 'on' };
    set('site_style', 'classic'); set('site_size', 'md'); set('site_fx', 'on');
    paint();
  }

  function openPanel() { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
  function closePanel(refocus) {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    if (refocus) btn.focus();
  }

  function build() {
    panel = document.createElement('div');
    panel.id = 'formatPanel';
    panel.className = 'format-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Formatting options');
    panel.innerHTML =
      '<div class="fmt-head"><span>Formatting</span><button type="button" class="fmt-close" data-fmt="close" aria-label="Close">✕</button></div>' +
      '<div class="fmt-row"><span class="fmt-label">Style</span><div class="fmt-seg">' +
        '<button type="button" data-fmt="style" data-val="classic">Classic</button>' +
        '<button type="button" data-fmt="style" data-val="cyber">Cyber</button></div></div>' +
      '<div class="fmt-row"><span class="fmt-label">Text size</span><div class="fmt-seg">' +
        '<button type="button" data-fmt="size-down" aria-label="Smaller text">A-</button>' +
        '<span class="fmt-val" id="fmtSizeVal">100%</span>' +
        '<button type="button" data-fmt="size-up" aria-label="Larger text">A+</button></div></div>' +
      '<div class="fmt-row fmt-row-fx"><span class="fmt-label">Neon effects</span><div class="fmt-seg">' +
        '<button type="button" data-fmt="fx" data-val="on">On</button>' +
        '<button type="button" data-fmt="fx" data-val="off">Off</button></div></div>' +
      '<button type="button" class="fmt-reset" data-fmt="reset">Reset to default</button>';
    nav.appendChild(panel);

    panel.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fmt]');
      if (!b) return;
      var a = b.dataset.fmt;
      if (a === 'style') setStyle(b.dataset.val);
      else if (a === 'fx') setFx(b.dataset.val);
      else if (a === 'size-down') step(-1);
      else if (a === 'size-up') step(1);
      else if (a === 'reset') reset();
      else if (a === 'close') closePanel(true);
    });
  }

  paint();
  if (!btn || !nav) return;
  build();
  paint();

  btn.addEventListener('click', function () { if (panel.hidden) openPanel(); else closePanel(false); });
  document.addEventListener('click', function (e) {
    if (panel.hidden || panel.contains(e.target) || btn.contains(e.target)) return;
    closePanel(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(true); });
})();
