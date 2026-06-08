// Mobile menu
const body = document.body;
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const warnBar = document.querySelector(".warn");
const header = document.querySelector(".header");

function setMenuState(isOpen) {
    hamburger.classList.toggle("active", isOpen);
    mobileMenu.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    body.classList.toggle("menu-open", isOpen);
}

if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
        setMenuState(!mobileMenu.classList.contains("active"));
    });

    document.addEventListener("click", (event) => {
        const clickInsideMenu = mobileMenu.contains(event.target);
        const clickHamburger = hamburger.contains(event.target);

        if (!clickInsideMenu && !clickHamburger) {
            setMenuState(false);
        }
    });
}

// Scroll effects
function syncScrollState() {
    const scrollY = window.scrollY;
    const warnIsHidden = warnBar ? warnBar.classList.contains("hidden") : false;
    const shouldHideWarn = scrollY > 64 || (warnIsHidden && scrollY > 4);
    const isScrolled = scrollY > 24;

    if (warnBar) {
        warnBar.classList.toggle("hidden", shouldHideWarn);
    }

    if (header) {
        header.classList.toggle("scrolled", isScrolled);
        header.classList.toggle("warn-hidden", shouldHideWarn);
    }

    if (mobileMenu) {
        mobileMenu.classList.toggle("warn-hidden", shouldHideWarn);
    }
}

window.addEventListener("scroll", syncScrollState);
window.addEventListener("load", syncScrollState);

// Reveal animations
const revealItems = document.querySelectorAll(".reveal, .bid-card, .artwork-card");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
});

revealItems.forEach((item) => {
    if (!item.classList.contains("reveal")) {
        item.classList.add("reveal");
    }
    revealObserver.observe(item);
});

// Button ripple
document.querySelectorAll(".btn-connect, .btn-connect-mobile, .btn-explore, .btn-create, .btn-bid").forEach((button) => {
    button.addEventListener("click", (event) => {
        const ripple = document.createElement("span");
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - (size / 2);
        const y = event.clientY - rect.top - (size / 2);

        ripple.className = "ripple";
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.appendChild(ripple);
        window.setTimeout(() => ripple.remove(), 600);
    });
});

const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
    .btn-connect,
    .btn-connect-mobile,
    .btn-explore,
    .btn-create,
    .btn-bid {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        background: rgba(255, 255, 255, 0.45);
        animation: ripple-effect 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Age gate
const ageModal = document.getElementById("ageModal");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

window.addEventListener("load", () => {
    if (!localStorage.getItem("alfakherAgeConfirmed")) {
        ageModal.classList.add("active");
        ageModal.setAttribute("aria-hidden", "false");
    }
});

if (yesBtn) {
    yesBtn.addEventListener("click", () => {
        localStorage.setItem("alfakherAgeConfirmed", "true");
        ageModal.classList.remove("active");
        ageModal.setAttribute("aria-hidden", "true");
    });
}

if (noBtn) {
    noBtn.addEventListener("click", () => {
        window.alert("Acesso reservado a maiores de 18 anos.");
    });
}

// Reviews slider
const reviewsTrack = document.getElementById("reviewsTrack");
const prevReview = document.getElementById("prevReview");
const nextReview = document.getElementById("nextReview");

if (reviewsTrack && prevReview && nextReview) {
    const reviewCards = Array.from(reviewsTrack.querySelectorAll(".review-card"));
    let reviewIndex = 0;

    function getCardsToShow() {
        if (window.innerWidth <= 768) {
            return 1;
        }
        if (window.innerWidth <= 1100) {
            return 2;
        }
        return 3;
    }

    function updateReviewSlider() {
        const cardsToShow = getCardsToShow();
        const maxIndex = Math.max(0, reviewCards.length - cardsToShow);

        if (reviewIndex > maxIndex) {
            reviewIndex = maxIndex;
        }

        const percentage = reviewIndex * (100 / cardsToShow);
        reviewsTrack.style.transform = `translateX(-${percentage}%)`;
    }

    nextReview.addEventListener("click", () => {
        const cardsToShow = getCardsToShow();
        const maxIndex = Math.max(0, reviewCards.length - cardsToShow);
        reviewIndex = reviewIndex >= maxIndex ? 0 : reviewIndex + 1;
        updateReviewSlider();
    });

    prevReview.addEventListener("click", () => {
        const cardsToShow = getCardsToShow();
        const maxIndex = Math.max(0, reviewCards.length - cardsToShow);
        reviewIndex = reviewIndex <= 0 ? maxIndex : reviewIndex - 1;
        updateReviewSlider();
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(updateReviewSlider, 150);
    });

    updateReviewSlider();
}

// FAQ accordion
document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector(".faq-question");
    if (!button) {
        return;
    }

    button.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        document.querySelectorAll(".faq-item").forEach((faqItem) => {
            faqItem.classList.remove("active");
            const faqButton = faqItem.querySelector(".faq-question");
            if (faqButton) {
                faqButton.setAttribute("aria-expanded", "false");
            }
        });

        if (!isActive) {
            item.classList.add("active");
            button.setAttribute("aria-expanded", "true");
        }
    });
});

// Footer city list toggle
const cityToggle = document.getElementById("city");
const cityWrapper = document.querySelector(".foot-cont-three");
const portugalCities = document.getElementById("portugal-cities");

if (cityToggle && cityWrapper) {
    cityToggle.addEventListener("click", () => {
        const isExpanded = cityWrapper.classList.toggle("expanded");
        cityToggle.classList.toggle("active", isExpanded);

        if (portugalCities) {
            portugalCities.hidden = !isExpanded;
        }
    });
}

// Footer year
const year = document.getElementById("year");
if (year) {
    year.textContent = new Date().getFullYear();
}
