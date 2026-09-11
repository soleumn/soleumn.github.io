---
layout: page
title: Biblioteca
---

<style>
  .biblioteca-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 25px;
    margin-top: 20px;
  }
  .card-historia {
    border: 1px solid #e1e4e8;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
  }
  .capa-container {
    width: 100%;
    height: 320px;
    overflow: hidden;
    background: #f0f0f0;
  }
  .capa-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .conteudo-card {
    padding: 18px;
    flex-grow: 1;
  }
  .titulo-historia {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 1.25rem;
    color: #24292e;
  }
  .sinopse {
    font-size: 0.9rem;
    color: #586069;
    margin-bottom: 15px;
  }
  .lista-capitulos {
    list-style: none;
    padding-left: 0;
    margin-bottom: 0;
  }
  .lista-capitulos li {
    padding: 6px 0;
    border-top: 1px solid #f0f0f0;
  }
  .lista-capitulos a {
    text-decoration: none;
    font-weight: 500;
    color: #0366d6;
  }
  .lista-capitulos a:hover {
    text-decoration: underline;
  }
</style>

Escolha uma história abaixo para começar a leitura:

<div class="biblioteca-grid">

  <!-- CARD HISTÓRIA 1 -->
  <div class="card-historia">
    <div class="capa-container">
      <img src="{{ '/assets/eoshinki.jpg' | relative_url }}" alt="Capa Eoshinki" class="capa-img">
    </div>
    <div class="conteudo-card">
      <h3 class="titulo-historia">I'm a Young God, Won't You Raise Me?</h3>
      <p class="sinopse">A former pro gamer who retired due to injury.

After retirement, he spent his life just playing games…

Then the game he used to play became reality.

But he is not a player.

[You are the system of the planet “Earth.”]

He’s told to register people as characters, but he has no idea what that means.

For now, he decides to clear the game first—because he knows everything about it.</p>
      
      <strong>Capítulos:</strong>
      <ul class="lista-capitulos">
        {% for post in site.categories.eoshinki reverse %}
          <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
        {% endfor %}
      </ul>
    </div>
  </div>

  <!-- CARD HISTÓRIA 2 -->
  <div class="card-historia">
    <div class="capa-container">
      <img src="{{ '/assets/gsgw.jpg' | relative_url }}" alt="Capa Amor em Paris" class="capa-img">
    </div>
    <div class="conteudo-card">
      <h3 class="titulo-historia">Got Dropped Into a Ghost Story, Still Gotta Work</h3>
      <p class="sinopse">A pop-up event for "A Certain Modern Fantasy," a novel I loved so much I even used my precious vacation days to go.

And that day, I was transported into that very modern fantasy.

As a newly hired employee at a famous conglomerate, no less!

Good benefits, good salary, and even my direct superiors are kind and competent—it's a dream job.

Using the knowledge of the world that only I possess, I'm rapidly climbing the corporate ladder!

Am I happy?

Please, just send me home.

※Special Note: The genre is horror.</p>
      
      <strong>Capítulos:</strong>
      <ul class="lista-capitulos">
        {% for post in site.categories.gsgw reverse %}
          <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
        {% endfor %}
      </ul>
    </div>
  </div>

</div>
