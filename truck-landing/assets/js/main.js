// Main JavaScript for TopHid Truck Landing

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Mobile Nav Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Optional: Toggle icon between menu and x
            const icon = navToggle.querySelector('i');
            // Re-render Lucide icons if dynamically changing, 
            // but for simplicity we rely on CSS clip-path toggle
        });

        // Close menu/link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- 1. Tab Switching (Logistics Section) ---
    window.openTab = function (tabName) {
        // Hide all tab contents
        const contents = document.getElementsByClassName('tab-content');
        for (let i = 0; i < contents.length; i++) {
            contents[i].classList.remove('active');
        }

        // Deactivate all buttons
        const tabs = document.getElementsByClassName('tab-btn');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
        }

        // Activate current
        document.getElementById(tabName).classList.add('active');

        // Find button that calls this function (rough approximation)
        const activeBtn = Array.from(tabs).find(btn => btn.getAttribute('onclick').includes(tabName));
        if (activeBtn) activeBtn.classList.add('active');
    };

    // --- 2. Before/After Slider Logic ---
    const sliderContainer = document.querySelector('.ba-image-container');
    const rangeInput = document.querySelector('.slider-range');
    const beforeWrapper = document.querySelector('.img-before-wrapper');
    const handle = document.querySelector('.slider-handle');
    const beforeImage = document.querySelector('.img-before');

    function updateSlider() {
        const value = rangeInput.value;
        beforeWrapper.style.width = value + '%';
        handle.style.left = value + '%';

        // Sync before image width to container width so it doesn't squash, 
        // effectively revealing/hiding it instead of resizing
        if (sliderContainer) {
            beforeImage.style.width = sliderContainer.offsetWidth + 'px';
        }
    }

    if (rangeInput) {
        rangeInput.addEventListener('input', updateSlider);
        // Initial setup
        updateSlider();

        // Update on resize
        window.addEventListener('resize', updateSlider);
    }

    // --- 3. Smooth Scrolling for Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 4. Form Submission to Webhook ---
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            const formStatus = document.getElementById('formStatus');
            const originalText = btn.innerText;

            // Clear previous status
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            // Disable button and show loading state
            btn.innerText = 'Отправка...';
            btn.disabled = true;

            // Collect form data
            const formData = {
                truck: form.querySelector('[name="truck"]').value,
                issue: form.querySelector('[name="issue"]').value,
                phone: form.querySelector('[name="phone"]').value
            };

            try {
                // Send to Netlify Function
                const response = await fetch('/.netlify/functions/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    // Show success message
                    formStatus.textContent = '✓ Спасибо! Ваша заявка принята. Мы свяжемся с вами в течение 15 минут.';
                    formStatus.className = 'form-status form-status-success';
                    form.reset();
                } else {
                    throw new Error(result.error || 'Ошибка отправки');
                }

            } catch (error) {
                console.error('Form submission error:', error);
                formStatus.textContent = '✗ ' + (error.message || 'Ошибка отправки. Пожалуйста, попробуйте позже или позвоните нам.');
                formStatus.className = 'form-status form-status-error';
            } finally {
                // Re-enable button
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

});
