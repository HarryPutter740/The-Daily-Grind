document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('page-transition-overlay');

    // --- Slide Out on Page Load ---
    // On page load, the overlay is visible by default (from CSS).
    // We add a class to slide it out, revealing the content.
    if (overlay) {
        // Using a short timeout ensures the transition is smooth on all browsers.
        setTimeout(() => {
            overlay.classList.add('slide-out');
        }, 50); // A small delay can help prevent rendering glitches
    }

    // --- Slide In on Link Click ---
    // Find all links that don't start with 'http' (external) or '#' (anchor).
    // This is a more robust way to select all internal page links.
    const internalLinks = document.querySelectorAll('a:not([href^="http"]):not([href^="#"])');


    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignore anchor links on the same page and links opening in a new tab.
            if (href.startsWith('#') || this.target === '_blank') {
                return; // Let the browser handle these clicks normally.
            }

            // Prevent the browser from navigating immediately.
            e.preventDefault();

            // If the overlay exists, start the slide-in animation.
            if (overlay) {
                overlay.classList.remove('slide-out');

                // Wait for the slide-in animation to complete (600ms), then navigate.
                setTimeout(() => {
                    window.location = href;
                }, 600);
            } else {
                // If for some reason the overlay isn't there, just navigate.
                window.location = href;
            }
        });
    });
});