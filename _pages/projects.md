---
title: "Projects"
permalink: /projects/
layout: single
author_profile: true
toc: true
toc_label: "My Portfolio"
toc_icon: "gamepad"

# -----------------------
# PROJECT 1 DATA
# -----------------------
project_vulkan:
  - image_path: "https://placehold.co/600x400/101010/white?text=Vulkan+Engine" # Placeholder image
    alt: "Vulkan Engine"
    title: "Custom C++ Vulkan Engine"
    excerpt: "A high-performance rendering engine built from scratch using **C++** and **Vulkan**. Features include Deferred Rendering, PBR (Physically Based Rendering), and cascaded shadow maps."
    url: "https://github.com/federicocos/YOUR-REPO-NAME"
    btn_label: "View Source Code"
    btn_class: "btn--inverse"

# -----------------------
# PROJECT 2 DATA
# -----------------------
project_raytracer:
  - image_path: "https://placehold.co/600x400/202020/white?text=Ray+Tracer" # Placeholder image
    alt: "Ray Tracer"
    title: "Real-Time Ray Tracer"
    excerpt: "Implemented in **CUDA** to explore global illumination techniques. Includes support for reflection, refraction, and soft shadows."
    url: "https://youtube.com/..."
    btn_label: "Watch Demo"
    btn_class: "btn--primary"
---

## Graphics Engineering
Here you can find a selection of my work in computer graphics, focusing on real-time rendering and engine architecture.

---

### 1. Custom Game Engine
{% include feature_row id="project_vulkan" type="left" %}

**Tech Stack:** C++17, Vulkan SDK, GLSL, CMake.

**Key Challenges Solved:**
* Implemented a custom memory allocator to reduce fragmentation.
* Designed a multi-threaded command buffer generation system.
* Wrote a shader reflection system to automate descriptor set layout creation.

---

### 2. Path Tracing Experiments
{% include feature_row id="project_raytracer" type="right" %}

**Tech Stack:** C++, CUDA, OptiX.

**Key Challenges Solved:**
* Optimized BVH traversal for GPU execution.
* Implemented importance sampling to reduce noise in fewer samples.