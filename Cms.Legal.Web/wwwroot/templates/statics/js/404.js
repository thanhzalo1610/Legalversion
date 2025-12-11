// 404 Error Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#login' && href !== '#register') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add hover effect to suggestion items
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    suggestionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Add click animation to buttons
    const buttons = document.querySelectorAll('.btn-home, .btn-contact');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Track 404 error (for analytics)
    console.log('404 Error: Page not found - ' + window.location.href);

    // Optional: Send 404 error to analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_not_found', {
            'page_location': window.location.href,
            'page_path': window.location.pathname
        });
    }

    // Add animation delay to page links
    const pageLinks = document.querySelectorAll('.page-link');
    pageLinks.forEach((link, index) => {
        link.style.animationDelay = `${1.2 + (index * 0.1)}s`;
        link.style.animation = 'fadeIn 0.5s ease both';
    });

    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            showEasterEgg();
        }
    });

    function showEasterEgg() {
        const errorNumber = document.querySelector('.error-number');
        errorNumber.style.animation = 'none';
        setTimeout(() => {
            errorNumber.style.animation = 'bounce 0.5s ease';
        }, 10);
        
        // Change colors temporarily
        document.querySelectorAll('.number-4, .number-0').forEach(el => {
            el.style.color = '#ff6b6b';
            setTimeout(() => {
                el.style.color = '#d4af37';
            }, 2000);
        });
    }
});

// Add bounce animation
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);
