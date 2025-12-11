document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lawyerRegisterForm');
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('documents');
  const uploadedFilesContainer = document.getElementById('uploadedFiles');
  
  let uploadedFiles = [];

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        showNotification('Tệp ' + file.name + ' vượt quá 10MB', 'error');
        return;
      }
      
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        showNotification('Định dạng tệp không hợp lệ: ' + file.name, 'error');
        return;
      }
      
      if (!uploadedFiles.find(f => f.name === file.name)) {
        uploadedFiles.push(file);
        renderUploadedFiles();
      }
    });
  }

  function renderUploadedFiles() {
    uploadedFilesContainer.innerHTML = uploadedFiles.map((file, index) => `
      <div class="uploaded-file">
        <span class="file-name">${file.name}</span>
        <span class="remove-file" data-index="${index}">✕</span>
      </div>
    `).join('');

    document.querySelectorAll('.remove-file').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        uploadedFiles.splice(index, 1);
        renderUploadedFiles();
      });
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
      <span class="loading-spinner"></span>
      <span>Đang xử lý...</span>
    `;
    submitBtn.disabled = true;

    const formData = new FormData(form);
    
    const specializations = [];
    document.querySelectorAll('input[name="specialization"]:checked').forEach(cb => {
      specializations.push(cb.value);
    });
    
    if (specializations.length === 0) {
      showNotification('Vui lòng chọn ít nhất một lĩnh vực chuyên môn', 'error');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      return;
    }

    const data = {
      lastName: formData.get('lastName'),
      firstName: formData.get('firstName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      licenseNumber: formData.get('licenseNumber'),
      barAssociation: formData.get('barAssociation'),
      experience: formData.get('experience'),
      specializations: specializations,
      lawFirm: formData.get('lawFirm'),
      address: formData.get('address'),
      bio: formData.get('bio'),
      documents: uploadedFiles.map(f => f.name)
    };

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Form submitted:', data);
    
    showNotification('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong 24-48 giờ.', 'success');
    
    showSuccessModal();
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  });

  function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close">✕</button>
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });

    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3>Đăng Ký Thành Công!</h3>
        <p>Cảm ơn bạn đã đăng ký trở thành Luật sư đối tác của LexAI.</p>
        <p class="sub-text">Hồ sơ của bạn sẽ được xét duyệt trong vòng 24-48 giờ làm việc. Chúng tôi sẽ gửi email thông báo kết quả.</p>
        <a href="index.html" class="btn-gold">Về Trang Chủ</a>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    modal.querySelector('.modal-overlay').addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(0, 0, 0, 0.3);
      border-top-color: #000;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .notification {
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: rgba(17, 17, 17, 0.95);
      border: 1px solid var(--dark-border);
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 1rem;
      z-index: 10000;
      transform: translateX(120%);
      transition: transform 0.3s ease;
      backdrop-filter: blur(20px);
      max-width: 400px;
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification.success {
      border-color: var(--gold);
    }
    
    .notification.error {
      border-color: #ff6b6b;
    }
    
    .notification span {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem;
      font-size: 1rem;
    }
    
    .success-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    
    .success-modal.show {
      opacity: 1;
      visibility: visible;
    }
    
    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
    }
    
    .modal-content {
      position: relative;
      background: rgba(17, 17, 17, 0.95);
      border: 1px solid var(--gold);
      border-radius: 24px;
      padding: 3rem;
      text-align: center;
      max-width: 450px;
      margin: 1rem;
      transform: scale(0.9);
      transition: transform 0.3s ease;
    }
    
    .success-modal.show .modal-content {
      transform: scale(1);
    }
    
    .success-icon {
      color: var(--gold);
      margin-bottom: 1.5rem;
    }
    
    .modal-content h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--white);
    }
    
    .modal-content p {
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }
    
    .modal-content .sub-text {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 2rem;
    }
    
    .modal-content .btn-gold {
      display: inline-flex;
    }
  `;
  document.head.appendChild(style);

  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
});