---
layout: page
title: "Eoshinke"
permalink: /eoshinki/
---


<div style="display: flex; gap: 25px; margin-bottom: 30px; flex-wrap: wrap; align-items: flex-start;">
  <img src="{{ '/assets/eoshinki.jpg' | relative_url }}" style="width: 160px; height: 230px; object-fit: cover; border-radius: 8px;">
  <div style="flex: 1; min-width: 250px;">
    <h3>Summary</h3>
    <p>A former pro gamer who retired due to injury.

<br><br>After retirement, he spent his life just playing games…

<br><br>Then the game he used to play became reality.

<br><br>But he is not a player.

<br><br>[You are the system of the planet “Earth.”]

<br><br>He’s told to register people as characters, but he has no idea what that means.

<br><br>For now, he decides to clear the game first—because he knows everything about it.</p>
    <p><strong>Author:</strong> 강토공<br><strong>Status:</strong> On-Going</p>
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

### 📜 Chapters

<ul style="list-style: none; padding-left: 0;">
  {% for post in site.categories.eoshinki reverse %}
    <li style="padding: 10px 0; border-bottom: 1px solid #27272a;">
      <a href="{{ post.url | relative_url }}" style="font-size: 1.1rem; text-decoration: none;">
        📖 {{ post.title }}
      </a>
    </li>
  {% endfor %}
</ul>
