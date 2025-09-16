// Show notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Add password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
});

function updatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthMeter = document.getElementById('password-strength');
    
    if (!strengthMeter) return;
    
    // Reset classes
    strengthMeter.className = 'password-strength';
    
    if (!password) {
        strengthMeter.style.width = '0%';
        return;
    }
    
    // Calculate strength (simple example)
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    
    // Update UI
    strengthMeter.style.width = `${strength}%`;
    
    // Update color based on strength
    if (strength < 50) {
        strengthMeter.classList.add('weak');
    } else if (strength < 75) {
        strengthMeter.classList.add('medium');
    } else {
        strengthMeter.classList.add('strong');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    // Get form values
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = document.getElementById('user-role').value;
    
    // Validate form
    if (!fullname || !email || !username || !password || !confirmPassword || !role) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('#signup-form button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Creating Account...';
        
        // Call the signup API
        const userData = {
            name: fullname,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password,
            role
        };
        
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create account');
        }
        
        // Redirect to login page with success message
        window.location.href = 'index.html?signup=success';
        
    } catch (error) {
        console.error('Signup error:', error);
        alert(error.message || 'An error occurred during signup. Please try again.');
    } finally {
        // Reset button state
        const submitBtn = document.querySelector('#signup-form button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    }
}
