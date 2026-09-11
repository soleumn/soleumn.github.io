---
layout: page
title: "Got Dropped Into a Ghost Story, Still Gotta Work"
permalink: /gsgw/
---


<!-- BLOCO DA CAPA E SINOPSE COM TAMANHO FORÇADO -->
<div style="display: flex; gap: 30px; margin-bottom: 35px; flex-wrap: wrap; align-items: flex-start;">
  
  <div style="width: 260px; min-width: 260px; flex-shrink: 0;">
    <img src="{{ '/assets/gsgw.jpg' | relative_url }}" 
         alt="Capa Gsgw" 
         style="width: 100% !important; height: 370px !important; object-fit: cover !important; border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.6); display: block;">
  </div>

  <div style="flex: 1; min-width: 280px;">
    <h2 style="margin-top: 0; font-size: 1.8rem;">Summary</h2>
    <p style="font-size: 1.1rem; line-height: 1.7; color: #d1d5db;">
      A pop-up event for "A Certain Modern Fantasy," a novel I loved so much I even used my precious vacation days to go.

<br><br>And that day, I was transported into that very modern fantasy.

<br><br>As a newly hired employee at a famous conglomerate, no less!

<br><br>Good benefits, good salary, and even my direct superiors are kind and competent—it's a dream job.

<br><br>Using the knowledge of the world that only I possess, I'm rapidly climbing the corporate ladder!

<br><br>Am I happy?

<br><br>Please, just send me home.

<br><br>※Special Note: The genre is horror.</p>
    <hr style="border-color: #27272a; margin: 20px 0;">
    <p style="font-size: 1rem; color: #9ca3af;">
      <strong>Author:</strong> 백덕수<br>
      <strong>Status:</strong> Hiatus
    </p>
  </div>

</div>

<!-- COLE O BOTÃO "CONTINUAR" AQUI, ANTES DA LISTA DE CAPÍTULOS: -->
<div style="margin-bottom: 20px;">
  <a id="btnContinuar" href="#" style="display: none; padding: 12px 20px; background: #380928; color: white !important; font-weight: bold; border-radius: 6px; text-decoration: none;">
    ➠ Continue from where you left off
  </a>
</div>

<script>
  var ultimoCapitulo = localStorage.getItem('ultimoCapitulo');
  if (ultimoCapitulo) {
    var btn = document.getElementById('btnContinuar');
    btn.href = ultimoCapitulo;
    btn.style.display = 'inline-block';
  }
</script>

---

### ☰ Chapters

<ul style="list-style: none; padding-left: 0;">
  {% assign capitulos = site.categories.gsgw | sort: "capitulo" %}
  {% for post in capitulos %}
    <li style="padding: 12px 0; border-bottom: 1px solid var(--borda-suave);">
      <a href="{{ post.url | relative_url }}" style="font-size: 1.1rem; text-decoration: none;">
        🕮 {{ post.title }}
      </a>
    </li>
  {% endfor %}
</ul>
