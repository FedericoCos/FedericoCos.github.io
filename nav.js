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
        const scrollPosition = window.innerHeight + window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        
        if (scrollPosition >= scrollHeight - 50) {
            const contactItem = document.querySelector('.nav-item[href="#contact"]');
            if (contactItem) {
                navItems.forEach(item => item.classList.remove('active'));
                contactItem.classList.add('active');
                updateIndicator(contactItem);
            }
        }
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

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // We only update if the section is significantly visible
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const targetItem = document.querySelector(`.nav-item[href="#${id}"]`);
                
                if (targetItem) {
                    // Remove active from all, then add to the one currently entering
                    navItems.forEach(item => item.classList.remove('active'));
                    targetItem.classList.add('active');
                    updateIndicator(targetItem);
                }
            }
        });
    }, { 
        // rootMargin: Top, Right, Bottom, Left
        // -20% Top and -20% Bottom creates a "sweet spot" in the middle 60% of the screen
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.15 // Trigger when at least 15% of the section is in that sweet spot
    });

    sections.forEach(section => sectionObserver.observe(section));

    // Initial position
    window.addEventListener('load', () => {
        const activeItem = document.querySelector('.nav-item.active');
        updateIndicator(activeItem);
    });
});