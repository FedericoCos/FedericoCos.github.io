let isClicked = false;
let lastId = -1;
let moveDistance = 0;
let threshold_mov = 0.6;

document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('carousel-wrapper');
    const inner = document.getElementById('projects-inner');
    
    let scrollPos = 0;
    let isDragging = false;
    let isFreezed = false;
    let hasMoved = false;
    let startX;
    const speed = 0.4;
    const gap = 20;

    const items = [...inner.children];
    items.forEach(item => {
        const clone = item.cloneNode(true);
        inner.appendChild(clone);
    });

    // Helper to get card width + gap
    const getCardWidth = () => {
        const card = inner.firstElementChild;
        return card ? card.offsetWidth + gap : 0;
    };

    function recycle() {
        const cardWidth = getCardWidth();
        if (cardWidth === 0) return;

        if (scrollPos <= -cardWidth) {
            scrollPos += cardWidth;
            inner.appendChild(inner.firstElementChild);
        }
        
        // Moving Right: If the scroll position goes positive
        if (scrollPos > 0) {
            const lastCard = inner.lastElementChild;
            scrollPos -= cardWidth;
            inner.insertBefore(lastCard, inner.firstElementChild);
        }
        
        inner.style.transform = `translateX(${scrollPos}px)`;
    }

    function animate() {
        if (!isDragging && !isFreezed && (!isClicked || hasMoved)) {
            scrollPos -= speed;
            recycle();
        }
        requestAnimationFrame(animate);
    }

    // Start only after window load to ensure offsetWidth is not 0
    window.addEventListener('load', () => {
        animate();
    });

    // Dragging Logic
    wrapper.addEventListener('mousedown', (e) => {
        hasMoved = false;
        isDragging = true;
        isFreezed = true;
        moveDistance = 0;
        startX = e.pageX;
        inner.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
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
        isFreezed = true;
    });

    wrapper.addEventListener('mouseleave', (e) =>{
        isFreezed = false;
        if(!isDragging){
            moveDistance = 0;
        }
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
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

    allCards.forEach(card => card.classList.remove('is-selected'));
    allDetails.forEach(detail => detail.classList.remove('active'));
    container.classList.remove('visible');
    

    if ((isClicked && lastId === id && moveDistance < threshold_mov) || id == -1) {
        isClicked = false;
        lastId = -1;
        return;
    }

    if(moveDistance >= threshold_mov){
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
        isClicked = true;
        lastId = id;
        clickedCard.classList.add('is-selected');
        targetDetail.classList.add('active');
        container.classList.add('visible');
        
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}