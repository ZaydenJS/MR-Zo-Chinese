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

// ===== REMOVE LOADING SCREEN (removed for performance) =====
// Loading screen markup removed and this block deleted to avoid delaying FCP/LCP

// ===== HEADER SCROLL EFFECT =====
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ===== SMOOTH SCROLLING (accounts for sticky header and mobile menu) =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();

    const header = document.querySelector(".header");
    const headerHeight = header ? header.offsetHeight : 0;

    const scrollToTarget = () => {
      const rect = targetElement.getBoundingClientRect();
      const targetTop = window.pageYOffset + rect.top - headerHeight - 6; // small comfort offset
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    };

    // If mobile menu is open, close it first then scroll after transition
    const navMenu = document.querySelector(".nav-menu");
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    if (navMenu && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      if (mobileToggle) mobileToggle.classList.remove("active");
      document.body.style.overflow = "";
      setTimeout(scrollToTarget, 280); // align with CSS transition speed
    } else {
      scrollToTarget();
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

// (Reservation modal removed as bookings are by phone call)
// (Reservation forms removed)
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

// ===== SCROLL ANIMATIONS + LAZY BACKGROUND IMAGES =====
function observeElements() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "200px 0px",
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

  // Aggressive loading for instant display - load images immediately when they're close to viewport
  const lazyBgObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const bg = el.getAttribute("data-bg");
          if (bg) {
            // Preload image for instant display
            const img = new Image();
            img.onload = () => {
              el.style.backgroundImage = `url('${bg}')`;
            };
            img.src = bg;
          }
          obs.unobserve(el);
        }
      });
    },
    { rootMargin: "800px 0px", threshold: 0 }
  );

  // Load critical above-the-fold images immediately
  const criticalImages = document.querySelectorAll(
    ".gallery-item:nth-child(-n+2) [data-bg]"
  );
  criticalImages.forEach((el) => {
    const bg = el.getAttribute("data-bg");
    if (bg) {
      const img = new Image();
      img.onload = () => {
        el.style.backgroundImage = `url('${bg}')`;
      };
      img.src = bg;
    }
  });

  // Observe remaining images for lazy loading
  document.querySelectorAll("[data-bg]").forEach((el) => {
    // Skip critical images that are already loaded
    if (!el.closest(".gallery-item:nth-child(-n+2)")) {
      lazyBgObserver.observe(el);
    }
  });

  // Lazy-load hero background image on desktop only; keep gradient-only on mobile for best SI
  const hero = document.querySelector(".hero-background");
  if (hero && window.innerWidth > 768) {
    const src = hero.getAttribute("data-bg-desktop");
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        hero.style.backgroundImage = `linear-gradient(135deg, rgba(200,16,46,0.8), rgba(139,0,0,0.9)), url('${src}')`;
      };
    }
  }
}

// Preload all gallery images for instant loading
function preloadAllImages() {
  const allImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  ];

  allImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  observeElements();
  preloadAllImages();
});

// ===== SCROLL TO TOP BUTTON =====
document.addEventListener("DOMContentLoaded", function () {
  const scrollToTopBtn = document.getElementById("scroll-to-top");
  const scrollThreshold = 300; // Show button after scrolling 300px

  // Show/hide button based on scroll position
  function toggleScrollButton() {
    if (window.pageYOffset > scrollThreshold) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  }

  // Smooth scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Event listeners
  window.addEventListener("scroll", toggleScrollButton);
  scrollToTopBtn.addEventListener("click", scrollToTop);

  // Initial check
  toggleScrollButton();
});

// ===== GALLERY LIGHTBOX =====
document.addEventListener("DOMContentLoaded", function () {
  const galleryItems = document.querySelectorAll(".gallery-item");

  // Build an array of image sources from the gallery items
  const images = Array.from(galleryItems).map((item) => {
    const el = item.querySelector(".gallery-image");
    const dataBg = el.getAttribute("data-bg");
    return dataBg ? `url('${dataBg}')` : getComputedStyle(el).backgroundImage;
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
      // Ensure the background image is loaded immediately when clicked
      const imageElement = item.querySelector(".gallery-image");
      const dataBg = imageElement.getAttribute("data-bg");
      if (dataBg && !imageElement.style.backgroundImage) {
        imageElement.style.backgroundImage = `url('${dataBg}')`;
      }
      openLightbox(idx);
    });
  });
});
