const container = document.getElementById('tilt-container');
const inner = document.getElementById('card-inner');
let isFlipped = false;
let isTransitioning = false;

container.addEventListener('mousemove', (e) => {
    if(isTransitioning) return;
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    inner.style.transform = `rotateX(${y * -20}deg) rotateY(${x * 20 + (isFlipped ? 180 : 0)}deg) scale(1.05)`;
});

container.addEventListener('mouseleave', () => {
    if(isTransitioning) return;
    const rot = isFlipped ? 180 : 0;
    inner.style.transform = `rotateX(0deg) rotateY(${rot}deg) scale(1)`;
});

container.addEventListener('click', () => {
    isTransitioning = true;
    isFlipped = !isFlipped;
    inner.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    inner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
});

inner.addEventListener('transitionend', () => {
    inner.style.transition = 'none';
    isTransitioning = false;
});











