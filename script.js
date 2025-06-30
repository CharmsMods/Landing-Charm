document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('charmNameInput');

    // Enhanced background image loading with fade transitions
    const mainPageSection = document.querySelector('.main-page-section');
    const topBackgroundImage = new Image();
    topBackgroundImage.src = 'top-background.png';
    topBackgroundImage.onload = function() {
        mainPageSection.style.backgroundImage = `url('${topBackgroundImage.src}')`;
    };

    const socialsPageSection = document.querySelector('.socials-page-section');
    const bottomBackgroundImage = new Image();
    bottomBackgroundImage.src = 'bottom-background.png';
    bottomBackgroundImage.onload = function() {
        socialsPageSection.style.backgroundImage = `url('${bottomBackgroundImage.src}')`;
    };

    const galleryPageSection = document.querySelector('.gallery-page-section');
    const galleryBackgroundImage = new Image();
    galleryBackgroundImage.src = 'gallery-background.png';
    galleryBackgroundImage.onload = function() {
        galleryPageSection.style.backgroundImage = `url('${galleryBackgroundImage.src}')`;
    };

    // Enhanced input interactions
    nameInput.addEventListener('focus', () => {
        nameInput.style.transform = 'scale(1.02)';
        nameInput.style.textShadow = '0 0 30px var(--primary-glow)';
    });

    nameInput.addEventListener('blur', () => {
        nameInput.style.transform = 'scale(1)';
        nameInput.style.textShadow = 'none';
    });

    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    document.querySelectorAll('.section-container').forEach(section => {
        observer.observe(section);
    });

    // --- Text Scramble Effect ---
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.originalText = el.textContent.trim();
            this.chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Letters for scrambling
            this.frameRequest = null;
            this.lastUpdateTime = 0; // Added: Timestamp of the last scramble update
            this.scrambleInterval = 60; // Added: Interval in milliseconds for updates.
                                        // Smaller value = faster scramble.
                                        // 60ms is roughly 16-17 updates per second.
                                        // Try values like 30 (very fast) to 150 (slow)
        }

        startScrambling() {
            if (this.frameRequest) {
                cancelAnimationFrame(this.frameRequest);
            }
            this.lastUpdateTime = performance.now(); // Initialize last update time
            this.frameRequest = requestAnimationFrame(this.updateLoop);
        }

        stopScrambling() {
            if (this.frameRequest) {
                cancelAnimationFrame(this.frameRequest);
                this.frameRequest = null;
            }
            this.el.textContent = this.originalText;
            this.el.style.minWidth = ''; // Reset styles
            this.el.style.whiteSpace = '';
            this.el.style.overflow = '';
        }

        // The main animation loop for continuous scrambling
        // timestamp is provided by requestAnimationFrame
        updateLoop = (timestamp) => {
            // Calculate time elapsed since last actual scramble update
            const deltaTime = timestamp - this.lastUpdateTime;

            if (deltaTime >= this.scrambleInterval) {
                let scrambledText = '';
                for (let i = 0; i < this.originalText.length; i++) {
                    // This controls the *density* of the scramble (how many chars change per update)
                    // Lower value (e.g., 0.05) makes more characters change. Higher (e.g., 0.5) makes fewer.
                    if (Math.random() > 0.1) {
                        scrambledText += this.randomChar();
                    } else {
                        scrambledText += this.originalText[i];
                    }
                }
                this.el.textContent = scrambledText;
                this.lastUpdateTime = timestamp; // Update the timestamp for the next interval check
            }

            // Continue the animation loop as long as it's active
            if (this.frameRequest !== null) {
                this.frameRequest = requestAnimationFrame(this.updateLoop);
            }
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    const elementsForScramble = document.querySelectorAll(
        'h1, h2, h3, h4, h5, h6, p, a, span, li, button, .friend-name'
    );

    const scramblers = []; // Store all valid scrambler instances

    elementsForScramble.forEach(el => {
        // --- Exclusion Logic ---
        if (el.id === 'charmNameInput' || el.classList.contains('secondary-text') || el.classList.contains('site-logo') || el.classList.contains('about-button')) {
            return;
        }
        if (el.textContent.trim().length === 0 || (el.children.length === 1 && el.querySelector('i') && el.textContent.trim().length < 2)) {
            return;
        }
        
        let targetElement = el;
        // Special handling for "Pushing Revolution" impact text - REMOVED, no longer needed
        // as the impact section is removed.

        const scrambler = new TextScramble(targetElement);
        scramblers.push(scrambler); // Add to the list of scramblers

        let originalWidth = 0;

        el.addEventListener('mouseenter', () => {
            originalWidth = el.clientWidth;
            el.style.minWidth = `${originalWidth}px`;
            el.style.whiteSpace = 'nowrap';
            el.style.overflow = 'hidden';

            scrambler.startScrambling();
        });

        el.addEventListener('mouseleave', () => {
            scrambler.stopScrambling();
            el.style.minWidth = '';
            el.style.whiteSpace = '';
            el.style.overflow = '';
        });
    });

    // --- Periodic Random Scramble Effect ---
    setInterval(() => {
        if (scramblers.length > 0) {
            const randomIndex = Math.floor(Math.random() * scramblers.length);
            const randomScrambler = scramblers[randomIndex];

            // Ensure the element is not currently hovered to avoid conflicts
            const parentElement = randomScrambler.el.parentElement; // Get parent if targetElement is a text node
            const isHovered = parentElement ? parentElement.matches(':hover') : randomScrambler.el.matches(':hover');

            if (!isHovered) {
                const originalWidth = randomScrambler.el.clientWidth;
                randomScrambler.el.style.minWidth = `${originalWidth}px`;
                randomScrambler.el.style.whiteSpace = 'nowrap';
                randomScrambler.el.style.overflow = 'hidden';

                randomScrambler.startScrambling();
                setTimeout(() => {
                    randomScrambler.stopScrambling();
                }, 200); // Stop after 0.2 seconds
            }
        }
    }, 1000); // Trigger every 1 second (1000 milliseconds)
});