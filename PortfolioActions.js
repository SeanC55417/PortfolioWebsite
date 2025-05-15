// Improved Portfolio Actions
function RedirectHome() {
    window.location.href = "PortfolioHome.html";
}

function RedirectWorkHistory() {
    window.location.href = "WorkHistory.html";
}

function RedirectProjects() {
    window.location.href = "Projects.html";
}

function RedirectContactInfo() {
    window.location.href = "ContactInfo.html";
}

// Email sending functionality using EmailJS
function sendEmail(event) {
    event.preventDefault(); // Prevent form from submitting normally
    
    // Show sending indicator
    const submitButton = document.getElementById('submit-btn');
    const originalButtonText = submitButton.innerText;
    submitButton.innerText = 'Sending...';
    submitButton.disabled = true;
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Send email using EmailJS
    emailjs.send('service_id', 'template_id', {
        from_name: name,
        reply_to: email,
        message: message
    })
    .then(function() {
        // Show success message
        document.getElementById('form-status').innerHTML = 
            '<div class="success-message">Message sent successfully!</div>';
        
        // Reset form
        document.getElementById('contact-form').reset();
        
        // Reset button
        submitButton.innerText = originalButtonText;
        submitButton.disabled = false;
    })
    .catch(function(error) {
        // Show error message
        document.getElementById('form-status').innerHTML = 
            '<div class="error-message">Failed to send message. Please try again.</div>';
        
        // Log error to console
        console.error('EmailJS error:', error);
        
        // Reset button
        submitButton.innerText = originalButtonText;
        submitButton.disabled = false;
    });
}

// Enhanced Slider Functionality
// Track current slide index and interval for each slider
const sliderStates = {};
const AUTO_SLIDE_INTERVAL = 5000; // Time in milliseconds between auto transitions (5 seconds)

// Initialize slider once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
});

function initializeSlider(sliderId) {
    const slider = document.getElementById(sliderId);
    const slides = slider.querySelectorAll('.slide-img');
    const dots = document.querySelector(`.slider-dots[data-slider="${sliderId}"]`).querySelectorAll('.dot');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');
    
    // If no slides, exit the function
    if (slides.length === 0) return;
    
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
    const slides = slider.querySelectorAll('.slide-img');
    const dots = document.querySelector(`.slider-dots[data-slider="${sliderId}"]`).querySelectorAll('.dot');
    
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