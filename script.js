document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('charmNameInput');
    
    // Handle friend name clicks
    document.querySelectorAll('.friend-name').forEach(friend => {
        friend.addEventListener('click', (e) => {
            e.preventDefault();
            const url = friend.getAttribute('data-url');
            if (url && url !== '#') {
                window.open(url, '_blank');
            }
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
            this.scrambleInterval = 60;
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
                    Math.random() > 0.1 ? this.randomChar() : char
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

    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, li, button, .friend-name').forEach(el => {
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

    // === Periodic auto-scramble ===
    setInterval(() => {
        if (scramblers.length > 0) {
            const scrambler = scramblers[Math.floor(Math.random() * scramblers.length)];
            const el = scrambler.el;

            if (!el.matches(':hover') && !el.parentElement.matches(':hover')) {
                scrambler.setStyle();
                scrambler.startScrambling();
                setTimeout(scrambler.stopScrambling, 200);
            }
        }
    }, 1000);
});
