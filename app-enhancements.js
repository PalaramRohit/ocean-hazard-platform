// app-enhancements.js - UI/UX improvements that work with existing code

document.addEventListener('DOMContentLoaded', () => {
    // Add loading states to form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner"></span>
                ${submitBtn.textContent.trim()}
            `;
            
            // Re-enable after form handling completes
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }, 1000);
        });
    });

    // Add client-side validation
    document.querySelectorAll('input[required], select[required]').forEach(input => {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'This field is required';
        
        // Only add if not already present
        if (!input.nextElementSibling?.classList?.contains('error-message')) {
            input.parentNode.insertBefore(errorMsg, input.nextSibling);
        }

        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.classList.add('error');
            if (this.nextElementSibling?.classList?.contains('error-message')) {
                this.nextElementSibling.style.display = 'block';
            }
        });

        input.addEventListener('input', function() {
            this.classList.remove('error');
            if (this.nextElementSibling?.classList?.contains('error-message')) {
                this.nextElementSibling.style.display = 'none';
            }
        });
    });

    // Add loading overlay for page transitions
    document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                const overlay = document.createElement('div');
                overlay.className = 'loader-overlay';
                overlay.innerHTML = '<div class="loader"></div>';
                document.body.appendChild(overlay);
                
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 500);
            }
        });
    });
});

// Show loading overlay for AJAX operations
function showLoading(show = true) {
    let overlay = document.querySelector('.loader-overlay');
    
    if (show) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'loader-overlay';
            overlay.innerHTML = '<div class="loader"></div>';
            document.body.appendChild(overlay);
        }
        return () => document.body.removeChild(overlay);
    } else if (overlay) {
        document.body.removeChild(overlay);
    }
    
    return () => {};
}

// Add to window for global access
window.showLoading = showLoading;
