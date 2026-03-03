document.addEventListener('DOMContentLoaded', () => {
    // Note: The loading screen logic is outside DOMContentLoaded
    // because we want to wait for ALL assets (images, fonts) to load, not just HTML.

    const heroContainer = document.querySelector('.hero-center-container');
    const heroWrapper = document.querySelector('.hero-image-wrapper');
    const textOverlay = document.querySelector('.hero-content');
    const claw = document.querySelector('.claw-marks');

    // 3D Parallax Tilt Effect on Mouse Move
    if (heroContainer && heroWrapper) {
        heroContainer.addEventListener('mousemove', (e) => {
            // Get dimensions and limits
            const rect = heroContainer.getBoundingClientRect();

            // Calculate mouse position relative to the element's center
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt degrees (Max 15 degrees tilt)
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            // Apply 3D tilt to the image container
            heroWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

            // Enhance depth by moving the text slightly in the opposite direction (parallax)
            if (textOverlay) {
                const textX = ((x - centerX) / centerX) * -40;
                const textY = ((y - centerY) / centerY) * -40;
                textOverlay.style.transform = `translate(calc(-50% + ${textX}px), calc(-50% + ${textY}px)) translateZ(150px) scale(1.05)`;
            }

            // Move the claw slightly as well
            if (claw) {
                const clawX = ((x - centerX) / centerX) * 40;
                const clawY = ((y - centerY) / centerY) * 20;
                claw.style.transform = `translateX(calc(-50% + ${clawX}px)) translateY(${clawY}px) scale(1.05)`;
            }
        });

        // Smooth reset when mouse leaves the container
        heroContainer.addEventListener('mouseleave', () => {
            // Restore wrapper
            heroWrapper.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            heroWrapper.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

            // Restore text
            if (textOverlay) {
                textOverlay.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                textOverlay.style.transform = 'translate(-50%, -50%) translateZ(50px) scale(1)';
            }

            // Restore claw
            if (claw) {
                claw.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                claw.style.transform = 'translateX(-50%) translateY(0) scale(1)';
            }

            // Remove transition delay to ensure smoothness on next mousemove
            setTimeout(() => {
                heroWrapper.style.transition = 'transform 0.1s ease-out';
                if (textOverlay) textOverlay.style.transition = 'none';
                if (claw) claw.style.transition = 'none';
            }, 600);
        });
    }

    // Small Fade-in entry animation
    const elements = document.querySelectorAll('.hero-content, .vertical-text-left, .social-icons-right, .available-on');
    elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.animation = `fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1) ${i * 0.2}s forwards`;
    });

    // Mobile Menu Toggle Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-mode');

    if (mobileMenuBtn && closeMenuBtn && mobileMenuOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
            // Add a small bounce animation to the star
            mobileMenuBtn.style.transform = 'scale(0.8)';
            setTimeout(() => mobileMenuBtn.style.transform = '', 150);
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuOverlay.classList.remove('active');
            });
        });
    }
});

// Loading Screen Logic
// We use window.addEventListener('load', ...) which waits for the entire page
// including all dependent resources such as stylesheets and images.
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');

    if (loader) {
        // Add a slight delay so the loader is visible for at least a split second
        // even on very fast connections, to show off the cool animation.
        setTimeout(() => {
            loader.classList.add('loader-hidden');

            // Remove the loader from the DOM entirely after the CSS transition finishes (0.6s)
            loader.addEventListener('transitionend', () => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            });
        }, 500);
    }
});

// =========================================
// TRANSLATION LOGIC
// =========================================
const translations = {
    es: {
        home: "INICIO",
        story: "HISTORIA",
        character: "PERSONAJE",
        program: "PROGRAMA",
        about_us: "SOBRE NOSOTROS",
        claim: "RECLAMAR",
        sign_up: "REGÍSTRATE",
        subtitle: "HOLA:BIENVENIDO",
        available_on: "DISPONIBLE EN :",
        back_home: "VOLVER AL INICIO",
        access_terminal: "TERMINAL DE ACCESO",
        enter_credentials: "Ingresa tus credenciales para establecer conexión",
        username_email: "Usuario o Correo",
        password: "Contraseña",
        remember_me: "Recuérdame",
        forgot_password: "¿Olvidaste tu contraseña?",
        initialize: "INICIALIZAR",
        or_login_via: "O INICIA SESIÓN POR ENLACE SEGURO",
        new_user: "¿Nuevo usuario?",
        create_account: "Crear Cuenta"
    },
    en: {
        home: "HOME",
        story: "STORY",
        character: "CHARACTER",
        program: "PROGRAM",
        about_us: "ABOUT US",
        claim: "CLAIM",
        sign_up: "SIGN UP",
        subtitle: "HELLO:WELCOME",
        available_on: "AVAILABLE ON :",
        back_home: "BACK TO HOME",
        access_terminal: "ACCESS TERMINAL",
        enter_credentials: "Enter your credentials to establish connection",
        username_email: "Username or Email",
        password: "Password",
        remember_me: "Remember Me",
        forgot_password: "Forgot password?",
        initialize: "INITIALIZE",
        or_login_via: "OR LOGIN VIA SECURE LINK",
        new_user: "New user?",
        create_account: "Create Account"
    },
    jp: {
        home: "ホーム",
        story: "ストーリー",
        character: "キャラクター",
        program: "プログラム",
        about_us: "私たちについて",
        claim: "請求する",
        sign_up: "サインアップ",
        subtitle: "こんにちは：ようこそ",
        available_on: "利用可能 :",
        back_home: "ホームへ戻る",
        access_terminal: "アクセス端末",
        enter_credentials: "資格情報を入力して接続を確立してください",
        username_email: "ユーザー名またはメール",
        password: "パスワード",
        remember_me: "記録する",
        forgot_password: "パスワードを忘れた？",
        initialize: "初期化",
        or_login_via: "安全なリンクからログイン",
        new_user: "新規ユーザー？",
        create_account: "アカウント作成"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch) {
        langSwitch.addEventListener('change', (e) => {
            const lang = e.target.value;

            // Update all elements with data-translate attribute
            document.querySelectorAll('[data-translate]').forEach(el => {
                const key = el.getAttribute('data-translate');
                if (translations[lang] && translations[lang][key]) {
                    el.textContent = translations[lang][key];
                }
            });

            // Update document lang attribute
            document.documentElement.lang = lang;
        });

        // Initialize language on load according to select value (default 'es' based on HTML)
        langSwitch.dispatchEvent(new Event('change'));
    }
});
