document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LOADER ANIMATION
    const loader = document.getElementById('loader');
    if (loader) {
        const loaderLine = document.querySelector('.loader-line');
        
        // Simulate loading
        setTimeout(() => {
            if(loaderLine) loaderLine.style.width = '100px';
        }, 100);

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 500);
        });
    }

    // 2. SCROLL OBSERVER (FOR FADE-UP ANIMATIONS)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } 
        });
    });

    // Select elements to animate
    const scrollElements = document.querySelectorAll('[data-scroll]');
    scrollElements.forEach(el => observer.observe(el));

    // Image Reveal Animation
    const revealImages = document.querySelectorAll('.reveal-image');
    revealImages.forEach(el => {
        const image = el.querySelector('img');
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: "top 80%",
            }
        });
        tl.to(el, 1, { width: '100%', ease: 'power2.inOut' });
        tl.fromTo(image, { scale: 1.4 }, { scale: 1, duration: 1.4, ease: 'power2.out' }, "-=1");
    });

    // 3. NAVBAR SCROLL EFFECT
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 4. PARALLAX EFFECT
    const parallaxImages = document.querySelectorAll('.parallax-img');
    const parallaxBgs = document.querySelectorAll('.parallax-bg');

    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;

        // Background Parallax sections
        parallaxBgs.forEach(bg => {
            const rect = bg.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                let speed = 0.2;
                let yPos = -rect.top * speed;
                bg.style.transform = `translateY(${yPos}px)`;
            }
        });
    });

    // 5. MOBILE MENU
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.add('open');
            hamburger.classList.add('open');
        });

        const closeMenu = () => {
            mobileNav.classList.remove('open');
            hamburger.classList.remove('open');
        };

        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMenu);
        }

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // 5.1. MOBILE SUB-MENU DROPDOWN
        const mobileDropdowns = document.querySelectorAll('.mobile-nav .has-dropdown');
        mobileDropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('a');
            trigger.addEventListener('click', (e) => {
                // Prevent the main link from navigating if it's just a trigger
                e.preventDefault();
                // Stop the main menu from closing when we click a dropdown
                e.stopPropagation(); 
                dropdown.classList.toggle('open');
            });
        });
    }

    // 6. CONTACT FORM HANDLING (Node.js Backend)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = {
                name: contactForm.querySelector('input[name="name"]').value,
                email: contactForm.querySelector('input[name="email"]').value,
                message: contactForm.querySelector('textarea[name="message"]').value
            };

            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert('Failed to send message. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Is the backend server running?');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});