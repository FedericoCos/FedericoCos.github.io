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
  /* 1. LAYOUT OVERRIDES */
  #main .page__inner-wrap {
    max-width: 100% !important;
    width: 100% !important;
    margin-right: 0 !important;
    padding-right: 2rem; 
  }

  /* 2. CATEGORY HEADERS (The big sections) */
  .category-header {
    margin-top: 5rem !important; /* Huge gap above new sections */
    margin-bottom: 2rem !important;
    border-bottom: 3px solid #555; /* Solid underline */
    padding-bottom: 10px;
    font-size: 2.2em;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #fff; /* Ensure bright contrast */
  }

  /* 3. PROJECT CARD STYLING */
  .project-card {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-bottom: 1.5rem; /* Reduced bottom margin so Media Showcase sits closer */
    align-items: flex-start;
  }
  .project-image {
    flex: 1 1 400px;
  }
  .project-image img {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    width: 100%;
    border: 1px solid #333; /* Subtle border for definition */
  }
  .project-info {
    flex: 1 1 300px;
  }
  .project-info h3 {
    margin-top: 0;
  }

  /* 4. MEDIA SECTION STYLING */
  .media-header {
    border-bottom: 1px solid #444; 
    padding-bottom: 5px; 
    margin-top: 0; 
    margin-bottom: 15px; 
    color: #aaa; /* Slightly dimmer than main text */
    font-size: 1.1em;
  }
  .video-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 0;
  }
  .video-item {
    flex: 1 1 45%;
    min-width: 300px;
  }
  
  /* 5. SEPARATION BETWEEN PROJECTS */
  .project-divider {
    border: 0;
    height: 1px;
    /* Fading gradient line */
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
    margin: 4rem 0; /* Large breathing room */
  }
</style>

<h1 class="category-header" style="margin-top: 0 !important;">Game Development</h1>

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

<h4 class="media-header">Media Showcase</h4>
<div class="video-container">
  <div class="video-item">
    <p><strong>Trailer</strong></p>
    {% include video id="NQ8VkvjYgpw" provider="youtube" %}
  </div>
  <div class="video-item">
    <p><strong>Gameplay Walkthrough</strong></p>
    {% include video id="S7PVqLQhDXk" provider="youtube" %}
  </div>
</div>

<div class="project-divider"></div>


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

<h4 class="media-header">Engine Showcase</h4>
<div class="video-container">
  <div class="video-item">
    <p><strong>Gameplay Demo</strong></p>
    <video width="100%" controls style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
      <source src="/assets/videos/CG_video.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</div>


<h1 class="category-header">Engine Development</h1>

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

<h4 class="media-header">Engine Showcase</h4>
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

<div class="project-divider"></div>


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

<h4 class="media-header">Experimental Results</h4>
<div class="video-container">
  
  <div class="video-item" style="flex: 1 1 45%;">
    <p><strong>Stress Test: World of Cubes</strong></p>
    <img src="/assets/images/cubes.png" alt="Instance Rendering Stress Test" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>

  <div class="video-item" style="flex: 1 1 45%;">
    <p><strong>Performance Analysis</strong></p>
    <img src="/assets/images/cubes_10k_ES.png" alt="Frame Timing Analysis Graph" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>
</div>

<div class="video-container" style="margin-top: 1rem;">
  <div class="video-item" style="flex: 1 1 45%;">
    <img src="/assets/images/Model_DS.png" alt="Menger Sponge Detail" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>

  <div class="video-item" style="flex: 1 1 45%;">
    <img src="/assets/images/ThirdScene.png" alt="Shadow Precision Comparison" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 100%;">
  </div>
</div>


<h1 class="category-header">Small Personal Projects</h1>

## 5. Interactive Sudoku Visualizer

<div class="project-card">
  <div class="project-image">
    <img src="/assets/images/Sudoku.png" alt="Sudoku Pygame Interface">
  </div>

  <div class="project-info">
    <p><em>A Python application that visualizes the Backtracking algorithm in real-time using Pygame.</em></p>
    
    <p><strong>The Concept:</strong><br>
    Built using the <strong>Pygame</strong> engine, this tool allows users to manually input Sudoku puzzles via an interactive grid. The core feature is the <strong>Algorithm Visualization</strong>: upon triggering the solver, the application renders the recursive <strong>Backtracking</strong> process step-by-step. It demonstrates how the algorithm explores the state space, places tentative numbers, and "backtracks" when constraints are violated.</p>

    <ul>
      <li><strong>Stack:</strong> Python 3, Pygame.</li>
      <li><strong>Key Algorithms:</strong> Recursive Backtracking with Step-Delay (for visualization), Real-time Constraint Checking.</li>
    </ul>
  </div>
</div>

<h4 class="media-header">Algorithm Demo</h4>
<div class="video-container">
  <div style="width: 100%; max-width: 800px;">
    <video width="100%" controls style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
      <source src="/assets/videos/Sudoku.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</div>

<div class="project-divider"></div>


## 6. 2D Metaballs & Marching Squares

<div class="project-card">
  <div class="project-image">
    <img src="/assets/images/metaballs.png" alt="Metaballs Simulation">
  </div>

  <div class="project-info">
    <p><em>A high-performance simulation of organic isosurfaces using vectorized field calculations.</em></p>
    
    <p><strong>The Concept:</strong><br>
    This project renders "Metaballs"—organic-looking blobs that merge smoothly when close to each other. It works by generating a scalar field based on the inverse-square law of the moving particles. To visualize the field in real-time, I implemented the <strong>Marching Squares</strong> algorithm, which reconstructs the contour geometry (isolines) from the underlying grid values.</p>

    <p><strong>The Optimization:</strong><br>
    Calculating distances for every pixel in a 1280x720 grid is computationally expensive in Python. I utilized <strong>NumPy vectorization</strong> and array broadcasting to process the entire scalar field matrix in parallel, achieving real-time framerates.</p>

    <ul>
      <li><strong>Stack:</strong> Python 3, Pygame, NumPy.</li>
      <li><strong>Key Algorithms:</strong> Marching Squares, Scalar Field Generation.</li>
    </ul>
  </div>
</div>

<h4 class="media-header">Simulation Demo</h4>
<div class="video-container">
  <div style="width: 100%; max-width: 800px;">
    <p><strong>Real-Time Contouring</strong></p>
    <video width="100%" controls style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
      <source src="/assets/videos/metaballs.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</div>

<hr style="margin-top: 4rem;">