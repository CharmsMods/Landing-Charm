// Profile Page Interactive Features

// Initialize blur circle effect
const blurCircle = document.getElementById('blurCircle');
let isHovering = false;
let isInitialized = false;

// Function to update blur circle position
function updateBlurPosition(x, y) {
    requestAnimationFrame(() => {
        blurCircle.style.left = `${x}px`;
        blurCircle.style.top = `${y}px`;
    });
}

// Show and update blur circle position on mouse move
document.addEventListener('mousemove', (e) => {
    if (!isHovering) {
        blurCircle.style.opacity = '1';
    }
    updateBlurPosition(e.clientX, e.clientY);
});

// Hide blur circle when mouse leaves the window
document.addEventListener('mouseleave', () => {
    blurCircle.style.opacity = '0';
    isHovering = false;
});

// Show blur circle when mouse re-enters the window
document.addEventListener('mouseenter', () => {
    blurCircle.style.opacity = '1';
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    if (isInitialized) return;
    isInitialized = true;
    
    initializeProfilePage();
    
    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .social-link, .profile-picture, .profile-card');

    interactiveElements.forEach(element => {
        // Make sure the element is visible and in the viewport
        if (!element.offsetParent) return;
        
        element.addEventListener('mouseenter', (e) => {
            const rect = element.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;
            
            // Position the blur circle at the center of the hovered element
            updateBlurPosition(elementCenterX, elementCenterY);
            
            // Adjust size and blur based on element size
            const size = Math.max(rect.width, rect.height) * 1.2;
            blurCircle.style.width = `${size}px`;
            blurCircle.style.height = `${size}px`;
            blurCircle.style.borderRadius = '50%';
            
            // Apply more blur when hovering over elements
            blurCircle.style.backdropFilter = 'blur(15px)';
            blurCircle.style.webkitBackdropFilter = 'blur(15px)';
            blurCircle.style.background = 'rgba(255, 255, 255, 0.2)';
            
            isHovering = true;
        });

        element.addEventListener('mouseleave', () => {
            // Return to default state when leaving element
            blurCircle.style.width = '200px';
            blurCircle.style.height = '200px';
            blurCircle.style.backdropFilter = 'blur(10px)';
            blurCircle.style.webkitBackdropFilter = 'blur(10px)';
            blurCircle.style.background = 'rgba(255, 255, 255, 0.1)';
            blurCircle.style.borderRadius = '50%';
            
            isHovering = false;
        });
    });
    
    // Initialize blur circle position
    const container = document.querySelector('.container');
    if (container) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        updateBlurPosition(centerX, centerY);
    }
});

function initializeProfilePage() {
    handleProfilePictureError();
    addMouseTrackingEffect();
    addSocialLinkAnimations();
    addStatusAnimation();
    addParallaxEffect();
    addLoadingAnimation();
}

// Handle profile picture loading error
function handleProfilePictureError() {
    const profilePicture = document.getElementById('profilePicture');
    
    profilePicture.addEventListener('error', function() {
        // Create a beautiful fallback avatar
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 240;
        canvas.height = 240;
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 240, 240);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 240, 240);
        
        // Add initials or icon
        ctx.fillStyle = 'white';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👤', 120, 120);
        
        // Replace the image with the canvas
        profilePicture.src = canvas.toDataURL();
    });
}

// Add mouse tracking effect to profile card
function addMouseTrackingEffect() {
    const profileCard = document.querySelector('.profile-card');
    
    profileCard.addEventListener('mousemove', function(e) {
        const rect = profileCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    profileCard.addEventListener('mouseleave', function() {
        profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
}

// Add enhanced social link animations
function addSocialLinkAnimations() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach((link, index) => {
        // Stagger animation on load
        link.style.animationDelay = `${0.6 + index * 0.1}s`;
        link.style.animation = 'slideUp 0.6s ease-out both';
        
        // Add click ripple effect
        link.addEventListener('click', function(e) {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                showCustomAlert(`${link.querySelector('span').textContent} link not configured yet!`);
            }
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = link.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            link.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add status indicator animation
function addStatusAnimation() {
    const statusTexts = ['Online', 'Active', 'Available', 'Ready to chat'];
    const statusText = document.querySelector('.status-text');
    let currentIndex = 0;
    
    setInterval(() => {
        statusText.style.opacity = '0';
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % statusTexts.length;
            statusText.textContent = statusTexts[currentIndex];
            statusText.style.opacity = '1';
        }, 300);
    }, 3000);
}

// Add parallax effect to floating shapes
function addParallaxEffect() {
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Add loading animation
function addLoadingAnimation() {
    const elements = document.querySelectorAll('.profile-card > *');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Custom alert function
function showCustomAlert(message) {
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-size: 14px;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations for alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Utility function to customize profile data
function updateProfile(profileData) {
    const {
        name,
        bio,
        profilePicture,
        socials = {}
    } = profileData;
    
    // Update name
    if (name) {
        document.getElementById('profileName').textContent = name;
        document.title = `Profile - ${name}`;
    }
    
    // Update bio
    if (bio) {
        document.getElementById('profileBio').textContent = bio;
    }
    
    // Update profile picture
    if (profilePicture) {
        document.getElementById('profilePicture').src = profilePicture;
    }
    
    // Update social links
    Object.entries(socials).forEach(([platform, url]) => {
        const socialLink = document.querySelector(`[data-platform="${platform}"]`);
        if (socialLink && url) {
            socialLink.href = url;
        }
    });
}

// Example usage (uncomment and modify as needed):
/*
updateProfile({
    name: "Alex Johnson",
    bio: "Full-stack developer who loves creating beautiful web experiences.",
    profilePicture: "alex-profile.jpg",
    socials: {
        instagram: "https://instagram.com/alexjohnson",
        twitter: "https://twitter.com/alexjohnson",
        linkedin: "https://linkedin.com/in/alexjohnson",
        github: "https://github.com/alexjohnson"
    }
});
*/