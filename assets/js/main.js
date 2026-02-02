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

    // --- 4. Simple Form Handling (Prototype) ---
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerText = 'Отправка...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в течение 15 минут.');
                form.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1000);
        });
    }

});
