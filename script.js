document.addEventListener('DOMContentLoaded', () => {
    // Keep only the logo rotation effect
    const siteLogo = document.querySelector('.site-logo');
    if (siteLogo) {
        siteLogo.style.opacity = '0.9';
        siteLogo.addEventListener('click', (e) => {
            e.preventDefault();
            siteLogo.classList.remove('rotate-logo');
            void siteLogo.offsetWidth;
            siteLogo.classList.add('rotate-logo');
            setTimeout(() => {
                siteLogo.classList.remove('rotate-logo');
            }, 800);
        });
    }

    const charmInput = document.getElementById('charmNameInput');
    const secretButton = document.getElementById('secretButton');
    let password = '';
    const correctPassword = '255';
    const pageOverlay = document.getElementById('pageOverlay');
    const secretGif = document.getElementById('secretGif');
    const mainContent = document.querySelector('.main-content-wrapper');

    charmInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (password === correctPassword) {
                document.body.classList.add('hide-content');
                setTimeout(() => {
                    pageOverlay.classList.add('visible');
                    setTimeout(() => {
                        secretGif.src = secretGif.src;
                        secretGif.onerror = () => {
                            console.error('Failed to load GIF');
                        };
                        secretGif.onload = () => {
                            secretGif.classList.add('visible');
                        };
                        setTimeout(() => {
                            secretGif.classList.add('visible');
                            setTimeout(() => {
                                const closeButton = document.getElementById('closeOverlay');
                                closeButton.classList.add('visible');
                                closeButton.addEventListener('click', () => {
                                    window.location.reload();
                                });
                                pageOverlay.addEventListener('click', (e) => {
                                    if (e.target === pageOverlay) {
                                        window.location.reload();
                                    }
                                });
                            }, 2000);
                        }, 100);
                    }, 800);
                }, 500);
            } else {
                charmInput.classList.add('shake');
                setTimeout(() => charmInput.classList.remove('shake'), 500);
            }
            password = '';
        } else if (e.key >= '0' && e.key <= '9') {
            password += e.key;
            if (password.length > 3) {
                password = password.slice(-3);
            }
        } else if (e.key === 'Backspace') {
            password = password.slice(0, -1);
        } else {
            e.preventDefault();
        }
    });

    secretButton.addEventListener('click', function() {
        this.classList.add('glitch');
        setTimeout(() => {
            this.classList.remove('glitch');
        }, 1000);
    });

    secretButton.style.display = 'none';
    const nameInput = document.getElementById('charmNameInput');

    document.querySelectorAll('.friend-name').forEach(friend => {
        friend.addEventListener('click', (e) => {
            const href = friend.getAttribute('href');
            const dataUrl = friend.getAttribute('data-url');
            if ((!href || href === '#') && dataUrl && dataUrl !== '#') {
                e.preventDefault();
                window.open(dataUrl, '_blank');
            }
        });
        friend.style.cursor = 'pointer';
    });

    const setBackground = (selector, src) => {
        const section = document.querySelector(selector);
        const image = new Image();
        image.src = src;
        image.onload = () => {
            section.style.backgroundImage = `url('${src}')`;
        };
    };

    setBackground('.main-page-section', 'top-background.png');
    setBackground('.socials-page-section', 'bottom-background.webp');
    setBackground('.gallery-page-section', 'gallery-background.png');

    nameInput.addEventListener('focus', () => {
        nameInput.style.transform = 'scale(1.02)';
        nameInput.style.textShadow = '0 0 30px var(--primary-glow)';
    });

    nameInput.addEventListener('blur', () => {
        nameInput.style.transform = 'scale(1)';
        nameInput.style.textShadow = 'none';
    });

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

    class TextScramble {
        constructor(el) {
            this.el = el;
            this.originalText = el.textContent.trim();
            this.chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            this.frameRequest = null;
            this.lastUpdateTime = 0;
            if (el.closest('.gallery-section, .socials-section')) {
                this.scrambleInterval = 120;
                this.scrambleChance = 0.2;
                this.transitionDuration = 300;
            } else {
                this.scrambleInterval = 60;
                this.scrambleChance = 0.1;
                this.transitionDuration = 200;
            }
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

        const skipScramble = el.id === 'inception' || el.id === 'lisa061';

        if (!skipScramble) {
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

        if (el.id === 'inception' || el.id === 'lisa061') {
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

        // === Special behavior for 'charm' ===
        if (el.id === 'charm') {
            const originalText = el.textContent;
            el.addEventListener('mouseenter', () => {
                el.textContent = 'femboy training';
                el.style.color = 'hotpink';
                el.style.textShadow = '0 0 10px hotpink';
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
});
