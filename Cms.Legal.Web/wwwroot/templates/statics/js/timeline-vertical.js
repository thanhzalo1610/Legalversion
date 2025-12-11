// Vertical Timeline Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
    const verticalTimeline = document.querySelector('.vertical-timeline-container');
    if (!verticalTimeline) return;

    const timelineItems = document.querySelectorAll('.vertical-timeline-item');
    const progressFill = document.querySelector('.vertical-progress-fill');
    const progressGlow = document.querySelector('.vertical-progress-glow');
    const readMoreButtons = document.querySelectorAll('.btn-read-more');

    // Intersection Observer for timeline items
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Activate marker
                const marker = entry.target.querySelector('.marker-seal');
                if (marker) {
                    setTimeout(() => {
                        marker.style.animation = 'markerActivate 0.6s ease';
                    }, 200);
                }
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Add marker activation animation
    const markerStyle = document.createElement('style');
    markerStyle.textContent = `
        @keyframes markerActivate {
            0% {
                transform: scale(0.5) rotate(-180deg);
                opacity: 0;
            }
            50% {
                transform: scale(1.2) rotate(10deg);
            }
            100% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(markerStyle);

    // Update progress fill on scroll
    function updateProgress() {
        const timelineRect = verticalTimeline.getBoundingClientRect();
        const timelineTop = timelineRect.top + window.scrollY;
        const timelineHeight = timelineRect.height;
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        // Calculate progress percentage
        const progress = Math.max(0, Math.min(100, 
            ((scrollPosition - timelineTop) / timelineHeight) * 100
        ));

        if (progressFill) {
            progressFill.style.height = `${progress}%`;
        }

        // Update glow position
        if (progressGlow) {
            progressGlow.style.top = `${progress}%`;
            progressGlow.style.opacity = progress > 0 && progress < 100 ? '1' : '0';
        }

        // Highlight active items
        timelineItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.top + itemRect.height / 2;
            const windowCenter = window.innerHeight / 2;
            
            if (Math.abs(itemCenter - windowCenter) < 200) {
                item.style.transform = 'translateY(0) scale(1.02)';
                item.style.opacity = '1';
            } else {
                item.style.transform = 'translateY(0) scale(1)';
            }
        });
    }

    // Throttle scroll event
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(updateProgress);
    });

    // Initial update
    updateProgress();

    // Read More button handlers
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(`modal-${modalId}`);
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Add animation
                const modalContainer = modal.querySelector('.modal-container');
                if (modalContainer) {
                    modalContainer.style.animation = 'none';
                    setTimeout(() => {
                        modalContainer.style.animation = 'modalSlideUp 0.5s ease';
                    }, 10);
                }
            }
        });
    });

    // Add hover effects to markers
    const markers = document.querySelectorAll('.marker-seal');
    markers.forEach(marker => {
        marker.addEventListener('mouseenter', function() {
            createMarkerRipple(this);
        });
    });

    function createMarkerRipple(marker) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            inset: -15px;
            border: 2px solid #d4af37;
            border-radius: 50%;
            animation: rippleExpand 1s ease-out;
            pointer-events: none;
        `;
        marker.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1000);
    }

    // Add particle effects on scroll
    let particleInterval;
    window.addEventListener('scroll', function() {
        if (!particleInterval) {
            particleInterval = setInterval(() => {
                if (isTimelineInView()) {
                    createScrollParticle();
                }
            }, 500);
        }
    });

    function isTimelineInView() {
        const rect = verticalTimeline.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    function createScrollParticle() {
        const particle = document.createElement('div');
        const randomX = Math.random() * 40 - 20;
        
        particle.style.cssText = `
            position: absolute;
            left: 50%;
            top: ${Math.random() * 100}%;
            width: 4px;
            height: 4px;
            background: #d4af37;
            border-radius: 50%;
            transform: translateX(${randomX}px);
            pointer-events: none;
            z-index: 2;
            animation: particleFade 2s ease-out forwards;
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
        `;
        
        verticalTimeline.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
    }

    // Add particle animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFade {
            0% {
                opacity: 0;
                transform: translateX(var(--x, 0)) translateY(0);
            }
            50% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: translateX(var(--x, 0)) translateY(50px);
            }
        }
    `;
    document.head.appendChild(particleStyle);

    // Add smooth scroll to timeline items
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn-read-more')) {
                const itemTop = item.closest('.section-timeline-vertical');
                const sectionTop = itemTop.offsetTop;
                window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    //// Add progress percentage indicator
    //const progressIndicator = document.createElement('div');
    //progressIndicator.className = 'vertical-progress-indicator';
    //progressIndicator.style.cssText = `
    //    position: fixed;
    //    right: 30px;
    //    top: 50%;
    //    transform: translateY(-50%);
    //    background: rgba(0, 0, 0, 0.9);
    //    color: #d4af37;
    //    padding: 15px 20px;
    //    border-radius: 15px;
    //    border: 2px solid #d4af37;
    //    font-weight: 700;
    //    font-size: 1.2rem;
    //    z-index: 100;
    //    opacity: 0;
    //    transition: opacity 0.3s ease;
    //    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
    //`;
    //document.body.appendChild(progressIndicator);

    //// Update progress indicator
    //window.addEventListener('scroll', function() {
    //    if (isTimelineInView()) {
    //        const timelineRect = verticalTimeline.getBoundingClientRect();
    //        const timelineTop = timelineRect.top + window.scrollY;
    //        const timelineHeight = timelineRect.height;
    //        const scrollPosition = window.scrollY + window.innerHeight / 2;
            
    //        const progress = Math.max(0, Math.min(100, 
    //            ((scrollPosition - timelineTop) / timelineHeight) * 100
    //        ));

    //        progressIndicator.textContent = `${Math.round(progress)}%`;
    //        progressIndicator.style.opacity = '1';
    //    } else {
    //        progressIndicator.style.opacity = '0';
    //    }
    //});

    //// Add year labels along the timeline
    //timelineItems.forEach((item, index) => {
    //    const year = item.getAttribute('data-year');
    //    if (year) {
    //        const yearLabel = document.createElement('div');
    //        yearLabel.className = 'timeline-year-label';
    //        yearLabel.textContent = year;
    //        yearLabel.style.cssText = `
    //            position: absolute;
    //            left: calc(50% + 60px);
    //            top: 50%;
    //            transform: translateY(-50%);
    //            background: rgba(0, 0, 0, 0.8);
    //            color: #d4af37;
    //            padding: 5px 12px;
    //            border-radius: 10px;
    //            font-size: 0.8rem;
    //            font-weight: 700;
    //            border: 1px solid rgba(212, 175, 55, 0.3);
    //            opacity: 0;
    //            transition: all 0.3s ease;
    //            pointer-events: none;
    //            white-space: nowrap;
    //        `;
            
    //        item.appendChild(yearLabel);
            
    //        // Show year label on hover
    //        item.addEventListener('mouseenter', function() {
    //            yearLabel.style.opacity = '1';
    //            yearLabel.style.transform = 'translateY(-50%) translateX(10px)';
    //        });
            
    //        item.addEventListener('mouseleave', function() {
    //            yearLabel.style.opacity = '0';
    //            yearLabel.style.transform = 'translateY(-50%) translateX(0)';
    //        });
    //    }
    //});

    //console.log('Vertical Timeline initialized successfully!');
});
