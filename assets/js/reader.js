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
    ['f-lifesavers', 'Life Savers', 1], ['f-sofadi', 'Sofadi One'], ['f-vast', 'Vast Shadow'], ['notebook', 'Indie Flower'], ['wiki', 'VT323']
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

  /* ---------- EDITOR DO DONO (só aparece em aparelhos onde você colou o token) ---------- */
  var REPO = 'soleumn/soleumn.github.io';
  var TOKEN_KEY = 'gh_editor_token';
  var HINT = 'Linha em branco = novo parágrafo · *itálico* · **negrito**';
  var ed = {};
  var lastSel = '';

  function getToken() { return store.get(TOKEN_KEY, ''); }

  function toast(msg, ms) {
    var t = $('#edToast');
    if (!t) { t = document.createElement('div'); t.id = 'edToast'; t.className = 'ed-toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.timer);
    if (ms) toast.timer = setTimeout(function () { t.classList.remove('show'); }, ms);
  }

  function utf8ToB64(str) {
    var bytes = new TextEncoder().encode(str), bin = '', i;
    for (i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
    return btoa(bin);
  }
  function b64ToUtf8(b64) {
    var bin = atob(b64.replace(/\s/g, '')), bytes = new Uint8Array(bin.length), i;
    for (i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function api(method, path, body) {
    var url = 'https://api.github.com/repos/' + REPO + '/contents/' + path.split('/').map(encodeURIComponent).join('/');
    return fetch(url, {
      method: method,
      cache: 'no-store',
      headers: { 'Authorization': 'Bearer ' + getToken(), 'Accept': 'application/vnd.github+json' },
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) { var e = new Error(j.message || ('HTTP ' + r.status)); e.status = r.status; throw e; }
        return j;
      });
    });
  }

  function errMsg(e) {
    if (e.status === 401) return 'Token inválido ou expirado. Abra o capítulo com #admin no final do endereço para colocar um novo.';
    if (e.status === 403 || e.status === 404) return 'Sem permissão. O token precisa de "Contents: Read and write" neste repositório.';
    if (e.status === 409 || e.status === 422) return 'O arquivo mudou no GitHub desde que você abriu. Feche e abra o editor de novo.';
    return 'Erro: ' + (e.message || e);
  }

  function clearDraft(path) { try { localStorage.removeItem('draft_' + path); } catch (e) {} }
  function isDirty() { var ta = $('#edText'); return !!(ta && ed.path && ta.value !== ed.original); }

  function buildEditor() {
    if ($('#edPanel')) return;
    var p = document.createElement('div');
    p.id = 'edPanel';
    p.className = 'ed-panel';
    p.innerHTML =
      '<div class="ed-bar">' +
        '<button class="ed-btn" id="edClose" aria-label="Close">✕</button>' +
        '<span class="ed-tools"><button class="ed-btn" id="edBold"><b>B</b></button><button class="ed-btn" id="edItalic"><i>I</i></button></span>' +
        '<button class="ed-btn ed-save" id="edSave">Save</button>' +
      '</div>' +
      '<div class="ed-status" id="edStatus"></div>' +
      '<textarea id="edText" spellcheck="true"></textarea>';
    document.body.appendChild(p);

    var ta = $('#edText'), timer;
    ta.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { if (isDirty()) store.set('draft_' + ed.path, ta.value); }, 800);
    });
    $('#edClose').addEventListener('click', closeEditor);
    $('#edSave').addEventListener('click', saveEditor);
    $('#edBold').addEventListener('click', function () { wrapSel('**'); });
    $('#edItalic').addEventListener('click', function () { wrapSel('*'); });
  }

  function wrapSel(m) {
    var ta = $('#edText'), s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
    ta.value = v.slice(0, s) + m + v.slice(s, e) + m + v.slice(e);
    ta.setSelectionRange(s + m.length, e + m.length);
    ta.focus();
    ta.dispatchEvent(new Event('input'));
  }

  function jumpTo(ta, sel, ratio) {
    var body = ta.value, i = -1, len = 0, tries = sel ? [sel, sel.slice(0, 25), sel.slice(-25)] : [], k;
    for (k = 0; k < tries.length; k++) {
      if (tries[k].length >= 4) { i = body.indexOf(tries[k]); if (i > -1) { len = tries[k].length; break; } }
    }
    if (i > -1) {
      ta.focus();
      ta.setSelectionRange(i, i + len);
      ta.scrollTop = Math.max(0, (i / body.length) * ta.scrollHeight - ta.clientHeight / 3);
    } else {
      ta.scrollTop = ratio * (ta.scrollHeight - ta.clientHeight);
    }
  }

  function openEditor() {
    var rootEl = $('#reader-root'), path = rootEl && rootEl.dataset.path;
    if (!path) { toast('Falta o data-path no post.html', 4000); return; }
    buildEditor();
    var ta = $('#edText'), st = $('#edStatus'), sel = lastSel;
    lastSel = '';
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? window.pageYOffset / max : 0;
    ed = { path: path, title: rootEl.dataset.title || path, sha: '', head: '', original: '' };
    $('#edPanel').classList.add('open');
    document.body.style.overflow = 'hidden';
    ta.value = ''; ta.disabled = true; $('#edSave').disabled = true;
    st.textContent = 'Loading…';

    api('GET', path).then(function (f) {
      ed.sha = f.sha;
      var raw = b64ToUtf8(f.content).replace(/\r\n/g, '\n');
      var m = raw.match(/^---\n[\s\S]*?\n---\n?/);
      ed.head = m ? m[0] : '';
      var body = raw.slice(ed.head.length);
      ed.original = body;
      var draft = store.get('draft_' + path, '');
      if (draft && draft !== body && confirm('Há um rascunho não salvo deste capítulo neste aparelho. Recuperar?')) body = draft;
      ta.value = body; ta.disabled = false; $('#edSave').disabled = false;
      st.textContent = HINT;
      jumpTo(ta, sel, ratio);
    }).catch(function (e) { st.textContent = errMsg(e); });
  }

  function closeEditor(force) {
    if (force !== true && isDirty() && !confirm('Fechar sem salvar? Um rascunho fica guardado neste aparelho.')) return;
    var p = $('#edPanel');
    if (p) p.classList.remove('open');
    document.body.style.overflow = '';
    ed.path = '';
  }

  function saveEditor() {
    var ta = $('#edText'), st = $('#edStatus'), btn = $('#edSave');
    if (!isDirty()) { toast('Nenhuma alteração.', 2000); closeEditor(true); return; }
    btn.disabled = true;
    st.textContent = 'Saving…';
    api('PUT', ed.path, {
      message: 'Edit ' + ed.title + ' (via site)',
      content: utf8ToB64(ed.head + ta.value),
      sha: ed.sha
    }).then(function () {
      clearDraft(ed.path);
      ed.original = ta.value;
      closeEditor(true);
      waitForBuild();
    }).catch(function (e) { btn.disabled = false; st.textContent = errMsg(e); });
  }

  /* Depois de salvar, o GitHub leva ~1 min para republicar. Esta função fica
     checando e troca o texto na tela sozinha quando a versão nova ficar pronta. */
  function waitForBuild() {
    var box = $('.post-content');
    if (!box) return;
    var before = box.innerHTML.trim(), n = 0;
    toast('Salvo ✓ Publicando… (o texto atualiza sozinho)', 0);
    (function poll() {
      if (++n > 40) { toast('Salvo! A publicação está demorando — recarregue a página mais tarde.', 6000); return; }
      fetch(location.pathname + '?v=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html'), nb = doc.querySelector('.post-content');
          if (nb && nb.innerHTML.trim() !== before) {
            box.innerHTML = nb.innerHTML;
            loadSpecialFonts();
            toast('Atualizado ✓', 2500);
          } else setTimeout(poll, 6000);
        })
        .catch(function () { setTimeout(poll, 6000); });
    })();
  }

  var EDITOR_CSS = [
    '.ed-fab{position:fixed;right:16px;bottom:20px;z-index:1050;width:52px;height:52px;border-radius:50%;border:0;background:var(--detalhe-accent);color:var(--on-accent);font-size:1.4rem;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.45);opacity:.9}',
    '.ed-panel{position:fixed;inset:0;z-index:2000;background:var(--bg-principal);display:none;flex-direction:column}',
    '.ed-panel.open{display:flex}',
    '.ed-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;background:var(--bg-card);border-bottom:1px solid var(--borda-suave)}',
    '.ed-tools{display:flex;gap:8px}',
    '.ed-btn{background:rgba(127,127,127,.12);color:var(--texto-principal);border:1px solid var(--borda-suave);border-radius:8px;padding:8px 14px;font:inherit;font-size:1rem;cursor:pointer}',
    '.ed-save{background:var(--detalhe-accent);color:var(--on-accent);border:0;font-weight:700}',
    '.ed-save:disabled{opacity:.5}',
    '.ed-status{padding:6px 12px;font-size:.8rem;color:var(--texto-secundario);background:var(--bg-card);border-bottom:1px solid var(--borda-suave)}',
    '.ed-panel textarea{flex:1;width:100%;border:0;resize:none;outline:0;padding:14px;background:var(--bg-principal);color:var(--texto-principal);font:16px/1.7 ui-monospace,Menlo,Consolas,monospace}',
    '.ed-toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:2100;max-width:90%;background:var(--bg-card);color:var(--texto-principal);border:1px solid var(--detalhe-accent);border-radius:10px;padding:10px 16px;font-size:.9rem;box-shadow:0 8px 20px rgba(0,0,0,.5);display:none;text-align:center}',
    '.ed-toast.show{display:block}'
  ].join('');

  function initAdmin() {
    if (location.hash === '#admin') {
      var t = prompt('Cole aqui o seu token do GitHub para ativar a edição neste aparelho.\n(Deixe vazio e confirme para desativar.)');
      if (t !== null) {
        t = t.trim();
        if (t) { store.set(TOKEN_KEY, t); }
        else { try { localStorage.removeItem(TOKEN_KEY); } catch (e) {} }
      }
      history.replaceState(null, '', location.pathname + location.search);
    }
    if (!getToken()) return;

    var css = document.createElement('style');
    css.textContent = EDITOR_CSS;
    document.head.appendChild(css);

    var fab = document.createElement('button');
    fab.className = 'ed-fab';
    fab.title = 'Edit this chapter';
    fab.textContent = '✎';
    fab.addEventListener('click', openEditor);
    document.body.appendChild(fab);

    /* lembra o último texto selecionado, para o editor abrir já naquele ponto */
    document.addEventListener('selectionchange', function () {
      var s = window.getSelection(), c = $('.post-content');
      if (s && c && s.anchorNode && c.contains(s.anchorNode)) {
        var txt = String(s).trim();
        if (txt) lastSel = txt;
      }
    });
    window.addEventListener('beforeunload', function (e) { if (isDirty()) { e.preventDefault(); e.returnValue = ''; } });
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && $('#edPanel') && $('#edPanel').classList.contains('open')) { e.preventDefault(); saveEditor(); }
    });
  }

  /* ---------- início ---------- */
  apply();
  var rootEl = $('#reader-root');
  if (rootEl && rootEl.dataset.kind === 'chapter') { saveProgress(rootEl); loadSpecialFonts(); initScroll(); initKeys(); initComments(); initAdmin(); }
  if (rootEl && rootEl.dataset.kind === 'novel') { initContinueButton(rootEl); initChapterSearch(); }
  window.addEventListener('load', initSynopsis);
})();
