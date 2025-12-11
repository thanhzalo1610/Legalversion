// ===== FORM VALIDATION =====
const form = document.getElementById('contactForm');
const inputs = form.querySelectorAll('.form-control');

// Add real-time validation
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this);
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
            validateField(this);
        }
    });
});

function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        return false;
    }
    
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            return false;
        }
    }
    
    if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            return false;
        }
    }
    
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    return true;
}

// ===== FORM SUBMISSION =====
function handleSubmit(event) {
    event.preventDefault();
    
    // Validate all fields
    let isValid = true;
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim()
    };
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = 'Sending...';
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        
        // Show success message
        showSuccessModal(formData.fullName);
        
        // Reset form
        form.reset();
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
        
    }, 2000);
}

// ===== SUCCESS MODAL =====
function showSuccessModal(name) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.success-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeSuccessModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeSuccessModal()">×</button>
            <div class="success-icon">
                <svg width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
            </div>
            <h2>Message Sent Successfully!</h2>
            <p>Thank you <strong>${name}</strong> for contacting us.<br>We'll get back to you as soon as possible.</p>
            <button class="btn-close-modal" onclick="closeSuccessModal()">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    addModalStyles();
    
    // Animate in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function addModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .success-modal.active {
            opacity: 1;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
        }
        
        .modal-content {
            position: relative;
            background: linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(40, 40, 40, 0.98) 100%);
            backdrop-filter: blur(20px);
            border: 2px solid #d4af37;
            border-radius: 20px;
            padding: 50px 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .success-modal.active .modal-content {
            transform: scale(1);
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: #d4af37;
            font-size: 2rem;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(212, 175, 55, 0.2);
            transform: rotate(90deg);
        }
        
        .success-icon {
            margin-bottom: 25px;
            animation: scaleIn 0.5s ease;
        }
        
        .success-icon svg {
            color: #d4af37;
            filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.6));
        }
        
        .modal-content h2 {
            color: #d4af37;
            font-size: 2rem;
            font-weight: 900;
            margin: 0 0 20px 0;
        }
        
        .modal-content p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1rem;
            line-height: 1.8;
            margin: 0 0 30px 0;
        }
        
        .btn-close-modal {
            background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
            border: none;
            color: #000000;
            padding: 15px 40px;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-close-modal:hover {
            transform: translateY(-2px);
        }
        
        @keyframes scaleIn {
            from {
                transform: scale(0);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        @media (max-width: 576px) {
            .modal-content {
                padding: 40px 25px;
            }
            
            .modal-content h2 {
                font-size: 1.6rem;
            }
            
            .modal-content p {
                font-size: 1rem;
            }
            
            .success-icon svg {
                width: 60px;
                height: 60px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ===== NOTIFICATION FUNCTION =====
function showNotification(message, type) {
    const existingNotif = document.querySelector('.contact-notification');
    if (existingNotif) existingNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = `contact-notification ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    const colors = {
        success: '#00ff00',
        error: '#ff4444',
        warning: '#ffaa00',
        info: '#4a90e2'
    };
    
    notification.innerHTML = `
        <span style="color: ${colors[type]}; font-size: 1.3rem; font-weight: bold;">${icons[type]}</span>
        <span style="color: rgba(255, 255, 255, 0.9); font-weight: 600;">${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(40, 40, 40, 0.98) 100%);
        backdrop-filter: blur(15px); border: 2px solid ${colors[type]}; border-radius: 10px;
        padding: 15px 20px; display: flex; align-items: center; gap: 12px;
        animation: slideIn 0.4s ease; max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ===== INPUT ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});

// ===== CLOSE MODAL ON ESC =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSuccessModal();
    }
});

// Add notification styles
const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(notifStyle);

console.log('%c Contact Us - Legal AI ', 'background: #d4af37; color: #000; font-size: 16px; font-weight: bold; padding: 8px;');
