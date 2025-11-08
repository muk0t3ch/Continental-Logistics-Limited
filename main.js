// main.js - Optimized JavaScript for Continental Logistics

// Debounce function for scroll events
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
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

// Common functionality across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Use requestAnimationFrame for smooth scrolling
    let ticking = false;
    
    // Navbar scroll effect with debouncing
    function updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Back to top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        function updateBackToTop() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        }
        
        window.addEventListener('scroll', debounce(updateBackToTop, 10));
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Set active navigation link based on current page
    setActiveNavLink();

    // Initialize customer slider only if it's in viewport
    const customerSection = document.querySelector('.customers-section');
    if (customerSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initCustomerSlider();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(customerSection);
    }
});

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Get the href attribute and extract filename
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
        
        // Special case for index.html
        if ((currentPage === '' || currentPage === 'index.html') && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });
}

// Customer Slider Functionality with performance optimizations
function initCustomerSlider() {
    const track = document.getElementById('customerTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const logos = document.querySelectorAll('.customer-logo');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const logoWidth = 200 + 60; // width + margin
    let currentPosition = 0;
    const maxPosition = -((logos.length - 4) * logoWidth);
    let autoSlideInterval;
    
    function updateButtons() {
        prevBtn.disabled = currentPosition >= 0;
        nextBtn.disabled = currentPosition <= maxPosition;
    }
    
    function slide(direction) {
        if (direction === 'next') {
            if (currentPosition > maxPosition) {
                currentPosition -= logoWidth * 2;
                if (currentPosition < maxPosition) currentPosition = maxPosition;
            } else {
                // Reset to start for infinite loop
                currentPosition = 0;
            }
        } else {
            if (currentPosition < 0) {
                currentPosition += logoWidth * 2;
                if (currentPosition > 0) currentPosition = 0;
            } else {
                // Reset to end for infinite loop
                currentPosition = maxPosition;
            }
        }
        track.style.transform = `translateX(${currentPosition}px)`;
        updateButtons();
    }
    
    prevBtn.addEventListener('click', function() {
        clearInterval(autoSlideInterval);
        slide('prev');
        startAutoSlide();
    });
    
    nextBtn.addEventListener('click', function() {
        clearInterval(autoSlideInterval);
        slide('next');
        startAutoSlide();
    });
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            slide('next');
        }, 3000); // Slide every 3 seconds
    }
    
    // Initialize button states and start auto-slide
    updateButtons();
    startAutoSlide();
    
    // Pause auto-slide on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    track.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Add touch/swipe support for mobile
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        clearInterval(autoSlideInterval);
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left - next
                slide('next');
            } else {
                // Swipe right - previous
                slide('prev');
            }
            isDragging = false;
        }
    });
    
    track.addEventListener('touchend', () => {
        isDragging = false;
        startAutoSlide();
    });
}

// Lazy load images with Intersection Observer
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}