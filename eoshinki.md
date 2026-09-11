---
layout: page
title: "Eoshinke"
permalink: /eoshinki/
---

<style>
  body { background-color: #121214 !important; color: #e1e1e6 !important; }
  .site-header, .site-footer { background-color: #18181b !important; border-color: #27272a !important; }
  .site-title, .page-link { color: #f4f4f5 !important; }
  a { color: #8257e5 !important; }
</style>

<div style="display: flex; gap: 20px; margin-bottom: 25px; flex-wrap: wrap;">
  <img src="{{ '/assets/eoshinki.jpg' | relative_url }}" style="width: 160px; height: 230px; object-fit: cover; border-radius: 8px;">
  <div style="flex: 1; min-width: 200px;">
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
