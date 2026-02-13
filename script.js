document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('card-inner');
    const tiltContainer = document.getElementById('tilt-container');
    let isFlipped = false;
    let isTransitioning = false;
    
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    tiltContainer.addEventListener('mousemove', (e) => {
        if (isTransitioning) return;
        
        const rect = tiltContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        targetX = (e.clientX - centerX) / rect.width;
        targetY = (e.clientY - centerY) / rect.height;
    });

    tiltContainer.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
    });

    card.addEventListener('click', () => {
        isTransitioning = true;
        isFlipped = !isFlipped;
        
        card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        const rotY = isFlipped ? 180 : 0;
        card.style.transform = `rotateY(${rotY}deg)`;
        
        targetX = 0;
        targetY = 0;
    });

    card.addEventListener('transitionend', () => {
        card.style.transition = 'none';
        isTransitioning = false;
    });

    function lerpTilt() {
        if (!isTransitioning) {
            currentX += (targetX - currentX) * 0.05;
            currentY += (targetY - currentY) * 0.05;

            const baseRotY = isFlipped ? 180 : 0;
            const tiltX = currentY * -25; 
            const tiltY = currentX * 25 + baseRotY;
            
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        }
        requestAnimationFrame(lerpTilt);
    }

    lerpTilt();
});