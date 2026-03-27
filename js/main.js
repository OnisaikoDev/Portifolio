document.addEventListener("DOMContentLoaded", () => {
    setDynamicValues();
    initTypedEffect();
    initStarfield();
    initRevealOnScroll();
    initNavHighlight();
    initMobileNav();
    initHeaderState();
    initTiltCards();
    initHeroParallax();
    initProjectsCarousel();
});

function setDynamicValues() {
    const currentYear = new Date().getFullYear();
    const birthYear = 1999;

    const yearElement = document.getElementById("current-year");
    const ageElement = document.getElementById("age-value");

    if (yearElement) {
        yearElement.textContent = String(currentYear);
    }

    if (ageElement) {
        ageElement.textContent = String(currentYear - birthYear);
    }
}

function initTypedEffect() {
    const typedEl = document.getElementById("typed-text");
    if (!typedEl) return;

    const phrases = [
        "landing pages com presença",
        "interfaces modernas e responsivas",
        "experiências digitais de alto impacto"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isTyping = true;

    function tick() {
        const currentPhrase = phrases[phraseIndex];

        if (isTyping) {
            charIndex += 1;
            typedEl.textContent = currentPhrase.slice(0, charIndex);

            if (charIndex < currentPhrase.length) {
                window.setTimeout(tick, 70);
                return;
            }

            isTyping = false;
            window.setTimeout(tick, 1500);
            return;
        }

        charIndex -= 1;
        typedEl.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex > 0) {
            window.setTimeout(tick, 35);
            return;
        }

        isTyping = true;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window.setTimeout(tick, 350);
    }

    tick();
}

function initStarfield() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    const stars = [];
    const starCount = 90;
    let pointerX = 0;
    let pointerY = 0;
    const accentColor = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue("--accent") || "#7aa2ff");

    function createStar() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.4,
            speed: Math.random() * 0.35 + 0.08,
            alpha: Math.random() * 0.6 + 0.2,
            drift: Math.random() * 0.3 + 0.05
        };
    }

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        stars.length = 0;

        for (let index = 0; index < starCount; index += 1) {
            stars.push(createStar());
        }
    }

    function draw() {
        context.clearRect(0, 0, width, height);

        stars.forEach((star) => {
            star.y += star.speed;
            star.x += (pointerX - width / 2) * 0.000015 * star.drift;

            if (star.y > height + 10) {
                star.y = -10;
                star.x = Math.random() * width;
            }

            if (star.x > width + 10) star.x = -10;
            if (star.x < -10) star.x = width + 10;

            context.beginPath();
            context.fillStyle = `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, ${star.alpha})`;
            context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            context.fill();
        });

        window.requestAnimationFrame(draw);
    }

    window.addEventListener("mousemove", (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
    });

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    draw();
}

function hexToRgb(hexValue) {
    let value = hexValue.trim();

    if (value.startsWith("#")) {
        value = value.slice(1);
    }

    if (value.length === 3) {
        value = value.split("").map((char) => char + char).join("");
    }

    const parsedValue = Number.parseInt(value, 16);

    return {
        r: (parsedValue >> 16) & 255,
        g: (parsedValue >> 8) & 255,
        b: parsedValue & 255
    };
}

function initRevealOnScroll() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("show");
            currentObserver.unobserve(entry.target);
        });
    }, { threshold: 0.18 });

    elements.forEach((element) => currentObserverSafeObserve(observer, element));
}

function currentObserverSafeObserve(observer, element) {
    observer.observe(element);
}

function initNavHighlight() {
    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");
    if (!links.length || !sections.length) return;

    function updateActiveLink() {
        const scrollPosition = window.scrollY + window.innerHeight * 0.35;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPosition < top || scrollPosition >= bottom || !id) return;

            links.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${id}`;
                link.classList.toggle("active", isActive);
            });
        });
    }

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();
}

function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const links = document.querySelectorAll(".nav-link");

    if (!toggle || !links.length) return;

    links.forEach((link) => {
        link.addEventListener("click", () => {
            toggle.checked = false;
        });
    });
}

function initHeaderState() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    function syncHeader() {
        header.classList.toggle("scrolled", window.scrollY > 24);
    }

    window.addEventListener("scroll", syncHeader);
    syncHeader();
}

function initTiltCards() {
    const tiltElements = document.querySelectorAll("[data-tilt]");
    if (!tiltElements.length) return;

    tiltElements.forEach((element) => {
        let frameId = 0;

        function resetTilt() {
            element.style.transform = "";
        }

        element.addEventListener("mousemove", (event) => {
            const bounds = element.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;
            const rotateY = ((x / bounds.width) - 0.5) * 12;
            const rotateX = ((y / bounds.height) - 0.5) * -12;

            if (frameId) {
                cancelAnimationFrame(frameId);
            }

            frameId = requestAnimationFrame(() => {
                element.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });
        });

        element.addEventListener("mouseleave", () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }

            resetTilt();
        });
    });
}

function initHeroParallax() {
    const hero = document.querySelector(".hero-section");
    const heroPanel = document.querySelector(".hero-panel");
    const heroCopy = document.querySelector(".hero-copy");

    if (!hero || !heroPanel || !heroCopy) return;

    let frameId = 0;

    hero.addEventListener("mousemove", (event) => {
        const bounds = hero.getBoundingClientRect();
        const xPercent = (event.clientX - bounds.left) / bounds.width - 0.5;
        const yPercent = (event.clientY - bounds.top) / bounds.height - 0.5;

        if (frameId) {
            cancelAnimationFrame(frameId);
        }

        frameId = requestAnimationFrame(() => {
            heroPanel.style.transform = `translate3d(${xPercent * 18}px, ${yPercent * 16}px, 0)`;
            heroCopy.style.transform = `translate3d(${xPercent * -10}px, ${yPercent * -8}px, 0)`;
        });
    });

    hero.addEventListener("mouseleave", () => {
        heroPanel.style.transform = "";
        heroCopy.style.transform = "";
    });
}

function initProjectsCarousel() {
    const slides = Array.from(document.querySelectorAll("[data-project-slide]"));
    const prevButton = document.querySelector("[data-project-prev]");
    const nextButton = document.querySelector("[data-project-next]");
    const dots = Array.from(document.querySelectorAll("[data-project-dot]"));
    const carousel = document.querySelector(".projects-carousel");
    const counter = document.querySelector("[data-project-counter]");

    if (!slides.length || !prevButton || !nextButton || !dots.length || !carousel) return;

    let activeIndex = 0;
    let intervalId = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function paint() {
        slides.forEach((slide, index) => {
            slide.classList.remove("is-active", "is-next", "is-prev", "is-hidden");

            if (index === activeIndex) {
                slide.classList.add("is-active");
                return;
            }

            if (index === (activeIndex + 1) % slides.length) {
                slide.classList.add("is-next");
                return;
            }

            if (index === (activeIndex + 2) % slides.length) {
                slide.classList.add("is-prev");
                return;
            }

            slide.classList.add("is-hidden");
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle("is-active", index === activeIndex);
        });

        if (counter) {
            const current = String(activeIndex + 1).padStart(2, "0");
            const total = String(slides.length).padStart(2, "0");
            counter.textContent = `${current} / ${total}`;
        }
    }

    function goTo(index) {
        activeIndex = (index + slides.length) % slides.length;
        paint();
    }

    function startAutoPlay() {
        stopAutoPlay();
        intervalId = window.setInterval(() => {
            goTo(activeIndex + 1);
        }, 4200);
    }

    function stopAutoPlay() {
        if (!intervalId) return;
        window.clearInterval(intervalId);
    }

    prevButton.addEventListener("click", () => {
        goTo(activeIndex - 1);
        startAutoPlay();
    });

    nextButton.addEventListener("click", () => {
        goTo(activeIndex + 1);
        startAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goTo(index);
            startAutoPlay();
        });
    });

    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);

    carousel.addEventListener("touchstart", (event) => {
        stopAutoPlay();
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {
        touchEndX = event.changedTouches[0].clientX;
        const delta = touchEndX - touchStartX;

        if (Math.abs(delta) > 40) {
            if (delta < 0) {
                goTo(activeIndex + 1);
            } else {
                goTo(activeIndex - 1);
            }
        }

        startAutoPlay();
    }, { passive: true });

    paint();
    startAutoPlay();
}
