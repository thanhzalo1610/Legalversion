// ===== STATE MANAGEMENT =====
let uploadedFiles = [];
let educationCount = 1;
let practiceAreaCount = 1;
let barAdmissionCount = 1;

// ===== ADD BAR ADMISSION =====
function addBarAdmission() {
    barAdmissionCount++;
    const barAdmissionsList = document.getElementById('barAdmissionsList');
    
    const barAdmissionItem = document.createElement('div');
    barAdmissionItem.className = 'bar-admission-item';
    barAdmissionItem.innerHTML = `
        <button type="button" class="btn-remove-item" onclick="removeBarAdmission(this)">×</button>
        <div class="row g-3">
            <div class="col-md-6">
                <div class="form-group">
                    <label>BAR ASSOCIATION</label>
                    <select class="form-control" required>
                        <option value="">Select your bar...</option>
                        <option value="vietnam">Vietnam Bar Federation</option>
                        <option value="hanoi">Hanoi Bar Association</option>
                        <option value="hcm">Ho Chi Minh City Bar Association</option>
                        <option value="danang">Da Nang Bar Association</option>
                    </select>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label>LICENSE NUMBER</label>
                    <input type="text" class="form-control" placeholder="" required>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>ADMISSION DATE</label>
            <input type="date" class="form-control" placeholder="mm/dd/yyyy" required>
        </div>
    `;
    
    barAdmissionsList.appendChild(barAdmissionItem);
    showNotification('Bar admission entry added successfully.', 'success');
}

function removeBarAdmission(button) {
    const barAdmissionItem = button.parentElement;
    barAdmissionItem.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        barAdmissionItem.remove();
        barAdmissionCount--;
        showNotification('Bar admission entry removed.', 'info');
    }, 300);
}

// ===== ADD EDUCATION =====
function addEducation() {
    educationCount++;
    const educationList = document.getElementById('educationList');
    
    const educationItem = document.createElement('div');
    educationItem.className = 'education-item';
    educationItem.innerHTML = `
        <button type="button" class="btn-remove-item" onclick="removeEducation(this)">×</button>
        <div class="row g-3">
            <div class="col-md-6">
                <div class="form-group">
                    <label>INSTITUTION</label>
                    <input type="text" class="form-control" placeholder="">
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label>DEGREE</label>
                    <input type="text" class="form-control" placeholder="e.g., Juris Doctor (J.D.)">
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>GRADUATION YEAR</label>
            <input type="text" class="form-control" placeholder="e.g., 2010">
        </div>
    `;
    
    educationList.appendChild(educationItem);
    showNotification('Education entry added successfully.', 'success');
}

function removeEducation(button) {
    const educationItem = button.parentElement;
    educationItem.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        educationItem.remove();
        educationCount--;
        showNotification('Education entry removed.', 'info');
    }, 300);
}

// ===== ADD PRACTICE AREA =====
function addPracticeArea() {
    practiceAreaCount++;
    const practiceAreasList = document.getElementById('practiceAreasList');
    
    const practiceAreaItem = document.createElement('div');
    practiceAreaItem.className = 'practice-area-item';
    practiceAreaItem.innerHTML = `
        <button type="button" class="btn-remove-item" onclick="removePracticeArea(this)">×</button>
        <div class="row g-3">
            <div class="col-md-6">
                <div class="form-group">
                    <label>PRACTICE AREA</label>
                    <select class="form-control">
                        <option value="">Select your expertise...</option>
                        <option value="corporate">Corporate Law</option>
                        <option value="criminal">Criminal Law</option>
                        <option value="civil">Civil Law</option>
                        <option value="family">Family Law</option>
                        <option value="labor">Labor Law</option>
                        <option value="realestate">Real Estate Law</option>
                        <option value="intellectual">Intellectual Property</option>
                        <option value="tax">Tax Law</option>
                    </select>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label>YEARS OF EXPERIENCE</label>
                    <input type="number" class="form-control" placeholder="e.g., 5" min="0">
                </div>
            </div>
        </div>
    `;
    
    practiceAreasList.appendChild(practiceAreaItem);
    showNotification('Practice area added successfully.', 'success');
}

function removePracticeArea(button) {
    const practiceAreaItem = button.parentElement;
    practiceAreaItem.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        practiceAreaItem.remove();
        practiceAreaCount--;
        showNotification('Practice area removed.', 'info');
    }, 300);
}

// ===== FILE UPLOAD =====
function handleFileUpload(event) {
    const files = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`File "${file.name}" is too large. Maximum 5MB per file.`, 'error');
            continue;
        }
        
        // Validate file type
        const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
            showNotification(`File "${file.name}" has unsupported format. Only PDF, JPG, PNG allowed.`, 'error');
            continue;
        }
        
        // Add to uploaded files
        uploadedFiles.push(file);
        addFileToList(file);
    }
    
    // Reset input
    event.target.value = '';
}

function addFileToList(file) {
    const filesList = document.getElementById('uploadedFilesList');
    
    const fileItem = document.createElement('div');
    fileItem.className = 'uploaded-file-item';
    fileItem.dataset.fileName = file.name;
    
    const fileIcon = getFileIcon(file.name);
    
    fileItem.innerHTML = `
        <div class="file-icon">${fileIcon}</div>
        <div class="file-details">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${formatFileSize(file.size)}</div>
        </div>
        <button type="button" class="btn-remove-file" onclick="removeFile('${file.name}')">×</button>
    `;
    
    filesList.appendChild(fileItem);
    showNotification(`File "${file.name}" uploaded successfully.`, 'success');
}

function removeFile(fileName) {
    // Remove from array
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    
    // Remove from DOM
    const fileItem = document.querySelector(`[data-file-name="${fileName}"]`);
    if (fileItem) {
        fileItem.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            fileItem.remove();
            showNotification('File removed.', 'info');
        }, 300);
    }
}

function getFileIcon(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'pdf':
            return '📄';
        case 'jpg':
        case 'jpeg':
        case 'png':
            return '🖼️';
        default:
            return '📎';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ===== FORM VALIDATION =====
function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });
    
    // Validate email
    const email = document.getElementById('email');
    if (email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.classList.add('is-invalid');
            email.classList.remove('is-valid');
            isValid = false;
        }
    }
    
    // Check if files uploaded
    if (uploadedFiles.length === 0) {
        showNotification('Please upload at least one credential document.', 'warning');
        isValid = false;
    }
    
    return isValid;
}

// ===== FORM SUBMISSION =====
function handleLawyerRegister(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Collect form data
    const formData = {
        fullName: document.querySelector('#fullName').value.trim(),
        email: document.querySelector('#email').value.trim(),
        shortBio: document.querySelector('#shortBio').value.trim(),
        barAdmissions: collectBarAdmissions(),
        education: collectEducation(),
        practiceAreas: collectPracticeAreas(),
        files: uploadedFiles.map(f => f.name)
    };
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = 'Submitting Application...';
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        
        // Show success modal
        showSuccessModal(formData.fullName);
        
    }, 2500);
}

function collectBarAdmissions() {
    const barAdmissionItems = document.querySelectorAll('.bar-admission-item');
    const barAdmissions = [];
    
    barAdmissionItems.forEach(item => {
        const barAssociation = item.querySelector('select').value;
        const licenseNumber = item.querySelectorAll('input[type="text"]')[0].value.trim();
        const admissionDate = item.querySelector('input[type="date"]').value;
        
        if (barAssociation || licenseNumber || admissionDate) {
            barAdmissions.push({ barAssociation, licenseNumber, admissionDate });
        }
    });
    
    return barAdmissions;
}

function collectEducation() {
    const educationItems = document.querySelectorAll('.education-item');
    const education = [];
    
    educationItems.forEach(item => {
        const institution = item.querySelector('input[placeholder=""]').value.trim();
        const degree = item.querySelector('input[placeholder*="Juris"]').value.trim();
        const year = item.querySelector('input[placeholder*="2010"]').value.trim();
        
        if (institution || degree || year) {
            education.push({ institution, degree, year });
        }
    });
    
    return education;
}

function collectPracticeAreas() {
    const practiceItems = document.querySelectorAll('.practice-area-item');
    const practiceAreas = [];
    
    practiceItems.forEach(item => {
        const area = item.querySelector('select').value;
        const experience = item.querySelector('input[type="number"]').value;
        
        if (area) {
            practiceAreas.push({ area, experience });
        }
    });
    
    return practiceAreas;
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
                <svg width="100" height="100" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
            </div>
            <h2>Application Submitted Successfully!</h2>
            <p>Thank you <strong>${name}</strong> for applying to join our platform.<br>
            Your application will be reviewed by our team within 3-5 business days.<br>
            We'll send you an email notification once the review is complete.</p>
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
            // Redirect to home page
            window.location.href = 'index.html';
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
            max-width: 600px;
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
            margin-bottom: 30px;
            animation: scaleIn 0.5s ease;
        }
        
        .success-icon svg {
            color: #d4af37;
        }
        
        .modal-content h2 {
            color: #d4af37;
            font-size: 2rem;
            font-weight: 900;
            margin: 0 0 20px 0;
            text-transform: uppercase;
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
            padding: 15px 50px;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 900;
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
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
        
        @media (max-width: 576px) {
            .modal-content {
                padding: 40px 25px;
            }
            
            .modal-content h2 {
                font-size: 1.5rem;
            }
            
            .modal-content p {
                font-size: 1rem;
            }
            
            .success-icon svg {
                width: 80px;
                height: 80px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ===== NOTIFICATION FUNCTION =====
function showNotification(message, type) {
    const existingNotif = document.querySelector('.lawyer-notification');
    if (existingNotif) existingNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = `lawyer-notification ${type}`;
    
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

// ===== REAL-TIME VALIDATION =====
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else if (this.value.trim()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && this.value.trim()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
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

console.log('%c Lawyer Registration - Legal AI ', 'background: #d4af37; color: #000; font-size: 16px; font-weight: bold; padding: 8px;');
