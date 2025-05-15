// Portfolio Actions
// Main JavaScript file for Sean Chin's Portfolio

// Init function - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize slider functionality
    initSliders();
});

// Smooth scrolling for navigation
function initSmoothScrolling() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a.NavButton').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Update active state in navigation
                document.querySelectorAll('a.NavButton').forEach(nav => {
                    nav.classList.remove('active');
                });
                this.classList.add('active');
                
                // Smooth scroll to the target section
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active section based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Get all sections and corresponding nav items
        const sections = document.querySelectorAll('section[id]');
        const navButtons = document.querySelectorAll('a.NavButton');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navButtons.forEach(navButton => {
                    navButton.classList.remove('active');
                    if (navButton.getAttribute('href') === '#' + sectionId) {
                        navButton.classList.add('active');
                    }
                });
            }
        });
    });
}

// Enhanced Slider Functionality
// Track current slide index and interval for each slider
const sliderStates = {};
const AUTO_SLIDE_INTERVAL = 5000; // Time in milliseconds between auto transitions (5 seconds)

// Initialize sliders
function initSliders() {
    // Find all sliders on the page
    const sliders = document.querySelectorAll('.slider-container');
    
    // If no sliders, exit the function
    if (sliders.length === 0) return;
    
    // Initialize each slider
    sliders.forEach(slider => {
        const sliderId = slider.id;
        
        // Initialize state for this slider
        sliderStates[sliderId] = {
            currentSlide: 0,
            autoPlayInterval: null,
            userInteracted: false,
            lastInteractionTime: Date.now()
        };
        
        initializeSlider(sliderId);
        startAutoPlay(sliderId);
    });
    
    // Reset user interaction flag after inactivity
    document.addEventListener('mousemove', function() {
        for (const sliderId in sliderStates) {
            sliderStates[sliderId].lastInteractionTime = Date.now();
        }
    });
}

function initializeSlider(sliderId) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.slide-img');
    if (slides.length === 0) return;
    
    const dotContainer = document.querySelector(`.slider-dots[data-slider="${sliderId}"]`);
    if (!dotContainer) return;
    
    const dots = dotContainer.querySelectorAll('.dot');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');
    
    // Set up event listeners for buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            handleUserInteraction(sliderId);
            changeSlide(sliderId, sliderStates[sliderId].currentSlide - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            handleUserInteraction(sliderId);
            changeSlide(sliderId, sliderStates[sliderId].currentSlide + 1);
        });
    }
    
    // Set up event listeners for dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            handleUserInteraction(sliderId);
            const slideIndex = parseInt(this.getAttribute('data-index'));
            changeSlide(sliderId, slideIndex);
        });
    });
    
    // Pause auto-play when hovering over slider
    slider.addEventListener('mouseenter', function() {
        handleUserInteraction(sliderId);
    });
    
    // Resume auto-play when mouse leaves
    slider.addEventListener('mouseleave', function() {
        resetInactivityTimer(sliderId);
    });
}

function handleUserInteraction(sliderId) {
    sliderStates[sliderId].userInteracted = true;
    sliderStates[sliderId].lastInteractionTime = Date.now();
    
    // Stop auto-play temporarily
    if (sliderStates[sliderId].autoPlayInterval) {
        clearInterval(sliderStates[sliderId].autoPlayInterval);
        sliderStates[sliderId].autoPlayInterval = null;
    }
}

function resetInactivityTimer(sliderId) {
    // Check if the auto-play was stopped due to user interaction
    if (sliderStates[sliderId].userInteracted) {
        // Set a timeout to restart auto-play after inactivity
        setTimeout(function() {
            const currentTime = Date.now();
            const timeSinceLastInteraction = currentTime - sliderStates[sliderId].lastInteractionTime;
            
            // If no interaction for more than AUTO_SLIDE_INTERVAL, restart auto-play
            if (timeSinceLastInteraction >= AUTO_SLIDE_INTERVAL) {
                sliderStates[sliderId].userInteracted = false;
                startAutoPlay(sliderId);
            }
        }, AUTO_SLIDE_INTERVAL);
    }
}

function startAutoPlay(sliderId) {
    // Clear any existing interval
    if (sliderStates[sliderId].autoPlayInterval) {
        clearInterval(sliderStates[sliderId].autoPlayInterval);
    }
    
    // Start a new interval
    sliderStates[sliderId].autoPlayInterval = setInterval(function() {
        // Only auto-advance if user hasn't interacted recently
        if (!sliderStates[sliderId].userInteracted) {
            const nextSlide = sliderStates[sliderId].currentSlide + 1;
            changeSlide(sliderId, nextSlide);
        } else {
            // Check if enough time has passed since last interaction
            const currentTime = Date.now();
            const timeSinceLastInteraction = currentTime - sliderStates[sliderId].lastInteractionTime;
            
            if (timeSinceLastInteraction >= AUTO_SLIDE_INTERVAL) {
                sliderStates[sliderId].userInteracted = false;
            }
        }
    }, AUTO_SLIDE_INTERVAL);
}

function changeSlide(sliderId, index) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.slide-img');
    if (slides.length === 0) return;
    
    const dotContainer = document.querySelector(`.slider-dots[data-slider="${sliderId}"]`);
    if (!dotContainer) return;
    
    const dots = dotContainer.querySelectorAll('.dot');
    
    // Handle wrapping around
    if (index < 0) {
        index = slides.length - 1;
    } else if (index >= slides.length) {
        index = 0;
    }
    
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    slides[index].classList.add('active');
    if (dots[index]) {
        dots[index].classList.add('active');
    }
    
    // Update current slide index for this slider
    sliderStates[sliderId].currentSlide = index;
}