function initPopup() {
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
  const showCartToast = () => {
    if (!cartToast) return;
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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPopup);
} else {
  initPopup();
}
