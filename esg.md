---
layout: page
title: "Editor's Survival Guide"
permalink: /esg/
---


<!-- BLOCO DA CAPA E SINOPSE COM TAMANHO FORÇADO -->
<div style="display: flex; gap: 30px; margin-bottom: 35px; flex-wrap: wrap; align-items: flex-start;">

  <div style="width: 260px; min-width: 260px; flex-shrink: 0;">
    <img src="{{ '/assets/esg.jpg' | relative_url }}"
         alt="Capa Esg"
         style="width: 100% !important; height: 370px !important; object-fit: cover !important; border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.6); display: block;">
  </div>

  <div style="flex: 1; min-width: 280px;">
    <h2 style="margin-top: 0; font-size: 1.8rem;">Summary</h2>
    
    <!-- INÍCIO DA CAIXA DE SINOPSE EXPANSÍVEL -->
    <div id="synopsisBox" class="synopsis-container">
      <p style="font-size: 1.1rem; line-height: 1.7; margin: 0;">
        『Editor’s Survival Guide』 <br>“You are currently in a special zone managed by the South Korean government.”<br><br> 
        Seo Doun wakes up at an unfamiliar station on his way home from work, only to find himself in a special zone that defies the laws of reality!<br><br>
        A siren sounds every 47 minutes; the price of a single escape ticket is 15.87 million won; and… five escape routes.<br>
        To survive here, all that is needed is not morality, but choice. His story of surviving within this special zone does not end!
      </p>
    </div>

    <button id="btnSynopsis" class="btn-toggle-synopsis" onclick="toggleSynopsis()" style="margin-bottom: 15px;">
      Read More...
    </button>
    <!-- FIM DA CAIXA DE SINOPSE -->

    <hr style="border-color: #27272a; margin: 20px 0;">
    
    <p style="font-size: 1rem; color: #9ca3af;">
      <strong>Author:</strong> 김영지<br>
      <strong>Status:</strong> On-Going<br>
      <strong>Chapters:</strong> 157+<br>
      <strong>Raws:</strong> <a href="https://page.kakao.com/content/68473234/" style="color: var(--detalhe-accent, #cba6f7); text-decoration: underline; font-weight: 600;">here</a><br>
      <strong>place to read previous ch:</strong> <a href="https://azurechronicles.com/novel/editors-survival-guide/" style="color: var(--detalhe-accent, #cba6f7); text-decoration: underline; font-weight: 600;">1</a>
    </p>
  </div>
  
</div>

<!-- SCRIPT PARA FUNCIONAR O BOTÃO DE ABRIR/FECHAR -->
<script>
  function toggleSynopsis() {
    const box = document.getElementById('synopsisBox');
    const btn = document.getElementById('btnSynopsis');
    
    box.classList.toggle('expanded');
    
    if (box.classList.contains('expanded')) {
      btn.innerText = 'Read Less...';
    } else {
      btn.innerText = 'Read More...';
    }
  }
</script>


<div style="margin-top: 15px;">
  <a id="btn-continuar-lendo" href="{{ '/esg/2026/10/01/ch1.html' | relative_url }}" class="btn-nav" style="display: inline-block; width: 100%; text-align: center; background-color: var(--detalhe-accent); color: #11111b; font-weight: bold; text-decoration: none; padding: 12px 0; border-radius: 8px;">
    ✦ Start Reading
  </a>
</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const urlSalva = localStorage.getItem('esg_progresso_url');
    const tituloSalvo = localStorage.getItem('esg_progresso_titulo');
    const btnContinuar = document.getElementById('btn-continuar-lendo');

    if (urlSalva && btnContinuar) {
      // Atualiza o link do botão para a URL que foi salva anteriormente
      btnContinuar.href = urlSalva;
      
      // Atualiza o texto do botão para mostrar onde o leitor parou
      if (tituloSalvo) {
        btnContinuar.innerHTML = 'Continue Reading: ' + tituloSalvo;
      } else {
        btnContinuar.innerHTML = 'Continue Reading';
      }
    }
  });
</script>

---

### ⫶☰ Chapters

<!-- Adicionamos a div wrapper ao redor da ul para criar a caixa com scroll -->
<div class="chapter-scrollbox">
  <ul id="lista-capitulos" style="list-style: none; padding-left: 0; margin: 0;">
    {% for post in site.categories.esg %}
      <li class="item-capitulo" data-ordem="{{ post.capitulo | default: 0 }}" style="padding: 12px 0; border-bottom: 1px solid var(--borda-suave);">
        <a href="{{ post.url | relative_url }}" style="font-size: 1.1rem; text-decoration: none;">
          ❏ {{ post.title }}
        </a>
      </li>
    {% endfor %}
  </ul>
</div>
<script>
  document.addEventListener("DOMContentLoaded", function() {
    const lista = document.getElementById("lista-capitulos");
    if (!lista) return;

    const itens = Array.from(lista.querySelectorAll(".item-capitulo"));

    // Ordena os capítulos do menor número para o maior
    itens.sort((a, b) => {
      const ordemA = parseInt(a.getAttribute("data-ordem")) || 0;
      const ordemB = parseInt(b.getAttribute("data-ordem")) || 0;
      return ordemA - ordemB;
    });

    // Reinsere na lista em ordem correta
    itens.forEach(item => lista.appendChild(item));
  });
</script>
