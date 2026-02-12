document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        card.style.transform = `translateY(-15px) rotateX(${y * -0.05}deg) rotateY(${x * 0.05}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `translateY(0) rotateX(0) rotateY(0)`;
    });
});