let siteData = { projects: [], articles: [], experience: [] };
let activeProjectIndex = 0;
let activeArticleIndex = 0;
let activeExpIndex = 0;

function updateStatus(text, isHighlight) {
    const statusEl = document.getElementById('admin-status');
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.style.borderColor = isHighlight ? 'var(--accent)' : 'var(--border-subtle)';
    statusEl.style.color = isHighlight ? 'var(--text-primary)' : 'var(--text-secondary)';
}

let contentFileHandle = null;

async function syncSessionPreview(writeToDisk = false) {
    const jsonString = JSON.stringify(siteData, null, 4);
    sessionStorage.setItem('fc_site_content_preview', jsonString);

    if (!writeToDisk) return;

    // 1. Try local dev server endpoint first (zero prompts if running server.py / server.js)
    try {
        const res = await fetch('/api/save-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonString
        });
        if (res.ok) {
            updateStatus('Saved to data/content.json', true);
            return;
        }
    } catch (_) {
        // No local API endpoint active; fall back to File System Access API
    }

    // 2. Fallback: Browser File System Access API (direct local disk write)
    if ('showSaveFilePicker' in window) {
        try {
            if (!contentFileHandle) {
                contentFileHandle = await window.showSaveFilePicker({
                    suggestedName: 'content.json',
                    types: [{
                        description: 'JSON File',
                        accept: { 'application/json': ['.json'] }
                    }]
                });
            }
            const writable = await contentFileHandle.createWritable();
            await writable.write(jsonString);
            await writable.close();
            updateStatus('Saved to data/content.json', true);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Failed to write file:', err);
                updateStatus('Disk Write Failed (Saved in Session)', false);
            }
        }
    } else {
        updateStatus('Saved in Session (Browser lacks File System API)', true);
    }
}

const ORDER_CONFIG = {
    projects:   { listId: 'admin-project-list', getActive: () => activeProjectIndex, setActive: v => { activeProjectIndex = v; } },
    articles:   { listId: 'admin-article-list', getActive: () => activeArticleIndex, setActive: v => { activeArticleIndex = v; } },
    experience: { listId: 'admin-exp-list',     getActive: () => activeExpIndex,     setActive: v => { activeExpIndex = v; } }
};

function adminListItemHTML(key, idx, total, label, isActive, selectFn) {
    return `
        <div class="admin-list-item ${isActive ? 'active' : ''}" draggable="true" data-list="${key}" data-index="${idx}" onclick="${selectFn}(${idx})">
            <span class="admin-drag-handle" title="Drag to reorder">&#8942;&#8942;</span>
            <span class="admin-item-label">${escapeHTML(label)}</span>
            <span class="admin-order-btns">
                <button type="button" class="order-btn" title="Move up" ${idx === 0 ? 'disabled' : ''}
                    onclick="event.stopPropagation(); moveAdminItem('${key}', ${idx}, ${idx - 1})">&#9650;</button>
                <button type="button" class="order-btn" title="Move down" ${idx === total - 1 ? 'disabled' : ''}
                    onclick="event.stopPropagation(); moveAdminItem('${key}', ${idx}, ${idx + 2})">&#9660;</button>
            </span>
        </div>
    `;
}

function renderAdminSidebarLists() {
    const projList = document.getElementById('admin-project-list');
    if (projList) {
        const n = siteData.projects.length;
        projList.innerHTML = siteData.projects.map((p, idx) =>
            adminListItemHTML('projects', idx, n, p.title || 'Untitled Project', idx === activeProjectIndex, 'selectAdminProject')
        ).join('');
    }

    const artList = document.getElementById('admin-article-list');
    if (artList) {
        if (siteData.articles.length === 0) {
            artList.innerHTML = `<div class="card-meta">No articles (Section hidden on site)</div>`;
        } else {
            const n = siteData.articles.length;
            artList.innerHTML = siteData.articles.map((a, idx) =>
                adminListItemHTML('articles', idx, n, a.title || 'Untitled Article', idx === activeArticleIndex, 'selectAdminArticle')
            ).join('');
        }
    }

    const expList = document.getElementById('admin-exp-list');
    if (expList) {
        const n = siteData.experience.length;
        expList.innerHTML = siteData.experience.map((e, idx) =>
            adminListItemHTML('experience', idx, n, `${e.role || 'Untitled'} (${e.period || ''})`, idx === activeExpIndex, 'selectAdminExp')
        ).join('');
    }
}

// Moves the item at `from` so it ends up just before original index `insertPos`
// (insertPos === array length means "to the end"). The editor form is left
// untouched, so unsaved edits to the open item are not lost.
window.moveAdminItem = function(key, from, insertPos) {
    const arr = siteData[key];
    const cfg = ORDER_CONFIG[key];
    if (!Array.isArray(arr) || !cfg || from < 0 || from >= arr.length) return;

    insertPos = Math.max(0, Math.min(arr.length, insertPos));
    const to = insertPos > from ? insertPos - 1 : insertPos;
    if (to === from) return;

    const activeItem = arr[cfg.getActive()];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);

    const newActive = arr.indexOf(activeItem);
    cfg.setActive(newActive >= 0 ? newActive : 0);

    renderAdminSidebarLists();
    syncSessionPreview();
    updateStatus('Order updated (Apply or Publish to save)', true);
};

function initOrderDragAndDrop() {
    let drag = null;
    const ITEM = '.admin-list-item[data-index]';

    Object.entries(ORDER_CONFIG).forEach(([key, cfg]) => {
        const list = document.getElementById(cfg.listId);
        if (!list) return;

        const clearMarks = () => list.querySelectorAll('.dragging, .drop-before, .drop-after')
            .forEach(el => el.classList.remove('dragging', 'drop-before', 'drop-after'));

        const isAfter = (e, item) => {
            const rect = item.getBoundingClientRect();
            return e.clientY > rect.top + rect.height / 2;
        };

        list.addEventListener('dragstart', e => {
            const item = e.target.closest && e.target.closest(ITEM);
            if (!item) return;
            drag = { key, from: Number(item.dataset.index) };
            item.classList.add('dragging');
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(drag.from)); // required by Firefox
            }
        });

        list.addEventListener('dragover', e => {
            if (!drag || drag.key !== key) return;
            const item = e.target.closest(ITEM);
            if (!item) return;
            e.preventDefault();
            list.querySelectorAll('.drop-before, .drop-after')
                .forEach(el => el.classList.remove('drop-before', 'drop-after'));
            item.classList.add(isAfter(e, item) ? 'drop-after' : 'drop-before');
        });

        list.addEventListener('drop', e => {
            if (!drag || drag.key !== key) return;
            const item = e.target.closest(ITEM);
            if (!item) return;
            e.preventDefault();
            const insertPos = Number(item.dataset.index) + (isAfter(e, item) ? 1 : 0);
            const from = drag.from;
            drag = null;
            clearMarks();
            window.moveAdminItem(key, from, insertPos);
        });

        list.addEventListener('dragend', () => {
            drag = null;
            clearMarks();
        });
    });
}

function buildBlockEditorHTML(block, idx, prefix) {
    if (block.type === 'paragraph') {
        return `
            <div class="block-editor-card" data-block-index="${idx}" data-block-type="paragraph">
                <div class="block-card-top">
                    <span class="block-type-badge">Paragraph</span>
                    <button class="btn btn-danger btn-xs" onclick="removeBlock('${prefix}', ${idx})">Remove</button>
                </div>
                <textarea rows="3" class="form-input block-field-text" placeholder="Paragraph text... (use $x^2$ for inline math)">${escapeHTML(block.text)}</textarea>
            </div>
        `;
    }
    if (block.type === 'split') {
        return `
            <div class="block-editor-card" data-block-index="${idx}" data-block-type="split">
                <div class="block-card-top">
                    <span class="block-type-badge">Media + Text Split</span>
                    <button class="btn btn-danger btn-xs" onclick="removeBlock('${prefix}', ${idx})">Remove</button>
                </div>
                <div class="form-grid-3">
                    <div class="form-group">
                        <label>Media Type</label>
                        <select class="form-input block-field-mediatype">
                            <option value="video" ${block.mediaType === 'video' ? 'selected' : ''}>Video (MP4)</option>
                            <option value="image" ${block.mediaType === 'image' ? 'selected' : ''}>Image</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Media Source Path</label>
                        <input type="text" class="form-input block-field-src" value="${block.src || ''}">
                    </div>
                    <div class="form-group">
                        <label>Caption</label>
                        <input type="text" class="form-input block-field-caption" value="${block.caption || ''}">
                    </div>
                </div>
                <textarea rows="3" class="form-input block-field-text" placeholder="Accompanying text... (use $x^2$ for inline math)">${escapeHTML(block.text)}</textarea>
            </div>
        `;
    }
    if (block.type === 'gallery') {
        const serialized = (block.items || []).map(i => `${i.mediaType || 'image'}|${i.src || ''}|${i.caption || ''}`).join('\n');
        return `
            <div class="block-editor-card" data-block-index="${idx}" data-block-type="gallery">
                <div class="block-card-top">
                    <span class="block-type-badge">Gallery (One per line: image|path|caption)</span>
                    <button class="btn btn-danger btn-xs" onclick="removeBlock('${prefix}', ${idx})">Remove</button>
                </div>
                <textarea rows="4" class="form-input mono block-field-items">${serialized}</textarea>
            </div>
        `;
    }
    if (block.type === 'code') {
        return `
            <div class="block-editor-card" data-block-index="${idx}" data-block-type="code">
                <div class="block-card-top">
                    <span class="block-type-badge">Code Snippet</span>
                    <button class="btn btn-danger btn-xs" onclick="removeBlock('${prefix}', ${idx})">Remove</button>
                </div>
                <textarea rows="5" class="form-input mono block-field-code" placeholder="Source code...">${block.code || ''}</textarea>
            </div>
        `;
    }
    if (block.type === 'formula') {
        return `
            <div class="block-editor-card" data-block-index="${idx}" data-block-type="formula">
                <div class="block-card-top">
                    <span class="block-type-badge">Formula Callout (LaTeX)</span>
                    <button class="btn btn-danger btn-xs" onclick="removeBlock('${prefix}', ${idx})">Remove</button>
                </div>
                <div class="form-group">
                    <label>Label (optional)</label>
                    <input type="text" class="form-input block-field-label" placeholder="Rendering equation" value="${escapeHTML(block.label)}">
                </div>
                <div class="form-group">
                    <label>LaTeX</label>
                    <textarea rows="3" class="form-input mono block-field-latex" placeholder="L_o = L_e + \\int_{\\Omega} f_r \\, L_i \\, (\\omega_i \\cdot n) \\, d\\omega_i">${escapeHTML(block.latex)}</textarea>
                </div>
                <div class="form-group">
                    <label>Note below formula (optional, supports **bold** and $inline$ math)</label>
                    <textarea rows="2" class="form-input block-field-text">${escapeHTML(block.text)}</textarea>
                </div>
            </div>
        `;
    }
    if (block.type === 'webgl') {
        return `
            <div class="block-editor-card" data-block-index="${idx}" data-block-type="webgl">
                <div class="block-card-top">
                    <span class="block-type-badge">Interactive WebGL Canvas</span>
                    <button class="btn btn-danger btn-xs" onclick="removeBlock('${prefix}', ${idx})">Remove</button>
                </div>
                <div class="form-grid-2">
                    <div class="form-group">
                        <label>Execution Mode</label>
                        <select class="form-input block-field-mode">
                            <option value="shader" ${block.mode !== 'script' ? 'selected' : ''}>Fragment Shader (u_time, u_resolution, u_mouse)</option>
                            <option value="script" ${block.mode === 'script' ? 'selected' : ''}>Custom JS Function (canvas, gl)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Viewport Caption</label>
                        <input type="text" class="form-input block-field-caption" value="${block.caption || ''}">
                    </div>
                </div>
                <textarea rows="8" class="form-input mono block-field-code" placeholder="GLSL fragment shader or JS WebGL code...">${block.code || ''}</textarea>
            </div>
        `;
    }
    return '';
}

function collectBlocksFromDOM(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    const cards = container.querySelectorAll('.block-editor-card');
    const result = [];

    cards.forEach(card => {
        const type = card.dataset.blockType;
        if (type === 'paragraph') {
            result.push({
                type: 'paragraph',
                text: card.querySelector('.block-field-text').value
            });
        } else if (type === 'split') {
            result.push({
                type: 'split',
                mediaType: card.querySelector('.block-field-mediatype').value,
                src: card.querySelector('.block-field-src').value.trim(),
                caption: card.querySelector('.block-field-caption').value.trim(),
                text: card.querySelector('.block-field-text').value
            });
        } else if (type === 'gallery') {
            const lines = card.querySelector('.block-field-items').value.split('\n').filter(l => l.trim());
            const items = lines.map(line => {
                const parts = line.split('|');
                return {
                    mediaType: (parts[0] || 'image').trim(),
                    src: (parts[1] || '').trim(),
                    caption: (parts[2] || '').trim()
                };
            });
            result.push({ type: 'gallery', items });
        } else if (type === 'code') {
            result.push({
                type: 'code',
                code: card.querySelector('.block-field-code').value
            });
        } else if (type === 'formula') {
            result.push({
                type: 'formula',
                label: card.querySelector('.block-field-label').value.trim(),
                latex: card.querySelector('.block-field-latex').value,
                text: card.querySelector('.block-field-text').value
            });
        } else if (type === 'webgl') {
            result.push({
                type: 'webgl',
                mode: card.querySelector('.block-field-mode').value,
                caption: card.querySelector('.block-field-caption').value.trim(),
                code: card.querySelector('.block-field-code').value
            });
        }
    });
    return result;
}

function selectAdminProject(idx) {
    activeProjectIndex = idx;
    renderAdminSidebarLists();
    const p = siteData.projects[idx];
    if (!p) return;
    document.getElementById('proj-id').value = p.id || '';
    document.getElementById('proj-title').value = p.title || '';
    document.getElementById('proj-image').value = p.image || '';
    document.getElementById('proj-tags').value = (p.tags || []).join(', ');
    document.getElementById('proj-link').value = p.link || '';
    document.getElementById('proj-link-text').value = p.linkText || '';
    document.getElementById('proj-summary').value = p.summary || '';

    const container = document.getElementById('proj-blocks-container');
    container.innerHTML = (p.blocks || []).map((b, i) => buildBlockEditorHTML(b, i, 'proj')).join('');
}

function selectAdminArticle(idx) {
    activeArticleIndex = idx;
    renderAdminSidebarLists();
    const a = siteData.articles[idx];
    const container = document.getElementById('art-blocks-container');
    if (!a) {
        document.getElementById('art-id').value = '';
        document.getElementById('art-title').value = '';
        document.getElementById('art-date').value = '';
        document.getElementById('art-tags').value = '';
        document.getElementById('art-summary').value = '';
        if (container) container.innerHTML = '';
        return;
    }
    document.getElementById('art-id').value = a.id || '';
    document.getElementById('art-title').value = a.title || '';
    document.getElementById('art-date').value = a.date || '';
    document.getElementById('art-tags').value = (a.tags || []).join(', ');
    document.getElementById('art-summary').value = a.summary || '';
    container.innerHTML = (a.blocks || []).map((b, i) => buildBlockEditorHTML(b, i, 'art')).join('');
}

function selectAdminExp(idx) {
    activeExpIndex = idx;
    renderAdminSidebarLists();
    const e = siteData.experience[idx];
    if (!e) return;
    document.getElementById('exp-period').value = e.period || '';
    document.getElementById('exp-role').value = e.role || '';
    document.getElementById('exp-org').value = e.organization || '';
    document.getElementById('exp-category').value = e.category || 'Education';
    document.getElementById('exp-desc').value = e.description || '';
}

window.addProjectBlock = function(type) {
    const p = siteData.projects[activeProjectIndex];
    if (!p) return;
    p.blocks = collectBlocksFromDOM('proj-blocks-container');
    p.blocks.push({ type, text: '', items: [], mode: 'shader' });
    selectAdminProject(activeProjectIndex);
};

window.addArticleBlock = function(type) {
    const a = siteData.articles[activeArticleIndex];
    if (!a) return;
    a.blocks = collectBlocksFromDOM('art-blocks-container');
    a.blocks.push({ type, text: '', code: '', mode: 'shader' });
    selectAdminArticle(activeArticleIndex);
};

window.removeBlock = function(prefix, blockIdx) {
    if (prefix === 'proj') {
        const p = siteData.projects[activeProjectIndex];
        p.blocks = collectBlocksFromDOM('proj-blocks-container');
        p.blocks.splice(blockIdx, 1);
        selectAdminProject(activeProjectIndex);
    } else {
        const a = siteData.articles[activeArticleIndex];
        a.blocks = collectBlocksFromDOM('art-blocks-container');
        a.blocks.splice(blockIdx, 1);
        selectAdminArticle(activeArticleIndex);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    initOrderDragAndDrop();

    const savedToken = sessionStorage.getItem('fc_gh_pat');
    if (savedToken) {
        document.getElementById('gh-token').value = savedToken;
        updateStatus('Token Loaded in Session', true);
    }

    document.getElementById('gh-token').addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
            sessionStorage.setItem('fc_gh_pat', val);
            updateStatus('Token Ready', true);
        } else {
            sessionStorage.removeItem('fc_gh_pat');
            updateStatus('Unauthenticated', false);
        }
    });

    siteData = await fetchSiteContent();
    renderAdminSidebarLists();
    if (siteData.projects.length > 0) selectAdminProject(0);
    if (siteData.articles.length > 0) selectAdminArticle(0);
    if (siteData.experience.length > 0) selectAdminExp(0);

    document.getElementById('btn-save-project').addEventListener('click', async () => {
        const p = siteData.projects[activeProjectIndex];
        if (!p) return;
        p.id = document.getElementById('proj-id').value.trim();
        p.title = document.getElementById('proj-title').value.trim();
        p.image = document.getElementById('proj-image').value.trim();
        p.tags = document.getElementById('proj-tags').value.split(',').map(s => s.trim()).filter(Boolean);
        p.link = document.getElementById('proj-link').value.trim();
        p.linkText = document.getElementById('proj-link-text').value.trim();
        p.summary = document.getElementById('proj-summary').value.trim();
        p.blocks = collectBlocksFromDOM('proj-blocks-container');
        renderAdminSidebarLists();
        await syncSessionPreview(true);
    });

    document.getElementById('btn-new-project').addEventListener('click', () => {
        siteData.projects.unshift({
            id: 'new-project-' + Date.now(),
            title: 'New Project',
            image: '',
            tags: ['Vulkan', 'C++'],
            link: '',
            linkText: 'View Source',
            summary: 'Short technical overview of the project.',
            blocks: [{ type: 'paragraph', text: 'Detailed technical description.' }]
        });
        selectAdminProject(0);
        syncSessionPreview();
    });

    document.getElementById('btn-delete-project').addEventListener('click', () => {
        if (siteData.projects.length === 0) return;
        siteData.projects.splice(activeProjectIndex, 1);
        activeProjectIndex = Math.max(0, activeProjectIndex - 1);
        selectAdminProject(activeProjectIndex);
        syncSessionPreview();
        renderAdminSidebarLists();
    });

    document.getElementById('btn-save-article').addEventListener('click', async () => {
        const a = siteData.articles[activeArticleIndex];
        if (!a) return;
        a.id = document.getElementById('art-id').value.trim();
        a.title = document.getElementById('art-title').value.trim();
        a.date = document.getElementById('art-date').value.trim();
        a.tags = document.getElementById('art-tags').value.split(',').map(s => s.trim()).filter(Boolean);
        a.summary = document.getElementById('art-summary').value.trim();
        a.blocks = collectBlocksFromDOM('art-blocks-container');
        renderAdminSidebarLists();
        await syncSessionPreview(true);
    });

    document.getElementById('btn-new-article').addEventListener('click', () => {
        siteData.articles.unshift({
            id: 'article-' + Date.now(),
            title: 'New Technical Article',
            date: new Date().toISOString().slice(0, 10),
            tags: ['Graphics', 'WebGL'],
            summary: 'Concise summary of the article topic.',
            blocks: [{ type: 'paragraph', text: 'Introduction paragraph.' }]
        });
        selectAdminArticle(0);
        syncSessionPreview();
    });

    document.getElementById('btn-delete-article').addEventListener('click', () => {
        if (siteData.articles.length === 0) return;
        siteData.articles.splice(activeArticleIndex, 1);
        activeArticleIndex = Math.max(0, activeArticleIndex - 1);
        selectAdminArticle(activeArticleIndex);
        syncSessionPreview();
        renderAdminSidebarLists();
    });

    document.getElementById('btn-save-exp').addEventListener('click', async () => {
        const e = siteData.experience[activeExpIndex];
        if (!e) return;
        e.period = document.getElementById('exp-period').value.trim();
        e.role = document.getElementById('exp-role').value.trim();
        e.organization = document.getElementById('exp-org').value.trim();
        e.category = document.getElementById('exp-category').value;
        e.description = document.getElementById('exp-desc').value.trim();
        renderAdminSidebarLists();
        await syncSessionPreview(true);
    });

    document.getElementById('btn-new-exp').addEventListener('click', () => {
        siteData.experience.unshift({
            period: '2026 - Present',
            role: 'New Role',
            organization: 'Organization Name',
            category: 'Experience',
            description: 'Role responsibilities and achievements.'
        });
        selectAdminExp(0);
        syncSessionPreview();
    });

    document.getElementById('btn-delete-exp').addEventListener('click', () => {
        if (siteData.experience.length === 0) return;
        siteData.experience.splice(activeExpIndex, 1);
        activeExpIndex = Math.max(0, activeExpIndex - 1);
        selectAdminExp(activeExpIndex);
        syncSessionPreview();
        renderAdminSidebarLists();
    });

    document.getElementById('btn-download-json').addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(siteData, null, 4)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'content.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('btn-publish-github').addEventListener('click', async () => {
        const owner = document.getElementById('gh-owner').value.trim();
        const repo = document.getElementById('gh-repo').value.trim();
        const token = document.getElementById('gh-token').value.trim();
        const path = 'data/content.json';

        if (!token) {
            updateStatus('Missing GitHub Token', false);
            return;
        }

        try {
            updateStatus('Publishing to GitHub...', true);
            const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
            const getRes = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github+json'
                }
            });

            let sha = undefined;
            if (getRes.ok) {
                const existing = await getRes.json();
                sha = existing.sha;
            }

            const jsonString = JSON.stringify(siteData, null, 4);
            const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

            const putRes = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update portfolio content via Root Console',
                    content: base64Content,
                    sha: sha
                })
            });

            if (putRes.ok) {
                updateStatus('Committed to GitHub', true);
            } else {
                updateStatus('GitHub Commit Failed', false);
            }
        } catch (err) {
            console.error(err);
            updateStatus('Network Error', false);
        }
    });
});