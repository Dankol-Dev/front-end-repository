function initPopup() {
  // Hamburger menu toggle
  const hamburger = document.querySelector(".hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const nav = hamburger.closest(".container, .universal-container")?.querySelector("nav");
      if (!nav) return;
      const isOpen = nav.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Toggle navigation menu");
    });

    // Close the menu when a link is clicked
    document.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", () => {
        const nav = hamburger.closest(".container, .universal-container")?.querySelector("nav");
        nav?.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Toggle navigation menu");
      });
    });

    // Close the menu with Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const nav = hamburger.closest(".container, .universal-container")?.querySelector("nav");
        nav?.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Toggle navigation menu");
      }
    });
  }

  const eventForm = document.querySelector(".event-booking-form");
  if (eventForm) {
    const captcha = eventForm.querySelector(".g-recaptcha");
    const captchaError = eventForm.querySelector(".recaptcha-error");

    eventForm.addEventListener("submit", (event) => {
      const response = eventForm.querySelector('[name="g-recaptcha-response"]');
      event.preventDefault();
      captchaError.classList.toggle("is-success", Boolean(response?.value));
      if (response?.value) {
        captchaError.textContent = "Test response received. Verify this token on your server before processing event bookings.";
      } else {
        captchaError.textContent = "Please complete the reCAPTCHA verification before submitting.";
        captcha?.focus();
      }
    });
  }

  const popup = document.getElementById("popup");
  const closeBtn = document.querySelector(".close");
  const buttons = document.querySelectorAll(".subscribeBtn");
  const form = document.querySelector("#popup form");

  let lastTrigger = null;
  const closePopup = () => {
    if (!popup) return;
    popup.style.display = "none";
    popup.setAttribute("aria-hidden", "true");
    lastTrigger?.focus();
  };

  if (popup && closeBtn) {
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        lastTrigger = btn;
        popup.style.display = "flex";
        popup.setAttribute("aria-hidden", "false");
        form?.querySelector("input")?.focus();
      });
    });

    closeBtn.addEventListener("click", () => {
      closePopup();
    });

    window.addEventListener("click", (event) => {
      if (event.target === popup) {
        closePopup();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (popup.style.display !== "flex") return;

      if (event.key === "Escape") {
        closePopup();
        return;
      }

      if (event.key === "Tab") {
        const focusable = popup.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      alert("Thank you for subscribing!");
      closePopup();
      form.reset();
    });
  }

  const cartToast = document.getElementById('cart-toast');
  const showCartToast = (message = "Added to cart") => {
    if (!cartToast) return;
    cartToast.textContent = message;
    cartToast.classList.add('show');
    cartToast.style.display = 'block';
    cartToast.style.opacity = '1';
    cartToast.style.transform = 'translateY(0)';
    clearTimeout(showCartToast.timer);
    showCartToast.timer = setTimeout(() => {
      cartToast.classList.remove('show');
      cartToast.style.display = 'none';
      cartToast.style.opacity = '0';
      cartToast.style.transform = 'translateY(20px)';
    }, 1800);
  };

  const cartButtons = document.querySelectorAll('.universal-section button, .image-container button');
  cartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.textContent.trim().toLowerCase().includes('add to cart')) {
        showCartToast();
      }
    });
  });

  const cartItems = document.getElementById("cart-items");
  document.querySelectorAll(".recommendation-card .add-to-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".recommendation-card");
      const name = card?.dataset.name;
      const priceText = card?.dataset.price;
      if (!cartItems || !name || !priceText) return;

      const price = Number(priceText.replace(/[^0-9.]/g, ""));
      if (!Number.isFinite(price)) return;

      const existingRow = Array.from(cartItems.rows).find(
        (row) => row.cells[0]?.textContent.trim() === name
      );
      if (existingRow) {
        const quantityCell = existingRow.cells[2];
        const quantity = Number(quantityCell.textContent) + 1;
        quantityCell.textContent = String(quantity);
        existingRow.cells[3].textContent = `$${(price * quantity).toFixed(2)}`;
      } else {
        const row = cartItems.insertRow();
        row.insertCell().textContent = name;
        row.insertCell().textContent = `$${price.toFixed(2)}`;
        row.insertCell().textContent = "1";
        row.insertCell().textContent = `$${price.toFixed(2)}`;
      }

      showCartToast(`${name} added to your order`);
    });
  });

  const checkoutButton = document.getElementById("checkout-button");
  const checkoutStatus = document.getElementById("checkout-status");
  checkoutButton?.addEventListener("click", () => {
    if (checkoutStatus) {
      checkoutStatus.textContent = "Online checkout is not set up yet. Your selected items are ready to review.";
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPopup);
} else {
  initPopup();
}
