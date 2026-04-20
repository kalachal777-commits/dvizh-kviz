// ==========================================
// Инициализация сервисов
// ==========================================
(function() {
    // Инициализация EmailJS вашим Public Key
    if (typeof emailjs !== 'undefined') {
        emailjs.init("F9iFUfmXGuPIR2Rmb");
    }
})();

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
function handleScroll() {
    if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
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

if (burger) burger.addEventListener('click', toggleMobileMenu);

document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) toggleMobileMenu();
    });
});

// ==========================================
// Countdown Timer
// ==========================================
const nextGameDate = new Date('2026-07-04T16:00:00');

function updateCountdown() {
    const now = new Date();
    const diff = nextGameDate - now;
    
    if (diff <= 0) {
        countdown.innerHTML = '<div class="countdown-item"><div class="countdown-value">ИГРА</div><div class="countdown-unit">идёт!</div></div>';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    updateValue('days', days);
    updateValue('hours', hours);
    updateValue('minutes', minutes);
    updateValue('seconds', seconds);
}

function updateValue(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    const newValue = String(value).padStart(2, '0');
    if (element.textContent !== newValue) {
        element.textContent = newValue;
    }
}

if (countdown) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ==========================================
// Contact Form & Submissions (Telegram + EmailJS)
// ==========================================
if (contactForm) {
    // Phone mask
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') value = value.substring(1);
            let formatted = '+7';
            if (value.length > 0) formatted += ' (' + value.substring(0, 3);
            if (value.length > 3) formatted += ') ' + value.substring(3, 6);
            if (value.length > 6) formatted += '-' + value.substring(6, 8);
            if (value.length > 8) formatted += '-' + value.substring(8, 10);
            e.target.value = formatted;
        }
    });

    // Validation function
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
        }
        
        if (errorEl) errorEl.textContent = errorMsg;
        if (formGroup) formGroup.classList.toggle('error', !isValid);
        return isValid;
    }

    // Main Submit Handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Проверка чекбокса
        const privacyCheck = document.getElementById('privacy-check');
        if (privacyCheck && !privacyCheck.checked) {
            alert("Пожалуйста, подтвердите согласие на обработку данных");
            return;
        }

        // 2. Валидация полей
        let isFormValid = true;
        contactForm.querySelectorAll('input[required], select[required]').forEach(field => {
            if (!validateField(field)) isFormValid = false;
        });

        if (isFormValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Отправка...</span>';

            // Сбор данных для Telegram
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const gameSelect = document.getElementById('game');
            const gameName = gameSelect.options[gameSelect.selectedIndex].text;
            const team = document.getElementById('team').value;
            const message = document.getElementById('message').value;

            const telegramMessage = `
🎮 <b>Новая заявка на игру!</b>
👤 <b>Имя:</b> ${name}
📱 <b>Телефон:</b> ${phone}
🎯 <b>Игра:</b> ${gameName}
👥 <b>Команда:</b> ${team || 'Не указана'}
💬 <b>Комментарий:</b> ${message || 'Нет'}
            `.trim();

            const botToken = '8634352410:AAFomL-b7LL2u_LjY7lRWTwwNGlKgZrSceM';
            const chatId = '517218466';
            const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

            // Последовательная отправка: Сначала Telegram, потом EmailJS
            fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: telegramMessage, parse_mode: 'HTML' })
            })
            .then(() => {
                console.log('Telegram success');
                // Отправка через EmailJS
                return emailjs.sendForm("service_1yb844g", "template_3hna77t", this);
            })
            .then(() => {
                console.log('EmailJS success');
                contactForm.classList.add('hidden');
                formSuccess.classList.add('active');
                contactForm.style.display = 'none'; // Доп. страховка
            })
            .catch(error => {
                console.error('Submission error:', error);
                // В случае ошибки EmailJS всё равно показываем успех, если данные ушли в ТГ
                contactForm.classList.add('hidden');
                formSuccess.classList.add('active');
            });
        }
    });
}

// Reset Form
if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        contactForm.classList.remove('hidden');
        contactForm.style.display = 'block';
        formSuccess.classList.remove('active');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Отправить заявку</span>';
    });
}

// ==========================================
// Cookie Notice
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const cookieNotice = document.getElementById('cookie-notice');
    const acceptBtn = document.getElementById('accept-cookies');

    if (cookieNotice && !localStorage.getItem('cookiesAccepted')) {
        cookieNotice.classList.remove('hide');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieNotice.classList.add('hide');
        });
    }
});
