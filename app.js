function escapeHTML(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/*
 * Inline text formatting:
 *   **bold**   -> <strong>
 *   $latex$    -> inline math (typeset by KaTeX after render)
 *   \$         -> literal dollar sign
 * Math is stashed before the bold pass so characters like * or _ inside
 * a formula are never touched.
 */
function formatInlineText(text) {
    if (!text) return '';
    const stash = [];

    let out = text.replace(/\\\$/g, '\u0001');

    // Opening $ must not be followed by whitespace, closing $ must not be
    // preceded by whitespace or followed by a digit (so "$5 and $10" stays text).
    out = out.replace(/\$(?!\s)([^$\n]*?[^\s$\\])\$(?!\d)/g, (_, tex) => {
        stash.push(`<span class="math-inline" data-tex="${escapeHTML(tex)}">$${escapeHTML(tex)}$</span>`);
        return `\u0000${stash.length - 1}\u0000`;
    });

    out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[Number(i)]);
    return out.replace(/\u0001/g, '$');
}

const KATEX_VERSION = '0.16.11';
let katexPromise = null;

function loadKaTeX() {
    if (window.katex) return Promise.resolve(window.katex);
    if (katexPromise) return katexPromise;
    katexPromise = new Promise((resolve, reject) => {
        const base = `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/`;
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = base + 'katex.min.css';
        document.head.appendChild(css);

        const script = document.createElement('script');
        script.src = base + 'katex.min.js';
        script.onload = () => resolve(window.katex);
        script.onerror = () => {
            katexPromise = null;
            reject(new Error('Failed to load KaTeX'));
        };
        document.head.appendChild(script);
    });
    return katexPromise;
}

// Typesets every not-yet-rendered [data-tex] element under root.
// KaTeX is only downloaded when a page actually contains math.
async function typesetMath(root = document) {
    const nodes = root.querySelectorAll('[data-tex]:not([data-math-done])');
    if (!nodes.length) return;
    try {
        const katex = await loadKaTeX();
        nodes.forEach(el => {
            try {
                katex.render(el.dataset.tex, el, {
                    displayMode: el.classList.contains('math-block'),
                    throwOnError: false
                });
                el.dataset.mathDone = '1';
            } catch (err) {
                console.error('KaTeX render error:', err);
            }
        });
    } catch (err) {
        console.error(err);
    }
}

async function fetchSiteContent() {
    const cached = sessionStorage.getItem('fc_site_content_preview');
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch (e) {}
    }
    const response = await fetch('data/content.json', { cache: 'no-store' });
    return await response.json();
}

function renderIndexPage(data) {
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid && Array.isArray(data.projects)) {
        projectsGrid.innerHTML = data.projects.map(proj => `
            <a href="project.html?id=${encodeURIComponent(proj.id)}" class="entry-card">
                ${proj.image ? `
                <div class="card-thumb-wrap">
                    <img src="${proj.image}" alt="${proj.title}" class="card-thumb" loading="lazy">
                </div>` : ''}
                <div class="card-body">
                    <h3 class="card-title">${proj.title}</h3>
                    <p class="card-summary">${formatInlineText(proj.summary)}</p>
                    <div class="tag-list">
                        ${(proj.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                </div>
            </a>
        `).join('');
    }

    const articlesSection = document.getElementById('articles');
    const navArticles = document.getElementById('nav-articles');
    const articlesGrid = document.getElementById('articles-grid');

    if (Array.isArray(data.articles) && data.articles.length > 0) {
        if (articlesSection) articlesSection.classList.remove('hidden');
        if (navArticles) navArticles.classList.remove('hidden');
        if (articlesGrid) {
            articlesGrid.innerHTML = data.articles.map(art => `
                <a href="article.html?id=${encodeURIComponent(art.id)}" class="entry-card">
                    <div class="card-body">
                        <span class="card-meta">${art.date || ''}</span>
                        <h3 class="card-title">${art.title}</h3>
                        <p class="card-summary">${formatInlineText(art.summary)}</p>
                        <div class="tag-list">
                            ${(art.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
                        </div>
                    </div>
                </a>
            `).join('');
        }
    } else {
        if (articlesSection) articlesSection.classList.add('hidden');
        if (navArticles) navArticles.classList.add('hidden');
    }

    const timelineList = document.getElementById('timeline-list');
    if (timelineList && Array.isArray(data.experience)) {
        timelineList.innerHTML = data.experience.map(item => `
            <div class="timeline-row">
                <span class="timeline-period">${item.period}</span>
                <div class="timeline-main">
                    <h3>${item.role}</h3>
                    <div class="timeline-org">${item.organization}</div>
                    <p class="timeline-desc">${formatInlineText(item.description)}</p>
                </div>
                <span class="timeline-badge">${item.category || 'Experience'}</span>
            </div>
        `).join('');
    }
}

function renderMediaElement(mediaType, src, altText) {
    if (mediaType === 'video') {
        return `<video autoplay loop muted playsinline><source src="${src}" type="video/mp4"></video>`;
    }
    return `<img src="${src}" alt="${altText || ''}" loading="lazy">`;
}

function renderBlocks(blocks) {
    if (!Array.isArray(blocks)) return '';
    return blocks.map((block, index) => {
        if (block.type === 'paragraph') {
            return `<p class="detail-paragraph">${formatInlineText(block.text)}</p>`;
        }
        if (block.type === 'split') {
            return `
                <div class="detail-split ${block.reverse ? 'reverse' : ''}">
                    <div class="split-text">
                        <p class="detail-paragraph">${formatInlineText(block.text)}</p>
                    </div>
                    <div class="split-media media-frame">
                        ${renderMediaElement(block.mediaType, block.src, block.caption)}
                        ${block.caption ? `<div class="media-caption">${block.caption}</div>` : ''}
                    </div>
                </div>
            `;
        }
        if (block.type === 'gallery') {
            const itemsHtml = (block.items || []).map(item => `
                <div class="media-frame">
                    ${renderMediaElement(item.mediaType, item.src, item.caption)}
                    ${item.caption ? `<div class="media-caption">${item.caption}</div>` : ''}
                </div>
            `).join('');
            return `<div class="detail-gallery">${itemsHtml}</div>`;
        }
        if (block.type === 'code') {
            const escaped = (block.code || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<pre class="code-block"><code>${escaped}</code></pre>`;
        }
        if (block.type === 'formula') {
            if (!block.latex || !block.latex.trim()) return '';
            return `
                <div class="formula-callout">
                    ${block.label ? `<div class="formula-label">${formatInlineText(block.label)}</div>` : ''}
                    <div class="formula-body math-block" data-tex="${escapeHTML(block.latex)}">$$${escapeHTML(block.latex)}$$</div>
                    ${block.text ? `<p class="formula-note">${formatInlineText(block.text)}</p>` : ''}
                </div>
            `;
        }
        if (block.type === 'webgl') {
            return `
                <div class="webgl-card">
                    <canvas id="webgl-canvas-${index}" class="webgl-canvas" width="860" height="420"></canvas>
                    <div class="webgl-toolbar">
                        <span class="media-caption" style="border:none;padding:0;">${block.caption || 'Interactive WebGL Viewport'}</span>
                        <div class="webgl-controls">
                            <button class="btn btn-secondary btn-xs" id="webgl-toggle-${index}">Pause</button>
                            <button class="btn btn-secondary btn-xs" id="webgl-reset-${index}">Reset Time</button>
                        </div>
                    </div>
                </div>
            `;
        }
        return '';
    }).join('');
}

function mountWebGLBlocks(blocks) {
    if (!Array.isArray(blocks)) return;
    blocks.forEach((block, index) => {
        if (block.type !== 'webgl') return;
        const canvas = document.getElementById(`webgl-canvas-${index}`);
        if (!canvas) return;
        initWebGLRunner(canvas, block, index);
    });
}

function initWebGLRunner(canvas, block, index) {
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const isWebGL2Context = (typeof WebGL2RenderingContext !== 'undefined') && (gl instanceof WebGL2RenderingContext);

    const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (block.mode === 'script') {
        try {
            const runner = new Function('canvas', 'gl', block.code);
            runner(canvas, gl);
        } catch (err) {
            console.error(err);
        }
        return;
    }

    const defaultFs = `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform float u_time;
        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0.0, 2.0, 4.0));
            gl_FragColor = vec4(col, 1.0);
        }
    `;

    // Normalize non-breaking spaces (\u00a0), remove zero-width characters, and trim leading whitespace
    const sanitizeGLSL = (src) => src
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\u00A0/g, ' ')
        .trimStart();

    const fsSource = (block.code && block.code.trim()) ? sanitizeGLSL(block.code) : defaultFs.trimStart();
    const isES300 = fsSource.startsWith('#version 300 es');

    if (isES300 && !isWebGL2Context) {
        console.error('This shader requires WebGL 2 (#version 300 es), which is not supported by this browser.');
        return;
    }

    const vsSource = isES300
        ? `#version 300 es
in vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}`
        : `attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const compileShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return;
    }

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_position');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    let mouseX = 0;
    let mouseY = 0;
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        mouseX = (e.clientX - rect.left) * dpr;
        mouseY = (rect.height - (e.clientY - rect.top)) * dpr;
    });

    let running = true;
    let startOffset = performance.now();
    let elapsedBeforePause = 0;

    const toggleBtn = document.getElementById(`webgl-toggle-${index}`);
    const resetBtn = document.getElementById(`webgl-reset-${index}`);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (running) {
                elapsedBeforePause += performance.now() - startOffset;
                running = false;
                toggleBtn.textContent = 'Play';
            } else {
                startOffset = performance.now();
                running = true;
                toggleBtn.textContent = 'Pause';
                requestAnimationFrame(renderLoop);
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            startOffset = performance.now();
            elapsedBeforePause = 0;
        });
    }

    function renderLoop(now) {
        if (!running) return;
        const totalSeconds = (elapsedBeforePause + (now - startOffset)) * 0.001;

        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        if (resLoc) gl.uniform2f(resLoc, canvas.width, canvas.height);
        if (timeLoc) gl.uniform1f(timeLoc, totalSeconds);
        if (mouseLoc) gl.uniform2f(mouseLoc, mouseX, mouseY);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
}

function renderProjectDetailPage(data) {
    const root = document.getElementById('project-root');
    if (!root) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const project = (data.projects || []).find(p => p.id === id);

    if (!project) {
        root.innerHTML = `<p class="detail-paragraph">Project not found.</p>`;
        return;
    }

    document.title = `${project.title} — Federico Costantini`;
    root.innerHTML = `
        <header class="detail-header">
            <div class="detail-top-bar">
                <h1 class="detail-title">${project.title}</h1>
                ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener" class="btn btn-primary">${project.linkText || 'View Project'}</a>` : ''}
            </div>
            <div class="tag-list">
                ${(project.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
        </header>
        <div class="detail-body">
            ${renderBlocks(project.blocks)}
        </div>
    `;
    mountWebGLBlocks(project.blocks);
}

function renderArticleDetailPage(data) {
    const root = document.getElementById('article-root');
    if (!root) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const article = (data.articles || []).find(a => a.id === id);

    if (!article) {
        root.innerHTML = `<p class="detail-paragraph">Article not found.</p>`;
        return;
    }

    document.title = `${article.title} — Federico Costantini`;
    root.innerHTML = `
        <header class="detail-header">
            <span class="card-meta">${article.date || ''}</span>
            <div class="detail-top-bar">
                <h1 class="detail-title">${article.title}</h1>
            </div>
            <div class="tag-list">
                ${(article.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
        </header>
        <div class="detail-body">
            ${renderBlocks(article.blocks)}
        </div>
    `;
    mountWebGLBlocks(article.blocks);
}

document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('projects-grid') || document.getElementById('project-root') || document.getElementById('article-root')) {
        try {
            const data = await fetchSiteContent();
            if (document.getElementById('projects-grid')) renderIndexPage(data);
            if (document.getElementById('project-root')) renderProjectDetailPage(data);
            if (document.getElementById('article-root')) renderArticleDetailPage(data);
            typesetMath(document);
        } catch (err) {
            console.error(err);
        }
    }
});