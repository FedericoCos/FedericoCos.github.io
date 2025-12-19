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
    background: #fdfdfd;
    padding: 2rem;
    border-radius: 8px;
    border-left: 4px solid #00cc44; /* Green accent */
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.2s;
  }
  .skill-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
  .skill-icon {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 1rem;
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
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  }
  .mini-project img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  .mini-project:hover img {
    transform: scale(1.05);
  }
  .mini-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    text-align: center;
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
    I build <span class="hero-accent">Rendering Engines</span>, optimize <span class="hero-accent">Graphics Pipelines</span>, and push pixels to their limit.
  </p>

  <div style="margin-top: 2rem;">
    <a href="/projects/" class="btn-green"><i class="fas fa-code"></i> See My Code</a>
    <a href="/cv/" class="btn btn--inverse" style="border-radius: 30px; padding: 12px 25px; margin-left: 10px;">View CV</a>
  </div>
</div>

<h2 style="text-align: center; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 2px;">Technical Focus</h2>

<div class="skills-grid">
  <div class="skill-card">
    <div class="skill-icon"><i class="fas fa-vr-cardboard" style="color: #00cc44;"></i></div>
    <h3>Graphics Programming</h3>
    <p>Specialized in <strong>Vulkan</strong> and <strong>OpenGL</strong>. I love writing shaders (GLSL/HLSL), implementing Ray Tracing, and understanding the GPU pipeline at a hardware level.</p>
  </div>

  <div class="skill-card">
    <div class="skill-icon"><i class="fas fa-cogs" style="color: #00cc44;"></i></div>
    <h3>Engine Development</h3>
    <p>Building engines from scratch using <strong>C++</strong>. Managing explicit memory allocation, synchronization, and data-oriented design to achieve maximum performance.</p>
  </div>

  <div class="skill-card">
    <div class="skill-icon"><i class="fas fa-network-wired" style="color: #00cc44;"></i></div>
    <h3>Distributed Systems</h3>
    <p>Proven experience in Software Engineering with <strong>Java</strong>, designing distributed architectures (RMI/Sockets) and safety-critical analysis (WCET).</p>
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

  <a href="/projects/#6-2d-metaballs--marching-squares" class="mini-project">
    <img src="/assets/images/metaballs_wallpaper.jpg" alt="Metaballs Sim">
    <div class="mini-overlay"><strong>Metaballs Simulation</strong></div>
  </a>

</div>

<div style="text-align: center; margin-top: 3rem; margin-bottom: 2rem;">
  <p style="color: #777; font-style: italic;">"The only way to do great work is to love what you do."</p>
</div>