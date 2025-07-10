// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create cursor elements
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    const cursorHalo = document.createElement('div');
    cursorHalo.className = 'cursor-halo';
    document.body.appendChild(cursorHalo);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Set initial cursor position
    let mouseX = 0;
    let mouseY = 0;
    let isOverDark = false;
    
    // Function to check if element or its parents have dark background
    function isElementDark(element) {
        if (!element || element === document.documentElement) return false;
        
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;
        
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                return brightness < 128;
            }
        }
        
        return isElementDark(element.parentElement);
    }
    
    // Mouse move event listener
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update cursor position
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        
        // Update halo position with slight delay for trailing effect
        requestAnimationFrame(() => {
            cursorHalo.style.left = `${mouseX}px`;
            cursorHalo.style.top = `${mouseY}px`;
        });
        
        // Check background color
        const element = document.elementFromPoint(mouseX, mouseY);
        const shouldBeDark = isElementDark(element);
        
        if (shouldBeDark !== isOverDark) {
            isOverDark = shouldBeDark;
            if (isOverDark) {
                cursorDot.style.backgroundColor = '#ffffff';
                cursorHalo.style.borderColor = 'rgba(0, 188, 212, 0.7)';
            } else {
                cursorDot.style.backgroundColor = '#000000';
                cursorHalo.style.borderColor = 'rgba(147, 112, 219, 0.7)';
            }
        }
    });
    
    // Add hover effect for interactive elements
    const interactiveElements = ['a', 'button', 'input', 'textarea', 'select', '.btn', '.tool-card'];
    interactiveElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorHalo.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorHalo.style.borderColor = isOverDark ? 'rgba(0, 188, 212, 0.9)' : 'rgba(147, 112, 219, 0.9)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%)';
                cursorHalo.style.transform = 'translate(-50%, -50%)';
                cursorHalo.style.borderColor = isOverDark ? 'rgba(0, 188, 212, 0.7)' : 'rgba(147, 112, 219, 0.7)';
            });
        });
    });
});

// Original page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Typing Animation for Hero Section
    const typingTextElement = document.getElementById('typing-text');
    const professions = ["modder", "AI Enthusiast", "gamer", "website builder"]; // Updated a profession
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150; // Milliseconds per character
    const deletingSpeed = 100;
    const delayBetweenProfessions = 1500; // Milliseconds

    function type() {
        const currentProfession = professions[professionIndex];
        if (isDeleting) {
            typingTextElement.textContent = currentProfession.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentProfession.substring(0, charIndex + 1);
            charIndex++;
        }

        let currentTypingSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentProfession.length) {
            currentTypingSpeed = delayBetweenProfessions;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
        }

        setTimeout(type, currentTypingSpeed);
    }

    // Only start typing animation if on the index.html page
    if (typingTextElement) {
        type(); // Start the typing animation
    }


    // Scroll Fade-In Animation
    const faders = document.querySelectorAll('.content-fade-in');

    const appearOptions = {
        threshold: 0.2, // When 20% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Shrink bottom margin to trigger earlier
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                // Only stop observing if it's the hero section or a section with an ID
                // to allow fade-in on other pages if needed.
                if (entry.target.id === 'hero' || entry.target.id === 'about' || 
                    entry.target.id === 'projects' || entry.target.id === 'skills' ||
                    entry.target.id === 'other-sites' || entry.target.id === 'socials' ||
                    entry.target.id === 'tools') {
                    appearOnScroll.unobserve(entry.target); 
                }
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Navigation-related code removed as per user request
});
