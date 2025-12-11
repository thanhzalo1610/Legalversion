// Privacy Policy Page JavaScript

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

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all privacy sections
    document.querySelectorAll('.privacy-section').forEach(section => {
        observer.observe(section);
    });

    // Add scroll to top button functionality
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            if (window.scrollY > 300) {
                // Could add a scroll to top button here if needed
            }
        }, 100);
    });

    // Print functionality
    const printButton = document.getElementById('printPolicy');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }

    // Copy section link functionality
    document.querySelectorAll('.section-title').forEach(title => {
        title.style.cursor = 'pointer';
        title.addEventListener('click', function() {
            const sectionNumber = this.querySelector('.section-number').textContent;
            const sectionText = this.textContent.replace(sectionNumber, '').trim();
            
            // Could implement copy to clipboard functionality here
            console.log('Section clicked:', sectionText);
        });
    });
});

// Add print styles
const style = document.createElement('style');
style.textContent = `
    @media print {
        .header-main,
        .footer-main {
            display: none;
        }
        
        .privacy-main {
            background: white;
            padding: 20px;
        }
        
        .privacy-section {
            page-break-inside: avoid;
            border: 1px solid #ddd;
            background: white;
        }
        
        .section-title,
        .privacy-title {
            color: #000;
        }
        
        .section-content {
            color: #333;
        }
    }
`;
document.head.appendChild(style);
