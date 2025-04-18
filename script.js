// Project Modal Functionality
function setupProjectModals() {
    // Get all project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    // Get all close buttons
    const closeButtons = document.querySelectorAll('.close-modal, .modal-footer .btn');
    
    // Add click event to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            const modal = document.getElementById(`${projectId}Modal`);
            
            if (modal) {
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
                modal.classList.add('show');
            }
        });
    });
    
    // Add click event to close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                document.body.style.overflow = ''; // Restore scrolling
                modal.classList.remove('show');
            }
        });
    });
    
    // Close modal when clicking outside of content
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.style.overflow = ''; // Restore scrolling
                modal.classList.remove('show');
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                document.body.style.overflow = ''; // Restore scrolling
                openModal.classList.remove('show');
            }
        }
    });
}

// Contact Form Handling
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('Contact form not found!');
        return;
    }
    
    const submitBtn = form.querySelector('button');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Just log the form data without sending it
            console.log('Form submitted with data:', { name, email, subject, message });
            
            // Show success message
            showNotification('Thank you for your message!', 'success');
            
            // Reset form
            form.reset();
        });
    }
}

// Notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Add close button event
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
    }
}

// Hide notification function
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Initialize Lightbox Gallery
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxContainer = document.querySelector('.lightbox-container');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxContent = document.querySelector('.lightbox-content');
    
    let currentIndex = 0;
    let currentGalleryImages = [];
    let isLightboxActive = false;
    
    // Setup gallery for each project modal
    const projectModals = document.querySelectorAll('.modal');
    projectModals.forEach(modal => {
        const modalId = modal.id;
        const galleryItems = modal.querySelectorAll('.gallery-item img');
        
        // Create array of gallery images for this specific modal
        const galleryImages = [];
        galleryItems.forEach(item => {
            galleryImages.push({
                src: item.getAttribute('src'),
                alt: item.getAttribute('alt') || 'Project image'
            });
        });
        
        // Add click event to gallery items
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent modal close
                currentIndex = index;
                currentGalleryImages = galleryImages; // Set the current gallery to this modal's images
                updateLightboxImage();
                lightbox.classList.add('active');
                isLightboxActive = true;
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });
    });
    
    // Handle project cards gallery images
    const projectGalleries = document.querySelectorAll('.projects-container .project-card');
    projectGalleries.forEach(projectCard => {
        const projectId = projectCard.getAttribute('data-project');
        const galleryItems = projectCard.querySelectorAll('img');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Find which modal to open
                const modalId = `${projectId}Modal`;
                const modal = document.getElementById(modalId);
                if (modal) {
                    // Simulate click on first image in the modal
                    const firstModalImage = modal.querySelector('.gallery-item img');
                    if (firstModalImage) {
                        setTimeout(() => {
                            firstModalImage.click();
                        }, 100); // Small delay to ensure modal is open
                    }
                }
            });
        });
    });
    
    // Close lightbox when clicking the X button
    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling
        closeLightbox();
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
        
        // Navigate with arrow keys
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });
    
    // Prevent clicks on lightbox content or container from closing the lightbox
    if (lightboxContent) {
        lightboxContent.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling to lightbox background
        });
    }
    
    if (lightboxContainer) {
        lightboxContainer.addEventListener('click', (e) => {
            // Only stop propagation if clicking on the container itself or its direct children
            // except the close button (which should close the lightbox)
            if (e.target === lightboxContainer || 
                e.target === lightboxContent || 
                e.target === lightboxImg ||
                e.target === lightboxCaption ||
                e.target === lightboxPrev ||
                e.target === lightboxNext) {
                e.stopPropagation();
            }
        });
    }
    
    // Close when clicking on the lightbox background (outside the content)
    lightbox.addEventListener('click', (e) => {
        // Make sure we're clicking directly on the lightbox background, not any of its children
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Function to close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        isLightboxActive = false;
        
        // Reset variables
        setTimeout(() => {
            // Clear the current gallery after closing animation completes
            if (!isLightboxActive) {
                currentGalleryImages = [];
                lightboxImg.src = '';
            }
        }, 300);
    }
    
    // Previous image
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling
        showPrevImage();
    });
    
    // Next image
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling
        showNextImage();
    });
    
    function showPrevImage() {
        if (currentGalleryImages.length === 0) return;
        currentIndex = (currentIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        updateLightboxImage();
    }
    
    function showNextImage() {
        if (currentGalleryImages.length === 0) return;
        currentIndex = (currentIndex + 1) % currentGalleryImages.length;
        updateLightboxImage();
    }
    
    function updateLightboxImage() {
        if (currentGalleryImages.length === 0) return;
        
        const currentImage = currentGalleryImages[currentIndex];
        lightboxImg.src = currentImage.src;
        lightboxCaption.textContent = currentImage.alt;
        
        // Show/hide navigation based on gallery size
        if (currentGalleryImages.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        } else {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        }
        
        // Preload next image for smoother navigation
        if (currentGalleryImages.length > 1) {
            const nextIndex = (currentIndex + 1) % currentGalleryImages.length;
            const preloadImg = new Image();
            preloadImg.src = currentGalleryImages[nextIndex].src;
        }
    }
}

// Prevent lightbox content from closing the lightbox
document.addEventListener('DOMContentLoaded', () => {
    const lightboxContent = document.querySelector('.lightbox-content');
    if (lightboxContent) {
        lightboxContent.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent clicks on the content from closing the lightbox
        });
    }
    
    // Fix issue with lightbox staying active after closing
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        // Ensure lightbox is completely reset on page load
        lightbox.classList.remove('active');
        lightbox.style.display = '';
        
        // Add a global click handler to force reset the lightbox if it's in an incorrect state
        document.addEventListener('click', function(e) {
            // Don't do anything if we're clicking inside a gallery item or project card
            if (e.target.closest('.gallery-item') !== null || 
                e.target.closest('.project-card') !== null ||
                e.target.closest('.lightbox-content') !== null ||
                e.target.closest('.lightbox-close') !== null ||
                e.target.closest('.lightbox-nav') !== null) {
                return;
            }
            
            // Skip if clicking inside a modal 
            const clickedInsideModal = e.target.closest('.modal-content') !== null;
            
            if (!clickedInsideModal && lightbox) {
                // Check if lightbox is in a "stuck" state
                if (!lightbox.classList.contains('active') && 
                    (getComputedStyle(lightbox).display === 'flex' || 
                     getComputedStyle(lightbox).visibility === 'visible')) {
                    console.log('Forcing lightbox reset');
                    lightbox.classList.remove('active');
                    lightbox.style.display = 'none';
                    setTimeout(() => {
                        lightbox.style.display = '';
                        document.body.style.overflow = '';
                    }, 10);
                }
            }
        }, true); // Use capture phase to catch events before they reach other handlers
    }
    
    // Set up contact form
    setupContactForm();
});

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-button');
    const body = document.body;
    
    console.log("Theme toggle element:", themeToggle); // Debug output
    
    // Direct toggle function for debugging
    window.toggleDarkMode = function() {
        console.log("Manual theme toggle triggered");
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            console.log("Switched to light mode");
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            console.log("Switched to dark mode");
        }
        return true; // Return true for the onclick handler
    };
    
    // Check for saved theme preference or respect OS theme setting
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    console.log("Saved theme:", savedTheme, "Prefers dark mode:", prefersDarkMode); // Debug output
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        body.setAttribute('data-theme', 'dark');
        console.log("Setting initial theme to dark");
    }
    
    // We don't need to add an event listener since the button already has an onclick attribute
    if (!themeToggle) {
        console.error("Theme toggle element not found!");
    }

    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            setTimeout(() => {
                cursorFollower.style.left = `${e.clientX}px`;
                cursorFollower.style.top = `${e.clientY}px`;
            }, 80);
        });
        
        // Add cursor effects on hover
        const links = document.querySelectorAll('a, button, .btn, .hamburger, .theme-switch label');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-grow');
                cursorFollower.classList.add('cursor-grow');
            });
            
            link.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-grow');
                cursorFollower.classList.remove('cursor-grow');
            });
        });
    } else {
        // Hide custom cursor on mobile
        if (cursor && cursorFollower) {
            cursor.style.display = 'none';
            cursorFollower.style.display = 'none';
        }
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileNavLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNavLinks.classList.toggle('active');
        });
    }

    // Hide mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileNavLinks.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offset = targetId === '#education' ? 70 : 70; // We can adjust offsets for different sections if needed
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to nav links on scroll
    const sections = document.querySelectorAll('.section');
    const navLinksHighlight = document.querySelectorAll('.nav-links a');

    function highlightNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksHighlight.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Add scroll event listener
    window.addEventListener('scroll', highlightNavLink);
    
    // Initialize Particles.js
    if (document.getElementById('particles-js')) {
        try {
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#0e76a8"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#0e76a8",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });
        } catch (error) {
            console.warn('Particles.js not loaded:', error);
        }
    }
    
    // Initialize Vanilla Tilt for skill cards
    if (typeof VanillaTilt !== 'undefined') {
        try {
            VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.2
            });
        } catch (error) {
            console.warn('VanillaTilt not loaded:', error);
        }
    }
    
    // Skill bar animation on scroll
    const skillBars = document.querySelectorAll('.skill-bar');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const barWidth = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = barWidth;
            }, 100);
        });
    }
    
    // Trigger skill bar animation when skills section is in view
    const skillsSection = document.getElementById('skills');
    let skillsAnimated = false;
    
    function checkSkillsVisibility() {
        if (skillsSection && !skillsAnimated) {
            const sectionTop = skillsSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (sectionTop < screenPosition) {
                animateSkillBars();
                skillsAnimated = true;
            }
        }
    }
    
    // Add smooth reveal animation to elements when they come into view
    const revealElements = document.querySelectorAll('.skill-card, .project-card, .contact-info, .contact-form');
    
    const revealOnScroll = function() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
        
        // Check if skills section is visible
        checkSkillsVisibility();
    };
    
    // Add 'revealed' class to CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .skill-card, .project-card, .contact-info, .contact-form {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .skill-card.revealed, .project-card.revealed, .contact-info.revealed, .contact-form.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Notification Styles */
        .notification {
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 15px 20px;
            border-radius: 8px;
            background-color: #333;
            color: white;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 1000;
            max-width: 350px;
            font-weight: 500;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: 15px;
        }
        
        .notification.success {
            background-color: #28a745;
            border-left: 5px solid #1e7e34;
        }
        
        .notification.error {
            background-color: #dc3545;
            border-left: 5px solid #bd2130;
        }
        
        .notification.info {
            background-color: #17a2b8;
            border-left: 5px solid #138496;
        }
        
        @media (max-width: 576px) {
            .notification {
                left: 20px;
                right: 20px;
                max-width: calc(100% - 40px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Check for elements in view on page load and scroll
    window.addEventListener('load', revealOnScroll);
    window.addEventListener('scroll', revealOnScroll);
    
    // Animate sections when they come into view
    const animateSections = document.querySelectorAll('.section-title, .section-subtitle');
    
    function animateSectionsOnScroll() {
        animateSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight - 100) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Add animation styles
    const sectionStyle = document.createElement('style');
    sectionStyle.textContent = `
        .section-title, .section-subtitle {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
    `;
    document.head.appendChild(sectionStyle);
    
    // Listen for scroll to animate sections
    window.addEventListener('scroll', animateSectionsOnScroll);
    window.addEventListener('load', animateSectionsOnScroll);
    
    // Set up project modals
    setupProjectModals();

    // Set up lightbox
    setupLightbox();

    // Modal functionality 
    const modalTriggers = document.querySelectorAll('[data-project]');
    const modalClosers = document.querySelectorAll('.close-modal, .modal-footer .btn[data-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const modal = document.getElementById(`${projectId}Modal`);
            if (modal) {
                modal.style.display = 'block';
                document.body.classList.add('modal-open');
            }
        });
    });
    
    modalClosers.forEach(closer => {
        closer.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        });
    });
    
    // Certificate loading variables
    let isLoadingCertificate = false;
    let loadAttempts = 0;
    const maxLoadAttempts = 2;

    // Certificate modal functionality
    function setupCertificateModal() {
        const modal = document.getElementById('certificateModal');
        const img = document.getElementById('certificateImg');
        const closeBtn = document.querySelector('.certificate-close');
        const loadingElement = document.querySelector('.certificate-loading');
        
        // Function to open certificate modal
        window.openCertificateModal = function(imageSrc) {
            if (!modal || !img) return;
            
            // Show modal first
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Set up loading and image
            img.style.display = 'none';
            loadingElement.style.display = 'flex';
            
            // Load the image
            img.onload = function() {
                loadingElement.style.display = 'none';
                img.style.display = 'block';
            };
            
            img.onerror = function() {
                loadingElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Failed to load certificate</p>';
            };
            
            // Set image source to trigger loading
            img.src = imageSrc;
        };
        
        // Close modal when clicking the close button
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        // Close modal when clicking outside the image
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Close modal with ESC key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal && modal.style.display === 'flex') {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Initialize certificate modal on DOM content loaded
    document.addEventListener('DOMContentLoaded', function() {
        setupCertificateModal();
    });

    // Add back to top button functionality
    function setupBackToTopButton() {
        const backToTopButton = document.getElementById('back-to-top');
        
        // Show button when scrolled down
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when clicked
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Call all setup functions
    setupProjectModals();
    setupLightbox();
    setupCertificateModal();
    setupBackToTopButton();
}); 