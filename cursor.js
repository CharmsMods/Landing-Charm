// cursor.js

document.addEventListener('DOMContentLoaded', () => {
    // Create the main custom cursor element
    const customCursor = document.createElement('div');
    customCursor.classList.add('custom-cursor');
    document.body.appendChild(customCursor);

    // Create multiple trailing elements for the "moving parts" effect
    const trailElements = [];
    for (let i = 1; i <= 4; i++) { // Create 4 trailing elements
        const trail = document.createElement('div');
        trail.classList.add('cursor-trail', `cursor-trail-${i}`);
        document.body.appendChild(trail);
        trailElements.push(trail);
    }

    // Store the last known mouse position
    let mouseX = 0;
    let mouseY = 0;

    // Listen for mouse movement
    document.addEventListener('mousemove', (e) => {
        // Update the main cursor position
        mouseX = e.clientX;
        mouseY = e.clientY;
        customCursor.style.left = `${mouseX}px`;
        customCursor.style.top = `${mouseY}px`;

        // Update the trail elements with a slight delay for the trailing effect
        // We'll update them directly here for simplicity and responsiveness
        trailElements.forEach((trail, index) => {
            // Apply a slight delay based on the index to create the "lag" effect
            // The position is set directly, and CSS transitions handle the smooth movement
            setTimeout(() => {
                trail.style.left = `${mouseX}px`;
                trail.style.top = `${mouseY}px`;
                trail.style.opacity = '1'; // Make the trail visible when moving
            }, index * 20); // Adjust this delay for more or less "trail" effect
        });
    });

    // Handle mouse leaving the document to hide the custom cursor and trails
    document.addEventListener('mouseleave', () => {
        customCursor.style.opacity = '0';
        trailElements.forEach(trail => {
            trail.style.opacity = '0';
        });
    });

    // Handle mouse entering the document to show them again
    document.addEventListener('mouseenter', () => {
        customCursor.style.opacity = '0.8'; // Restore opacity
        // Trail elements will become visible again on mousemove
    });
});
