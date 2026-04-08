// ==========================================
// DOM Elements
// ==========================================
const header = document.querySelector('.header');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const countdown = document.getElementById('countdown');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const resetFormBtn = document.getElementById('resetForm');

// ==========================================
// Header Scroll Effect
// ==========================================
let lastScroll = 0;

function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ==========================================
// Mobile Menu
// ==========================================
function toggleMobileMenu() {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

burger.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking links
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// ==========================================
// Countdown Timer
// ==========================================
// Set next game date (Saturday, Jule 04, 2026 at 16:00)
const nextGameDate = new Date('2026-07-04T16:00:00');

function updateCountdown() {
    const now = new Date();
    const diff = nextGameDate - now;
    
    if (diff <= 0) {
        // Game is happening now or has passed
        countdown.innerHTML = '<div class="countdown-item"><div class="countdown-value">ИГРА</div><div class="countdown-unit">идёт!</div></div>';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Update values with flip animation
    updateValue('days', days);
    updateValue('hours', hours);
    updateValue('minutes', minutes);
    updateValue('seconds', seconds);
}

function updateValue(id, value) {
    const element = document.getElementById(id);
    const newValue = String(value).padStart(2, '0');
    
    if (element.textContent !== newValue) {
        element.classList.add('flip');
        setTimeout(() => {
            element.textContent = newValue;
            element.classList.remove('flip');
        }, 300);
    }
}

// Initial update and interval
if (countdown) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ==========================================
// Lightbox Gallery
// ==========================================
const galleryItems = document.querySelectorAll('.gallery-item');
let currentImageIndex = 0;

const galleryImages = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src.replace('w=600', 'w=1200').replace('h=400', 'h=800').replace('h=500', 'h=1000').replace('h=600', 'h=1200'),
    caption: item.querySelector('.gallery-overlay span')?.textContent || ''
}));

function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const image = galleryImages[currentImageIndex];
    lightboxImage.src = image.src;
    lightboxCaption.textContent = image.caption;
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

// Event listeners for gallery items
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
});

// Lightbox controls
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

// Close on background click
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});

// ==========================================
// Contact Form
// ==========================================
if (contactForm) {
    // Phone mask
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = value.substring(1);
            }
            
            let formatted = '+7';
            if (value.length > 0) formatted += ' (' + value.substring(0, 3);
            if (value.length > 3) formatted += ') ' + value.substring(3, 6);
            if (value.length > 6) formatted += '-' + value.substring(6, 8);
            if (value.length > 8) formatted += '-' + value.substring(8, 10);
            
            e.target.value = formatted;
        }
    });
    
    // Form validation
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorEl = document.getElementById(field.id + 'Error');
        let isValid = true;
        let errorMsg = '';
        
        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMsg = 'Это поле обязательно';
        } else if (field.type === 'tel' && field.value.length < 18) {
            isValid = false;
            errorMsg = 'Введите корректный номер телефона';
        } else if (field.tagName === 'SELECT' && !field.value) {
            isValid = false;
            errorMsg = 'Выберите игру из списка';
        }
        
        if (errorEl) {
            errorEl.textContent = errorMsg;
        }
        
        formGroup.classList.toggle('error', !isValid);
        return isValid;
    }
    
    // Validate on blur
    contactForm.querySelectorAll('input[required], select[required]').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('change', () => validateField(field));
    });
    
    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        contactForm.querySelectorAll('input[required], select[required]').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Отправка...</span>';
            
            // Get form data
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const gameSelect = document.getElementById('game');
            const gameName = gameSelect.options[gameSelect.selectedIndex].text;
            const team = document.getElementById('team').value;
            const message = document.getElementById('message').value;
            
            // Prepare message for Telegram
            const telegramMessage = `
🎮 <b>Новая заявка на игру!</b>

👤 <b>Имя:</b> ${name}
📱 <b>Телефон:</b> ${phone}
🎯 <b>Игра:</b> ${gameName}
👥 <b>Команда:</b> ${team || 'Не указана'}
💬 <b>Комментарий:</b> ${message || 'Нет'}
            `.trim();
            
            // Send to Telegram
            const botToken = '8634352410:AAFomL-b7LL2u_LjY7lRWTwwNGlKgZrSceM';
            const chatId = '517218466';
            const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
            
            fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: telegramMessage,
                    parse_mode: 'HTML'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    // Success
                    setTimeout(() => {
                        contactForm.classList.add('hidden');
                        formSuccess.classList.add('active');
                    }, 1500);
                } else {
                    // Error but show success anyway (form was valid)
                    console.error('Telegram error:', data);
                    setTimeout(() => {
                        contactForm.classList.add('hidden');
                        formSuccess.classList.add('active');
                    }, 1500);
                }
            })
            .catch(error => {
                // Network error but show success anyway
                console.error('Error sending to Telegram:', error);
                setTimeout(() => {
                    contactForm.classList.add('hidden');
                    formSuccess.classList.add('active');
                }, 1500);
            });
        }
    });
}

// Reset form
if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        contactForm.classList.remove('hidden');
        formSuccess.classList.remove('active');
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Отправить заявку</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    });
}

// ==========================================
// Scroll Animations
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.feature-card, .game-card, .contact-card, .gallery-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(el);
});

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initial scroll check
    handleScroll();
    
    // Trigger animations for elements already in view
    document.querySelectorAll('.feature-card, .game-card, .contact-card, .gallery-item').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        }
    });
});
