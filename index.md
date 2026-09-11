---
layout: page
title: Library
---

<style>
  /* ORGANIZAÇÃO EM GRADE (LADO A LADO) */
  .biblioteca-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
    gap: 20px !important;
    margin-top: 20px !important;
  }
  
  .card-historia {
    background: #18181b !important;
    border: 1px solid #27272a !important;
    border-radius: 8px !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    transition: transform 0.2s, border-color 0.2s;
  }
  
  .card-historia:hover {
    transform: translateY(-4px);
    border-color: #8257e5 !important;
  }

  /* LIMITA O TAMANHO DA CAPA */
  .capa-container {
    height: 260px !important;
    width: 100% !important;
    background: #27272a;
    overflow: hidden;
  }

  .capa-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
  }

  .conteudo-card {
    padding: 12px !important;
    text-align: center !important;
  }

  .titulo-historia {
    font-size: 1rem !important;
    margin: 0 !important;
  }

  .titulo-historia a {
    text-decoration: none !important;
    color: #f4f4f5 !important;
    font-weight: bold !important;
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
