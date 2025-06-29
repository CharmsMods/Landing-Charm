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
});