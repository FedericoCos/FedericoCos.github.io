---
title: "Projects"
permalink: /projects/
layout: single
author_profile: true
toc: true
toc_label: "My Portfolio"
toc_icon: "gamepad"
---

<style>
  .project-card {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-bottom: 2rem;
    align-items: flex-start; /* This forces Top Alignment */
  }
  .project-image {
    flex: 1 1 400px; /* Takes up space but shrinks if needed */
  }
  .project-image img {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    width: 100%;
  }
  .project-info {
    flex: 1 1 300px;
  }
  .project-info h3 {
    margin-top: 0; /* Removes default top spacing to align with image */
  }
  .video-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 1rem;
  }
  .video-item {
    flex: 1 1 45%; /* Videos take roughly half width each */
    min-width: 300px; /* Forces stacking on mobile */
  }
</style>

## Game Development

### Nailed It

<div class="project-card">
  <div class="project-image">
    <img src="/assets/images/nailed-it.png" alt="Nailed It Gameplay">
  </div>

  <div class="project-info">d
    <p><em>Developed for the "Video Game Design and Programming" course at Politecnico di Milano.</em></p>
    
    <p><strong>The Concept:</strong><br>
    "Nailed It" is a 2D puzzle-platformer built on a unique mechanic: <strong>you are the platform.</strong> In a world with limited footing, you must shoot nails into walls and fix your own character to the environment, sacrificing your previous body to create a step for your next life to climb.</p>

    <ul>
      <li><strong>Role:</strong> Group Leader & Programmer</li>
      <li><strong>Stack:</strong> Unity (2D), C#</li>
      <li><strong>Team:</strong> Costantini Federico, Zanca Federico, Xie Valerio, Sas Alexandro</li>
    </ul>

    <a href="https://polimi-game-collective.itch.io/nailed-it" class="btn btn--primary btn--large">Play on Itch.io</a>
  </div>
</div>

<h4 style="border-bottom: 1px solid #333; padding-bottom: 10px;">Media Showcase</h4>

<div class="video-container">
  <div class="video-item">
    <p><strong>Trailer</strong></p>
    {% include video id="NQ8VkvjYgpw&t" provider="youtube" %}
  </div>

  <div class="video-item">
    <p><strong>Gameplay Walkthrough</strong></p>
    {% include video id="S7PVqLQhDXk&t" provider="youtube" %}
  </div>
</div>

<hr>

### First Vulkan Engine

<div class="project-card">
  <div class="project-image">
    <img src="/assets/images/CG_wall.png" alt="Vulkan Engine Demo">
  </div>

  <div class="project-info">
    <p><em>A low-level rasterization engine built from scratch to master modern graphics APIs.</em></p>
    
    <p><strong>The Concept:</strong><br>
    This project was a deep dive into the complexities of explicit rendering APIs. I architected a custom C++ engine to handle the verbose nature of Vulkan, focusing on efficient resource management and pipeline synchronization. To benchmark the renderer, I developed a vehicle simulation where a car navigates a track, handling collisions and object collection (flags) with high performance.</p>

    <ul>
      <li><strong>Focus:</strong> Graphics Pipeline, Shader Logic (GLSL), Memory Optimization</li>
      <li><strong>Stack:</strong> C++, Vulkan SDK</li>
      <li><strong>Key Feature:</strong> Custom collision detection system & optimized command buffer recording.</li>
    </ul>

    </div>
</div>

<h4 style="border-bottom: 1px solid #333; padding-bottom: 10px;">Engine Showcase</h4>

<div class="video-container">
  <div class="video-item">
    <p><strong>Gameplay Demo</strong></p>
    <video width="100%" controls style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
      <source src="/assets/videos/CG_video.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>

  <div class="video-item">
    <p><strong>Debug / Wireframe View</strong></p>
    <img src="/assets/images/CG_img.png" alt="Vulkan Engine Detail View" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>
</div>

<hr>