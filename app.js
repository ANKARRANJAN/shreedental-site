// SHREE DENTALS - Interactive Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initCounters();
    initFormHandling();
    initScrollEffects();
    initHeroButtons();
});

// Navigation Functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('show');
        });
    }

    // Navigation link functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('show');
            }
            
            // Get target section
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('show');
        }
    });
}

// Hero Buttons Functionality
function initHeroButtons() {
    const bookAppointmentBtn = document.querySelector('.hero-buttons .btn--primary');
    const learnMoreBtn = document.querySelector('.hero-buttons .btn--outline');
    
    if (bookAppointmentBtn) {
        bookAppointmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection('#contact');
        });
    }
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection('#about');
        });
    }
}

// Scroll to section function
function scrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight || 70;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll Effects (Header background, Active nav links)
function initScrollEffects() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        // Header background effect
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Active navigation link highlighting
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll Animations (Fade-in effects)
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Animated Counters
function initCounters() {
    const counterElements = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(element => {
        counterObserver.observe(element);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target === 0 ? 0 : target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        if (target === 0) {
            element.textContent = '0';
            return;
        }
        
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
        } else {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        }
    };

    updateCounter();
}

// Form Handling
function initFormHandling() {
    const appointmentForm = document.getElementById('appointmentForm');
    const serviceSelect = document.getElementById('service');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }

    // Ensure service dropdown works properly
    if (serviceSelect) {
        // Add change event listener for feedback
        serviceSelect.addEventListener('change', function() {
            console.log('Service selected:', this.value);
            if (this.value) {
                this.style.color = 'var(--color-text)';
            }
        });
        
        // Fix styling issue that might prevent dropdown from working
        serviceSelect.style.backgroundColor = 'var(--color-surface)';
        serviceSelect.style.border = '1px solid var(--color-border)';
    }

    // Add input focus effects
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (this.parentElement) {
                this.parentElement.classList.add('focused');
            }
        });

        input.addEventListener('blur', function() {
            if (!this.value && this.parentElement) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

function handleFormSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Validate form
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'var(--color-error)';
            setTimeout(() => {
                field.style.borderColor = 'var(--color-border)';
            }, 3000);
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading"></span> Booking...';

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        showNotification('Appointment request submitted successfully! We will contact you soon.', 'success');
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Remove focused classes
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.remove('focused'));
        
    }, 2000);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Set base styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 10000;
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        padding: var(--space-16);
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        font-family: var(--font-family-base);
    `;

    // Set color based on type
    if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
    }

    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: var(--space-12);">
            <span style="color: var(--color-text); font-size: var(--font-size-md); flex: 1;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                font-size: var(--font-size-xl);
                color: var(--color-text-secondary);
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">×</button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification && notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Additional Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Add parallax effect to hero section
    initParallaxEffect();
    
    // Add typewriter effect restart on scroll
    initTypewriterRestart();
    
    // Add smooth button hover effects
    initButtonEffects();
    
    // Initialize lazy loading
    initLazyLoading();
});

function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.3;
            
            if (scrolled < hero.offsetHeight) {
                heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        }, 10));
    }
}

function initTypewriterRestart() {
    const typewriterElement = document.querySelector('.typewriter');
    
    if (typewriterElement) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Restart typewriter animation
                    entry.target.style.animation = 'none';
                    setTimeout(() => {
                        entry.target.style.animation = 'typewriter 3s steps(12) 1s both, blink 1s infinite';
                    }, 10);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(typewriterElement);
    }
}

function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });
}

// Performance optimization - Lazy load sections
function initLazyLoading() {
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, {
        rootMargin: '50px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add custom CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .notification {
        animation: slideInRight 0.3s ease-out;
    }
    
    .achievement-card.highlight {
        animation: pulse 2s ease-in-out infinite;
    }
    
    .btn {
        transition: all 0.2s ease;
    }
    
    .loading {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: currentColor;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('SHREE DENTALS: Non-critical error handled:', e.message);
});

// Ensure all functionality works even if some elements are missing
function safeQuerySelector(selector, callback) {
    const element = document.querySelector(selector);
    if (element && callback) {
        callback(element);
    }
    return element;
}