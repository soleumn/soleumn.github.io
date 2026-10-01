---
layout: page
title: Koko's TL
---

<style>
  /* SUBTÍTULO / INTRODUÇÃO */
  .intro-text {
    color: var(--texto-secundario, #a1a1aa);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 28px;
  }

  /* GRADE DE HISTÓRIAS */
  .biblioteca-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
    gap: 24px !important;
    margin-top: 20px !important;
  }
  
  /* CARD COMPLETO COMO LINK */
  .card-historia-link {
    text-decoration: none !important;
    color: inherit !important;
    display: flex !important;
    flex-direction: column !important;
  }

  .card-historia {
    background: var(--bg-card, #18181b) !important;
    border: 1px solid var(--borda-suave, #27272a) !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    height: 100%;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  
  .card-historia-link:hover .card-historia {
    transform: translateY(-6px);
    border-color: var(--detalhe-accent, #8257e5) !important;
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.5), 0 0 12px -2px var(--detalhe-accent, #8257e5);
  }

  /* CONTAINER DA CAPA (PROPORÇÃO FIXA DE LIVRO) */
  .capa-container {
    position: relative;
    width: 100% !important;
    aspect-ratio: 2 / 3 !important;
    background: #27272a;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .capa-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
    transition: transform 0.4s ease;
  }

  .card-historia-link:hover .capa-img {
    transform: scale(1.05);
  }

  /* PLACEHOLDER QUANDO A CAPA AINDA NÃO EXISTE OU NÃO CARREGA */
  .capa-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
    color: var(--texto-secundario, #a1a1aa);
    font-family: var(--fonte-titulo, serif);
    font-size: 0.95rem;
    font-weight: 600;
    text-align: center;
    border-bottom: 1px solid var(--borda-suave, #27272a);
  }

  /* CONTEÚDO DO CARD */
  .conteudo-card {
    padding: 14px 12px !important;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-grow: 1;
  }

  .titulo-historia {
    font-family: var(--fonte-titulo, serif) !important;
    margin: 0 !important;
    font-size: 1.05rem !important;
    color: var(--texto-titulo, #f4f4f5) !important;
    font-weight: 700;
    line-height: 1.3;
  }

  .sinopse-historia {
    font-size: 0.82rem !important;
    color: var(--texto-secundario, #a1a1aa) !important;
    margin: 0 !important;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>

<div class="intro-text">
  Webnovels translated by me! ^^ (pls gatekeep)
</div>

<div class="biblioteca-grid">

  <!-- HISTÓRIA 1 -->
  <a href="{{ '/eoshinki/' | relative_url }}" class="card-historia-link">
    <div class="card-historia">
      <div class="capa-container">
        <div class="capa-placeholder">Eoshinki</div>
        <img src="{{ '/assets/eoshinki.jpg' | relative_url }}" alt="Eoshinki" class="capa-img" onerror="this.style.display='none'">
      </div>
      <div class="conteudo-card">
        <h2 class="titulo-historia">I'm a Young God, Won't You Raise Me?</h2>
        <p class="sinopse-historia">Ch112+</p>
      </div>
    </div>
  </a>

  <!-- HISTÓRIA 2 -->
  <a href="{{ '/gsgw/' | relative_url }}" class="card-historia-link">
    <div class="card-historia">
      <div class="capa-container">
        <div class="capa-placeholder">GSGW</div>
        <img src="{{ '/assets/gsgw.jpg' | relative_url }}" alt="GSGW" class="capa-img" onerror="this.style.display='none'">
      </div>
      <div class="conteudo-card">
        <h2 class="titulo-historia">Got Dropped Into a Ghost Story, Still Gotta Work</h2>
        <p class="sinopse-historia">PT3 only!!</p>
      </div>
    </div>
  </a>

  <!-- HISTÓRIA 3 -->
  <a href="{{ '/esg/' | relative_url }}" class="card-historia-link">
    <div class="card-historia">
      <div class="capa-container">
        <div class="capa-placeholder">Esg</div>
        <img src="{{ '/assets/esg.jpg' | relative_url }}" alt="Esg" class="capa-img" onerror="this.style.display='none'">
      </div>
      <div class="conteudo-card">
        <h2 class="titulo-historia">Editor's Survival Guide</h2>
        <p class="sinopse-historia">Ch157+</p>
      </div>
    </div>
  </a>

</div>
