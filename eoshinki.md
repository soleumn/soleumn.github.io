---
layout: page
title: "I'm a Young God, Won't You Raise Me?"
permalink: /eoshinki/
---


<!-- BLOCO DA CAPA E SINOPSE COM TAMANHO FORÇADO -->
<div style="display: flex; gap: 30px; margin-bottom: 35px; flex-wrap: wrap; align-items: flex-start;">
  
  <div style="width: 260px; min-width: 260px; flex-shrink: 0;">
    <img src="{{ '/assets/eoshinki.jpg' | relative_url }}" 
         alt="Capa Eoshinki" 
         style="width: 100% !important; height: 370px !important; object-fit: cover !important; border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.6); display: block;">
  </div>

  <div style="flex: 1; min-width: 280px;">
    <h2 style="margin-top: 0; font-size: 1.8rem;">Summary</h2>
    <p style="font-size: 1.1rem; line-height: 1.7; color: #d1d5db;">
      A former pro gamer who retired due to injury.

<br><br>After retirement, he spent his life just playing games…

<br><br>Then the game he used to play became reality.

<br><br>But he is not a player.

<br><br>[You are the system of the planet “Earth.”]

<br><br>He’s told to register people as characters, but he has no idea what that means.

<br><br>For now, he decides to clear the game first—because he knows everything about it.</p>
    <hr style="border-color: #27272a; margin: 20px 0;">
    <p style="font-size: 1rem; color: #9ca3af;">
      <strong>Author:</strong> 강토공<br>
      <strong>Status:</strong> On-Going
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
  {% assign capitulos_existentes = site.categories.eoshinki | where_exp: "item", "item.capitulo != nil" %}
  {% assign capitulos_ordenados = capitulos_existentes | sort: "capitulo" %}
  
  {% for post in capitulos_ordenados %}
    <li style="padding: 12px 0; border-bottom: 1px solid var(--borda-suave);">
      <a href="{{ post.url | relative_url }}" style="font-size: 1.1rem; text-decoration: none;">
        🕮 {{ post.title }}
      </a>
    </li>
  {% endfor %}
</ul>
