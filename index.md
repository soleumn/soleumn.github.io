---
layout: page
title: Library
---

<style>
  /* 1. Remove o clique do título "Minhas Histórias" no topo e altera o cursor */
  .site-title {
    pointer-events: none !important;
    cursor: default !important;
  }

  /* 2. Oculta o rodapé padrão repetitivo no final da página */
  .site-footer {
    display: none !important;
  }
  /* TEMA ESCURO PARA A PÁGINA */
  body {
    background-color: #121214 !important;
    color: #e1e1e6 !important;
  }
  .site-header, .site-footer {
    background-color: #18181b !important;
    border-color: #27272a !important;
  }
  .site-title, .page-link {
    color: #f4f4f5 !important;
  }
  
  /* GRID DE HISTÓRIAS (ESTILO WEBNOVEL) */
  .biblioteca-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  .card-historia {
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, border-color 0.2s;
  }
  .card-historia:hover {
    transform: translateY(-4px);
    border-color: #8257e5;
  }
  .capa-container {
    height: 280px;
    width: 100%;
    background: #27272a;
  }
  .capa-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .conteudo-card {
    padding: 12px;
    text-align: center;
  }
  .titulo-historia {
    font-size: 1rem;
    margin: 0;
  }
  .titulo-historia a {
    text-decoration: none;
    color: #f4f4f5 !important;
    font-weight: bold;
  }
</style>

<p>Webnovels translated by me! ^^</p>

<div class="biblioteca-grid">

  <!-- HISTÓRIA 1 -->
  <div class="card-historia">
    <a href="{{ '/eoshinki/' | relative_url }}">
      <div class="capa-container">
        <img src="{{ '/assets/eoshinki.jpg' | relative_url }}" alt="Capa Eoshinki" class="capa-img">
      </div>
    </a>
    <div class="conteudo-card">
      <h3 class="titulo-historia">
        <a href="{{ '/eoshinki/' | relative_url }}">Eoshinke</a>
      </h3>
    </div>
  </div>

  <!-- HISTÓRIA 2 -->
  <div class="card-historia">
    <a href="{{ '/gsgw/' | relative_url }}">
      <div class="capa-container">
        <img src="{{ '/assets/gsgw.jpg' | relative_url }}" alt="Capa Gsgw" class="capa-img">
      </div>
    </a>
    <div class="conteudo-card">
      <h3 class="titulo-historia">
        <a href="{{ '/gsgw/' | relative_url }}">Gdgk</a>
      </h3>
    </div>
  </div>

</div>
