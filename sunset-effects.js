// Efeitos Avançados JavaScript para Sunset 2025 - Aveiro

// ========================
// LOADER INICIAL
// ========================
window.addEventListener('load', () => {
    const loader = document.querySelector('.page-transition');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 1500);
    }
});

// ========================
// PARTÍCULAS DE MARESIA
// ========================
function createParticles() {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.animationDuration = (3 + Math.random() * 2) + 's';
        document.body.appendChild(particle);
    }
}

// ========================
// EFEITO RIPPLE AO CLICAR
// ========================
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});

// ========================
// PARALLAX SCROLL
// ========================
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Atualizar indicador de scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        const scrollPercentage = (scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        scrollIndicator.style.width = scrollPercentage + '%';
    }
    
    // Efeito parallax nos moliceiros
    document.querySelectorAll('.moliceiro').forEach((moliceiro, index) => {
        const speed = 0.5 + (index * 0.1);
        moliceiro.style.transform = `translateY(${scrollY * speed * 0.1}px) rotate(${scrollY * 0.05}deg)`;
    });
    
    // Efeito parallax no sol
    const sun = document.querySelector('.sun');
    if (sun) {
        sun.style.transform = `translateX(-50%) translateY(${scrollY * 0.3}px)`;
    }
    
    lastScrollY = scrollY;
});

// ========================
// INTERSECTION OBSERVER PARA ANIMAÇÕES
// ========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.event-card, .testimonial-card, .countdown-item').forEach(el => {
    el.classList.add('section-fade-in');
    observer.observe(el);
});

// ========================
// CONFETTI ALEATÓRIO
// ========================
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6c5ce7', '#a29bfe'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.width = (5 + Math.random() * 10) + 'px';
        confetti.style.height = confetti.style.width;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Confetti a cada 30 segundos
setInterval(createConfetti, 30000);

// ========================
// NOTIFICAÇÕES TOAST
// ========================
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <strong>🎉 ${message}</strong>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slide-in 0.5s ease-out reverse';
        setTimeout(() => toast.remove(), 500);
    }, duration);
}

// Mostrar mensagem de boas-vindas
setTimeout(() => {
    showToast('Bem-vindo ao Sunset 2025 - Praia da Barra!');
}, 2000);

// ========================
// CURSOR PERSONALIZADO
// ========================
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorFollower = document.createElement('div');
cursorFollower.className = 'custom-cursor-follower';
document.body.appendChild(cursorFollower);

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateFollower);
}
animateFollower();

// ========================
// EFEITO HOVER NOS MOLICEIROS
// ========================
document.querySelectorAll('.moliceiro').forEach(moliceiro => {
    moliceiro.classList.add('moliceiro-3d');
    
    moliceiro.addEventListener('mouseenter', () => {
        moliceiro.style.transform = 'scale(1.3) rotate3d(1, 1, 0, 20deg)';
        createMiniConfetti(moliceiro);
    });
    
    moliceiro.addEventListener('mouseleave', () => {
        moliceiro.style.transform = 'scale(1) rotate3d(0, 0, 0, 0deg)';
    });
});

function createMiniConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#4682b4', '#87ceeb', '#ffd93d'];
    
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = (rect.left + rect.width / 2) + 'px';
        confetti.style.top = (rect.top + rect.height / 2) + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 1500);
    }
}

// ========================
// MODO CLARO/ESCURO
// ========================
let isDarkMode = true;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    
    if (!isDarkMode) {
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        document.querySelectorAll('img, .sun, .farol').forEach(el => {
            el.style.filter = 'invert(1) hue-rotate(180deg)';
        });
        showToast('Modo claro ativado ☀️');
    } else {
        document.body.style.filter = 'none';
        document.querySelectorAll('img, .sun, .farol').forEach(el => {
            el.style.filter = 'none';
        });
        showToast('Modo escuro ativado 🌙');
    }
}

// ========================
// EFEITO BRILHO NOS CARDS
// ========================
document.querySelectorAll('.event-card').forEach(card => {
    card.classList.add('card-shine');
});

// ========================
// ANIMAÇÃO DO FAROL
// ========================
const farol = document.querySelector('.farol');
if (farol) {
    setInterval(() => {
        farol.style.textShadow = '0 0 50px yellow, 0 0 100px orange';
        setTimeout(() => {
            farol.style.textShadow = '0 0 20px yellow';
        }, 200);
    }, 3000);
}

// ========================
// SONS (opcional - pode ativar/desativar)
// ========================
let soundEnabled = false;

function playWaveSound() {
    if (!soundEnabled) return;
    // Implementação futura: adicionar sons de ondas
}

// ========================
// CONTADOR REGRESSIVO MELHORADO
// ========================
document.querySelectorAll('.countdown-number').forEach(num => {
    num.classList.add('neon-text');
});

// ========================
// EASTER EGGS
// ========================
let clickCount = 0;
document.querySelector('.farol')?.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        showToast('🗼 Descobriste um Easter Egg! O Farol da Barra tem 66 metros!');
        createConfetti();
        clickCount = 0;
    }
});

// Konami Code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            showToast('🎮 CHEAT CODE ATIVADO! Confetti infinito!');
            for (let i = 0; i < 100; i++) {
                setTimeout(() => createConfetti(), i * 100);
            }
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// ========================
// COMPARTILHAR NAS REDES SOCIAIS
// ========================
function shareOnSocial(platform) {
    const url = window.location.href;
    const text = 'Vem celebrar o Ano Novo 2026 na Praia da Barra, Aveiro! 🌅🎉';
    
    const urls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        whatsapp: `https://wa.me/?text=${text} ${url}`
    };
    
    if (urls[platform]) {
        window.open(urls[platform], '_blank');
        showToast(`Partilhar no ${platform}!`);
    }
}

// ========================
// INICIALIZAR TUDO
// ========================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    // Adicionar indicador de scroll
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.appendChild(scrollIndicator);
    
    // Adicionar botão de tema
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.addEventListener('click', () => {
        toggleTheme();
        themeToggle.innerHTML = isDarkMode ? '🌙' : '☀️';
    });
    document.body.appendChild(themeToggle);
    
    console.log('🌅 Sunset 2025 - Aveiro carregado com sucesso!');
});

// ========================
// PRELOAD DE IMAGENS
// ========================
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preloadLink = document.createElement('link');
            preloadLink.href = src;
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            document.head.appendChild(preloadLink);
        }
    });
}

preloadImages();
