document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll) library
    AOS.init({
        duration: 800, // animation duration
        once: true,    // whether animation should happen only once - while scrolling down
        offset: 100,   // offset (in px) from the original trigger point
        easing: 'ease-in-out', // easing for AOS animations
    });

    // Typing animation for the intro text
    const typingTextElement = document.getElementById('typing-text');
    const textToType = "Hi, I’m Charm?";
    let charIndex = 0;

    function typeText() {
        if (charIndex < textToType.length) {
            typingTextElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 100); // Adjust typing speed here
        } else {
            // Optional: Remove blinking cursor after typing is complete
            typingTextElement.style.borderRight = 'none';
        }
    }

    // Start typing animation after a short delay
    setTimeout(typeText, 500);

    // Smooth scroll for the down arrow
    const scrollDownArrow = document.querySelector('.scroll-down-arrow');
    if (scrollDownArrow) {
        scrollDownArrow.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = scrollDownArrow.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});