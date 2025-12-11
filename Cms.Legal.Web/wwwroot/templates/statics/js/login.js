// ===== TOGGLE PASSWORD VISIBILITY =====
function togglePassword() {
    const passwordInput = document.getElementById('Input_Password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = `
            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
        `;
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = `
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
        `;
    }
}

// ===== HANDLE LOGIN FORM SUBMISSION =====
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validate inputs
    if (!email || !password) {
        showNotification('Vui lòng điền đầy đủ thông tin!', 'warning');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Email không hợp lệ!', 'error');
        return;
    }
    
    // Show loading
    const loginBtn = document.querySelector('.btn-login');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<span>Đang đăng nhập...</span>';
    loginBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
        
        // Show success
        showNotification('Đăng nhập thành công! Đang chuyển hướng...', 'success');
        
        // Store login info if remember is checked
        if (remember) {
            localStorage.setItem('rememberedEmail', email);
        }
        
        // Redirect after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

// ===== SOCIAL LOGIN FUNCTIONS =====
function loginWithGoogle() {
    showNotification('Đang kết nối với Google...', 'info');
    // Simulate OAuth flow
    setTimeout(() => {
        showNotification('Đăng nhập Google thành công!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

function loginWithFacebook() {
    showNotification('Đang kết nối với Facebook...', 'info');
    setTimeout(() => {
        showNotification('Đăng nhập Facebook thành công!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

function loginWithApple() {
    showNotification('Đang kết nối với Apple...', 'info');
    setTimeout(() => {
        showNotification('Đăng nhập Apple thành công!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

function loginWithMicrosoft() {
    showNotification('Đang kết nối với Microsoft...', 'info');
    setTimeout(() => {
        showNotification('Đăng nhập Microsoft thành công!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

// ===== NOTIFICATION FUNCTION =====
function showNotification(message, type) {
    const existingNotif = document.querySelector('.login-notification');
    if (existingNotif) existingNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = `login-notification ${type}`;
    
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const colors = { success: '#00ff00', error: '#ff4444', warning: '#ffaa00', info: '#4a90e2' };
    
    notification.innerHTML = `
        <span style="color: ${colors[type]}; font-size: 1.3rem; font-weight: bold;">${icons[type]}</span>
        <span style="color: rgba(255, 255, 255, 0.9); font-weight: 600;">${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(40, 40, 40, 0.98) 100%);
        backdrop-filter: blur(15px); border: 2px solid ${colors[type]}; border-radius: 10px;
        padding: 15px 20px; display: flex; align-items: center; gap: 12px;
        animation: slideIn 0.4s ease; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ===== LOAD REMEMBERED EMAIL =====
document.addEventListener('DOMContentLoaded', () => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
    
    // Add input animations
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});

// ===== FORGOT PASSWORD =====
document.addEventListener('DOMContentLoaded', () => {
    const forgotLink = document.querySelector('.forgot-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Tính năng đặt lại mật khẩu sẽ được phát triển sớm!', 'info');
        });
    }
    
    const registerLink = document.querySelector('.register-link a');
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Tính năng đăng ký sẽ được phát triển sớm!', 'info');
        });
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

console.log('%c Login - Legal AI ', 'background: #d4af37; color: #000; font-size: 16px; font-weight: bold; padding: 8px;');
console.log('%c Social login buttons ready ', 'color: #d4af37; font-size: 12px;');
