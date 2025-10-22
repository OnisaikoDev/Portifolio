// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initTypedEffect();
    initStarfield();
    initRevealOnScroll();
    initNavHighlight();
    initMobileNav();
});

// Typed effect for hero section
function initTypedEffect() {
    const typedEl = document.getElementById('typed-text');
    if (!typedEl) return;
    const phrases = [
        'Interatividade de alto nível',
        'Design moderno e responsivo',
        'Experiências que encantam'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let typing = true;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (typing) {
            typedEl.textContent = currentPhrase.substring(0, charIndex);
            if (charIndex < currentPhrase.length) {
                charIndex++;
                setTimeout(type, 100);
            } else {
                typing = false;
                setTimeout(type, 2000);
            }
        } else {
            typedEl.textContent = currentPhrase.substring(0, charIndex);
            if (charIndex > 0) {
                charIndex--;
                setTimeout(type, 50);
            } else {
                typing = true;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 300);
            }
        }
    }
    type();
}

// Starfield animation for background canvas
function initStarfield() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    const numStars = 120;
    const stars = [];
    // Get accent colour from CSS variable
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#00c853';

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        stars.length = 0;
        for (let i = 0; i < numStars; i++) {
            stars.push(createStar());
        }
    }

    function createStar() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * width,
            o: Math.random() * 0.5 + 0.3
        };
    }

    function update() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            star.z -= 2;
            if (star.z <= 0) {
                stars[i] = createStar();
                stars[i].z = width;
            }
            const k = 128.0 / star.z;
            const px = (star.x - width / 2) * k + width / 2;
            const py = (star.y - height / 2) * k + height / 2;
            const size = (1 - star.z / width) * 3;
            ctx.beginPath();
            ctx.fillStyle = `rgba(${hexToRgb(accentColor).r}, ${hexToRgb(accentColor).g}, ${hexToRgb(accentColor).b}, ${star.o})`;
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(update);
    }

    window.addEventListener('resize', resize);
    resize();
    update();
}

// Convert hex colour to RGB object
function hexToRgb(hex) {
    let c = hex.trim();
    if (c.startsWith('#')) c = c.substring(1);
    if (c.length === 3) {
        c = c.split('').map(ch => ch + ch).join('');
    }
    const num = parseInt(c, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

// Reveal elements when they enter the viewport
function initRevealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    const options = {
        threshold: 0.2
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    reveals.forEach(el => {
        observer.observe(el);
    });
}

// Highlight navigation links based on scroll position
function initNavHighlight() {
    const navLinks = document.querySelectorAll('nav a.nav-link');
    const sections = document.querySelectorAll('section');
    function onScroll() {
        const scrollPos = window.scrollY + (window.innerHeight / 2);
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const offsetTop = window.scrollY + rect.top;
            const offsetBottom = offsetTop + rect.height;
            const id = section.getAttribute('id');
            if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
}

// Collapse mobile navigation on link click and toggle menu
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle.checked) {
                navToggle.checked = false;
            }
        });
    });
}