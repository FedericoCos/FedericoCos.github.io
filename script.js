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
        
        const currentRect = tiltContainer.getBoundingClientRect();
        const paddingX = currentRect.width * 0.02; // 15% internal margin
        const paddingY = currentRect.height * 0.02;
        const mouseX = e.clientX - currentRect.left;
        const mouseY = e.clientY - currentRect.top;

        // Check if mouse is within the "image space" (internal area)
        if (mouseX > paddingX && mouseX < currentRect.width - paddingX &&
            mouseY > paddingY && mouseY < currentRect.height - paddingY) {
            
            const centerX = currentRect.width / 2;
            const centerY = currentRect.height / 2;
            
            targetX = (mouseX - centerX) / (currentRect.width - 2 * paddingX);
            targetY = (mouseY - centerY) / (currentRect.height - 2 * paddingY);
        } else {
            targetX = 0;
            targetY = 0;
        }
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
            // Speed reduced from 0.05 to 0.02 for slower tilting
            currentX += (targetX - currentX) * 0.02;
            currentY += (targetY - currentY) * 0.02;

            const baseRotY = isFlipped ? 180 : 0;
            const tiltX = currentY * -25;
            const tiltY = currentX * 25 + baseRotY;
            
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        }
        requestAnimationFrame(lerpTilt);
    }

    lerpTilt();
});