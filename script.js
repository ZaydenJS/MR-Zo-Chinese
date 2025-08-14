// ===== MENU DOWNLOAD FALLBACK =====
// If menu.pdf is missing, show a friendly message instead of a 404
document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.getElementById("download-menu-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", async function (e) {
      try {
        const res = await fetch("menu.pdf", { method: "HEAD" });
        if (!res.ok) {
          e.preventDefault();
          showNotification(
            "Full menu PDF is coming soon. Please call us at 0491 570 156 for today's menu.",
            "info"
          );
        }
      } catch (err) {
        e.preventDefault();
        showNotification(
          "Full menu PDF is coming soon. Please call us at 0491 570 156 for today's menu.",
          "info"
        );
      }
    });
  }
});

// ===== LOADING SCREEN =====
window.addEventListener("load", function () {
  const loadingScreen = document.getElementById("loading-screen");
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 500);
  }, 1500);
});

// ===== HEADER SCROLL EFFECT =====
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const headerHeight = document.querySelector(".header").offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ===== MOBILE MENU TOGGLE =====
document.addEventListener("DOMContentLoaded", function () {
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (mobileToggle && navMenu) {
    // Toggle mobile menu
    mobileToggle.addEventListener("click", function () {
      const isActive = navMenu.classList.contains("active");

      if (isActive) {
        navMenu.classList.remove("active");
        mobileToggle.classList.remove("active");
        document.body.style.overflow = "";
      } else {
        navMenu.classList.add("active");
        mobileToggle.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        mobileToggle.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove("active");
        mobileToggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Close mobile menu on window resize (if screen becomes larger)
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        navMenu.classList.remove("active");
        mobileToggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
});

// ===== RESERVATION MODAL =====
document.addEventListener("DOMContentLoaded", function () {
  const reservationBtns = document.querySelectorAll(".reservation-btn");
  const modal = document.getElementById("reservation-modal");
  const modalClose = document.querySelector(".modal-close");

  // Open modal
  reservationBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  // Close modal when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
});

// ===== FORM HANDLING =====
document.addEventListener("DOMContentLoaded", function () {
  // Contact form
  const contactForm = document.getElementById("reservation-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Simulate form submission
      showNotification(
        "Thank you for your reservation request! We will contact you shortly to confirm.",
        "success"
      );
      contactForm.reset();
    });
  }

  // Modal form
  const modalForm = document.getElementById("modal-reservation-form");
  if (modalForm) {
    modalForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(modalForm);
      const data = Object.fromEntries(formData);

      // Simulate form submission
      showNotification(
        "Thank you for your reservation request! We will contact you shortly to confirm.",
        "success"
      );
      modalForm.reset();

      // Close modal
      const modal = document.getElementById("reservation-modal");
      modal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${
        type === "success" ? "check-circle" : "info-circle"
      }"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === "success" ? "#4CAF50" : "#2196F3"};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 10001;
    animation: slideInRight 0.3s ease;
    max-width: 400px;
  `;

  // Add to page
  document.body.appendChild(notification);

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ===== SCROLL ANIMATIONS =====
function observeElements() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements that should animate on scroll
  const animatedElements = document.querySelectorAll(
    ".menu-item, .review-card, .gallery-item, .info-card, .about-highlight"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener("DOMContentLoaded", observeElements);

// ===== GALLERY LIGHTBOX =====
document.addEventListener("DOMContentLoaded", function () {
  const galleryItems = document.querySelectorAll(".gallery-item");

  // Build an array of image sources from the gallery items
  const images = Array.from(galleryItems).map((item) => {
    const el = item.querySelector(".gallery-image");
    return getComputedStyle(el).backgroundImage;
  });

  function openLightbox(index) {
    const item = galleryItems[index];
    const imageElement = item.querySelector(".gallery-image");
    const title =
      item.querySelector(".gallery-overlay h4")?.textContent || "Gallery Image";
    const description =
      item.querySelector(".gallery-overlay p")?.textContent || "";

    // Create lightbox
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
        <button class="lightbox-next" aria-label="Next">&#10095;</button>
        <div class="lightbox-image"></div>
        <div class="lightbox-caption">
          <h3>${title}</h3>
          <div class="lightbox-description">${description}</div>
        </div>
      </div>
    `;

    // Backdrop
    lightbox.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 10002;
      display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease;
    `;

    const content = lightbox.querySelector(".lightbox-content");
    content.style.cssText = `
      position: relative; background: #fff; border-radius: 8px; max-width: 90%; max-height: 90%;
      overflow: hidden; display: flex; flex-direction: column; animation: slideUp 0.3s ease;
    `;

    const img = lightbox.querySelector(".lightbox-image");
    img.style.cssText = `
      width: 80vw; max-width: 1100px; height: 60vh; background-size: cover; background-position: center;
    `;

    const caption = lightbox.querySelector(".lightbox-caption");
    caption.style.cssText = `padding: 0.75rem 1rem; color: #666;`;

    const closeBtn = lightbox.querySelector(".lightbox-close");
    closeBtn.style.cssText = `
      position: absolute; top: 10px; right: 12px; background: rgba(0,0,0,0.6); color: #fff;
      border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;
    `;

    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");
    [prevBtn, nextBtn].forEach((btn) => {
      btn.style.cssText = `
        position: absolute; top: 50%; transform: translateY(-50%);
        background: rgba(0,0,0,0.5); color: #fff; border: none; width: 44px; height: 44px;
        border-radius: 50%; font-size: 1.3rem; cursor: pointer;
      `;
    });
    prevBtn.style.left = "12px";
    nextBtn.style.right = "12px";

    function render(i) {
      img.style.backgroundImage = images[i];
    }

    // Add to page
    document.body.appendChild(lightbox);
    document.body.style.overflow = "hidden";
    render(index);

    function closeLightbox() {
      lightbox.style.animation = "fadeOut 0.3s ease";
      setTimeout(() => {
        lightbox.remove();
        document.body.style.overflow = "";
      }, 300);
    }

    function goPrev() {
      index = (index - 1 + images.length) % images.length;
      render(index);
    }
    function goNext() {
      index = (index + 1) % images.length;
      render(index);
    }

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", goPrev);
    nextBtn.addEventListener("click", goNext);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    const keyHandler = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", keyHandler);

    // Clean up key handler when closing
    const observer = new MutationObserver(() => {
      if (!document.body.contains(lightbox)) {
        document.removeEventListener("keydown", keyHandler);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });
  }

  // Attach click handlers to open with correct index
  galleryItems.forEach((item, idx) => {
    item.addEventListener("click", function () {
      openLightbox(idx);
    });
  });
});
