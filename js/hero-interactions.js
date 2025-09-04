// Hero Section Interactive Elements
(function() {
    'use strict';

    // DOM Elements
    const hero = document.querySelector('.hero-main-container');
    const particles = document.querySelectorAll('.hero-particle');
    const ctaButtons = document.querySelectorAll('.hero-cta .btn');
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    const floatingElements = document.querySelectorAll('.hero-floating-element');
    const productImage = document.querySelector('.hero-product-image');

    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

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

    // Scroll Animations
    function handleScrollAnimations() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroHeight = hero.offsetHeight;
        const scrollProgress = Math.min(scrollTop / heroHeight, 1);

        // Parallax effect for particles
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.5;
            const yPos = scrollTop * speed * 0.1;
            particle.style.transform = `translateY(${yPos}px)`;
        });

        // Fade out scroll indicator
        if (scrollIndicator) {
            const opacity = Math.max(0, 1 - scrollProgress * 2);
            scrollIndicator.style.opacity = opacity;
        }

        // Floating elements animation
        floatingElements.forEach((element, index) => {
            const speed = 0.02 * (index % 2 === 0 ? 1 : -1);
            const rotation = scrollTop * speed;
            element.style.transform = `rotate(${rotation}deg)`;
        });
    }

    // Mouse Move Effects
    function handleMouseMove(e) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const mouseX = (clientX / innerWidth) * 2 - 1;
        const mouseY = (clientY / innerHeight) * 2 - 1;

        // Subtle parallax for product image
        if (productImage) {
            const maxMove = 10;
            const xMove = mouseX * maxMove;
            const yMove = mouseY * maxMove;
            productImage.style.transform = `translate(${xMove}px, ${yMove}px) scale(1.05)`;
        }

        // Floating elements follow mouse
        floatingElements.forEach((element, index) => {
            const speed = 0.02 * (index + 1);
            const xMove = mouseX * speed * 20;
            const yMove = mouseY * speed * 20;
            element.style.transform = `translate(${xMove}px, ${yMove}px) rotate(${xMove * 0.1}deg)`;
        });
    }

    // Intersection Observer for scroll-triggered animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const animatedElements = document.querySelectorAll('.hero-content, .hero-stats, .hero-visual-content, .hero-trust-signals');
        animatedElements.forEach(el => observer.observe(el));
    }

    // CTA Button Interactions
    function initCTAInteractions() {
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3)';
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });

            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);

                // Handle different button actions
                const action = this.dataset.action;
                if (action === 'shop-now') {
                    // Scroll to products section or navigate to shop
                    const productsSection = document.querySelector('#products') || document.querySelector('.product-grid');
                    if (productsSection) {
                        productsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                } else if (action === 'learn-more') {
                    // Scroll to features section
                    const featuresSection = document.querySelector('#features') || document.querySelector('.features-section');
                    if (featuresSection) {
                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // Scroll Indicator Functionality
    function initScrollIndicator() {
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const nextSection = document.querySelector('.product-grid') || 
                                   document.querySelector('#products') || 
                                   document.querySelector('section:nth-of-type(2)');
                
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            });

            // Animate scroll indicator
            setInterval(() => {
                scrollIndicator.classList.add('bounce');
                setTimeout(() => scrollIndicator.classList.remove('bounce'), 1000);
            }, 3000);
        }
    }

    // Particle System
    function initParticleSystem() {
        particles.forEach((particle, index) => {
            // Random initial positions
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const randomDelay = Math.random() * 2;
            
            particle.style.left = `${randomX}%`;
            particle.style.top = `${randomY}%`;
            particle.style.animationDelay = `${randomDelay}s`;
            
            // Add hover interaction
            particle.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.5)';
                this.style.filter = 'brightness(1.5)';
            });
            
            particle.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.filter = '';
            });
        });
    }

    // Counter Animation for Stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target || counter.textContent);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += step;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    // Initialize all interactive elements
    function init() {
        if (!hero) return;

        // Event listeners
        window.addEventListener('scroll', throttle(handleScrollAnimations, 16));
        window.addEventListener('mousemove', throttle(handleMouseMove, 16));
        
        // Initialize components
        initScrollAnimations();
        initCTAInteractions();
        initScrollIndicator();
        initParticleSystem();
        animateCounters();

        // Add loading animation
        document.body.classList.add('loaded');
        
        // Preload images for better performance
        const images = document.querySelectorAll('.hero-product-image');
        images.forEach(img => {
            if (img.dataset.src) {
                const preloadImg = new Image();
                preloadImg.src = img.dataset.src;
                preloadImg.onload = () => {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                };
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for global access
    window.HeroInteractions = {
        init,
        handleScrollAnimations,
        handleMouseMove
    };

})();