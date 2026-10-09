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

  let cartToast = document.getElementById('cart-toast');
  const showCartToast = (message) => {
    if (!cartToast) {
      cartToast = document.createElement('div');
      cartToast.id = 'cart-toast';
      cartToast.className = 'cart-toast';
      cartToast.setAttribute('aria-live', 'polite');
      cartToast.setAttribute('aria-atomic', 'true');
      document.body.append(cartToast);
    }
    cartToast.textContent = message;
    cartToast.classList.add('show');
    clearTimeout(showCartToast.timer);
    showCartToast.timer = setTimeout(() => {
      cartToast.classList.remove('show');
    }, 1800);
  };

  const cartKey = 'beanBoutiqueCart';
  const cartItems = document.querySelector('[data-cart-items]');
  const addToCartButtons = document.querySelectorAll(
    '.coffee-selection-page article button, .equipment-page .universal-section > div button'
  );

  const readCart = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      if (!Array.isArray(savedCart) || savedCart.some((item) => (
        !item
        || typeof item.id !== 'string'
        || typeof item.name !== 'string'
        || typeof item.currency !== 'string'
        || typeof item.image !== 'string'
        || !Number.isFinite(item.price)
        || !Number.isInteger(item.quantity)
        || item.quantity < 1
      ))) {
        throw new TypeError('Saved cart data is invalid.');
      }
      return savedCart;
    } catch (error) {
      console.error('Unable to read the saved shopping cart.', error);
      showCartToast('Unable to load your saved cart.');
      return [];
    }
  };

  const saveCart = (cart) => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('Unable to save the shopping cart.', error);
      showCartToast('Unable to save your cart. Please check browser storage.');
      return false;
    }
  };

  const formatPrice = (currency, price) => `${currency}${price.toFixed(2)}`;
  let cart = cartItems || addToCartButtons.length ? readCart() : [];

  const renderCart = () => {
    if (!cartItems) return;

    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('[data-cart-count]').textContent = String(count);
    document.querySelector('[data-cart-count-label]').textContent = count === 1 ? 'item' : 'items';
    document.querySelector('[data-summary-count]').textContent = String(count);
    document.querySelector('[data-summary-count-label]').textContent = count === 1 ? 'Item' : 'Items';
    cartItems.replaceChildren();

    if (cart.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'cart-empty';
      emptyMessage.innerHTML = '<h3>Your cart is empty</h3><p>Browse our selection and add something you love.</p>';
      const catalogLink = document.createElement('a');
      catalogLink.href = 'CoffeeSelection.html';
      catalogLink.textContent = 'Explore coffee';
      emptyMessage.append(catalogLink);
      cartItems.append(emptyMessage);
    } else {
      cart.forEach((item) => {
        const row = document.createElement('article');
        row.className = 'cart-item';

        const image = document.createElement('img');
        image.src = item.image;
        image.alt = '';

        const details = document.createElement('div');
        details.className = 'cart-item-details';
        const name = document.createElement('h3');
        name.textContent = item.name;
        const unitPrice = document.createElement('p');
        unitPrice.textContent = `${formatPrice(item.currency, item.price)} each`;
        details.append(name, unitPrice);

        const quantity = document.createElement('div');
        quantity.className = 'quantity-control';
        quantity.setAttribute('aria-label', `Quantity for ${item.name}`);
        const decrease = document.createElement('button');
        decrease.type = 'button';
        decrease.className = 'quantity-button';
        decrease.dataset.cartAction = 'decrease';
        decrease.dataset.cartId = item.id;
        decrease.setAttribute('aria-label', `Decrease ${item.name} quantity`);
        decrease.textContent = '−';
        const amount = document.createElement('span');
        amount.textContent = String(item.quantity);
        const increase = document.createElement('button');
        increase.type = 'button';
        increase.className = 'quantity-button';
        increase.dataset.cartAction = 'increase';
        increase.dataset.cartId = item.id;
        increase.setAttribute('aria-label', `Increase ${item.name} quantity`);
        increase.textContent = '+';
        quantity.append(decrease, amount, increase);

        const lineTotal = document.createElement('p');
        lineTotal.className = 'cart-line-total';
        lineTotal.textContent = formatPrice(item.currency, item.price * item.quantity);

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'cart-remove';
        remove.dataset.cartAction = 'remove';
        remove.dataset.cartId = item.id;
        remove.textContent = 'Remove';

        row.append(image, details, quantity, lineTotal, remove);
        cartItems.append(row);
      });
    }

    const totals = new Map();
    cart.forEach((item) => {
      totals.set(item.currency, (totals.get(item.currency) || 0) + item.price * item.quantity);
    });
    const totalsContainer = document.querySelector('[data-cart-totals]');
    totalsContainer.replaceChildren();
    if (totals.size === 0) {
      totalsContainer.textContent = '—';
    } else {
      totals.forEach((total, currency) => {
        const totalLine = document.createElement('p');
        totalLine.textContent = formatPrice(currency, total);
        totalsContainer.append(totalLine);
      });
    }
  };

  const getProduct = (button) => {
    const product = button.closest('article') || button.closest('.universal-section > div');
    if (!product) return null;

    const image = product.querySelector('img');
    const priceText = product.querySelector('span')?.textContent.trim()
      || [...product.querySelectorAll('p')].map((paragraph) => paragraph.textContent.trim())
        .find((text) => /^(?:[$€£]|MK)\s*[\d,.]+$/i.test(text));
    const priceMatch = priceText?.match(/^([$€£]|MK)\s*([\d,.]+)$/i);
    const name = product.querySelector('h2')?.textContent.trim()
      || [...product.querySelectorAll('p')].map((paragraph) => paragraph.textContent.trim())
        .find((text) => text && !/^(?:[$€£]|MK)\s*[\d,.]+$/i.test(text));

    if (!image || !priceMatch || !name) {
      console.error('Unable to identify the product for this Add to Cart button.', product);
      showCartToast('This item could not be added to your cart.');
      return null;
    }

    const price = Number(priceMatch[2].replace(/,/g, ''));
    if (!Number.isFinite(price)) {
      console.error('The product has an invalid price.', product);
      showCartToast('This item has an invalid price.');
      return null;
    }

    const imagePath = image.getAttribute('src');
    return {
      id: `${imagePath}|${name.toLowerCase()}`,
      name,
      price,
      currency: priceMatch[1].toUpperCase() === 'MK' ? 'MK' : priceMatch[1],
      image: imagePath
    };
  };

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const product = getProduct(button);
      if (!product) return;

      const existingItem = cart.find((item) => item.id === product.id);
      const updatedCart = existingItem
        ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...cart, { ...product, quantity: 1 }];

      if (!saveCart(updatedCart)) return;
      cart = updatedCart;
      renderCart();
      showCartToast(`${product.name} added to your cart.`);
    });
  });

  if (cartItems) {
    cartItems.addEventListener('click', (event) => {
      const button = event.target.closest('[data-cart-action]');
      if (!button) return;

      const itemId = button.dataset.cartId;
      const action = button.dataset.cartAction;
      const updatedCart = action === 'remove'
        ? cart.filter((item) => item.id !== itemId)
        : cart.flatMap((item) => {
          if (item.id !== itemId) return [item];
          if (action === 'decrease' && item.quantity <= 1) return [];
          const change = action === 'increase' ? 1 : -1;
          return [{ ...item, quantity: item.quantity + change }];
        });

      if (!saveCart(updatedCart)) return;
      cart = updatedCart;
      renderCart();
    });

    renderCart();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPopup);
} else {
  initPopup();
}
