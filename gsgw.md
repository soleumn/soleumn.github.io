---
layout: page
title: "Gdgk"
permalink: /gsgw/
---


<div style="display: flex; gap: 20px; margin-bottom: 25px; flex-wrap: wrap;">
  <img src="{{ '/assets/gsgw.jpg' | relative_url }}" style="width: 160px; height: 230px; object-fit: cover; border-radius: 8px;">
  <div style="flex: 1; min-width: 200px;">
    <h3>Summary</h3>
    <p>A pop-up event for "A Certain Modern Fantasy," a novel I loved so much I even used my precious vacation days to go.

<br><br>And that day, I was transported into that very modern fantasy.

<br><br>As a newly hired employee at a famous conglomerate, no less!

<br><br>Good benefits, good salary, and even my direct superiors are kind and competent—it's a dream job.

<br><br>Using the knowledge of the world that only I possess, I'm rapidly climbing the corporate ladder!

<br><br>Am I happy?

<br><br>Please, just send me home.

<br><br>※Special Note: The genre is horror.</p>
    <p><strong>Author:</strong> 백덕수<br><strong>Status:</strong> Hiatus</p>
  </div>
</div>

---

### 📜 Chapters

<ul style="list-style: none; padding-left: 0;">
  {% for post in site.categories.gsgw reverse %}
    <li style="padding: 10px 0; border-bottom: 1px solid #27272a;">
      <a href="{{ post.url | relative_url }}" style="font-size: 1.1rem; text-decoration: none;">
        📖 {{ post.title }}
      </a>
    </li>
  {% endfor %}
</ul>
