/* Extras do site (arquivo NOVO: assets/js/site.js)
   - botão de tema claro/escuro do site
   - favoritos (capítulos e parágrafos) + aba Favorites na home
   - tocar/selecionar um parágrafo: comentar ou favoritar */
(function () {
  'use strict';
  var root = document.documentElement;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function list(k) { try { var a = JSON.parse(get(k, '[]')); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function save(k, a) { set(k, JSON.stringify(a)); }
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function clip(s, n) {
    s = String(s).trim();
    return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s;
  }
  function safeUrl(u) { return typeof u === 'string' && u.charAt(0) === '/' && u.charAt(1) !== '/' ? u : '/'; }

  var toastTimer;
  function toast(msg, ms) {
    var t = $('#siteToast');
    if (!t) { t = el('div', 'site-toast'); t.id = 'siteToast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, ms || 2500);
  }

  /* ---------- tema claro/escuro do site ---------- */
  function initTheme() {
    var btn = $('#siteThemeBtn');
    if (!btn) return;
    function paint() {
      var dark = root.dataset.siteTheme !== 'light';
      btn.textContent = dark ? '☀' : '☾';
      btn.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    }
    btn.addEventListener('click', function () {
      var next = root.dataset.siteTheme === 'light' ? 'dark' : 'light';
      root.dataset.siteTheme = next;
      set('site_theme', next);
      paint();
    });
    paint();
  }

  /* ---------- favoritos: armazenamento ---------- */
  var KC = 'fav_chapters', KQ = 'fav_quotes';
  function hasFav(k, url) { return list(k).some(function (x) { return x.url === url; }); }
  function toggleFav(k, item) {
    var a = list(k), i = -1;
    a.forEach(function (x, n) { if (x.url === item.url) i = n; });
    if (i > -1) { a.splice(i, 1); save(k, a); return false; }
    item.t = Date.now();
    a.push(item);
    save(k, a);
    return true;
  }

  /* ---------- copiar texto ---------- */
  function fallbackCopy(txt) {
    try {
      var ta = el('textarea');
      ta.value = txt;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }
  function copy(txt, done) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { done(fallbackCopy(txt)); });
    } else { done(fallbackCopy(txt)); }
  }

  /* ---------- CAPÍTULO ---------- */
  function initChapter(r) {
    var path = location.pathname, slug = r.dataset.slug || '', title = r.dataset.title || document.title;

    /* coração para favoritar o capítulo (na barra do topo) */
    var grp = $('.reader-navbar .right-group');
    if (grp) {
      var b = el('button', 'btn-heart', '♡');
      b.type = 'button';
      b.title = 'Favorite this chapter';
      grp.insertBefore(b, grp.firstChild);
      var paintHeart = function () {
        var on = hasFav(KC, path);
        b.textContent = on ? '♥' : '♡';
        b.classList.toggle('on', on);
      };
      b.addEventListener('click', function () {
        var on = toggleFav(KC, { url: path, title: title, slug: slug });
        paintHeart();
        toast(on ? 'Chapter added to Favorites ♥' : 'Removed from Favorites');
      });
      paintHeart();
    }

    /* dica acima dos comentários */
    var box = $('.comments .giscus');
    if (box) box.parentNode.insertBefore(el('p', 'comment-hint', '𖡊 Tip: tap a paragraph (or select some text) in the story and press “Comment”. The quote is copied, just paste it here.'), box);

    initParagraphs(path, slug, title);
  }

  function initParagraphs(path, slug, title) {
    var box = $('.post-content');
    if (!box) return;
    var ps = $$('p', box).filter(function (p) { return p.textContent.trim().length > 1; });
    ps.forEach(function (p, i) { if (!p.id) p.id = 'p' + (i + 1); });
    function paintFavs() { ps.forEach(function (p) { p.classList.toggle('is-fav', hasFav(KQ, path + '#' + p.id)); }); }
    paintFavs();

    var bar = el('div', 'para-bar');
    bar.setAttribute('role', 'toolbar');
    bar.innerHTML = '<span class="pb-label"></span>' +
      '<button type="button" data-pa="comment">🗨 Comment</button>' +
      '<button type="button" data-pa="fav">♡ Save</button>' +
      '<button type="button" data-pa="close" aria-label="Close">✕</button>';
    document.body.appendChild(bar);
    var label = $('.pb-label', bar), favBtn = $('[data-pa="fav"]', bar), cur = null, openY = 0;

    function paintBar() {
      var on = hasFav(KQ, path + '#' + cur.p.id);
      favBtn.textContent = on ? '♥ Saved' : '♡ Save';
      favBtn.classList.toggle('on', on);
    }
    function hide() {
      bar.classList.remove('open');
      $$('.para-active').forEach(function (x) { x.classList.remove('para-active'); });
      cur = null;
    }
    function show(p, txt) {
      $$('.para-active').forEach(function (x) { x.classList.remove('para-active'); });
      cur = { p: p, text: txt || p.textContent.replace(/\s+/g, ' ').trim(), sel: !!txt };
      p.classList.add('para-active');
      label.textContent = 'Paragraph ' + p.id.slice(1);
      openY = window.pageYOffset;
      paintBar();
      bar.classList.add('open');
    }

    /* não deixa o clique na barra apagar a seleção */
    bar.addEventListener('mousedown', function (e) { e.preventDefault(); });
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pa]');
      if (!b || !cur) return;
      var a = b.dataset.pa, id = cur.p.id;
      if (a === 'close') {
        try { window.getSelection().removeAllRanges(); } catch (x) {}
        hide();
      } else if (a === 'fav') {
        var on = toggleFav(KQ, { url: path + '#' + id, text: clip(cur.text, 500), title: title, slug: slug });
        paintFavs();
        paintBar();
        toast(on ? 'Paragraph saved to Favorites ♥' : 'Removed from Favorites');
      } else if (a === 'comment') {
        var md = '> ' + clip(cur.text, 500).replace(/\n+/g, '\n> ') +
          '\n\n[↳ Paragraph ' + id.slice(1) + '](' + location.origin + path + '#' + id + ')\n\n';
        copy(md, function (ok) {
          if (ok) toast('Quote copied! Paste it in the comment box below ⇩', 4500);
          else window.prompt('Copy this quote and paste it in the comment box:', md);
        });
        hide();
        var c = $('.comments');
        if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    /* toque/clique num parágrafo */
    document.addEventListener('click', function (e) {
      if (e.target.closest('#paraBar, .para-bar, a, button, select, input, textarea, .tooltip-container, .ed-panel, .giscus, .reader-navbar, .format-modal')) return;
      var s = window.getSelection();
      if (s && !s.isCollapsed) return;
      var p = e.target.closest('.post-content p');
      if (p && p.id) {
        if (cur && cur.p === p && !cur.sel) hide(); else show(p, '');
      } else if (cur) { hide(); }
    });

    /* texto selecionado dentro da história */
    var selTimer;
    document.addEventListener('selectionchange', function () {
      clearTimeout(selTimer);
      selTimer = setTimeout(function () {
        var s = window.getSelection();
        if (!s || s.isCollapsed || !s.rangeCount || !box.contains(s.anchorNode)) return;
        var n = s.anchorNode, p = (n.nodeType === 1 ? n : n.parentElement).closest('p');
        var txt = String(s).trim();
        if (p && p.id && txt.length > 1) show(p, txt);
      }, 350);
    });

    /* esconde a barra se a pessoa só rolou a página */
    window.addEventListener('scroll', function () {
      if (cur && !cur.sel && Math.abs(window.pageYOffset - openY) > 160) hide();
    }, { passive: true });

    /* link direto para um parágrafo (#p12) */
    function jump() {
      var m = /^#(p\d+)$/.exec(location.hash);
      var t = m && document.getElementById(m[1]);
      if (!t) return;
      t.scrollIntoView({ block: 'center' });
      t.classList.add('para-flash');
      setTimeout(function () { t.classList.remove('para-flash'); }, 3600);
    }
    if (document.readyState === 'complete') jump(); else window.addEventListener('load', jump);
  }

  /* ---------- HOME: abas + favoritos ---------- */
  function paintCount() {
    var c = $('#favCount');
    if (!c) return;
    var n = list(KC).length + list(KQ).length;
    c.textContent = n ? '(' + n + ')' : '';
  }
  function byTime(a, b) { return (b.t || 0) - (a.t || 0); }

  function renderFavs() {
    var host = $('#favPanel');
    if (!host) return;
    var names = {};
    $$('.card-historia-link[data-slug]').forEach(function (a) {
      var h = $('.titulo-historia', a);
      names[a.dataset.slug] = h ? h.textContent.trim() : '';
    });
    var ch = list(KC).sort(byTime), qs = list(KQ).sort(byTime);
    host.textContent = '';
    paintCount();

    if (!ch.length && !qs.length) {
      var em = el('div', 'fav-empty');
      em.appendChild(el('p', 'fav-empty-ico', '♡'));
      em.appendChild(el('p', '', 'Nothing saved yet.'));
      em.appendChild(el('p', '', 'Open a chapter and tap ♡ to save it. Tap a paragraph to save a quote.'));
      host.appendChild(em);
      return;
    }

    function rmBtn(k, url) {
      var b = el('button', 'fav-rm', '✕');
      b.type = 'button';
      b.setAttribute('aria-label', 'Remove');
      b.dataset.k = k;
      b.dataset.url = url;
      return b;
    }

    if (ch.length) {
      host.appendChild(el('h2', 'fav-h', 'Chapters'));
      var ul = el('ul', 'fav-list');
      ch.forEach(function (c) {
        var li = el('li', 'fav-item'), a = el('a', 'fav-link');
        a.href = safeUrl(c.url);
        a.appendChild(el('span', 'fav-title', c.title || 'Chapter'));
        a.appendChild(el('span', 'fav-meta', names[c.slug] || ''));
        li.appendChild(a);
        li.appendChild(rmBtn(KC, c.url));
        ul.appendChild(li);
      });
      host.appendChild(ul);
    }

    if (qs.length) {
      host.appendChild(el('h2', 'fav-h', 'Quotes'));
      qs.forEach(function (q) {
        var d = el('div', 'fav-quote');
        d.appendChild(el('p', 'fav-text', '“' + q.text + '”'));
        var m = el('div', 'fav-meta');
        m.appendChild(el('span', '', (names[q.slug] ? names[q.slug] + ', ' : '') + (q.title || '')));
        var a = el('a', '', 'Read in context');
        a.href = safeUrl(q.url);
        m.appendChild(a);
        d.appendChild(m);
        d.appendChild(rmBtn(KQ, q.url));
        host.appendChild(d);
      });
    }
    host.appendChild(el('p', 'fav-note', 'Favorites are saved in this browser, on this device only.'));
  }

  function initHome() {
    var tabs = $$('.home-tab');
    if (!tabs.length) return;
    var panels = { stories: $('#storiesPanel'), favorites: $('#favPanel') };
    function showTab(n) {
      tabs.forEach(function (t) { t.classList.toggle('on', t.dataset.tab === n); });
      Object.keys(panels).forEach(function (k) { if (panels[k]) panels[k].hidden = k !== n; });
      if (n === 'favorites') renderFavs();
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        showTab(t.dataset.tab);
        history.replaceState(null, '', t.dataset.tab === 'favorites' ? '#favorites' : location.pathname + location.search);
      });
    });
    window.addEventListener('hashchange', function () { showTab(location.hash === '#favorites' ? 'favorites' : 'stories'); });
    $('#favPanel').addEventListener('click', function (e) {
      var b = e.target.closest('.fav-rm');
      if (!b) return;
      save(b.dataset.k, list(b.dataset.k).filter(function (x) { return x.url !== b.dataset.url; }));
      renderFavs();
    });
    paintCount();
    showTab(location.hash === '#favorites' ? 'favorites' : 'stories');
  }

  /* ---------- início ---------- */
  initTheme();
  var r = $('#reader-root');
  if (r && r.dataset.kind === 'chapter') initChapter(r);
  initHome();
})();
