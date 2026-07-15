document.addEventListener('DOMContentLoaded', () => {




    /* ==========================================================================
       2. Mobile Navigation Toggle
       ========================================================================== */
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileNavToggle.classList.toggle('open');
            mobileNavToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileNavToggle.classList.remove('open');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside of it
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileNavToggle.contains(e.target) && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                mobileNavToggle.classList.remove('open');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Scroll spy: Active link indicator
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       3. Stats Counter Animation
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function startCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Ease out quad formula
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * target);
                
                stat.textContent = currentValue.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    // Intersection Observer for Stats
    const statsSection = document.querySelector('.stats-bar-wrapper');
    if (statsSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(statsSection);
    } else if (statsSection) {
        // Fallback for older browsers
        setTimeout(startCounters, 1000);
    }


    /* ==========================================================================
       4. Interactive Testimonials Carousel
       ========================================================================== */
    const testimonialData = [
        {
            name: "John Peterson",
            role: "Founder, TechSprint Solutions",
            quote: "Orange PR completely revolutionized our public outreach. Within three months of working with them, our media features quadrupled, leading to a massive increase in organic sign-ups for our SaaS platform."
        },
        {
            name: "Sarah Lin",
            role: "VP of Marketing, GlowBeauty",
            quote: "The influencer campaigns managed by Orange PR were outstanding. They paired us with creators who genuinely aligned with our brand values, yielding a 35% conversion rate on our product launch campaign."
        },
        {
            name: "Marcus Aurel",
            role: "Event Director, Apex Sports",
            quote: "Flawless execution! Orange PR coordinated our national championship tour, handling everything from local news press releases to stage logistics. A masterclass in event management."
        },
        {
            name: "Elena Rostova",
            role: "CEO, Horizon Strategy",
            quote: "Their strategic positioning advice helped us rebrand and expand into three new European markets. Their PR connections and premium thought leadership placement are unmatched."
        }
    ];

    const avatarTabs = document.querySelectorAll('.avatar-tab');
    const indicatorDots = document.querySelectorAll('.t-dot');
    const quoteEl = document.getElementById('testimonial-quote');
    const authorNameEl = document.getElementById('testimonial-author-name');
    const authorRoleEl = document.getElementById('testimonial-author-role');
    const testimonialPanel = document.getElementById('testimonial-panel');

    let currentTestimonialIndex = 0;
    let autoRotateInterval;

    function switchTestimonial(index) {
        if (index < 0 || index >= testimonialData.length || index === currentTestimonialIndex) return;

        currentTestimonialIndex = index;

        // Transition fade out
        testimonialPanel.style.opacity = 0;
        testimonialPanel.style.transform = 'translateY(10px)';
        testimonialPanel.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            // Update Text
            quoteEl.textContent = `"${testimonialData[index].quote}"`;
            authorNameEl.textContent = testimonialData[index].name;
            authorRoleEl.textContent = testimonialData[index].role;

            // Update Avatars Active State
            avatarTabs.forEach((tab, i) => {
                if (i === index) {
                    tab.classList.add('active');
                    tab.setAttribute('aria-selected', 'true');
                } else {
                    tab.classList.remove('active');
                    tab.setAttribute('aria-selected', 'false');
                }
            });

            // Update Indicator Dots
            indicatorDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            // Transition fade in
            testimonialPanel.style.opacity = 1;
            testimonialPanel.style.transform = 'translateY(0)';
        }, 300);
    }

    // Add event listeners to tabs
    avatarTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            switchTestimonial(index);
            resetAutoRotate();
        });
    });

    // Add event listeners to dots
    indicatorDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            switchTestimonial(index);
            resetAutoRotate();
        });
    });

    // Auto rotate testimonials every 6 seconds
    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            const nextIndex = (currentTestimonialIndex + 1) % testimonialData.length;
            switchTestimonial(nextIndex);
        }, 6000);
    }

    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }

    startAutoRotate();


    /* ==========================================================================
       5. Form Handling & Validations
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successAlert = document.getElementById('form-success-alert');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');
            
            let isValid = true;

            // Name validation
            if (nameInput.value.trim() === '') {
                nameInput.parentElement.classList.add('error');
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('error');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('error');
                isValid = false;
            } else {
                emailInput.parentElement.classList.remove('error');
            }

            // Message validation
            if (messageInput.value.trim() === '') {
                messageInput.parentElement.classList.add('error');
                isValid = false;
            } else {
                messageInput.parentElement.classList.remove('error');
            }

            if (isValid) {
                // Submit action simulation
                const submitBtn = document.getElementById('form-submit-btn');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                setTimeout(() => {
                    contactForm.style.display = 'none';
                    successAlert.style.display = 'flex';
                }, 1200);
            }
        });

        // Realtime remove error styling on input
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.parentElement.classList.remove('error');
                }
            });
        });
    }

    // Newsletter form submit
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const button = newsletterForm.querySelector('button');

            button.innerHTML = '<i class="fa-solid fa-check"></i>';
            button.style.color = '#10B981';
            input.disabled = true;
            
            setTimeout(() => {
                input.value = '';
                input.disabled = false;
                input.placeholder = 'Subscribed!';
                button.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
                button.style.color = 'var(--color-light)';
            }, 3000);
        });
    }

    // Slide functionality in hero DOTS
    const heroDots = document.querySelectorAll('#hero-slider-dots .dot');
    heroDots.forEach((dot, index) => { 
        dot.addEventListener('click', () => {
            heroDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            const heroContainer = document.querySelector('.hero-container');
            if (index === 0) {
                heroContainer.style.background = "";
                heroContainer.style.backgroundImage = "url('assets/images/hero-megaphone.png')";
                heroContainer.style.backgroundSize = "cover";
                heroContainer.style.backgroundPosition = "center right";
            } else {
                const gradients = [
                    '',
                    'linear-gradient(135deg, #4E65FF 0%, #92EFFD 100%)',
                    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    'linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)'
                ];
                heroContainer.style.backgroundImage = "none";
                heroContainer.style.background = gradients[index];
            }
        });
    });
});
