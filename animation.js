// animations.js - Image and Visual Effects Animations

class ImageAnimations {
    constructor() {
        this.initImageAnimations();
        this.setupHoverEffects();
        this.setupScrollAnimations();
        this.setupLoadingAnimations();
    }

    initImageAnimations() {
        // Profile image special effects
        const profileImage = document.getElementById('profileImage');
        const profileContainer = document.querySelector('.profile-img-container');
        
        if (profileImage && profileContainer) {
            // Glow effect on hover
            profileContainer.addEventListener('mouseenter', () => {
                this.createGlowEffect(profileContainer);
                this.rotateImageBorder();
            });
            
            profileContainer.addEventListener('mouseleave', () => {
                this.removeGlowEffect(profileContainer);
            });
            
            // Click effect
            profileContainer.addEventListener('click', () => {
                this.createRippleEffect(profileContainer);
            });
            
            // Parallax effect on mouse move
            profileContainer.addEventListener('mousemove', (e) => {
                this.applyParallaxEffect(profileContainer, e);
            });
        }
        
        // Project images animation
        this.animateProjectImages();
        
        // Skill icons animation
        this.animateSkillIcons();
    }

    createGlowEffect(element) {
        // Remove existing glow
        const existingGlow = element.querySelector('.image-glow');
        if (existingGlow) existingGlow.remove();
        
        // Create glow element
        const glow = document.createElement('div');
        glow.className = 'image-glow';
        glow.style.cssText = `
            position: absolute;
            top: -20px;
            left: -20px;
            right: -20px;
            bottom: -20px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(244, 0, 9, 0.3) 0%, transparent 70%);
            z-index: -1;
            animation: pulse 2s infinite;
        `;
        
        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 0.5; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
        
        element.appendChild(glow);
        
        // Add floating animation to image
        const img = element.querySelector('.profile-img');
        if (img) {
            img.style.transform = 'scale(1.05) rotate(5deg)';
            img.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }
    }

    removeGlowEffect(element) {
        const glow = element.querySelector('.image-glow');
        if (glow) glow.remove();
        
        const img = element.querySelector('.profile-img');
        if (img) {
            img.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    rotateImageBorder() {
        const border = document.querySelector('.img-border');
        if (border) {
            border.style.animation = 'spin 10s linear infinite';
        }
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(244, 0, 9, 0.3);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 1;
        `;
        
        element.appendChild(ripple);
        
        // Animate ripple
        setTimeout(() => {
            ripple.style.width = '100%';
            ripple.style.height = '100%';
            ripple.style.opacity = '0';
            ripple.style.transition = 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            // Remove after animation
            setTimeout(() => {
                if (ripple.parentNode === element) {
                    element.removeChild(ripple);
                }
            }, 1000);
        }, 10);
    }

    applyParallaxEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / 20;
        const moveY = (y - centerY) / 20;
        
        const img = element.querySelector('.profile-img');
        if (img) {
            img.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        }
        
        // Move border opposite direction for depth effect
        const border = element.querySelector('.img-border');
        if (border) {
            border.style.transform = `translate(${-moveX}px, ${-moveY}px) rotate(var(--rotation))`;
        }
    }

    animateProjectImages() {
        const projectImages = document.querySelectorAll('.project-img');
        
        projectImages.forEach((imgContainer, index) => {
            // Add initial animation delay
            imgContainer.style.animationDelay = `${index * 0.2}s`;
            
            // Hover effect
            imgContainer.addEventListener('mouseenter', () => {
                this.zoomProjectImage(imgContainer);
                this.addImageOverlay(imgContainer);
            });
            
            imgContainer.addEventListener('mouseleave', () => {
                this.resetProjectImage(imgContainer);
                this.removeImageOverlay(imgContainer);
            });
            
            // Click to expand
            imgContainer.addEventListener('click', (e) => {
                if (window.innerWidth > 768) {
                    this.toggleImageExpansion(imgContainer);
                    e.stopPropagation();
                }
            });
        });
        
        // Close expanded images when clicking outside
        document.addEventListener('click', () => {
            this.closeAllExpandedImages();
        });
    }

    zoomProjectImage(element) {
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.3s ease';
        
        // Add subtle rotation
        const rotation = Math.random() * 4 - 2; // Random between -2 and 2 degrees
        element.style.transform += ` rotate(${rotation}deg)`;
        
        // Add glow
        element.style.boxShadow = '0 15px 35px rgba(244, 0, 9, 0.25)';
    }

    resetProjectImage(element) {
        element.style.transform = 'scale(1) rotate(0deg)';
        element.style.boxShadow = 'none';
    }

    addImageOverlay(element) {
        let overlay = element.querySelector('.project-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'project-overlay';
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, rgba(244, 0, 9, 0.8), rgba(244, 0, 9, 0.4));
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 2;
            `;
            
            const viewIcon = document.createElement('i');
            viewIcon.className = 'fas fa-expand';
            viewIcon.style.cssText = `
                color: white;
                font-size: 2rem;
                opacity: 0;
                transform: scale(0.5);
                transition: all 0.3s ease 0.1s;
            `;
            
            overlay.appendChild(viewIcon);
            element.appendChild(overlay);
            
            // Animate in
            setTimeout(() => {
                overlay.style.opacity = '1';
                viewIcon.style.opacity = '1';
                viewIcon.style.transform = 'scale(1)';
            }, 50);
        }
    }

    removeImageOverlay(element) {
        const overlay = element.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            const icon = overlay.querySelector('i');
            if (icon) {
                icon.style.opacity = '0';
                icon.style.transform = 'scale(0.5)';
            }
            
            // Remove after animation
            setTimeout(() => {
                if (overlay.parentNode === element) {
                    element.removeChild(overlay);
                }
            }, 300);
        }
    }

    toggleImageExpansion(element) {
        const isExpanded = element.classList.contains('expanded');
        
        if (isExpanded) {
            this.closeExpandedImage(element);
        } else {
            this.closeAllExpandedImages();
            this.expandImage(element);
        }
    }

    expandImage(element) {
        element.classList.add('expanded');
        
        // Store original position
        const rect = element.getBoundingClientRect();
        element.dataset.originalTop = rect.top + window.scrollY;
        element.dataset.originalLeft = rect.left;
        element.dataset.originalWidth = rect.width;
        element.dataset.originalHeight = rect.height;
        
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'image-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Animate to modal
        setTimeout(() => {
            element.style.position = 'fixed';
            element.style.top = '50%';
            element.style.left = '50%';
            element.style.transform = 'translate(-50%, -50%) scale(1.2)';
            element.style.width = '80vw';
            element.style.height = '80vh';
            element.style.maxWidth = '800px';
            element.style.maxHeight = '600px';
            element.style.zIndex = '10000';
            element.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            overlay.style.opacity = '1';
            
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--coca-red);
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                z-index: 10001;
                transition: transform 0.3s ease;
            `;
            
            closeBtn.addEventListener('click', () => this.closeExpandedImage(element));
            document.body.appendChild(closeBtn);
            
            element.dataset.closeBtn = closeBtn;
        }, 10);
    }

    closeExpandedImage(element) {
        element.classList.remove('expanded');
        
        // Remove modal overlay
        const overlay = document.querySelector('.image-modal-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
        
        // Remove close button
        const closeBtn = element.dataset.closeBtn;
        if (closeBtn && closeBtn.parentNode) {
            closeBtn.parentNode.removeChild(closeBtn);
        }
        
        // Reset to original position
        element.style.position = '';
        element.style.top = '';
        element.style.left = '';
        element.style.transform = '';
        element.style.width = '';
        element.style.height = '';
        element.style.zIndex = '';
        element.style.maxWidth = '';
        element.style.maxHeight = '';
    }

    closeAllExpandedImages() {
        document.querySelectorAll('.project-img.expanded').forEach(img => {
            this.closeExpandedImage(img);
        });
    }

    animateSkillIcons() {
        const skillIcons = document.querySelectorAll('.skill-icon');
        
        skillIcons.forEach((icon, index) => {
            // Staggered entrance animation
            icon.style.animationDelay = `${index * 0.1}s`;
            icon.classList.add('bounce-in');
            
            // Hover animation
            icon.addEventListener('mouseenter', () => {
                this.pulseIcon(icon);
                this.createIconParticles(icon);
            });
            
            // Click animation
            icon.addEventListener('click', () => {
                this.spinIcon(icon);
            });
        });
    }

    pulseIcon(icon) {
        icon.style.transform = 'scale(1.2)';
        icon.style.color = '#ff3366';
        icon.style.transition = 'all 0.3s ease';
        
        // Add glow
        icon.style.textShadow = '0 0 20px rgba(244, 0, 9, 0.5)';
        
        // Reset after animation
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
            icon.style.color = 'var(--coca-red)';
            icon.style.textShadow = 'none';
        }, 300);
    }

    createIconParticles(icon) {
        const rect = icon.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--coca-red);
                border-radius: 50%;
                top: ${centerY}px;
                left: ${centerX}px;
                pointer-events: none;
