// Interactive Timeline Modal Handler
document.addEventListener('DOMContentLoaded', function() {
    // Get all timeline chapters
    const chapters = document.querySelectorAll('.timeline-chapter');
    const modals = document.querySelectorAll('.chapter-modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    const overlays = document.querySelectorAll('.modal-overlay');

    // Open modal function
    function openModal(chapterNumber) {
        const modal = document.getElementById(`modal-${chapterNumber}`);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add animation to modal content
            const modalContainer = modal.querySelector('.modal-container');
            modalContainer.style.animation = 'none';
            setTimeout(() => {
                modalContainer.style.animation = 'modalSlideUp 0.5s ease';
            }, 10);

            // Update progress to current chapter
            updateProgressToChapter(chapterNumber);
        }
    }

    // Update progress to specific chapter
    function updateProgressToChapter(chapterNum) {
        const milestones = document.querySelectorAll('.timeline-milestone');
        milestones.forEach((milestone, index) => {
            if (index < chapterNum) {
                milestone.classList.add('active');
                
                // Add completion checkmark
                if (!milestone.querySelector('.completion-mark')) {
                    const checkmark = document.createElement('div');
                    checkmark.className = 'completion-mark';
                    checkmark.innerHTML = '✓';
                    checkmark.style.cssText = `
                        position: absolute;
                        inset: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #d4af37;
                        font-size: 12px;
                        font-weight: 900;
                        animation: checkmarkPop 0.4s ease;
                    `;
                    milestone.appendChild(checkmark);
                }
            }
        });

        // Highlight current chapter
        const currentChapter = document.querySelector(`[data-chapter="${chapterNum}"]`);
        if (currentChapter && currentChapter.classList.contains('timeline-chapter')) {
            currentChapter.style.transform = 'translateY(-15px) scale(1.05)';
            setTimeout(() => {
                currentChapter.style.transform = '';
            }, 500);
        }
    }

    // Add checkmark animation
    const checkmarkStyle = document.createElement('style');
    checkmarkStyle.textContent = `
        @keyframes checkmarkPop {
            0% {
                transform: scale(0) rotate(-45deg);
                opacity: 0;
            }
            50% {
                transform: scale(1.3) rotate(0deg);
            }
            100% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(checkmarkStyle);

    // Close modal function
    function closeModal(modal) {
        if (modal) {
            const modalContainer = modal.querySelector('.modal-container');
            modalContainer.style.animation = 'modalSlideDown 0.3s ease';
            
            setTimeout(() => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // Add slide down animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(50px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add click event to chapters
    chapters.forEach(chapter => {
        chapter.addEventListener('click', function() {
            const chapterNumber = this.getAttribute('data-chapter');
            openModal(chapterNumber);
        });

        // Add hover effect sound (optional)
        chapter.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });
    });

    // Add click event to close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.chapter-modal');
            closeModal(modal);
        });
    });

    // Add click event to overlays
    overlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const modal = this.closest('.chapter-modal');
            closeModal(modal);
        });
    });

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.chapter-modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    // Prevent modal content click from closing
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Add scroll animation for modal content
    modals.forEach(modal => {
        const modalContainer = modal.querySelector('.modal-container');
        if (modalContainer) {
            modalContainer.addEventListener('scroll', function() {
                const scrollPercentage = (this.scrollTop / (this.scrollHeight - this.clientHeight)) * 100;
                
                // Add parallax effect to header
                const header = this.querySelector('.modal-header');
                if (header) {
                    header.style.transform = `translateY(${scrollPercentage * 0.5}px)`;
                    header.style.opacity = 1 - (scrollPercentage / 200);
                }
            });
        }
    });

    // Add entrance animation to timeline chapters
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    chapters.forEach(chapter => {
        chapter.style.opacity = '0';
        chapter.style.transform = 'translateY(30px)';
        chapter.style.transition = 'all 0.6s ease';
        observer.observe(chapter);
    });

    // Add typewriter effect for modal 1
    function typewriterEffect(element, text, speed = 25) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Trigger typewriter when modal 1 opens
    const modal1 = document.getElementById('modal-1');
    if (modal1) {
        const observer1 = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.classList.contains('active')) {
                    const typewriterElement = modal1.querySelector('.typewriter-effect');
                    if (typewriterElement && !typewriterElement.dataset.typed) {
                        const originalText = typewriterElement.textContent;
                        typewriterEffect(typewriterElement, originalText, 30);
                        typewriterElement.dataset.typed = 'true';
                    }
                }
            });
        });

        observer1.observe(modal1, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // Add enhanced progress indicator for timeline
    const timeline = document.querySelector('.interactive-timeline');
    if (timeline) {
        // Add milestones
        for (let i = 1; i <= 5; i++) {
            const milestone = document.createElement('div');
            milestone.className = `timeline-milestone timeline-milestone-${i}`;
            milestone.dataset.chapter = i;
            timeline.appendChild(milestone);
        }

        // Add road markers
        for (let i = 1; i <= 8; i++) {
            const marker = document.createElement('div');
            marker.className = 'road-marker';
            timeline.appendChild(marker);
        }

        // Add progress particles
        for (let i = 1; i <= 4; i++) {
            const particle = document.createElement('div');
            particle.className = 'progress-particle';
            timeline.appendChild(particle);
        }

        // Add progress tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'progress-tooltip';
        tooltip.textContent = 'Hành trình bắt đầu...';
        timeline.appendChild(tooltip);

        // Add journey decorations
        const compass = document.createElement('div');
        compass.className = 'journey-compass';
        timeline.appendChild(compass);

        const flag = document.createElement('div');
        flag.className = 'destination-flag';
        timeline.appendChild(flag);

        const startLabel = document.createElement('div');
        startLabel.className = 'journey-start';
        startLabel.textContent = 'Start';
        timeline.appendChild(startLabel);

        const endLabel = document.createElement('div');
        endLabel.className = 'journey-end';
        endLabel.textContent = 'Justice';
        timeline.appendChild(endLabel);

        // Add progress percentage indicator
        const percentage = document.createElement('div');
        percentage.className = 'progress-percentage';
        percentage.textContent = '0%';
        timeline.appendChild(percentage);

        // Add path light effect
        const pathLight = document.createElement('div');
        pathLight.className = 'path-light';
        timeline.appendChild(pathLight);

        // Add progress trail
        const trail = document.createElement('div');
        trail.className = 'progress-trail';
        timeline.appendChild(trail);

        // Add active chapter indicator
        const activeIndicator = document.createElement('div');
        activeIndicator.className = 'chapter-active-indicator';
        timeline.appendChild(activeIndicator);

        // Activate milestones progressively
        const milestones = document.querySelectorAll('.timeline-milestone');
        milestones.forEach((milestone, index) => {
            setTimeout(() => {
                milestone.classList.add('active');
            }, 1000 + (index * 400));
        });

        // Update progress on chapter hover
        chapters.forEach((chapter, index) => {
            chapter.addEventListener('mouseenter', function() {
                const chapterNum = parseInt(this.getAttribute('data-chapter'));
                updateProgress(chapterNum);
                
                // Update tooltip
                const tooltipTexts = [
                    'Chương I: Bóng Tối',
                    'Chương II: Đấu Tranh',
                    'Chương III: Khám Phá',
                    'Chương IV: Ra Đời',
                    'Chương V: Tương Lai'
                ];
                tooltip.textContent = tooltipTexts[chapterNum - 1];
                tooltip.classList.add('show');
                
                // Position tooltip
                const progress = (chapterNum - 1) * 20;
                tooltip.style.left = `calc(10% + ${progress}%)`;

                // Update percentage indicator
                const progressPercent = chapterNum * 20;
                percentage.textContent = `${progressPercent}%`;
                percentage.classList.add('show');
                percentage.style.left = `calc(10% + ${progress}%)`;

                // Move active indicator
                activeIndicator.style.left = `calc(10% + ${progress}% - 20px)`;
                activeIndicator.style.opacity = '1';

                // Update trail
                trail.style.width = `${progress}%`;
            });

            chapter.addEventListener('mouseleave', function() {
                tooltip.classList.remove('show');
                percentage.classList.remove('show');
                activeIndicator.style.opacity = '0';
            });
        });

        // Update progress function
        function updateProgress(chapterNum) {
            const progressPercentage = (chapterNum - 1) * 20;
            
            // Highlight active milestones
            milestones.forEach((milestone, index) => {
                if (index < chapterNum) {
                    milestone.classList.add('active');
                } else {
                    milestone.classList.remove('active');
                }
            });

            // Create ripple effect
            const activeMilestone = document.querySelector(`.timeline-milestone-${chapterNum}`);
            if (activeMilestone) {
                createRipple(activeMilestone);
            }
        }

        // Create ripple effect
        function createRipple(element) {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                inset: -10px;
                border: 2px solid #d4af37;
                border-radius: 50%;
                animation: rippleExpand 1s ease-out;
                pointer-events: none;
            `;
            element.appendChild(ripple);

            setTimeout(() => ripple.remove(), 1000);
        }

        // Add ripple animation
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes rippleExpand {
                from {
                    transform: scale(1);
                    opacity: 1;
                }
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);

        // Track progress on modal open
        modals.forEach((modal, index) => {
            modal.addEventListener('click', function(e) {
                if (e.target === this || e.target.classList.contains('modal-overlay')) {
                    const chapterNum = index + 1;
                    updateProgress(chapterNum);
                }
            });
        });

        // Add glow effect on timeline
        const glowEffect = document.createElement('div');
        glowEffect.className = 'timeline-progress-glow';
        timeline.appendChild(glowEffect);

        // Animate glow after initial load
        setTimeout(() => {
            glowEffect.style.width = '80%';
            glowEffect.style.opacity = '1';
        }, 2500);
    }

    // Add particle effect on hover (optional enhancement)
    chapters.forEach(chapter => {
        chapter.addEventListener('mouseenter', function() {
            createParticles(this);
        });
    });

    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const particleCount = 5;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #d4af37;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                animation: particleFloat 1s ease-out forwards;
            `;
            document.body.appendChild(particle);

            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 50;
            particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);

            setTimeout(() => particle.remove(), 1000);
        }
    }

    // Add particle animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            to {
                transform: translate(var(--tx), var(--ty));
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);

    console.log('Interactive Timeline initialized successfully!');
});
