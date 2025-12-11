// ===== PIE CHART IMPLEMENTATION =====
// Using pure JavaScript Canvas API to create pie chart

document.addEventListener('DOMContentLoaded', () => {
    createPieChart();
});

function createPieChart() {
    const canvas = document.getElementById('resultChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const size = Math.min(canvas.parentElement.clientWidth, 400);
    canvas.width = size;
    canvas.height = size;
    
    // Chart data
    const data = [
        { label: 'Plaintiff wins', value: 68, color: '#d4af37' },
        { label: 'Reconcile', value: 18, color: '#0000ff' },
        { label: 'Defendant Win', value: 14, color: '#ff0000' }
    ];
    
    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Chart settings
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    // Draw pie chart
    let currentAngle = -Math.PI / 2; // Start from top
    
    data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Calculate label position
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
        
        // Draw percentage text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.value + '%', labelX, labelY);
        
        currentAngle += sliceAngle;
    });
    
    // Add animation effect
    animateChart(canvas, ctx, data, centerX, centerY, radius);
}

function animateChart(canvas, ctx, data, centerX, centerY, radius) {
    let animationProgress = 0;
    const animationDuration = 1500; // 1.5 seconds
    const startTime = Date.now();
    
    function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        animationProgress = Math.min(elapsed / animationDuration, 1);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate total
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        // Draw animated pie chart
        let currentAngle = -Math.PI / 2;
        
        data.forEach((item) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI * animationProgress;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();
            
            // Draw border
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw percentage text if animation is complete
            if (animationProgress === 1) {
                const labelAngle = currentAngle + sliceAngle / 2;
                const labelRadius = radius * 0.7;
                const labelX = centerX + Math.cos(labelAngle) * labelRadius;
                const labelY = centerY + Math.sin(labelAngle) * labelRadius;
                
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(item.value + '%', labelX, labelY);
            }
            
            currentAngle += sliceAngle;
        });
        
        if (animationProgress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// ===== RESPONSIVE CHART =====
window.addEventListener('resize', () => {
    createPieChart();
});

// ===== BUTTON ACTIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Case details buttons
    const caseDetailsButtons = document.querySelectorAll('.btn-case-details');
    caseDetailsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Đang tải chi tiết vụ án...', 'info');
        });
    });
    
    // Compare buttons
    const compareButtons = document.querySelectorAll('.btn-compare');
    compareButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Đang so sánh với các vụ án tương tự...', 'info');
        });
    });
});

// ===== NOTIFICATION FUNCTION =====
function showNotification(message, type) {
    const existingNotif = document.querySelector('.overview-notification');
    if (existingNotif) existingNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = `overview-notification ${type}`;
    
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

// ===== TABLE INTERACTIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to table rows
    const tableRows = document.querySelectorAll('.custom-table tbody tr, .cases-table tbody tr, .factors-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.chart-container, .results-summary, .analysis-table, .proposals-section, ' +
        '.damage-section, .legal-factors-section, .cases-list-section, .prediction-section'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
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

console.log('%c Overview - Legal AI ', 'background: #d4af37; color: #000; font-size: 16px; font-weight: bold; padding: 8px;');
console.log('%c Chart rendered with pure JavaScript Canvas API ', 'color: #d4af37; font-size: 12px;');
