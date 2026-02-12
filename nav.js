document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('dynamic-island');
    const navItems = document.querySelectorAll('.nav-item');
    const indicator = document.querySelector('.nav-indicator');
    const sections = document.querySelectorAll('section');
    
    let lastScrollY = window.scrollY;
    let idleTimer = null;
    let isMouseOverNav = false;
    
    const IDLE_TIMEOUT = 1500; // Smaller timeout (1.5 seconds)
    const SCROLL_THRESHOLD = 50; // Minimum scroll distance before menu reacts
    let accumulatedScroll = 0;

    function updateIndicator(element) {
        if (!element) return;
        indicator.style.width = `${element.offsetWidth}px`;
        indicator.style.left = `${element.offsetLeft}px`;
    }

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        // Only start timer if we are not at the top
        if (window.scrollY > 100) {
            idleTimer = setTimeout(hideNav, IDLE_TIMEOUT);
        }
    }

    function hideNav() {
        if (!isMouseOverNav && window.scrollY > 100) {
            nav.classList.add('hidden');
        }
    }

    function showNav() {
        nav.classList.remove('hidden');
        resetIdleTimer();
    }

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const delta = currentScroll - lastScrollY;

        // Reset accumulated scroll if direction changes
        if ((delta > 0 && accumulatedScroll < 0) || (delta < 0 && accumulatedScroll > 0)) {
            accumulatedScroll = 0;
        }
        accumulatedScroll += delta;

        // At-top logic (always visible)
        if (currentScroll < 50) {
            nav.classList.add('at-top');
            nav.classList.remove('hidden');
            clearTimeout(idleTimer);
        } else {
            nav.classList.remove('at-top');

            // Reaction based on threshold
            if (Math.abs(accumulatedScroll) >= SCROLL_THRESHOLD) {
                if (accumulatedScroll < 0) {
                    // Scrolling UP: Reappear
                    showNav();
                } else {
                    // Scrolling DOWN: Disappear
                    hideNav();
                }
                accumulatedScroll = 0; // Reset after threshold met
            }
        }
        lastScrollY = currentScroll;
    }, { passive: true });

    // REMOVED: mousemove listener so it only reappears on scroll up

    nav.addEventListener('mouseenter', () => {
        isMouseOverNav = true;
        clearTimeout(idleTimer);
    });

    nav.addEventListener('mouseleave', () => {
        isMouseOverNav = false;
        if (window.scrollY > 100) resetIdleTimer();
    });

    // Intersection Observer for section tracking
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                        updateIndicator(item);
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach(section => sectionObserver.observe(section));

    // Initial position
    window.addEventListener('load', () => {
        const activeItem = document.querySelector('.nav-item.active');
        updateIndicator(activeItem);
    });
});