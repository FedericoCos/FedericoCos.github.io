let isClicked = false;
let lastId = -1;
let moveDistance = 0;
let threshold_mov = 0.6;
let isGridLayout = false;

document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('carousel-wrapper');
    const inner = document.getElementById('projects-inner');
    const toggleBtn = document.getElementById('layout-toggle-btn');
    
    let scrollPos = 0;
    let isDragging = false;
    let isFreezed = false;
    let hasMoved = false;
    let startX;
    const speed = 1.5;
    const gap = 20;

    const originalCards = [...inner.children];

    originalCards.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone');
        inner.appendChild(clone);
    });

    const getCardWidth = () => {
        const card = inner.firstElementChild;
        return card ? card.offsetWidth + gap : 0;
    };

    const onStart = (e) => {
        if (isGridLayout) return;
        hasMoved = false;
        isDragging = true;
        isFreezed = true;
        moveDistance = 0;
        startX = e.pageX || e.touches[0].pageX;
        inner.style.transition = 'none';
    };

    const onMove = (e) => {
        if (!isDragging || isGridLayout) return;
        const x = e.pageX || e.touches[0].pageX;
        const currentMove = x - startX;
        startX = x;
        moveDistance += Math.abs(currentMove);
        if(moveDistance >= threshold_mov){
            hasMoved = true;
            if (e.cancelable) e.preventDefault();
        }
        scrollPos += currentMove;
        recycle();
    };

    const onEnd = () => {
        if (!isDragging || isGridLayout) return;
        isDragging = false;
        if (moveDistance > 5) {
            inner.style.pointerEvents = 'none';
            setTimeout(() => { inner.style.pointerEvents = 'auto'; }, 50);
        }
    };

    wrapper.addEventListener('mousedown', onStart);
    wrapper.addEventListener('touchstart', onStart, { passive: false });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });

    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);

    function recycle() {
        const cardWidth = getCardWidth();
        if (cardWidth === 0) return;

        if (scrollPos <= -cardWidth) {
            scrollPos += cardWidth;
            inner.appendChild(inner.firstElementChild);
        }
        
        if (scrollPos > 0) {
            const lastCard = inner.lastElementChild;
            scrollPos -= cardWidth;
            inner.insertBefore(lastCard, inner.firstElementChild);
        }
        
        inner.style.transform = `translateX(${scrollPos}px)`;
    }

    function animate() {
        if (!isGridLayout && !isDragging && !isFreezed && (!isClicked || hasMoved)) {
            scrollPos -= speed;
            recycle();
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('load', () => {
        animate();
    });

    toggleBtn.addEventListener('click', () => {
        const firstRects = originalCards.map(card => card.getBoundingClientRect());
        const firstWrapperHeight = wrapper.offsetHeight;

        isGridLayout = !isGridLayout;
        if (isGridLayout) {
            toggleBtn.innerText = 'Show Slider';
            wrapper.classList.add('grid-layout-wrapper');
            inner.classList.add('grid-layout');
            inner.style.transform = 'none';
            
            originalCards.forEach(card => inner.appendChild(card));
            const clones = Array.from(inner.children).filter(c => c.classList.contains('clone'));
            clones.forEach(clone => inner.appendChild(clone));
        } else {
            toggleBtn.innerText = 'Show Grid';
            wrapper.classList.remove('grid-layout-wrapper');
            inner.classList.remove('grid-layout');
            scrollPos = 0;
            inner.style.transform = `translateX(${scrollPos}px)`;
        }

        const lastWrapperHeight = wrapper.offsetHeight;

        wrapper.style.transition = 'none';
        wrapper.style.height = `${firstWrapperHeight}px`;

        originalCards.forEach((card, i) => {
            const lastRect = card.getBoundingClientRect();
            const deltaX = firstRects[i].left - lastRect.left;
            const deltaY = firstRects[i].top - lastRect.top;

            card.style.transition = 'none';
            card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                wrapper.style.transition = 'height 1.0s cubic-bezier(0.4, 0, 0.2, 1)';
                wrapper.style.height = `${lastWrapperHeight}px`;

                originalCards.forEach(card => {
                    card.style.transition = 'transform 1.0s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease';
                    card.style.transform = 'translate(0, 0)';
                });

                setTimeout(() => {
                    wrapper.style.height = 'auto';
                    originalCards.forEach(card => {
                        card.style.transform = '';
                    });
                }, 1000);
            });
        });
    });

    wrapper.addEventListener('mousedown', (e) => {
        if (isGridLayout) return;
        hasMoved = false;
        isDragging = true;
        isFreezed = true;
        moveDistance = 0;
        startX = e.pageX;
        inner.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging || isGridLayout) return;
        e.preventDefault();
        const x = e.pageX;
        const currentMove = x - startX;
        startX = x;
        moveDistance += Math.abs(currentMove - scrollPos);
        if(moveDistance >= threshold_mov){
            hasMoved = true;
        }
        scrollPos += currentMove;
        recycle();
    });

    wrapper.addEventListener('mouseover', (e) => {
        if (isGridLayout) return;
        isFreezed = true;
    });

    wrapper.addEventListener('mouseleave', (e) =>{
        if (isGridLayout) return;
        isFreezed = false;
        if(!isDragging){
            moveDistance = 0;
        }
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging || isGridLayout) return;
        isDragging = false;
        if (moveDistance > 5) {
            inner.style.pointerEvents = 'none';
            setTimeout(() => { inner.style.pointerEvents = 'auto'; }, 50);
        }
    });
});

function selectProject(id) {
    const allCards = document.querySelectorAll('.project-card');
    const allDetails = document.querySelectorAll('.project-detail-content');
    const container = document.getElementById('project-details');
    const projectsSection = document.getElementById('projects');
    const anchor = document.getElementById('scroll-anchor');

    allCards.forEach(card => card.classList.remove('is-selected'));
    allDetails.forEach(detail => detail.classList.remove('active'));
    container.classList.remove('visible');
    
    const isMobileQuery = window.matchMedia("(max-width: 768px)").matches;

    if ((isClicked && lastId === id && moveDistance < threshold_mov && !isGridLayout) || id == -1 || (isClicked && lastId === id && isGridLayout)) {
        isClicked = false;
        lastId = -1;
        
        if (isMobileQuery) {
            const header = projectsSection.querySelector('.projects-header');
            header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            const targetY = projectsSection.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
        return;
    }

    if(moveDistance >= threshold_mov && !isGridLayout){
        if(lastId >= 0){
            const lastImg = document.getElementById(`Project ${lastId}`);
            const lastCard = lastImg.closest('.project-card');
            const lastDetails = document.getElementById(`detail-${lastId}`);
            lastCard.classList.add('is-selected');
            lastDetails.classList.add('active');
            container.classList.add('visible');
        }
        return;
    }

    const clickedImg = document.getElementById(`Project ${id}`);
    const clickedCard = clickedImg.closest('.project-card');
    const targetDetail = document.getElementById(`detail-${id}`);

    if (targetDetail) {
        const lazyMedia = targetDetail.querySelectorAll('[data-src]');
        lazyMedia.forEach(media => {
            if (media.tagName === 'SOURCE') {
                const video = media.closest('video');
                media.src = media.dataset.src;
                video.load(); // Forces the video to start loading now
            } else {
                media.src = media.dataset.src;
            }
            media.removeAttribute('data-src'); // Clean up
        });
        isClicked = true;
        lastId = id;
        clickedCard.classList.add('is-selected');
        targetDetail.classList.add('active');
        container.classList.add('visible');
        
        const delay = isMobileQuery ? 10 : 120;
        
        setTimeout(() => {
            if (isMobileQuery) {
                anchor.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
            } else {
                const targetY = anchor.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ 
                    top: targetY, 
                    behavior: 'smooth' 
                });
            }
        }, delay);
    }
}