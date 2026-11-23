/* =========================================================
   EDITOR DA DONA DO SITE   (arquivo NOVO: assets/js/editor.js)

   Só funciona em aparelhos onde você colou o token do GitHub
   (abra qualquer página do site com  #admin  no final do endereço).
   Quem lê o site NÃO vê nada disso.

   O que ele faz:
   - Página de um capítulo : botão ✎ (editar este capítulo) e ＋ (novo capítulo)
   - Página de uma história: botão ＋ (novo capítulo) e ✎ (editar dados da história)
   - Página inicial        : botão ＋ (nova história)
   - Barra de PRESETS (caixas, wiki, chat, efeitos, fontes...)
   - Botões B / I, Corrigir parágrafos, Achar e substituir, contador de palavras
   - Seus próprios presets (ficam salvos neste aparelho)
   ========================================================= */
(function () {
  'use strict';

  /* ---------- CONFIGURAÇÃO (só mude se mudar o nome do repositório) ---------- */
  var REPO = 'soleumn/soleumn.github.io';
  var TOKEN_KEY = 'gh_editor_token';
  var MINE_KEY = 'ed_my_presets';
  var HINT = 'Linha em branco = novo parágrafo · *itálico* · **negrito**';

  /* =========================================================
     LISTA DE PRESETS  ← É AQUI QUE VOCÊ ADICIONA/ALTERA OS SEUS
     Cada preset é uma linha assim:
       { g:'grupo', label:'Nome do botão', block:true, tpl:'código aqui' }

     - g      : em qual aba aparece (box, wiki, chat, fx, misc)
     - label  : o nome que aparece no botão
     - tpl    : o código que será inserido. O que estiver entre @@ e @@
                é o "texto de exemplo": se você tiver selecionado um texto
                antes de clicar, o seu texto entra no lugar dele.
     - block  : true = ocupa um bloco inteiro (o editor põe linhas em branco em volta)
     - line   : true = ocupa uma linha inteira (sem linha em branco em volta)
     - fix    : 'liquid' (para o {% include %}) ou 'quote' (para citação)
     - make   : (avançado) uma função em vez de tpl
     ========================================================= */
  function attr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

  var GROUPS = [
    ['box', '📦 Caixas'], ['wiki', '📟 Wiki'], ['chat', '💬 Chat'],
    ['fx', '✨ Efeitos'], ['font', '🔤 Fontes'], ['misc', '🧰 Extras'], ['mine', '⭐ Meus']
  ];

  var PRESETS = [
    /* ---------- CAIXAS ---------- */
    { g: 'box', label: 'Janela de sistema', block: true, fix: 'liquid',
      tpl: '{% include system.html text="@@[Quest accepted!]@@" %}' },
    { g: 'box', label: 'Sistema (várias linhas)', block: true, fix: 'liquid',
      tpl: '{% include system.html text="@@[Status]<br>HP: 100/100<br>MP: 50/50@@" %}' },
    { g: 'box', label: 'Caderno / diário', block: true,
      tpl: '<div class="notebook" markdown="1">\n<p class="nb-title">Title</p>\n<p class="nb-date">Date</p>\n\n@@Write here, one paragraph per line.@@\n\n</div>' },
    { g: 'box', label: 'Caixa do jogo', block: true,
      tpl: '<div class="caixajogo" markdown="1">\n@@Text of the game box.@@\n</div>' },
    { g: 'box', label: 'Caixa de placa/aviso', block: true,
      tpl: '<div class="sign-box" markdown="1">\n@@TEXT ON THE SIGN@@\n</div>' },
    { g: 'box', label: 'Caixa de destaque', block: true,
      tpl: '<div class="highlight-box" markdown="1">\n@@Highlighted text.@@\n</div>' },
    { g: 'box', label: 'Goggles (símbolos)', block: true,
      tpl: '<div class="goggles">@@◉ ◉@@</div>' },
    { g: 'box', label: 'Rabisco (escadinha)', block: true,
      tpl: '<div class="scribble"><span>@@word@@</span><span>word</span><span>word</span></div>' },
    { g: 'box', label: 'Rabisco centralizado', block: true,
      tpl: '<div class="scribble center"><span>@@word@@</span><span>word</span><span>word</span></div>' },
    { g: 'box', label: 'Citação (> )', block: true, fix: 'quote',
      tpl: '> @@Quoted text.@@' },

    /* ---------- WIKI ---------- */
    { g: 'wiki', label: 'Página wiki completa', block: true,
      tpl: '<div class="wiki" markdown="1">\n<div class="wiki-title">Page title</div>\n<div class="wiki-author">Written by: Name</div>\n\n## Section\n\n@@Text of the wiki.@@\n\n- item one\n- item two\n\n</div>' },
    { g: 'wiki', label: 'Wiki só com texto', block: true,
      tpl: '<div class="wiki" markdown="1">\n\n@@Text of the wiki.@@\n\n</div>' },
    { g: 'wiki', label: 'Título de seção', block: true, tpl: '## @@Section@@' },
    { g: 'wiki', label: 'Aviso vermelho', line: true,
      tpl: '<div class="wiki-warning">@@WARNING: text@@</div>' },
    { g: 'wiki', label: 'Texto vermelho', tpl: '<span class="wiki-red">@@red text@@</span>' },
    { g: 'wiki', label: 'Tarja preta', tpl: '<span class="wiki-redacted">@@classified@@</span>' },

    /* ---------- CHAT ---------- */
    { g: 'chat', label: 'Chat (balões)', block: true,
      tpl: '<div class="chat-container">\n<div class="chat-group received"><span class="chat-author">Name</span><div class="chat-msg received">@@Hello!@@</div></div>\n<div class="chat-group sent"><span class="chat-author">Me</span><div class="chat-msg sent">Hi there!</div></div>\n</div>' },
    { g: 'chat', label: '+ balão recebido', line: true,
      tpl: '<div class="chat-group received"><span class="chat-author">Name</span><div class="chat-msg received">@@Message@@</div></div>' },
    { g: 'chat', label: '+ balão enviado', line: true,
      tpl: '<div class="chat-group sent"><span class="chat-author">Me</span><div class="chat-msg sent">@@Message@@</div></div>' },
    { g: 'chat', label: 'Chat (lista com —)', block: true,
      tpl: '<div class="chat-box">\n<div class="chat-msgs">@@First message@@</div>\n<div class="chat-reply">Reply</div>\n</div>' },
    { g: 'chat', label: '+ mensagem —', line: true, tpl: '<div class="chat-msgs">@@Message@@</div>' },
    { g: 'chat', label: '+ resposta ↳', line: true, tpl: '<div class="chat-reply">@@Reply@@</div>' },

    /* ---------- EFEITOS (dentro de uma frase) ---------- */
    { g: 'fx', label: 'Glitch animado',
      make: function (s) { s = s || 'TEXT'; return '<span class="glitch" data-text="' + attr(s) + '">' + s + '</span>'; } },
    { g: 'fx', label: 'Glitch parado',
      make: function (s) { s = s || 'TEXT'; return '<span class="glitch-static" data-text="' + attr(s) + '">' + s + '</span>'; } },
    { g: 'fx', label: 'Texto tremendo', tpl: '<span class="shake">@@trembling text@@</span>' },
    { g: 'fx', label: 'Arco-íris', tpl: '<span class="texto-rainbow">@@rainbow text@@</span>' },
    { g: 'fx', label: 'Sombra no texto', tpl: '<span class="texto-com-sombra">@@text@@</span>' },
    { g: 'fx', label: 'Significado (tooltip)',
      tpl: '<span class="tooltip-container">@@word@@<span class="tooltip-text">Meaning of the word</span></span>' },
    { g: 'fx', label: 'Caneta vermelha', tpl: '<span class="nb-red">@@red pen@@</span>' },
    { g: 'fx', label: 'Riscado (caderno)', tpl: '<s>@@crossed out@@</s>' },
    { g: 'fx', label: 'Marca-texto (caderno)', tpl: '<mark>@@highlighted@@</mark>' },

    /* ---------- EXTRAS ---------- */
    { g: 'misc', label: 'Quebra de cena', block: true, tpl: '* * *' },
    { g: 'misc', label: 'Texto centralizado', block: true,
      tpl: '<div style="text-align:center" markdown="1">\n@@Centered text@@\n</div>' },
    { g: 'misc', label: "Nota da autora", block: true,
      tpl: '<div class="sign-box" markdown="1">\n**Author\'s note:** @@Your note here.@@\n</div>' },
    { g: 'misc', label: 'Pensamento (itálico)', tpl: '*@@thought@@*' },
    { g: 'misc', label: 'Link', tpl: '[@@link text@@](https://)' },
    { g: 'misc', label: 'Imagem', block: true, tpl: '![@@description@@](/assets/IMAGE.jpg)' },
    { g: 'misc', label: 'Espaço em branco', block: true, tpl: '<div style="height:2rem"></div>' }
  ];

  /* Fontes especiais (as classes f-xxx já existem no webnovel.css) */
  var FONTS = [
    ['f-special', 'Special Elite (máquina de escrever)'], ['f-syne', 'Syne Mono'], ['f-xanh', 'Xanh Mono'],
    ['f-bitcount', 'Bitcount (sistema)'], ['f-iceland', 'Iceland'], ['f-silkscreen', 'Silkscreen (pixel)'],
    ['f-sixtyfour', 'Sixtyfour'], ['f-vt323', 'VT323 (terminal)'], ['f-crafty', 'Crafty Girls'],
    ['f-grape', 'Grape Nuts'], ['f-indie', 'Indie Flower (letra de mão)'], ['f-schoolbell', 'Schoolbell'],
    ['f-shadows', 'Shadows Into Light'], ['f-unkempt', 'Unkempt'], ['f-tangerine', 'Tangerine (cursiva)'],
    ['f-satisfy', 'Satisfy'], ['f-allura', 'Allura'], ['f-dirt', 'Rubik Dirt'], ['f-distressed', 'Rubik Distressed'],
    ['f-glitch', 'Rubik Glitch'], ['f-hatch', 'Rubik Marker Hatch'], ['f-vinyl', 'Rubik Vinyl'],
    ['f-paint', 'Rubik Wet Paint'], ['f-freckle', 'Freckle Face'], ['f-fredericka', 'Fredericka the Great'],
    ['f-frijole', 'Frijole'], ['f-workbench', 'Workbench'], ['f-bahiana', 'Bahiana'],
    ['f-blackwhite', 'Black And White Picture'], ['f-chelsea', 'Chelsea Market'], ['f-cormorant', 'Cormorant Unicase'],
    ['f-candy', 'Emilys Candy'], ['f-lifesavers', 'Life Savers'], ['f-sofadi', 'Sofadi One'],
    ['f-vast', 'Vast Shadow'], ['f-jersey', 'Jersey 10'], ['f-architects', 'Architects Daughter']
  ];

  var FIXES = {
    liquid: function (s) { return s.replace(/"/g, '&quot;').replace(/\s*\n+\s*/g, '<br>'); },
    quote: function (s) { return s.replace(/\n/g, '\n> '); }
  };

  /* ---------- utilidades ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  function slugify(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  /* ---------- token (mesmo lugar onde o editor antigo guardava) ---------- */
  if (location.hash === '#admin') {
    var tk = prompt('Cole aqui o seu token do GitHub para ativar a edição neste aparelho.\n(Deixe vazio e confirme para desativar.)');
    if (tk !== null) {
      tk = tk.trim();
      if (tk) store.set(TOKEN_KEY, tk); else store.del(TOKEN_KEY);
    }
    history.replaceState(null, '', location.pathname + location.search);
  }
  function getToken() { return store.get(TOKEN_KEY, ''); }
  if (!getToken()) return;           /* sem token = visitante: não faz nada */

  /* ---------- GitHub ---------- */
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
  function readB64(file) {
    return new Promise(function (ok, fail) {
      var r = new FileReader();
      r.onload = function () { ok(String(r.result).split(',')[1]); };
      r.onerror = function () { fail(new Error('Não consegui ler a imagem.')); };
      r.readAsDataURL(file);
    });
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
  function errMsg(e, creating) {
    if (e.custom) return e.message;
    if (e.status === 401) return 'Token inválido ou expirado. Abra a página com #admin no final do endereço para colocar um novo.';
    if (e.status === 403 || e.status === 404) return 'Sem permissão. O token precisa de "Contents: Read and write" neste repositório.';
    if (e.status === 409) return 'O arquivo mudou no GitHub desde que você abriu. Feche e abra o editor de novo.';
    if (e.status === 422) return creating ? 'Já existe um arquivo com esse nome. Mude o número (ou o título).' : 'O arquivo mudou no GitHub desde que você abriu. Feche e abra o editor de novo.';
    return 'Erro: ' + (e.message || e);
  }

  /* ---------- avisos e espera pela publicação ---------- */
  function toast(msg, ms) {
    var t = $('#edToast');
    if (!t) {
      t = el('div', 'ed-toast');
      t.id = 'edToast';
      t.addEventListener('click', function () { t.classList.remove('show'); });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.timer);
    if (ms) toast.timer = setTimeout(function () { t.classList.remove('show'); }, ms);
  }
  /* Repete a verificação a cada 5s (até 5 min) até ela devolver "true" */
  function pollUntil(check, done) {
    var n = 0;
    (function tick() {
      if (++n > 60) { toast('Salvo! A publicação está demorando. Recarregue a página mais tarde.', 8000); return; }
      check().then(function (ok) { if (ok) done(); else setTimeout(tick, 5000); })
        .catch(function () { setTimeout(tick, 5000); });
    })();
  }
  /* Baixa a página como ela está publicada agora e devolve só o miolo (#reader-root) */
  function fetchPart(url) {
    return fetch(url + (url.indexOf('?') > -1 ? '&' : '?') + 'v=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (h) {
        var d = new DOMParser().parseFromString(h, 'text/html'), n = d.querySelector('#reader-root');
        return n ? n.innerHTML.trim() : null;
      });
  }
  function waitForChange(url, base) {
    if (base === null) { toast('Salvo ✓ O site atualiza em ~1 minuto. Recarregue a página depois.', 9000); return; }
    toast('Salvo ✓ Publicando… (a página recarrega sozinha)', 0);
    pollUntil(function () {
      return fetchPart(url).then(function (h) { return h !== null && h !== base; });
    }, function () {
      toast('Atualizado ✓', 1500);
      setTimeout(function () { location.reload(); }, 400);
    });
  }

  /* =========================================================
     ESTADO E PAINEL
     ========================================================= */
  var ed = {};            /* o que está aberto agora */
  var lastSel = '';       /* último texto selecionado na história (para o editor abrir no ponto certo) */
  var curGroup = 'box';

  function setStatus(t) { var s = $('#edStatus'); if (s) s.textContent = t; }

  function updateCount() {
    var ta = $('#edText'), c = $('#edCount');
    if (!ta || !c) return;
    var t = ta.value.replace(/\{%[\s\S]*?%\}/g, ' ').replace(/<[^>]+>/g, ' ');
    var w = (t.match(/\S+/g) || []).length;
    c.textContent = w.toLocaleString('en-US') + ' words · ~' + Math.max(1, Math.round(w / 230)) + ' min';
  }

  function normalizeHead(h) {
    h = h.replace(/\r\n/g, '\n').replace(/\s+$/, '');
    if (!/^---\n[\s\S]*\n---$/.test(h)) return null;
    return h + '\n';
  }
  function isDirty() {
    var ta = $('#edText'), p = $('#edPanel');
    if (!ta || !p || !p.classList.contains('open') || ta.disabled) return false;
    if (ed.mode === 'edit' && $('#edHead').value.replace(/\r\n/g, '\n') !== ed.head) return true;
    return ta.value !== ed.original;
  }

  /* Escreve no textarea de um jeito que o "desfazer" (Ctrl+Z) continua funcionando */
  function putText(ta, text, from, to) {
    ta.focus();
    ta.setSelectionRange(from, to);
    var ok = false;
    try { ok = document.execCommand('insertText', false, text); } catch (x) {}
    if (!ok) { ta.setRangeText(text, from, to, 'end'); ta.dispatchEvent(new Event('input')); }
  }

  function buildPanel() {
    if ($('#edPanel')) return;
    var p = el('div', 'ed-panel');
    p.id = 'edPanel';
    p.innerHTML =
      '<div class="ed-bar">' +
        '<button type="button" class="ed-btn" id="edClose" aria-label="Fechar">✕</button>' +
        '<span class="ed-title" id="edTitle"></span>' +
        '<button type="button" class="ed-btn ed-save" id="edSave">Save</button>' +
      '</div>' +
      '<div class="ed-meta" id="edMeta" hidden></div>' +
      '<div class="ed-tools">' +
        '<button type="button" class="ed-btn" id="edBold" title="Negrito"><b>B</b></button>' +
        '<button type="button" class="ed-btn" id="edItalic" title="Itálico"><i>I</i></button>' +
        '<button type="button" class="ed-btn" id="edPre">✦ Presets</button>' +
        '<button type="button" class="ed-btn" id="edFix" title="Arruma os parágrafos (selecione um trecho, ou vale para o texto todo)">¶ Arrumar</button>' +
        '<button type="button" class="ed-btn" id="edFindBtn" title="Achar e substituir">🔍</button>' +
        '<button type="button" class="ed-btn" id="edHeadBtn" title="Cabeçalho do capítulo (título, subtítulo...)" hidden>⚙</button>' +
      '</div>' +
      '<div class="ed-drawer" id="edDrawer" hidden></div>' +
      '<div class="ed-find" id="edFindBar" hidden>' +
        '<input type="text" id="edFindIn" placeholder="Achar">' +
        '<input type="text" id="edReplIn" placeholder="Trocar por">' +
        '<button type="button" class="ed-btn" id="edNext">Próximo</button>' +
        '<button type="button" class="ed-btn" id="edAll">Trocar tudo</button>' +
      '</div>' +
      '<div class="ed-headwrap" id="edHeadWrap" hidden>' +
        '<textarea id="edHead" spellcheck="false" rows="6"></textarea>' +
      '</div>' +
      '<div class="ed-status"><span id="edStatus"></span><span id="edCount"></span></div>' +
      '<textarea id="edText" spellcheck="true"></textarea>';
    document.body.appendChild(p);

    var ta = $('#edText'), timer;
    ta.addEventListener('input', function () {
      updateCount();
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (!ed.draftKey) return;
        if (ta.value === ed.original) store.del(ed.draftKey); else store.set(ed.draftKey, ta.value);
      }, 800);
    });

    /* clicar nos botões não tira a seleção do texto */
    p.addEventListener('mousedown', function (e) { if (e.target.closest('button')) e.preventDefault(); });
    /* não deixa as setas ← → do teclado trocarem de capítulo enquanto você edita; Ctrl+S salva */
    p.addEventListener('keydown', function (e) {
      e.stopPropagation();
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); doSave(); }
    });

    $('#edClose').addEventListener('click', function () { closePanel(); });
    $('#edSave').addEventListener('click', doSave);
    $('#edBold').addEventListener('click', function () { wrapSel('**'); });
    $('#edItalic').addEventListener('click', function () { wrapSel('*'); });
    $('#edFix').addEventListener('click', fixParagraphs);
    $('#edPre').addEventListener('click', function () {
      var d = $('#edDrawer');
      d.hidden = !d.hidden;
      $('#edPre').classList.toggle('ed-on', !d.hidden);
      if (!d.hidden) { $('#edFindBar').hidden = true; renderDrawer(); }
    });
    $('#edFindBtn').addEventListener('click', function () {
      var f = $('#edFindBar');
      f.hidden = !f.hidden;
      if (!f.hidden) { $('#edDrawer').hidden = true; $('#edPre').classList.remove('ed-on'); $('#edFindIn').focus(); }
    });
    $('#edHeadBtn').addEventListener('click', function () { var h = $('#edHeadWrap'); h.hidden = !h.hidden; });
    $('#edNext').addEventListener('click', findNext);
    $('#edAll').addEventListener('click', replaceAll);
  }

  /* Prepara o painel para um tipo de edição. mode: edit | raw | newchapter | newstory */
  function setup(mode, cfg) {
    buildPanel();
    ed = { mode: mode, path: cfg.path || '', draftKey: cfg.draftKey || '', original: '', head: '', sha: '' };
    $('#edTitle').textContent = cfg.title;
    var meta = $('#edMeta');
    meta.innerHTML = cfg.metaHtml || '';
    meta.hidden = !cfg.metaHtml;
    $('#edHeadBtn').hidden = mode !== 'edit';
    $('#edHeadWrap').hidden = true;
    $('#edPre').hidden = mode === 'raw';
    $('#edDrawer').hidden = true;
    $('#edPre').classList.remove('ed-on');
    $('#edFindBar').hidden = true;
    var ta = $('#edText');
    ta.value = ''; ta.disabled = false;
    $('#edSave').disabled = false;
    $('#edPanel').classList.add('open');
    document.body.style.overflow = 'hidden';
    setStatus(HINT);
    updateCount();
    return ta;
  }

  function closePanel(force) {
    if (force !== true && isDirty() && !confirm('Fechar sem salvar? Um rascunho fica guardado neste aparelho.')) return;
    var p = $('#edPanel');
    if (p) p.classList.remove('open');
    document.body.style.overflow = '';
    ed.mode = ''; ed.path = '';
  }

  function doSave() {
    if (ed.mode === 'edit' || ed.mode === 'raw') saveEdit();
    else if (ed.mode === 'newchapter') saveNewChapter();
    else if (ed.mode === 'newstory') saveNewStory();
  }

  /* =========================================================
     FERRAMENTAS DE TEXTO
     ========================================================= */
  function wrapSel(m) {
    var ta = $('#edText'), s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e) || 'text';
    putText(ta, m + sel + m, s, e);
    ta.setSelectionRange(s + m.length, s + m.length + sel.length);
  }

  /* Cola texto do Word/Docs: cada linha vira um parágrafo (linha em branco entre eles) */
  function fixParagraphs() {
    var ta = $('#edText'), s = ta.selectionStart, e = ta.selectionEnd;
    var from = s === e ? 0 : s, to = s === e ? ta.value.length : e;
    var out = ta.value.slice(from, to).replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n+/g, '\n\n');
    putText(ta, out, from, to);
    updateCount();
    setStatus('Parágrafos arrumados ✓ (se algo ficou estranho, use Ctrl+Z / desfazer)');
  }

  function findNext() {
    var ta = $('#edText'), q = $('#edFindIn').value;
    if (!q) return;
    var i = ta.value.indexOf(q, ta.selectionEnd);
    if (i < 0) i = ta.value.indexOf(q);
    if (i < 0) { setStatus('Não achei: ' + q); return; }
    ta.focus();
    ta.setSelectionRange(i, i + q.length);
    ta.scrollTop = Math.max(0, (i / ta.value.length) * ta.scrollHeight - ta.clientHeight / 3);
  }
  function replaceAll() {
    var ta = $('#edText'), q = $('#edFindIn').value, r = $('#edReplIn').value;
    if (!q) return;
    var parts = ta.value.split(q), n = parts.length - 1;
    if (!n) { setStatus('Não achei: ' + q); return; }
    putText(ta, parts.join(r), 0, ta.value.length);
    updateCount();
    setStatus(n + (n > 1 ? ' trocas feitas ✓' : ' troca feita ✓'));
  }

  /* ---------- aplica um preset no ponto onde está o cursor ---------- */
  function applyPreset(p) {
    var ta = $('#edText');
    if (!ta || ta.disabled) return;
    var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value, sel = v.slice(s, e);
    var out, a, b;
    if (p.block || p.line) sel = sel.replace(/^\s+|\s+$/g, '');

    if (p.make) {
      out = p.make(sel); a = b = out.length;
    } else {
      var i = p.tpl.indexOf('@@'), j = i > -1 ? p.tpl.indexOf('@@', i + 2) : -1;
      if (j > -1) {
        var inner = sel ? (p.fix ? FIXES[p.fix](sel) : sel) : p.tpl.slice(i + 2, j);
        out = p.tpl.slice(0, i) + inner + p.tpl.slice(j + 2);
        a = i; b = i + inner.length;
      } else { out = p.tpl; a = b = out.length; }
    }

    var before = v.slice(0, s), after = v.slice(e), pre = '', post = '';
    if (p.block) {
      pre = !before ? '' : /\n\n$/.test(before) ? '' : /\n$/.test(before) ? '\n' : '\n\n';
      post = !after ? '\n' : /^\n\n/.test(after) ? '' : /^\n/.test(after) ? '\n' : '\n\n';
    } else if (p.line) {
      pre = (!before || /\n$/.test(before)) ? '' : '\n';
      post = /^\n/.test(after) ? '' : '\n';
    }
    putText(ta, pre + out + post, s, e);
    ta.setSelectionRange(s + pre.length + a, s + pre.length + b);
    updateCount();
  }

  function applyFont(cls) {
    var ta = $('#edText'), sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    if (/\n/.test(sel)) applyPreset({ block: true, tpl: '<div class="' + cls + '" markdown="1">\n@@x@@\n</div>' });
    else applyPreset({ tpl: '<span class="' + cls + '">@@Your text@@</span>' });
  }

  /* ---------- presets salvos por você (ficam neste aparelho) ---------- */
  function mine() { try { var a = JSON.parse(store.get(MINE_KEY, '[]')); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function saveMine(a) { store.set(MINE_KEY, JSON.stringify(a)); }

  function renderDrawer() {
    var d = $('#edDrawer');
    d.textContent = '';
    var tabs = el('div', 'ed-tabs');
    GROUPS.forEach(function (g) {
      var b = el('button', 'ed-tab' + (g[0] === curGroup ? ' on' : ''), g[1]);
      b.type = 'button';
      b.addEventListener('click', function () { curGroup = g[0]; renderDrawer(); });
      tabs.appendChild(b);
    });
    d.appendChild(tabs);

    var body = el('div', 'ed-pbody');
    if (curGroup === 'font') {
      body.appendChild(el('p', 'ed-note', 'Selecione um trecho do texto e escolha a fonte (sem selecionar, entra um texto de exemplo).'));
      var sel = el('select', 'ed-select');
      FONTS.forEach(function (f) { var o = el('option', '', f[1]); o.value = f[0]; sel.appendChild(o); });
      body.appendChild(sel);
      var go = el('button', 'ed-chip ed-chip-main', 'Aplicar fonte');
      go.type = 'button';
      go.addEventListener('click', function () { applyFont(sel.value); closeDrawer(); });
      body.appendChild(go);
    } else if (curGroup === 'mine') {
      body.appendChild(el('p', 'ed-note', 'Selecione no texto um código/trecho que você gosta e salve aqui. Ele vira um botão seu (fica só neste aparelho).'));
      var add = el('button', 'ed-chip ed-chip-main', '＋ Salvar a seleção como preset');
      add.type = 'button';
      add.addEventListener('click', function () {
        var ta = $('#edText'), t = ta.value.slice(ta.selectionStart, ta.selectionEnd);
        if (!t.trim()) { setStatus('Primeiro selecione o texto/código que quer salvar.'); return; }
        var name = prompt('Nome do botão:');
        if (!name) return;
        var a = mine();
        a.push({ label: name.trim().slice(0, 30), text: t, block: /\n/.test(t) });
        saveMine(a);
        renderDrawer();
      });
      body.appendChild(add);
      mine().forEach(function (m, idx) {
        var row = el('span', 'ed-mine');
        var b = el('button', 'ed-chip', m.label);
        b.type = 'button';
        b.addEventListener('click', function () { applyPreset({ tpl: m.text, block: m.block }); closeDrawer(); });
        var x = el('button', 'ed-chip ed-x', '✕');
        x.type = 'button';
        x.title = 'Apagar este preset';
        x.addEventListener('click', function () {
          if (!confirm('Apagar o preset "' + m.label + '"?')) return;
          var a = mine(); a.splice(idx, 1); saveMine(a); renderDrawer();
        });
        row.appendChild(b); row.appendChild(x);
        body.appendChild(row);
      });
    } else {
      PRESETS.filter(function (p) { return p.g === curGroup; }).forEach(function (p) {
        var b = el('button', 'ed-chip', p.label);
        b.type = 'button';
        b.addEventListener('click', function () { applyPreset(p); closeDrawer(); });
        body.appendChild(b);
      });
    }
    d.appendChild(body);
  }
  function closeDrawer() {
    $('#edDrawer').hidden = true;
    $('#edPre').classList.remove('ed-on');
    $('#edText').focus();
  }

  /* =========================================================
     EDITAR O QUE JÁ EXISTE (capítulo ou dados da história)
     ========================================================= */
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

  function loadExisting(ta, splitHead, sel, ratio) {
    ta.disabled = true; $('#edSave').disabled = true;
    setStatus('Carregando…');
    api('GET', ed.path).then(function (f) {
      ed.sha = f.sha;
      var raw = b64ToUtf8(f.content).replace(/\r\n/g, '\n');
      var m = splitHead ? raw.match(/^---\n[\s\S]*?\n---\n?/) : null;
      ed.head = m ? m[0] : '';
      var body = raw.slice(ed.head.length);
      ed.original = body;
      $('#edHead').value = ed.head;
      var draft = store.get(ed.draftKey, '');
      if (draft && draft !== body && confirm('Há um rascunho não salvo neste aparelho. Recuperar?')) body = draft;
      ta.value = body; ta.disabled = false; $('#edSave').disabled = false;
      setStatus(HINT);
      updateCount();
      jumpTo(ta, sel, ratio);
    }).catch(function (e) { setStatus(errMsg(e)); });
  }

  function openChapterEditor() {
    var r = $('#reader-root'), path = r && r.dataset.path;
    if (!path) { toast('Falta o data-path no post.html', 4000); return; }
    var sel = lastSel; lastSel = '';
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? window.pageYOffset / max : 0;
    var ta = setup('edit', { title: '✎ ' + (r.dataset.title || path), path: path, draftKey: 'draft_' + path });
    loadExisting(ta, true, sel, ratio);
  }

  function openEditStory() {
    var r = $('#reader-root');
    var path = r.dataset.path || ('_novels/' + r.dataset.slug + '.md');
    var ta = setup('raw', { title: '✎ Dados da história (cuidado com a parte entre ---)', path: path, draftKey: 'draft_' + path });
    loadExisting(ta, false, '', 0);
  }

  function saveEdit() {
    var ta = $('#edText'), btn = $('#edSave'), head = ed.head;
    if (ed.mode === 'edit') {
      head = normalizeHead($('#edHead').value);
      if (head === null) {
        $('#edHeadWrap').hidden = false;
        setStatus('O cabeçalho precisa começar com --- e terminar com --- (cada um numa linha).');
        return;
      }
    }
    if (!isDirty()) { toast('Nenhuma alteração.', 2000); closePanel(true); return; }
    var path = ed.path, sha = ed.sha, key = ed.draftKey, content = head + ta.value;
    var r = $('#reader-root'), name = (r && r.dataset.title) || path;
    var url = location.pathname;
    btn.disabled = true;
    setStatus('Salvando…');
    fetchPart(url).catch(function () { return null; }).then(function (base) {
      return api('PUT', path, { message: 'Edit ' + name + ' (via site)', content: utf8ToB64(content), sha: sha })
        .then(function () { return base; });
    }).then(function (base) {
      store.del(key);
      closePanel(true);
      waitForChange(url, base);
    }).catch(function (e) { btn.disabled = false; setStatus(errMsg(e)); });
  }

  /* =========================================================
     NOVO CAPÍTULO
     ========================================================= */
  function fileName(num) {
    return ed.info.tplName.replace(/(\d+)(?=\.md$)/i, function (d) {
      var s = String(num);
      while (s.length < d.length) s = '0' + s;
      return s;
    });
  }
  function updateFileLabel() {
    var n = parseInt($('#mfNum').value, 10);
    $('#mfFile').textContent = isNaN(n) ? '' : 'Arquivo que será criado: _chapters/' + ed.slug + '/' + fileName(n);
  }

  /* Descobre o próximo número olhando a pasta da história e o último capítulo */
  function chapterInfo(slug) {
    return api('GET', '_chapters/' + slug).catch(function (e) { if (e.status === 404) return []; throw e; }).then(function (list) {
      var files = (Array.isArray(list) ? list : []).filter(function (f) { return f.type === 'file' && /\.md$/i.test(f.name); });
      var best = null, max = 0;
      files.forEach(function (f) {
        var m = f.name.match(/(\d+)(?=\.md$)/i);
        if (!m) return;
        var n = parseInt(m[1], 10);
        if (!best || n >= max) { max = n; best = f; }
      });
      if (!best) {
        var first = files.length + 1;
        return { num: first, tplName: 'ch1.md', title: 'Chapter ' + first };
      }
      var info = { num: max + 1, tplName: best.name, title: 'Chapter ' + (max + 1) };
      return api('GET', best.path).then(function (f) {
        var raw = b64ToUtf8(f.content);
        var c = raw.match(/^capitulo:\s*["']?(\d+)/m);
        if (c) info.num = parseInt(c[1], 10) + 1;
        var t = raw.match(/^title:\s*(.+)$/m);
        if (t) {
          var tt = t[1].trim().replace(/^["']|["']$/g, '');
          info.title = /\d+/.test(tt) ? tt.replace(/\d+/, info.num) : 'Chapter ' + info.num;
        } else { info.title = 'Chapter ' + info.num; }
        return info;
      }).catch(function () { return info; });
    });
  }

  function openNewChapter() {
    var r = $('#reader-root'), slug = r && r.dataset.slug;
    if (!slug) { toast('Não achei o slug da história.', 4000); return; }
    var meta =
      '<label>Nº do capítulo<input id="mfNum" type="number" min="0" step="1"></label>' +
      '<label>Título<input id="mfTitle" type="text" placeholder="Chapter 5"></label>' +
      '<label class="full">Subtítulo (opcional)<input id="mfSub" type="text"></label>' +
      '<div class="ed-hint" id="mfFile"></div>';
    var ta = setup('newchapter', { title: '＋ Novo capítulo', draftKey: 'draft_new_' + slug, metaHtml: meta });
    ed.slug = slug;
    ed.dir = '_chapters/' + slug;
    ta.disabled = true; $('#edSave').disabled = true;
    setStatus('Vendo qual é o próximo número…');
    chapterInfo(slug).then(function (info) {
      ed.info = info;
      $('#mfNum').value = info.num;
      $('#mfTitle').value = info.title;
      $('#mfNum').addEventListener('input', updateFileLabel);
      updateFileLabel();
      var d = store.get(ed.draftKey, '');
      if (d) { ta.value = d; setStatus('Rascunho recuperado ✓'); } else { setStatus('Cole ou escreva o capítulo na caixa grande abaixo.'); }
      ta.disabled = false; $('#edSave').disabled = false;
      updateCount();
      $('#mfTitle').focus();
    }).catch(function (e) { setStatus(errMsg(e)); });
  }

  function saveNewChapter() {
    var ta = $('#edText'), btn = $('#edSave');
    var num = parseInt($('#mfNum').value, 10), title = $('#mfTitle').value.trim(), sub = $('#mfSub').value.trim();
    var body = ta.value.replace(/\r\n/g, '\n').trim();
    if (isNaN(num) || num < 0) { setStatus('Escreva o número do capítulo.'); return; }
    if (!title) { setStatus('Escreva o título do capítulo.'); $('#mfTitle').focus(); return; }
    if (!body) { setStatus('O capítulo está vazio.'); return; }
    var name = fileName(num), slug = ed.slug, path = ed.dir + '/' + name, key = ed.draftKey;
    var fm = '---\n' +
      'title: ' + JSON.stringify(title) + '\n' +
      (sub ? 'subtitle: ' + JSON.stringify(sub) + '\n' : '') +
      'capitulo: ' + num + '\n' +
      '---\n\n';
    btn.disabled = true;
    setStatus('Salvando…');
    api('PUT', path, { message: 'Add ' + title + ' (via site)', content: utf8ToB64(fm + body + '\n') }).then(function () {
      store.del(key);
      var url = '/' + slug + '/' + name.replace(/\.md$/i, '') + '/';
      closePanel(true);
      toast('Capítulo salvo ✓ Publicando… você será levada até ele sozinha.', 0);
      pollUntil(function () {
        return fetch(url + '?v=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok; });
      }, function () { location.href = url; });
    }).catch(function (e) { btn.disabled = false; setStatus(errMsg(e, true)); });
  }

  /* =========================================================
     NOVA HISTÓRIA (na página inicial)
     ========================================================= */
  function openNewStory() {
    var count = $$('.card-historia-link[data-slug]').length;
    var meta =
      '<label class="full">Título da história<input id="mfTitle" type="text"></label>' +
      '<label class="full">Frase curta (aparece no card)<input id="mfTag" type="text"></label>' +
      '<label>Autora<input id="mfAuthor" type="text"></label>' +
      '<label>Status<select id="mfStatus"><option>Ongoing</option><option>Completed</option><option>Hiatus</option></select></label>' +
      '<label class="full">Tags (separe por vírgula)<input id="mfTags" type="text" placeholder="Fantasy, Romance"></label>' +
      '<label>Cor de destaque<input id="mfAccent" type="color" value="#72583e"></label>' +
      '<label>Posição na home<input id="mfOrder" type="number" min="1" step="1"></label>' +
      '<label class="full">Capa (ideal: 600×900 px, jpg/png)<input id="mfCover" type="file" accept="image/*"></label>';
    setup('newstory', { title: '＋ Nova história', metaHtml: meta });
    $('#mfOrder').value = count + 1;
    $('#mfAuthor').value = store.get('ed_author', '');
    setStatus('Escreva o resumo (Summary) da história na caixa grande abaixo.');
    $('#mfTitle').focus();
  }

  function saveNewStory() {
    var btn = $('#edSave');
    var title = $('#mfTitle').value.trim(), slug = slugify(title);
    if (!slug) { setStatus('Escreva o título da história.'); $('#mfTitle').focus(); return; }
    var tag = $('#mfTag').value.trim(), author = $('#mfAuthor').value.trim(), status = $('#mfStatus').value;
    var tags = $('#mfTags').value.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    var accent = $('#mfAccent').value, order = parseInt($('#mfOrder').value, 10) || 1;
    var summary = $('#edText').value.replace(/\r\n/g, '\n').trim();
    var file = $('#mfCover').files[0], path = '_novels/' + slug + '.md';
    store.set('ed_author', author);
    btn.disabled = true;
    setStatus('Salvando…');

    api('GET', path).then(function () {
      var x = new Error('Já existe uma história com o endereço "' + slug + '". Mude o título.');
      x.custom = true;
      throw x;
    }, function (e) { if (e.status !== 404) throw e; })
      .then(function () {
        if (!file) return '';
        return readB64(file).then(function (b64) {
          var ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
          var ip = 'assets/' + slug + '/cover.' + ext;
          return api('PUT', ip, { message: 'Add cover for ' + title + ' (via site)', content: b64 }).then(function () { return '/' + ip; });
        });
      })
      .then(function (img) {
        var fm = '---\n' +
          'title: ' + JSON.stringify(title) + '\n' +
          'slug: ' + slug + '\n' +
          'permalink: /' + slug + '/\n' +
          (img ? 'image: ' + JSON.stringify(img) + '\n' : '') +
          (tag ? 'tagline: ' + JSON.stringify(tag) + '\n' : '') +
          (author ? 'author: ' + JSON.stringify(author) + '\n' : '') +
          'status: ' + status + '\n' +
          'chapter_auto: true\n' +
          'order: ' + order + '\n' +
          (tags.length ? 'tags: ' + JSON.stringify(tags) + '\n' : '') +
          'accent: ' + JSON.stringify(accent) + '\n' +
          '---\n' + summary + '\n';
        return api('PUT', path, { message: 'Add story ' + title + ' (via site)', content: utf8ToB64(fm) });
      })
      .then(function () {
        var url = '/' + slug + '/';
        closePanel(true);
        toast('História criada ✓ Publicando… você será levada até ela sozinha.', 0);
        pollUntil(function () {
          return fetch(url + '?v=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok; });
        }, function () { location.href = url; });
      })
      .catch(function (e) { btn.disabled = false; setStatus(errMsg(e, true)); });
  }

  /* =========================================================
     BOTÕES FLUTUANTES + CSS
     ========================================================= */
  var EDITOR_CSS = [
    '.ed-fabs{position:fixed;right:16px;bottom:20px;z-index:1050;display:flex;flex-direction:column;align-items:center;gap:10px}',
    '.ed-fab{width:52px;height:52px;border-radius:50%;border:0;background:var(--detalhe-accent);color:var(--on-accent);font-size:1.4rem;line-height:1;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.45);opacity:.92}',
    '.ed-fab.small{width:42px;height:42px;font-size:1.15rem;background:var(--bg-card);color:var(--texto-principal);border:1px solid var(--detalhe-accent)}',
    '.ed-panel{position:fixed;inset:0;z-index:2000;background:var(--bg-principal);color:var(--texto-principal);display:none;flex-direction:column;font-family:"Outfit",system-ui,sans-serif}',
    '.ed-panel.open{display:flex}',
    '.ed-panel [hidden]{display:none!important}',
    '.ed-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;background:var(--bg-card);border-bottom:1px solid var(--borda-suave)}',
    '.ed-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;font-size:.9rem}',
    '.ed-btn{background:rgba(127,127,127,.12);color:var(--texto-principal);border:1px solid var(--borda-suave);border-radius:8px;padding:8px 13px;font:inherit;font-size:.95rem;cursor:pointer;white-space:nowrap}',
    '.ed-btn.ed-on{border-color:var(--detalhe-accent);color:var(--detalhe-accent)}',
    '.ed-save{background:var(--detalhe-accent);color:var(--on-accent);border:0;font-weight:700}',
    '.ed-save:disabled{opacity:.5}',
    '.ed-meta{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px;padding:10px 12px;background:var(--bg-card);border-bottom:1px solid var(--borda-suave);max-height:44vh;overflow:auto}',
    '.ed-meta label{display:flex;flex-direction:column;gap:3px;font-size:.75rem;color:var(--texto-secundario);min-width:0}',
    '.ed-meta label.full,.ed-meta .ed-hint{grid-column:1/-1}',
    '.ed-meta input,.ed-meta select{width:100%;box-sizing:border-box;background:var(--bg-principal);color:var(--texto-principal);border:1px solid var(--borda-suave);border-radius:8px;padding:8px 10px;font:16px/1.3 inherit}',
    '.ed-meta input[type=color]{padding:2px;height:38px}',
    '.ed-hint{font-size:.75rem;color:var(--texto-secundario)}',
    '.ed-tools{display:flex;gap:6px;padding:8px 12px;overflow-x:auto;background:var(--bg-card);border-bottom:1px solid var(--borda-suave)}',
    '.ed-drawer{max-height:38vh;overflow:auto;background:var(--bg-card);border-bottom:1px solid var(--borda-suave)}',
    '.ed-tabs{display:flex;gap:4px;padding:8px 12px 0;overflow-x:auto}',
    '.ed-tab{background:transparent;color:var(--texto-secundario);border:0;border-bottom:2px solid transparent;padding:6px 10px;font:inherit;font-size:.85rem;cursor:pointer;white-space:nowrap}',
    '.ed-tab.on{color:var(--detalhe-accent);border-bottom-color:var(--detalhe-accent)}',
    '.ed-pbody{display:flex;flex-wrap:wrap;gap:8px;padding:10px 12px 14px}',
    '.ed-note{flex-basis:100%;margin:0;font-size:.78rem;color:var(--texto-secundario)}',
    '.ed-chip{background:var(--bg-principal);color:var(--texto-principal);border:1px solid var(--borda-suave);border-radius:999px;padding:7px 14px;font:inherit;font-size:.85rem;cursor:pointer}',
    '.ed-chip:hover{border-color:var(--detalhe-accent);color:var(--detalhe-accent)}',
    '.ed-chip-main{background:var(--detalhe-accent);color:var(--on-accent);border-color:transparent}',
    '.ed-chip-main:hover{color:var(--on-accent);opacity:.9}',
    '.ed-mine{display:inline-flex;gap:2px}',
    '.ed-x{padding:7px 10px}',
    '.ed-select{flex:1;min-width:160px;background:var(--bg-principal);color:var(--texto-principal);border:1px solid var(--borda-suave);border-radius:8px;padding:8px;font:16px inherit}',
    '.ed-find{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;background:var(--bg-card);border-bottom:1px solid var(--borda-suave)}',
    '.ed-find input{flex:1;min-width:110px;background:var(--bg-principal);color:var(--texto-principal);border:1px solid var(--borda-suave);border-radius:8px;padding:8px 10px;font:16px inherit}',
    '.ed-headwrap{padding:8px 12px;background:var(--bg-card);border-bottom:1px solid var(--borda-suave)}',
    '.ed-headwrap textarea{width:100%;box-sizing:border-box;background:var(--bg-principal);color:var(--texto-principal);border:1px solid var(--borda-suave);border-radius:8px;padding:8px;font:14px/1.5 ui-monospace,Menlo,Consolas,monospace}',
    '.ed-status{display:flex;justify-content:space-between;gap:10px;padding:6px 12px;font-size:.78rem;color:var(--texto-secundario);background:var(--bg-card);border-bottom:1px solid var(--borda-suave)}',
    '.ed-panel #edText{flex:1;width:100%;border:0;resize:none;outline:0;padding:14px;background:var(--bg-principal);color:var(--texto-principal);font:16px/1.7 ui-monospace,Menlo,Consolas,monospace}',
    '.ed-toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:2100;max-width:90%;background:var(--bg-card);color:var(--texto-principal);border:1px solid var(--detalhe-accent);border-radius:10px;padding:10px 16px;font-size:.9rem;box-shadow:0 8px 20px rgba(0,0,0,.5);display:none;text-align:center;cursor:pointer}',
    '.ed-toast.show{display:block}'
  ].join('');

  function mount() {
    var css = el('style');
    css.textContent = EDITOR_CSS;
    document.head.appendChild(css);

    var r = $('#reader-root'), kind = r && r.dataset.kind, box = el('div', 'ed-fabs');
    function fab(txt, title, fn, small) {
      var b = el('button', 'ed-fab' + (small ? ' small' : ''), txt);
      b.type = 'button';
      b.title = title;
      b.addEventListener('click', fn);
      box.appendChild(b);
    }
    if (kind === 'chapter') { fab('＋', 'Novo capítulo', openNewChapter, true); fab('✎', 'Editar este capítulo', openChapterEditor); }
    else if (kind === 'novel') { fab('✎', 'Editar dados da história', openEditStory, true); fab('＋', 'Novo capítulo', openNewChapter); }
    else if ($('.stories-grid')) { fab('＋', 'Nova história', openNewStory); }
    else return;
    document.body.appendChild(box);

    /* lembra o último texto selecionado na história, para o editor abrir já naquele ponto */
    document.addEventListener('selectionchange', function () {
      var s = window.getSelection(), c = $('.post-content');
      if (s && c && s.anchorNode && c.contains(s.anchorNode)) {
        var txt = String(s).trim();
        if (txt) lastSel = txt;
      }
    });
    window.addEventListener('beforeunload', function (e) { if (isDirty()) { e.preventDefault(); e.returnValue = ''; } });
  }

  mount();
})();
