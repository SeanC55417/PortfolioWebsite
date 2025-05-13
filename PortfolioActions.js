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

// Initialize EmailJS when the page loads (for contact page)
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the contact page
    if (document.getElementById('contact-form')) {
        // Initialize EmailJS with your user ID
        emailjs.init("YOUR_USER_ID"); // Replace with your actual EmailJS user ID
        
        // Add event listener to the contact form
        document.getElementById('contact-form').addEventListener('submit', sendEmail);
    }
});