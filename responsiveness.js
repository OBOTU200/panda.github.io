// responsive.js - Responsive and Animation JavaScript

class PortfolioAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupResponsiveFeatures();
        this.checkImageLoading();
    }

    setupEventListeners() {
        // Window resize handler
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.handleResize(), 250);
        });

        // Scroll handler
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileCloseBtn = document.getElementById('mobileCloseBtn');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        if (mobileCloseBtn) {
            mobileCloseBtn.addEventListener('click', () => this.closeMobileMenu());
        }

        // Close mobile menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.smoothScroll(e, anchor));
        });
    }

    initializeAnimations() {
        // Initialize GSAP animations if available
        if (typeof gsap !== 'undefined') {
            this.setupGSAPAnimations();
        } else {
            this.setupBasicAnimations();
        }

        // Initialize Intersection Observer for scroll animations
        this.setupIntersectionObserver();
    }

    setupResponsiveFeatures() {
        this.updateLayout();
        this.setupTouchEvents();
        this.setupImageResponsiveness();
    }

    checkImageLoading() {
        const profileImage = document.getElementById('profileImage');
        const backupAvatar = document.getElementById('backupAvatar');

        if (profileImage) {
            profileImage.onload = () => {
                console.log('Profile image loaded successfully!');
                if (backupAvatar) backupAvatar.style.display = 'none';
            };

            profileImage.onerror = () => {
                console.log('Profile image failed to load');
                if (backupAvatar) {
                    profileImage.style.display = 'none';
                    backupAvatar.style.display = 'flex';
                }
            };

            // Check image after 3 seconds
            setTimeout(() => {
                if (profileImage.naturalHeight === 0 && backupAvatar) {
                    profileImage.style.display = 'none';
                    backupAvatar.style.display = 'flex';
                }
            }, 3000);
        }
    }

    handleResize() {
        this.updateLayout();
        this.updateImageSizes();
        this.handleMobileMenuOnResize();
    }

    handleScroll() {
        this.updateHeaderOnScroll();
        this.triggerScrollAnimations();
        this.updateParallaxEffects();
    }

    updateHeaderOnScroll() {
        const header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const body = document.body;
        
        if (navLinks) {
            navLinks.classList.toggle('active');
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            
            // Add animation to menu items
            if (navLinks.classList.contains('active')) {
                this.animateMenuItems();
            }
        }
    }

    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const body = document.body;
        
        if (navLinks) {
            navLinks.classList.remove('active');
            body.style.overflow = '';
        }
    }

    handleMobileMenuOnResize() {
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth > 768 && navLinks) {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    smoothScroll(e, anchor) {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            if (window.innerWidth <= 768) {
                this.closeMobileMenu();
            }
        }
    }

    updateLayout() {
        // Update container sizes based on viewport
        const containers = document.querySelectorAll('.container, .profile-img-container');
        containers.forEach(container => {
            if (container.classList.contains('profile-img-container')) {
                this.updateProfileImageSize(container);
            }
        });
    }

    updateProfileImageSize(container) {
        if (window.innerWidth <= 480) {
            container.style.width = '280px';
            container.style.height = '280px';
        } else if (window.innerWidth <= 768) {
            container.style.width = '320px';
            container.style.height = '320px';
        } else {
            container.style.width = '380px';
            container.style.height = '380px';
        }
    }

    updateImageSizes() {
        const images = document.querySelectorAll('.profile-img, .project-img img');
        images.forEach(img => {
            if (window.innerWidth <= 768) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });
    }

    setupTouchEvents() {
        // Add touch support for mobile devices
        if ('ontouchstart' in window) {
            document.querySelectorAll('.skill-card, .project-card').forEach(card => {
                card.addEventListener('touchstart', () => {
                    card.classList.add('touch-active');
                }, { passive: true });
                
                card.addEventListener('touchend', () => {
                    setTimeout(() => {
                        card.classList.remove('touch-active');
                    }, 150);
                }, { passive: true });
            });
        }
    }

    setupImageResponsiveness() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    setupGSAPAnimations() {
        // Profile image floating animation
        const profileContainer = document.querySelector('.profile-img-container');
        if (profileContainer) {
            gsap.to(profileContainer, {
                y: 20,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        }

        // Skill cards stagger animation
        const skillCards = document.querySelectorAll('.skill-card');
        if (skillCards.length > 0) {
            gsap.from(skillCards, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: '#skills',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // Project cards animation
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length > 0) {
            gsap.from(projectCards, {
                x: -50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '#projects',
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
    }

    setupBasicAnimations() {
        // Basic fade-in animations for elements
        const fadeElements = document.querySelectorAll('.fade-in');
        
        function checkFadeIn() {
            fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('visible');
                }
            });
        }
        
        window.addEventListener('scroll', checkFadeIn);
        checkFadeIn(); // Initial check
    }

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Add specific animations based on element class
                    if (entry.target.classList.contains('skill-card')) {
                        this.animateSkillCard(entry.target);
                    } else if (entry.target.classList.contains('project-card')) {
                        this.animateProjectCard(entry.target);
                    } else if (entry.target.classList.contains('contact-item')) {
                        this.animateContactItem(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.skill-card, .project-card, .contact-item, .section-title').forEach(el => {
            observer.observe(el);
        });
    }

    animateSkillCard(card) {
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
        
        // Add hover effect enhancement
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
            card.style.boxShadow = '0 25px 50px rgba(244, 0, 9, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = 'var(--coca-shadow)';
        });
    }

    animateProjectCard(card) {
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
        
        // Add 3D tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    }

    animateContactItem(item) {
        item.style.transform = 'scale(1)';
        item.style.opacity = '1';
        
        // Pulsing animation for contact icons
        const icon = item.querySelector('.contact-icon');
        if (icon) {
            setInterval(() => {
                icon.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 300);
            }, 3000);
        }
    }

    animateMenuItems() {
        const menuItems = document.querySelectorAll('.nav-links a');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('slide-in');
        });
    }

    triggerScrollAnimations() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Parallax effect for hero section
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            const speed = 0.5;
            const yPos = -(scrollPosition * speed);
            heroImage.style.transform = `translateY(${yPos}px)`;
        }
        
        // Animate sections on scroll
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition > sectionTop - windowHeight + 100) {
                section.classList.add('in-view');
            }
        });
    }

    updateParallaxEffects() {
        // Update any parallax elements
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            const yPos = -(window.scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Initialize portfolio animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioAnimations();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioAnimations;
}
