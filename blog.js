document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('blackboard');
    const overlay = document.getElementById('board-overlay');
    let isDragging = false;
    let currentlyZoomed = null;

    async function initBlog() {
        try {
            const response = await fetch('blog-posts.json');
            const posts = await response.json();
            posts.forEach(post => createPostIt(post));
        } catch (err) {
            console.error("Error loading blog JSON:", err);
        }
    }

    function createPostIt(data) {
        const postIt = document.createElement('div');
        postIt.className = 'post-it';
        postIt.dataset.origRotation = data.rotation;

        const imgHtml = data.image ? `<img src="${data.image}" alt="${data.title}">` : '';

        postIt.innerHTML = `
            ${imgHtml}
            <h3>${data.title}</h3>
            <p>${data.content}</p>
            <div class="tech-stack">
                ${data.keywords.map(keyword => `<span class="tech-tag">${keyword}</span>`).join('')}
            </div>
        `;

        postIt.addEventListener('click', () => {
            if (!isDragging) toggleZoom(postIt);
        });

        makeDraggable(postIt);
        board.appendChild(postIt);

        // Clamps the post-it position within the board's visible area with an internal padding
        setTimeout(() => {
            const padding = 15;
            const bW = board.offsetWidth;
            const bH = board.offsetHeight;
            const pW = postIt.offsetWidth;
            const pH = postIt.offsetHeight;

            // Check original data against current board dimensions to prevent off-screen placement
            let startX = Math.max(padding, Math.min(data.x, bW - pW - padding));
            let startY = Math.max(padding, Math.min(data.y, bH - pH - padding));

            postIt.dataset.origLeft = startX;
            postIt.dataset.origTop = startY;
            
            postIt.style.left = `${startX}px`;
            postIt.style.top = `${startY}px`;
            postIt.style.transform = `rotate(${data.rotation}deg)`;
        }, 0);
    }

    window.addEventListener('resize', () => {
        const postIts = document.querySelectorAll('.post-it');
        const padding = 15;
        const bW = board.offsetWidth;
        const bH = board.offsetHeight;

        postIts.forEach(el => {
            if (el.classList.contains('zoomed')) return;
            
            const pW = el.offsetWidth;
            const pH = el.offsetHeight;
            
            let newLeft = Math.max(padding, Math.min(parseInt(el.style.left), bW - pW - padding));
            let newTop = Math.max(padding, Math.min(parseInt(el.style.top), bH - pH - padding));

            el.style.left = `${newLeft}px`;
            el.style.top = `${newTop}px`;
            el.dataset.origLeft = newLeft;
            el.dataset.origTop = newTop;
        });
    });

    function toggleZoom(el) {
        if (currentlyZoomed === el) {
            unzoom();
        } else {
            if (currentlyZoomed) unzoom();
            
            const rect = el.getBoundingClientRect();
            el.style.top = rect.top + 'px';
            el.style.left = rect.left + 'px';
            el.style.position = 'fixed';

            el.offsetHeight; 

            const viewCenterX = window.innerWidth / 2;
            const viewCenterY = window.innerHeight / 2;
            const elCenterX = rect.left + rect.width / 2;
            const elCenterY = rect.top + rect.height / 2;

            const diffX = (viewCenterX - elCenterX);
            const diffY = (viewCenterY - elCenterY);

            document.body.classList.add('no-scroll');
            el.classList.add('zoomed');
            overlay.classList.add('active');
            
            const scale = window.innerWidth <= 768 ? 1.2 : 1.5;
            el.style.transform = `translate(${diffX}px, ${diffY}px) scale(${scale}) rotate(0deg)`;
            currentlyZoomed = el;
        }
    }

    function unzoom() {
        if (!currentlyZoomed) return;
        
        const rot = currentlyZoomed.dataset.origRotation;
        const origLeft = currentlyZoomed.dataset.origLeft;
        const origTop = currentlyZoomed.dataset.origTop;

        currentlyZoomed.style.transform = `translate(0, 0) rotate(${rot}deg) scale(1)`;
        
        const target = currentlyZoomed;
        // Wait exactly for the 0.6s transition defined in CSS to finish
        setTimeout(() => {
            if (!target.classList.contains('zoomed')) {
                target.style.position = 'absolute';
                target.style.left = origLeft + 'px';
                target.style.top = origTop + 'px';
                // Re-enable scrolling only after the animation is complete
                document.body.classList.remove('no-scroll');
            }
        }, 600);

        currentlyZoomed.classList.remove('zoomed');
        overlay.classList.remove('active');
        currentlyZoomed = null;
    }

    overlay.addEventListener('click', unzoom);

    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let dragThreshold = 5;
        let moveX = 0, moveY = 0;

        const onStart = (e) => {
            if (el.classList.contains('zoomed')) return;
            isDragging = false;
            moveX = 0; 
            moveY = 0;
            
            const all = document.querySelectorAll('.post-it');
            all.forEach(p => p.style.zIndex = 10);
            el.style.zIndex = 100;

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            pos3 = clientX;
            pos4 = clientY;

            if (e.type === 'touchstart') {
                document.body.classList.add('no-scroll');
            }
            
            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchend', onEnd);
        };

        const onMove = (e) => {
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;
            moveX += Math.abs(pos1);
            moveY += Math.abs(pos2);
            
            if (moveX > dragThreshold || moveY > dragThreshold) isDragging = true;

            if (isDragging) {
                if (e.type.includes('touch')) e.preventDefault();
                el.style.transition = 'none';
                let newTop = el.offsetTop - pos2;
                let newLeft = el.offsetLeft - pos1;
                
                const padding = 15;
                const bW = board.offsetWidth, bH = board.offsetHeight;
                const eW = el.offsetWidth, eH = el.offsetHeight;

                if (newTop < padding) newTop = padding;
                if (newLeft < padding) newLeft = padding;
                if (newTop + eH > bH - padding) newTop = bH - eH - padding;
                if (newLeft + eW > bW - padding) newLeft = bW - eW - padding;

                el.style.top = newTop + "px";
                el.style.left = newLeft + "px";
            }
        };

        const onEnd = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchend', onEnd);

            if (!currentlyZoomed) {
                document.body.classList.remove('no-scroll');
            }

            el.dataset.origLeft = parseInt(el.style.left);
            el.dataset.origTop = parseInt(el.style.top);
            setTimeout(() => { isDragging = false; }, 50);
        };

        el.addEventListener('mousedown', onStart);
        el.addEventListener('touchstart', onStart, { passive: true });

        el.addEventListener('mouseup', () => {
            el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';
        });
        el.addEventListener('touchend', () => {
            el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';
        });
    }

    initBlog();
});