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

  /* 1. Target the specific ID to override theme defaults */
  #main .page__inner-wrap {
    max-width: 100% !important; /* Force it to fill the container */
    width: 100% !important;
    margin-right: 0 !important;
    padding-right: 2rem; 
  }

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

# Game Development

## 1. Nailed It

<div class="project-card">
  <div class="project-image">
    <img src="/assets/images/nailed-it.png" alt="Nailed It Gameplay">
  </div>

  <div class="project-info">
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

## 2. First Vulkan Engine

<div class="project-card">
  <div class="project-image">
    <img src="/assets/images/CG_img.png" alt="Vulkan Engine Demo">
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
</div>

# Engine Development

## 3. Vulkan Path Tracer & Gaussian Splatting R&D

<div class="project-card">
  <div class="project-image">
    <img src="/assets/images/neoclassic_wallpaper.png" alt="Toroidal Sampling Visualization">
  </div>

  <div class="project-info">
    <p><em>A custom engine designed to research toroidal sampling strategies for optimizing 3D scene reconstruction.</em></p>
    
    <p><strong>The Engine:</strong><br>
    I developed a custom <strong>Vulkan Path Tracer</strong> capable of rendering complex environments (interiors, exteriors) and conducting emissive lighting tests. Unlike a standard renderer, this engine functions as a data generator.</p>

    <p><strong>The Research:</strong><br>
    The core innovation is the implementation of a <strong>Toroidal Scanner</strong>. A torus is placed centrally in the scene to cast rays using varied sampling strategies, generating a high-fidelity point cloud of the environment. This data, paired with captured imagery, creates a dataset to train a <strong>Gaussian Splatting</strong> model.</p>
    
    <p><strong>The Objective:</strong><br>
    The goal is to evaluate if toroidal sampling provides sufficient quality for scene reconstruction. Success in this area opens the door to a novel compression technique: "unrolling" the 3D data from the torus surface into a 2D texture, allowing standard image algorithms (like JPG) to drastically reduce the memory footprint of Gaussian Splats.</p>

    <ul>
      <li><strong>Stack:</strong> C++, Vulkan Ray Tracing, Python (for GS Model training).</li>
      <li><strong>Key Features:</strong> Custom Ray Generation Shaders, Point Cloud Export, Emissive Light Testing.</li>
    </ul>
  </div>
</div>

<h4 style="border-bottom: 1px solid #333; padding-bottom: 10px;">Engine Showcase</h4>

<div class="video-container" style="margin-bottom: 20px;">
  <div class="video-item">
    <video width="100%" controls style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
      <source src="/assets/videos/Vulkan_vid1.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
  <div class="video-item" style="flex: 1 1 30%;">
    <img src="/assets/images/Vulkan_wall.png" alt="Original Scene Render" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>
</div>

### 

<div class="video-container">
  <div class="video-item" style="flex: 1 1 30%;">
    <p><strong>Original Scene</strong></p>
    <img src="/assets/images/Vulkan_full.png" alt="Original Scene Render" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>
  <div class="video-item" style="flex: 1 1 30%;">
    <p><strong>Generated Point Cloud</strong></p>
    <img src="/assets/images/Vulkan_point.png" alt="Generated Point Cloud" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>
  <div class="video-item" style="flex: 1 1 30%;">
    <p><strong>Toroidal view</strong></p>
    <img src="/assets/images/Vulkan_tor.png" alt="Generated Point Cloud" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>
  <div class="video-item" style="flex: 1 1 30%;">
    <p><strong>Gaussian Splatting</strong></p>
    <img src="/assets/images/Vulkan_gs.png" alt="Gaussian Splatting Result" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>
</div>

## 4. OpenGL Desktop vs. Safety Critical (SC)

<div class="project-card">
  <div class="project-image">
    <img src="/assets/images/menger_world.png" alt="Menger Sponge Fractal">
  </div>

  <div class="project-info">
    <p><em>A comparative analysis of standard rendering pipelines versus deterministic, certifiable embedded graphics.</em></p>
    
    <p><strong>The Objective:</strong><br>
    In safety-critical domains (Avionics, Automotive), unpredictability is unacceptable. This research project analyzed the trade-offs between the flexible <strong>OpenGL Desktop</strong> API and the restrictive <strong>OpenGL SC 2.0</strong> (Safety Critical) subset. The goal was to quantify the impact of removing non-deterministic features—such as runtime shader compilation and dynamic memory allocation—on rendering stability.</p>

    <p><strong>The Methodology:</strong><br>
    I developed a dual-pipeline engine (using C++ and simulated SC via OpenGL ES 2.0) to benchmark three distinct scenarios:
    1. <strong>Stress Testing:</strong> Comparing Instanced Rendering vs. Single Draw Calls (1M+ cubes).
    2. <strong>Compute Emulation:</strong> Porting native Compute Shaders to Fragment Shaders for SC compliance.
    3. <strong>Lighting Stability:</strong> analyzing shadow precision and shader complexity limits.</p>

    <ul>
      <li><strong>Stack:</strong> C++, OpenGL Core Profile, OpenGL ES 2.0 (SC Simulation), Python (Data Analysis).</li>
      <li><strong>Key Finding:</strong> While Desktop OpenGL achieved higher raw throughput, the SC implementation demonstrated significantly lower <strong>Worst Case Execution Time (WCET)</strong> variance, proving its necessity for real-time guarantees.</li>
    </ul>
    
    </div>
</div>

<h4 style="border-bottom: 1px solid #333; padding-bottom: 10px;">Experimental Results</h4>

<div class="video-container">
  
  <div class="video-item" style="flex: 1 1 45%;">
    <p><strong>Stress Test: World of Cubes</strong></p>
    <img src="/assets/images/cubes.png" alt="Instance Rendering Stress Test" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>

  <div class="video-item" style="flex: 1 1 45%;">
    <p><strong>Performance Analysis</strong></p>
    <img src="/assets/images/cubes_10k_ES.png" alt="Frame Timing Analysis Graph" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>

  <p><strong>Lighting & Shadow Artifacts</strong></p>

  <div class="video-item" style="flex: 1 1 45%;">
    <img src="/assets/images/Model_DS.png" alt="Menger Sponge Detail" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>

  <div class="video-item" style="flex: 1 1 45%;">
    <img src="/assets/images/ThirdScene.png" alt="Shadow Precision Comparison" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>

</div>

<hr>