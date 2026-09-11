---
layout: page
title: Biblioteca de Histórias
---

Bem-vindo à minha biblioteca! Escolha uma história abaixo para começar a ler:

---

## 🗡️ História 1: O Reino Perdido
*Uma história cheia de magia e aventuras.*

<ul>
  {% for post in site.categories.historia-fantasia reverse %}
    <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

---

## 💖 História 2: Amor em Paris
*Um romance marcante.*

<ul>
  {% for post in site.categories.historia-romance reverse %}
    <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
