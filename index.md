---
layout: single
author_profile: false
sidebar: false
---

<style>
  /* 1. HERO SECTION STYLING */
  .hero-container {
    text-align: center;
    padding: 4rem 1rem;
    background: #111;
    color: #fff;
    border-radius: 12px;
    margin-bottom: 3rem;
    position: relative;
    overflow: hidden;
    border: 1px solid #333;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  /* Matrix-like Green Accent */
  .hero-accent {
    color: #00cc44;
    font-weight: bold;
  }

  /* Profile Picture in Hero */
  .hero-avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 3px solid #00cc44;
    object-fit: cover;
    margin-bottom: 1.5rem;
    box-shadow: 0 0 20px rgba(0, 204, 68, 0.3);
  }

  /* Typewriter Effect for the Title */
  .typewriter h1 {
    font-family: 'Courier New', Courier, monospace;
    overflow: hidden;
    white-space: nowrap;
    margin: 0 auto;
    letter-spacing: .10em;
    animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
    max-width: fit-content;
    border-right: .15em solid #00cc44;
  }
  @keyframes typing { from { width: 0 } to { width: 100% } }
  @keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: #00cc44; } }

  /* 2. "WHAT I DO" GRID */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }
  .skill-card {
    background: #1a1a1a; /* CHANGED: Dark background */
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #333; /* CHANGED: Dark border */
    border-left: 4px solid #00cc44; /* Green accent preserved */
    color: #eee; /* CHANGED: Light text for readability */
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: transform 0.2s;
  }
  .skill-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,204,68,0.1); /* Green glow on hover */
    border-color: #555;
  }
  .skill-icon {
    font-size: 2.5rem;
    color: #00cc44; /* Green Icon */
    margin-bottom: 1rem;
  }
  .skill-card h3 {
    margin-top: 0;
    color: #fff;
  }

  /* 3. FEATURED PROJECT MINI-CARDS */
  .featured-projects {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
  .mini-project {
    flex: 1 1 300px;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    height: 200px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    border: 1px solid #333;
  }
  .mini-project img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
    opacity: 0.8;
  }
  .mini-project:hover img {
    transform: scale(1.05);
    opacity: 1;
  }
  .mini-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    color: #00cc44;
    padding: 10px;
    text-align: center;
    border-top: 1px solid #333;
    font-weight: bold;
  }

  /* 4. BUTTONS */
  .btn-green {
    background-color: #00cc44;
    color: #fff !important;
    border-radius: 30px;
    padding: 12px 25px;
    font-weight: bold;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 2px solid #00cc44;
    display: inline-block;
    margin-top: 1rem;
  }
  .btn-green:hover {
    background-color: transparent;
    color: #00cc44 !important;
    box-shadow: 0 0 15px rgba(0, 204, 68, 0.4);
  }
  
  /* Responsive Fix for Typewriter */
  @media (max-width: 600px) {
    .typewriter h1 { font-size: 1.2rem; }
  }
</style>

<div class="hero-container">
  <img src="/assets/images/me.png" alt="Federico Costantini" class="hero-avatar">

  <div class="typewriter">
    <h1>Hello, I'm Federico Costantini.</h1>
  </div>

  <p style="font-size: 1.2rem; color: #ccc; margin-top: 1rem; max-width: 600px; margin-left: auto; margin-right: auto;">
    Graphics Engineer & MSc Student @ Politecnico di Milano.<br>
    I focus on <span class="hero-accent">Custom Rendering Engines</span>, optimize <span class="hero-accent">Graphics Pipelines</span>, and develop Games using <span class="hero-accent">Unity</span>.
  </p>

  <div style="margin-top: 2rem;">
    <a href="/projects/" class="btn-green"><i class="fas fa-code"></i> See My Projects</a>
    <a href="/cv/" class="btn btn--inverse" style="border-radius: 30px; padding: 12px 25px; margin-left: 10px;">View CV</a>
  </div>
</div>

<h2 style="text-align: center; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 2px;">Technical Focus</h2>

<div class="skills-grid">
  <div class="skill-card">
    <div class="skill-icon"><i class="fas fa-vr-cardboard"></i></div>
    <h3>Graphics Programming</h3>
    <p>Specialized in <strong>Vulkan</strong> and <strong>OpenGL</strong>. I love writing shaders (GLSL/HLSL), implementing Ray Tracing, and understanding the GPU pipeline at a hardware level.</p>
  </div>

  <div class="skill-card">
    <div class="skill-icon"><i class="fas fa-cogs"></i></div>
    <h3>Engine Development</h3>
    <p>Building engines from scratch using <strong>C++</strong>. Managing explicit memory allocation, synchronization, and data-oriented design to achieve maximum performance.</p>
  </div>

  <div class="skill-card">
    <div class="skill-icon"><i class="fas fa-gamepad"></i></div>
    <h3>Game Development</h3>
    <p>Developing interactive experiences using <strong>Unity (C#)</strong> and custom frameworks. I focus on gameplay mechanics, physics implementation, and realt-time Physical Based Rendering.</p>
  </div>
</div>

<h2 style="text-align: center; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 2px;">Featured Projects</h2>

<div class="featured-projects">
  
  <a href="/projects/#3-vulkan-path-tracer--gaussian-splatting-rd" class="mini-project">
    <img src="/assets/images/neoclassic_wallpaper.png" alt="Vulkan Path Tracer">
    <div class="mini-overlay"><strong>Vulkan Path Tracer</strong></div>
  </a>

  <a href="/projects/#2-first-vulkan-engine" class="mini-project">
    <img src="/assets/images/CG_img.png" alt="Custom Rasterizer">
    <div class="mini-overlay"><strong>Custom Rasterizer</strong></div>
  </a>

  <a href="/projects/#4-Nailed-it" class="mini-project">
    <img src="/assets/images/nailed-it.png" alt="Metaballs Sim">
    <div class="mini-overlay"><strong>Metaballs Simulation</strong></div>
  </a>

</div>

<div style="margin-bottom: 4rem;"></div>