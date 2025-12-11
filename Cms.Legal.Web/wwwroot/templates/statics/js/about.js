// ===== EXPERIENCE MODAL FUNCTION =====
function showExperienceModal(serviceName) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.experience-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'experience-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeExperienceModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeExperienceModal()">×</button>
            <div class="modal-header">
                <div class="modal-icon">🚀</div>
                <h2>${serviceName}</h2>
            </div>
            <div class="modal-body">
                <p class="modal-intro">Cảm ơn bạn đã quan tâm đến dịch vụ <strong>${serviceName}</strong>!</p>
                <div class="demo-info">
                    <div class="info-item">
                        <span class="info-icon">✓</span>
                        <span>Trải nghiệm miễn phí 30 ngày</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">✓</span>
                        <span>Không cần thẻ tín dụng</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">✓</span>
                        <span>Hỗ trợ 24/7 từ chuyên gia</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">✓</span>
                        <span>Đào tạo miễn phí</span>
                    </div>
                </div>
                <form class="demo-form" onsubmit="submitDemoRequest(event, '${serviceName}')">
                    <div class="form-group">
                        <label>Họ và Tên</label>
                        <input type="text" class="form-input" placeholder="Nhập họ tên của bạn" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-input" placeholder="email@example.com" required>
                    </div>
                    <div class="form-group">
                        <label>Số Điện Thoại</label>
                        <input type="tel" class="form-input" placeholder="0123456789" required>
                    </div>
                    <div class="form-group">
                        <label>Công Ty / Tổ Chức</label>
                        <input type="text" class="form-input" placeholder="Tên công ty (tùy chọn)">
                    </div>
                    <button type="submit" class="btn-submit-demo">
                        Bắt Đầu Trải Nghiệm
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="ms-2">
                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                        </svg>
                    </button>
                </form>
            </div>
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

function closeExperienceModal() {
    const modal = document.querySelector('.experience-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function submitDemoRequest(event, serviceName) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    
    // Close modal
    closeExperienceModal();
    
    // Show success message
    setTimeout(() => {
        showSuccessMessage(name, serviceName);
    }, 400);
}

function showSuccessMessage(name, serviceName) {
    const successModal = document.createElement('div');
    successModal.className = 'experience-modal active';
    successModal.innerHTML = `
        <div class="modal-overlay" onclick="closeExperienceModal()"></div>
        <div class="modal-content success-content">
            <button class="modal-close" onclick="closeExperienceModal()">×</button>
            <div class="success-animation">
                <div class="success-checkmark">
                    <div class="check-icon">
                        <span class="icon-line line-tip"></span>
                        <span class="icon-line line-long"></span>
                        <div class="icon-circle"></div>
                        <div class="icon-fix"></div>
                    </div>
                </div>
            </div>
            <h2 class="success-title">Đăng Ký Thành Công!</h2>
            <p class="success-message">
                Cảm ơn <strong>${name}</strong> đã đăng ký trải nghiệm <strong>${serviceName}</strong>.<br>
                Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.
            </p>
            <button class="btn-close-success" onclick="closeExperienceModal()">Đóng</button>
        </div>
    `;
    
    document.body.appendChild(successModal);
}

function addModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .experience-modal {
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
        
        .experience-modal.active {
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
            padding: 40px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 80px rgba(212, 175, 55, 0.5);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .experience-modal.active .modal-content {
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
        
        .modal-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .modal-icon {
            font-size: 4rem;
            margin-bottom: 15px;
            animation: bounce 1s ease infinite;
        }
        
        .modal-header h2 {
            color: #d4af37;
            font-size: 2rem;
            font-weight: 900;
            margin: 0;
        }
        
        .modal-intro {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1rem;
            text-align: center;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .demo-info {
            background: rgba(0, 0, 0, 0.4);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .info-item {
            display: flex;
            align-items: center;
            gap: 15px;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 15px;
            font-size: 1.05rem;
        }
        
        .info-item:last-child {
            margin-bottom: 0;
        }
        
        .info-icon {
            color: #d4af37;
            font-weight: 900;
            font-size: 1.2rem;
        }
        
        .demo-form {
            margin-top: 30px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            color: #d4af37;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 0.95rem;
        }
        
        .form-input {
            width: 100%;
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(212, 175, 55, 0.3);
            color: #ffffff;
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #d4af37;
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
            background: rgba(0, 0, 0, 0.8);
        }
        
        .form-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }
        
        .btn-submit-demo {
            width: 100%;
            background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
            border: none;
            color: #000000;
            font-weight: 700;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 30px;
        }
        
        .btn-submit-demo:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.6);
        }
        
        /* Success Modal */
        .success-content {
            text-align: center;
        }
        
        .success-animation {
            margin-bottom: 30px;
        }
        
        .success-checkmark {
            width: 120px;
            height: 120px;
            margin: 0 auto;
            position: relative;
        }
        
        .check-icon {
            width: 120px;
            height: 120px;
            position: relative;
            border-radius: 50%;
            box-sizing: content-box;
            border: 4px solid #d4af37;
        }
        
        .icon-line {
            height: 5px;
            background-color: #d4af37;
            display: block;
            border-radius: 2px;
            position: absolute;
            z-index: 10;
        }
        
        .line-tip {
            top: 56px;
            left: 25px;
            width: 25px;
            transform: rotate(45deg);
            animation: checkTip 0.75s;
        }
        
        .line-long {
            top: 48px;
            right: 15px;
            width: 50px;
            transform: rotate(-45deg);
            animation: checkLong 0.75s;
        }
        
        .icon-circle {
            top: -4px;
            left: -4px;
            z-index: 10;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            position: absolute;
            box-sizing: content-box;
            border: 4px solid rgba(212, 175, 55, 0.3);
        }
        
        .icon-fix {
            top: 12px;
            width: 10px;
            left: 34px;
            z-index: 1;
            height: 100px;
            position: absolute;
            transform: rotate(-45deg);
            background: linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(40, 40, 40, 0.98) 100%);
        }
        
        .success-title {
            color: #d4af37;
            font-size: 2.5rem;
            font-weight: 900;
            margin-bottom: 20px;
        }
        
        .success-message {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1rem;
            line-height: 1.8;
            margin-bottom: 30px;
        }
        
        .btn-close-success {
            background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
            border: none;
            color: #000000;
            font-weight: 700;
            padding: 15px 50px;
            border-radius: 10px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
        }
        
        .btn-close-success:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.6);
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes checkTip {
            0% { width: 0; left: 5px; top: 25px; }
            54% { width: 0; left: 5px; top: 25px; }
            70% { width: 30px; left: 0px; top: 56px; }
            84% { width: 17px; left: 21px; top: 56px; }
            100% { width: 25px; left: 25px; top: 56px; }
        }
        
        @keyframes checkLong {
            0% { width: 0; right: 46px; top: 54px; }
            65% { width: 0; right: 46px; top: 54px; }
            84% { width: 55px; right: 0px; top: 48px; }
            100% { width: 50px; right: 15px; top: 48px; }
        }
        
        @media (max-width: 768px) {
            .modal-content {
                padding: 30px 20px;
            }
            
            .modal-header h2 {
                font-size: 1.5rem;
            }
            
            .modal-icon {
                font-size: 3rem;
            }
            
            .success-title {
                font-size: 2rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeExperienceModal();
    }
});

// Scroll animations for about page
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe elements on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.vision-block, .mission-block, .category-card-cta').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        aboutObserver.observe(el);
    });
});
