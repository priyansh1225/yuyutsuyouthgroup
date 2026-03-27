// ================= LOADER =================
window.addEventListener("load", function () {
  const loader = document.querySelector(".loader");

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 1500);
});

// ================= MOBILE MENU =================
const menuBtn = document.querySelector(".menu-btn");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    menuBtn.classList.toggle("active");

    const expanded = menuBtn.classList.contains("active");
    menuBtn.setAttribute("aria-expanded", expanded);
  });

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuBtn.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove("active");
      menuBtn.classList.remove("active");
    }
  });
}

// ================= SCROLL REVEAL =================
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.95;

  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < triggerBottom) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// first hero animation
window.addEventListener("load", () => {
  document.querySelectorAll(".reveal-first").forEach(el => {
    el.classList.add("active");
  });
});

// ================= SCROLL PROGRESS BAR =================
const progressBar = document.querySelector(".progress-bar");

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const scrolled = (scrollTop / height) * 100;

  if (progressBar) {
    progressBar.style.width = scrolled + "%";
  }
});

// ================= PARALLAX EFFECT =================
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  document.querySelectorAll(".floating-orb").forEach((orb, index) => {
    const speed = index === 0 ? 0.3 : 0.5;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// ================= BUTTON RIPPLE EFFECT =================
/*document.querySelectorAll(".btn").forEach(button => {
  button.addEventListener("click", function (e) {
    const circle = document.createElement("span");

    const diameter = Math.max(this.clientWidth, this.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - this.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - this.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = this.getElementsByClassName("ripple")[0];

    if (ripple) {
      ripple.remove();
    }

    this.appendChild(circle);
  });
});*/

// ================= SMOOTH SCROLL =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

// ================= NAVBAR SCROLL EFFECT =================
const navbar = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.style.background = "rgba(6, 12, 24, 0.95)";
  } else {
    navbar.style.background = "rgba(6, 12, 24, 0.7)";
  }
});

// ================= CARD TILT EFFECT (DESKTOP ONLY) =================
if (window.innerWidth > 768) {
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
  });
}
function openReportModal(imageSrc) {
  const modal = document.getElementById("reportModal");
  const modalImg = document.getElementById("reportModalImg");

  if (modal && modalImg) {
    modalImg.src = imageSrc;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function closeReportModal() {
  const modal = document.getElementById("reportModal");

  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
}

document.addEventListener("click", function (e) {
  const modal = document.getElementById("reportModal");
  const modalImg = document.getElementById("reportModalImg");

  if (!modal || !modalImg) return;

  if (e.target === modal) {
    closeReportModal();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeReportModal();
  }
});
function openGalleryImage(src) {
  const modal = document.getElementById("galleryModal");
  const modalImg = document.getElementById("galleryModalImg");

  modalImg.src = src;
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeGalleryModal() {
  const modal = document.getElementById("galleryModal");
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

// close when clicking outside image
document.addEventListener("click", function (e) {
  const modal = document.getElementById("galleryModal");
  const img = document.getElementById("galleryModalImg");

  if (!modal || !img) return;

  if (e.target === modal) {
    closeGalleryModal();
  }
});

// close with ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeGalleryModal();
  }
});