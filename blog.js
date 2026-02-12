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
        postIt.dataset.origLeft = data.x;
        postIt.dataset.origTop = data.y;
        
        postIt.style.left = `${data.x}px`;
        postIt.style.top = `${data.y}px`;
        postIt.style.transform = `rotate(${data.rotation}deg)`;

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
    }

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
            
            el.style.transform = `translate(${diffX}px, ${diffY}px) scale(1.5) rotate(0deg)`;
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

        el.onmousedown = (e) => {
            if (el.classList.contains('zoomed')) return;
            isDragging = false;
            moveX = 0; 
            moveY = 0;
            
            const all = document.querySelectorAll('.post-it');
            all.forEach(p => p.style.zIndex = 10);
            el.style.zIndex = 100;

            pos3 = e.clientX;
            pos4 = e.clientY;
            
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
                el.dataset.origLeft = parseInt(el.style.left);
                el.dataset.origTop = parseInt(el.style.top);
                setTimeout(() => { isDragging = false; }, 50);
            };

            document.onmousemove = (e) => {
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                moveX += Math.abs(pos1);
                moveY += Math.abs(pos2);
                
                if (moveX > dragThreshold || moveY > dragThreshold) isDragging = true;

                if (isDragging) {
                    el.style.transition = 'none';
                    let newTop = el.offsetTop - pos2;
                    let newLeft = el.offsetLeft - pos1;
                    
                    const bW = board.offsetWidth, bH = board.offsetHeight;
                    const eW = el.offsetWidth, eH = el.offsetHeight;

                    if (newTop < 0) newTop = 0;
                    if (newLeft < 0) newLeft = 0;
                    if (newTop + eH > bH) newTop = bH - eH;
                    if (newLeft + eW > bW) newLeft = bW - eW;

                    el.style.top = newTop + "px";
                    el.style.left = newLeft + "px";
                }
            };
        };

        el.addEventListener('mouseup', () => {
            el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';
        });
    }

    initBlog();
});