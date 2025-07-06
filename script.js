document.addEventListener('DOMContentLoaded', () => {
    // Keep only the logo rotation effect
    const siteLogo = document.querySelector('.site-logo');
    if (siteLogo) {
        siteLogo.style.opacity = '0.9';
        siteLogo.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove any existing animation classes
            siteLogo.classList.remove('rotate-logo');
            
            // Force a reflow to ensure the animation restarts
            void siteLogo.offsetWidth;
            
            // Add the rotation class
            siteLogo.classList.add('rotate-logo');
            
            // Remove the class after animation completes
            setTimeout(() => {
                siteLogo.classList.remove('rotate-logo');
            }, 800);
        });
    }
    
    // Password input handling
    const charmInput = document.getElementById('charmNameInput');
    const secretButton = document.getElementById('secretButton');
    let password = '';
    const correctPassword = '255';

    const pageOverlay = document.getElementById('pageOverlay');
    const secretGif = document.getElementById('secretGif');
    const mainContent = document.querySelector('.main-content-wrapper');
    
    charmInput.addEventListener('keydown', (e) => {
        // Only handle Enter key for submission
        if (e.key === 'Enter') {
            e.preventDefault();
            
            if (password === correctPassword) {
                // Hide the input and secondary text
                document.body.classList.add('hide-content');
                
                // Show the white overlay
                setTimeout(() => {
                    pageOverlay.classList.add('visible');
                    
                    // After overlay is fully visible, show the GIF
                    setTimeout(() => {
                        console.log('Showing GIF...');
                        console.log('GIF src:', secretGif.src);
                        console.log('GIF complete:', secretGif.complete);
                        console.log('GIF natural dimensions:', secretGif.naturalWidth, 'x', secretGif.naturalHeight);
                        
                        // Force reload in case of caching issues
                        secretGif.src = secretGif.src;
                        
                        // Add error handling
                        secretGif.onerror = function() {
                            console.error('Failed to load GIF');
                            console.log('Current path:', window.location.pathname);
                            console.log('Attempted to load from:', secretGif.src);
                        };
                        
                        secretGif.onload = function() {
                            console.log('GIF loaded successfully');
                            secretGif.classList.add('visible');
                        };
                        
                        // Add visible class after a short delay to ensure the image is loaded
                        setTimeout(() => {
                            secretGif.classList.add('visible');
                            
                            // Show close button after 2 seconds
                            setTimeout(() => {
                                const closeButton = document.getElementById('closeOverlay');
                                closeButton.classList.add('visible');
                                
                                // Add click handler to close button
                                closeButton.addEventListener('click', function() {
                                    // Reload the page to reset everything
                                    window.location.reload();
                                });
                                
                                // Also allow clicking anywhere on the overlay to close
                                pageOverlay.addEventListener('click', function(e) {
                                    // Only close if clicking on the overlay itself, not the image or button
                                    if (e.target === pageOverlay) {
                                        window.location.reload();
                                    }
                                });
                                
                            }, 2000); // 2 second delay
                            
                        }, 100);
                    }, 800);
                    
                }, 500);
                
            } else {
                // Shake effect for wrong password
                charmInput.classList.add('shake');
                setTimeout(() => charmInput.classList.remove('shake'), 500);
            }
            // Always clear password after Enter
            password = '';
        } 
        // Only allow numbers to be entered
        else if (e.key >= '0' && e.key <= '9') {
            password += e.key;
            // Keep only the last 3 digits to match password length
            if (password.length > 3) {
                password = password.slice(-3);
            }
        } 
        // Allow backspace
        else if (e.key === 'Backspace') {
            password = password.slice(0, -1);
        }
        // Prevent any other input
        else {
            e.preventDefault();
        }
    });

    // Button click handler
    secretButton.addEventListener('click', function() {
        // Add glitch effect
        this.classList.add('glitch');
        
        // Remove glitch effect after animation completes
        setTimeout(() => {
            this.classList.remove('glitch');
            
            // Optional: Redirect or perform action after glitch
            // window.location.href = 'your-secret-page.html';
            
        }, 1000);
    });
    
    // Hide the button initially
    secretButton.style.display = 'none';
    const nameInput = document.getElementById('charmNameInput');
    
    // Handle friend name clicks
    document.querySelectorAll('.friend-name').forEach(friend => {
        friend.addEventListener('click', (e) => {
            const href = friend.getAttribute('href');
            const dataUrl = friend.getAttribute('data-url');
            
            // Only prevent default if there's a data-url and no href
            if ((!href || href === '#') && dataUrl && dataUrl !== '#') {
                e.preventDefault();
                window.open(dataUrl, '_blank');
            }
            // If there's an href, let it work normally
        });
        
        // Add pointer cursor to indicate clickable
        friend.style.cursor = 'pointer';
    });

    // === Background image loading ===
    const setBackground = (selector, src) => {
        const section = document.querySelector(selector);
        const image = new Image();
        image.src = src;
        image.onload = () => {
            section.style.backgroundImage = `url('${src}')`;
        };
    };

    setBackground('.main-page-section', 'top-background.png');
    setBackground('.socials-page-section', 'bottom-background.png');
    setBackground('.gallery-page-section', 'gallery-background.png');

    // === Input interaction ===
    nameInput.addEventListener('focus', () => {
        nameInput.style.transform = 'scale(1.02)';
        nameInput.style.textShadow = '0 0 30px var(--primary-glow)';
    });

    nameInput.addEventListener('blur', () => {
        nameInput.style.transform = 'scale(1)';
        nameInput.style.textShadow = 'none';
    });

    // === Scroll-triggered animations ===
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.section-container').forEach(section => {
        observer.observe(section);
    });

    // === Text scramble class ===
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.originalText = el.textContent.trim();
            this.chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            this.frameRequest = null;
            this.lastUpdateTime = 0;
            
            // Customize scramble speed based on element's section
            if (el.closest('.gallery-section, .socials-section')) {
                // Slower for buttons in creations and socials sections
                this.scrambleInterval = 120; // Slower update interval (ms)
                this.scrambleChance = 0.2;   // Lower chance to change each character
                this.transitionDuration = 300; // Smoother transition (ms)
            } else {
                // Default speed for other elements
                this.scrambleInterval = 60;
                this.scrambleChance = 0.1;
                this.transitionDuration = 200;
            }
            
            // Apply transition for smoother animations
            el.style.transition = `all ${this.transitionDuration}ms ease-out`;
        }

        startScrambling = () => {
            if (this.frameRequest) cancelAnimationFrame(this.frameRequest);
            this.lastUpdateTime = performance.now();
            this.frameRequest = requestAnimationFrame(this.updateLoop);
        };

        stopScrambling = () => {
            if (this.frameRequest) cancelAnimationFrame(this.frameRequest);
            this.frameRequest = null;
            this.el.textContent = this.originalText;
            this.resetStyle();
        };

        updateLoop = (timestamp) => {
            if (timestamp - this.lastUpdateTime >= this.scrambleInterval) {
                const scrambled = Array.from(this.originalText).map(char =>
                    Math.random() > this.scrambleChance ? this.randomChar() : char
                ).join('');
                this.el.textContent = scrambled;
                this.lastUpdateTime = timestamp;
            }
            if (this.frameRequest) this.frameRequest = requestAnimationFrame(this.updateLoop);
        };

        randomChar = () => this.chars[Math.floor(Math.random() * this.chars.length)];

        setStyle = () => {
            const width = this.el.clientWidth;
            this.el.style.minWidth = `${width}px`;
            this.el.style.whiteSpace = 'nowrap';
            this.el.style.overflow = 'hidden';
        };

        resetStyle = () => {
            this.el.style.minWidth = '';
            this.el.style.whiteSpace = '';
            this.el.style.overflow = '';
        };
    }

    const scramblers = [];

    // Only apply scramble effect to friend names
    document.querySelectorAll('.friend-name').forEach(el => {
        if (
            el.id === 'charmNameInput' ||
            el.classList.contains('secondary-text') ||
            el.classList.contains('site-logo') ||
            el.classList.contains('about-button') ||
            el.textContent.trim().length === 0 ||
            (el.children.length === 1 && el.querySelector('i') && el.textContent.trim().length < 2)
        ) {
            return;
        }

        // === Skip scramble for 'inception'
        const isInception = el.id === 'inception';
        if (!isInception) {
            const scrambler = new TextScramble(el);
            scramblers.push(scrambler);

            el.addEventListener('mouseenter', () => {
                scrambler.setStyle();
                scrambler.startScrambling();

                if (el.id === 'supernaut') {
                    el.style.color = 'deepskyblue';
                    el.style.letterSpacing = '2px';
                }
            });

            el.addEventListener('mouseleave', () => {
                scrambler.stopScrambling();
                el.style.color = '';
                el.style.textShadow = '';
                el.style.transform = '';
                el.style.letterSpacing = '';

                if (el.id === 'supernaut') {
                    el.textContent = 'Supernaut';
                    scrambler.originalText = 'Supernaut';
                }
            });
        }

        // === Special behavior for 'inception' (no scramble)
        if (isInception) {
            const originalText = el.textContent;

            el.addEventListener('mouseenter', () => {
                el.textContent = 'EVANS GF';
                el.style.color = 'crimson';
                el.style.textShadow = '0 0 10px crimson';
                el.style.transform = 'scale(1.2)';
            });

            el.addEventListener('mouseleave', () => {
                el.textContent = originalText;
                el.style.color = '';
                el.style.textShadow = '';
                el.style.transform = '';
            });
        }
    });

    // Auto-scramble removed - now only hover effect on friend names // Longer interval between auto-scrambles
});
