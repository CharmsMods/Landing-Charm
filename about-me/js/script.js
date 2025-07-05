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
    const textToType = "Hi, I'm Charm?";
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // Base typing speed in ms
    let deleteSpeed = 50;  // Faster deleting speed
    let waitBeforeDelete = 2000; // Wait 2 seconds before starting to delete
    let waitAfterDelete = 1000;  // Wait 1 second after deleting before typing again

    function typeText() {
        const currentText = textToType.substring(0, charIndex);
        typingTextElement.textContent = currentText;
        
        // Add cursor class if not already added
        typingTextElement.classList.add('typing-cursor');

        if (!isDeleting && charIndex < textToType.length) {
            // Typing
            charIndex++;
            setTimeout(typeText, typingSpeed);
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            charIndex--;
            setTimeout(typeText, deleteSpeed);
        } else if (charIndex === textToType.length) {
            // Finished typing, wait then start deleting
            if (!isDeleting) {
                isDeleting = true;
                setTimeout(typeText, waitBeforeDelete);
            } else {
                // Finished deleting, wait then start typing again
                isDeleting = false;
                setTimeout(typeText, waitAfterDelete);
            }
        } else {
            // Shouldn't get here, but just in case
            isDeleting = false;
            charIndex = 0;
            setTimeout(typeText, waitAfterDelete);
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