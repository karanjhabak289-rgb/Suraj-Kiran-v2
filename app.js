
/* ==========================================
   SURAJ KIRAN — WEBSITE JAVASCRIPT
   ========================================== */

const WHATSAPP_NUMBER = "919942995694";
const CART_KEY = "surajKiranCart";

const PRODUCTS = [
  {
    id: "premium-chai",
    name: "Premium Chai",
    category: "CTC Tea",
    price: 540,
    sizes: [250, 500, 1000],
    images: [
      "premium_chai_front.webp",
      "premium_chai_back.png"
    ],
    desc: "A rich everyday chai with satisfying aroma and character.",
    description:
      "Discover the pleasure of a satisfying everyday cup with Suraj Kiran Premium Chai. Created for those who appreciate the familiar comfort of traditional Indian milk tea, this CTC tea offers a full-bodied character and an inviting tea aroma. Enjoy it as part of your morning routine, during an afternoon break, or while sharing conversations with family and friends.",
    highlights: [
      "Full-bodied CTC tea character",
      "Ideal for traditional milk chai",
      "Available in 250g, 500g and 1kg packs"
    ]
  },
  {
    id: "dhaba-chai",
    name: "Dhaba Chai",
    category: "CTC Tea",
    price: 449,
    sizes: [250, 500, 1000],
    images: [
      "Dhaba chai.png",
      "Dhaba chai 2.png"
    ],
    desc: "A comforting, full-bodied chai inspired by classic roadside tea.",
    description:
      "Inspired by the welcoming spirit of India's roadside tea stalls, Suraj Kiran Dhaba Chai brings a familiar, robust tea experience to your home. Its CTC character makes it well suited to traditional preparation with milk and sugar. Whether served with breakfast, snacks, or an evening conversation, it is designed for people who enjoy a strong, comforting cup of chai.",
    highlights: [
      "Inspired by classic Indian dhaba chai",
      "Robust character for milk tea",
      "Available in 250g, 500g and 1kg packs"
    ]
  },
  {
    id: "green-tea",
    name: "Green Tea",
    category: "Green Tea",
    price: 340,
    unit: "200g",
    grams: 200,
    images: ["green tea.png"],
    desc: "A clean, refreshing tea for a lighter everyday cup.",
    description:
      "Enjoy a lighter tea moment with Suraj Kiran Green Tea. Prepared as a gentle infusion, green tea offers a refreshing alternative to traditional milk chai. Its simple, straightforward character makes it suitable for a quiet morning, an afternoon pause, or any time you prefer a cup without milk. Brew with hot water and adjust the strength to your personal preference.",
    highlights: [
      "A refreshing alternative to milk chai",
      "Best enjoyed as a water-based infusion",
      "Available in a 200g pack"
    ]
  },
  {
    id: "butterfly-pea",
    name: "Butterfly Pea Flower",
    category: "Floral Infusion",
    price: 399,
    unit: "100g",
    grams: 100,
    images: ["Butterfly Pea Flower Tea.png"],
    desc: "A distinctive floral infusion with a naturally striking colour.",
    description:
      "Bring a beautiful touch of colour to your tea ritual with Suraj Kiran Butterfly Pea Flower. Known for producing a naturally vivid blue infusion, butterfly pea flowers create an eye-catching drink with a delicate botanical character. Enjoy the infusion warm or chilled. Adding lemon can change its colour towards purple, making it an especially interesting drink to prepare and serve.",
    highlights: [
      "Naturally vibrant blue floral infusion",
      "Enjoy hot or cold",
      "Available in a 100g pack"
    ]
  },
  {
    id: "hibiscus-flower",
    name: "Hibiscus Flower Tea",
    category: "Floral Infusion",
    price: 399,
    unit: "100g",
    grams: 100,
    images: ["hibiscus flower tea.png"],
    desc: "A vibrant floral infusion with a refreshing character.",
    description:
      "Suraj Kiran Hibiscus Flower Tea brings colour and a distinctive floral experience to your cup. Hibiscus is known for creating a deep reddish infusion with a pleasantly tart character. It can be enjoyed warm on a quiet day or chilled as a refreshing drink. Adjust the brewing time and sweetness to suit your taste.",
    highlights: [
      "Distinctive tart and floral character",
      "Naturally colourful infusion",
      "Available in a 100g pack"
    ]
  },
  {
    id: "chamomile-flower",
    name: "Chamomile Flower",
    category: "Floral Infusion",
    price: 399,
    unit: "100g",
    grams: 100,
    images: ["Chamomile flower tea.png"],
    desc: "A gentle floral tea suited to calm, quiet moments.",
    description:
      "Make room for a peaceful tea moment with Suraj Kiran Chamomile Flower. Chamomile is appreciated for its gentle floral aroma and delicate infusion. Enjoy it without milk to experience its naturally soft botanical character. It is a lovely choice for a quiet evening, a reading break, or whenever you want to enjoy a simple floral beverage.",
    highlights: [
      "Delicate floral aroma",
      "A gentle, caffeine-free floral infusion",
      "Available in a 100g pack"
    ]
  }
];

/* ==========================================
   HELPERS
   ========================================== */

function rupees(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char];
  });
}

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function imagesOf(product) {
  return product.images || (product.image ? [product.image] : []);
}

function defaultGrams(product) {
  return product.sizes ? 1000 : product.grams;
}

function packLabel(grams) {
  return grams === 1000 ? "1kg" : grams + "g";
}

function priceFor(product, grams) {
  if (!product.sizes) {
    return product.price;
  }

  return Number((product.price * grams / 1000).toFixed(2));
}

function displayPrice(product) {
  if (product.sizes) {
    return rupees(product.price) + "/kg";
  }

  return rupees(product.price) + "/" + product.unit;
}

function productUrl(product) {
  return "product.html?id=" + encodeURIComponent(product.id);
}

/* ==========================================
   SHOPPING BAG
   ========================================== */

function getCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCount();
}

function cartGrams(item, product) {
  const grams = Number(item.grams);

  if (product.sizes) {
    return product.sizes.includes(grams) ? grams : 1000;
  }

  return product.grams;
}

function updateCount() {
  const count = getCart().reduce((total, item) => {
    return total + (Number(item.qty) || 0);
  }, 0);

  document.querySelectorAll("#cartCount").forEach(element => {
    element.textContent = count;
  });
}

function add(id, grams, quantity = 1) {
  const product = getProduct(id);
  if (!product) return;

  const selectedGrams = product.sizes &&
    product.sizes.includes(Number(grams))
    ? Number(grams)
    : defaultGrams(product);

  const qty = Math.max(1, Math.floor(Number(quantity) || 1));

  const cart = getCart();

  const existing = cart.find(item =>
    item.id === id &&
    cartGrams(item, product) === selectedGrams
  );

  if (existing) {
    existing.qty = (Number(existing.qty) || 0) + qty;
    existing.grams = selectedGrams;
  } else {
    cart.push({
      id: id,
      grams: selectedGrams,
      qty: qty
    });
  }

  saveCart(cart);
  showToast(product.name + " added to bag");
}

function showToast(message) {
  let toast = document.getElementById("skToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "skToast";
    toast.style.cssText = [
      "position:fixed",
      "bottom:25px",
      "left:50%",
      "transform:translateX(-50%)",
      "background:#123b2a",
      "color:white",
      "padding:13px 22px",
      "z-index:9999",
      "font-family:Inter,sans-serif",
      "font-size:14px",
      "box-shadow:0 8px 25px #0002",
      "max-width:90%",
      "text-align:center"
    ].join(";");

    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.style.display = "none";
  }, 2200);
}

/* ==========================================
   PRODUCT IMAGE GALLERY
   ========================================== */

function galleryHtml(product, detail = false) {
  const images = imagesOf(product);

  return `
    <div class="sk-gallery ${detail ? "sk-gallery-detail" : ""}">
      <div class="product-slider" data-slider>
        ${images.map((image, index) => `
          <img
            src="${escapeHtml(image)}"
            alt="${escapeHtml(product.name)} image ${index + 1}"
            loading="${detail && index === 0 ? "eager" : "lazy"}"
          >
        `).join("")}
      </div>

      ${images.length > 1 ? `
        <button
          class="gallery-arrow gallery-prev"
          type="button"
          data-gallery-direction="-1"
          aria-label="Previous image"
        >&#10094;</button>

        <button
          class="gallery-arrow gallery-next"
          type="button"
          data-gallery-direction="1"
          aria-label="Next image"
        >&#10095;</button>

        <div class="gallery-dots">
          ${images.map((_, index) => `
            <button
              type="button"
              class="gallery-dot ${index === 0 ? "active" : ""}"
              data-gallery-index="${index}"
              aria-label="Show image ${index + 1}"
            ></button>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function moveGallery(button, direction) {
  const gallery = button.closest(".sk-gallery");
  if (!gallery) return;

  const slider = gallery.querySelector("[data-slider]");
  if (!slider) return;

  const images = slider.querySelectorAll("img");
  if (!images.length) return;

  const width = slider.clientWidth;
  if (!width) return;

  const current = Math.round(slider.scrollLeft / width);

  const next = Math.max(
    0,
    Math.min(images.length - 1, current + direction)
  );

  slider.scrollTo({
    left: next * width,
    behavior: "smooth"
  });
}

function goToGalleryImage(button, index) {
  const gallery = button.closest(".sk-gallery");
  if (!gallery) return;

  const slider = gallery.querySelector("[data-slider]");
  if (!slider) return;

  slider.scrollTo({
    left: Number(index) * slider.clientWidth,
    behavior: "smooth"
  });
}

function updateGalleryDots(slider) {
  const gallery = slider.closest(".sk-gallery");
  if (!gallery) return;

  const width = slider.clientWidth;
  if (!width) return;

  const active = Math.round(slider.scrollLeft / width);

  gallery.querySelectorAll(".gallery-dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === active);
  });
}

/* ==========================================
   PRODUCT CARDS
   ========================================== */

function card(product) {
  return `
    <article class="product-card" data-product="${product.id}">
      <div class="product-media">
        ${galleryHtml(product)}

        <button
          class="quick-add"
          type="button"
          data-quick-add="${product.id}"
          aria-label="Add ${escapeHtml(product.name)} to bag"
          title="Add to bag"
        >+</button>
      </div>

      <div class="product-body">
        <span class="product-cat">
          ${escapeHtml(product.category)}
        </span>

        <h3 class="product-name">
          <a href="${productUrl(product)}">
            ${escapeHtml(product.name)}
          </a>
        </h3>

        <p class="product-desc">
          ${escapeHtml(product.desc)}
        </p>

        <div class="product-meta">
          <span class="price">
            ${displayPrice(product)}
          </span>

          <a class="text-link" href="${productUrl(product)}">
            View Details
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const featured = document.getElementById("featuredProducts");

  if (featured) {
    featured.innerHTML = PRODUCTS.slice(0, 3).map(card).join("");
  }

  const all = document.getElementById("allProducts");

  if (all) {
    all.innerHTML = PRODUCTS.map(card).join("");
  }

  const search = document.getElementById("productSearch");

  if (search && all) {
    search.addEventListener("input", function () {
      const query = search.value.trim().toLowerCase();

      const results = PRODUCTS.filter(product => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.desc.toLowerCase().includes(query)
        );
      });

      all.innerHTML = results.length
        ? results.map(card).join("")
        : '<p>No teas found. Try another search.</p>';
    });
  }
}

/* ==========================================
   SINGLE PRODUCT DETAILS PAGE
   ========================================== */

function renderProductDetails() {
  const container = document.getElementById("productDetails");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = getProduct(id);

  if (!product) {
    container.innerHTML = `
      <div class="panel">
        <h2>Product not found</h2>
        <p>Please return to our tea collection.</p>
        <a class="btn btn-primary" href="products.html">
          Explore Our Teas
        </a>
      </div>
    `;
    return;
  }

  document.title = product.name + " | Suraj Kiran";

  const sizesHtml = product.sizes
    ? `
      <label for="detailPack" class="detail-label">
        Choose Pack Size
      </label>

      <select id="detailPack" class="detail-select">
        ${product.sizes.map(grams => `
          <option value="${grams}" ${grams === 1000 ? "selected" : ""}>
            ${packLabel(grams)} — ${rupees(priceFor(product, grams))}
          </option>
        `).join("")}
      </select>
    `
    : `
      <div class="detail-fixed-pack">
        Pack Size: <strong>${product.unit}</strong>
      </div>
    `;

  container.innerHTML = `
    <div class="detail-gallery-column">
      ${galleryHtml(product, true)}
    </div>

    <div class="detail-information">
      <span class="eyebrow">
        ${escapeHtml(product.category)}
      </span>

      <h1 class="detail-title">
        ${escapeHtml(product.name)}
      </h1>

      <p class="detail-short-description">
        ${escapeHtml(product.desc)}
      </p>

      <div class="detail-price" id="detailPrice">
        ${rupees(product.price)}
      </div>

      <p class="detail-price-note">
        Inclusive product price. Delivery charges, if any,
        will be confirmed before the order is finalised.
      </p>

      <div class="detail-purchase">
        ${sizesHtml}

        <label for="detailQuantity" class="detail-label">
          Quantity
        </label>

        <input
          type="number"
          id="detailQuantity"
          class="detail-quantity"
          value="1"
          min="1"
          max="99"
        >

        <button
          type="button"
          class="btn btn-primary detail-add-btn"
          data-detail-add="${product.id}"
        >
          Add to Bag
        </button>

        <a class="btn btn-ghost detail-bag-link" href="cart.html">
          View Shopping Bag
        </a>
      </div>

      <div class="detail-description">
        <h2>About This Tea</h2>
        <p>${escapeHtml(product.description)}</p>

        <h3>Product Highlights</h3>
        <ul>
          ${product.highlights.map(highlight => `
            <li>${escapeHtml(highlight)}</li>
          `).join("")}
        </ul>
      </div>
    </div>
  `;

  const pack = document.getElementById("detailPack");

  if (pack) {
    pack.addEventListener("change", function () {
      const price = priceFor(product, Number(pack.value));
      document.getElementById("detailPrice").textContent = rupees(price);
    });
  }
}

/* ==========================================
   CART PAGE
   ========================================== */

function changeCartQuantity(index, difference) {
  const cart = getCart();

  if (!cart[index]) return;

  cart[index].qty = (Number(cart[index].qty) || 1) + difference;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

function removeCartItem(index) {
  const cart = getCart();

  cart.splice(index, 1);

  saveCart(cart);
  renderCart();
}

function cartSummary() {
  const cart = getCart();
  const lines = [];
  let total = 0;

  cart.forEach(item => {
    const product = getProduct(item.id);
    if (!product) return;

    const grams = cartGrams(item, product);
    const qty = Math.max(1, Number(item.qty) || 1);
    const unitPrice = priceFor(product, grams);
    const subtotal = unitPrice * qty;

    total += subtotal;

    lines.push({
      product,
      grams,
      qty,
      unitPrice,
      subtotal
    });
  });

  return { lines, total };
}

function renderCart() {
  const container = document.getElementById("cartItems");
  if (!container) return;

  const summary = cartSummary();
  const cart = getCart();

  if (!summary.lines.length) {
    container.innerHTML = `
      <div class="panel">
        <h2>Your bag is empty.</h2>
        <p>Explore our tea collection and find your next favourite cup.</p>
        <a class="btn btn-primary" href="products.html">
          Shop Our Teas
        </a>
      </div>
    `;
  } else {
    container.innerHTML = cart.map((item, index) => {
      const product = getProduct(item.id);
      if (!product) return "";

      const grams = cartGrams(item, product);
      const qty = Math.max(1, Number(item.qty) || 1);
      const subtotal = priceFor(product, grams) * qty;

      return `
        <div class="cart-item">
          <a class="thumb" href="${productUrl(product)}">
            <img
              src="${escapeHtml(imagesOf(product)[0])}"
              alt="${escapeHtml(product.name)}"
            >
          </a>

          <div class="cart-item-info">
            <a href="${productUrl(product)}">
              <strong>${escapeHtml(product.name)}</strong>
            </a>

            <p class="small muted">
              Pack: ${packLabel(grams)}
            </p>

            <div class="cart-quantity-controls">
              <button
                type="button"
                data-cart-minus="${index}"
                aria-label="Decrease quantity"
              >−</button>

              <span>${qty}</span>

              <button
                type="button"
                data-cart-plus="${index}"
                aria-label="Increase quantity"
              >+</button>
            </div>

            <button
              type="button"
              class="cart-remove"
              data-cart-remove="${index}"
            >
              Remove
            </button>
          </div>

          <div class="cart-price">
            <strong>${rupees(subtotal)}</strong>
          </div>
        </div>
      `;
    }).join("");
  }

  const totalElement = document.getElementById("cartTotal");

  if (totalElement) {
    totalElement.textContent = rupees(summary.total);
  }

  ensureCheckout(summary.lines.length > 0);
}

/* ==========================================
   WHATSAPP CHECKOUT
   ========================================== */

function ensureCheckout(hasItems) {
  const cartItems = document.getElementById("cartItems");
  if (!cartItems) return;

  let checkout = document.getElementById("skCheckout");

  if (!checkout) {
    checkout = document.createElement("div");
    checkout.id = "skCheckout";
    checkout.className = "form-card sk-checkout";

    checkout.innerHTML = `
      <h2>Delivery Details</h2>

      <p>
        Enter your details to prepare your order on WhatsApp.
      </p>

      <form id="whatsappOrderForm">
        <label>
          Full Name
          <input
            type="text"
            id="customerName"
            required
            maxlength="100"
            autocomplete="name"
            placeholder="Your full name"
          >
        </label>

        <label>
          Mobile Number
          <input
            type="tel"
            id="customerMobile"
            required
            pattern="[0-9]{10}"
            maxlength="10"
            inputmode="numeric"
            placeholder="10-digit mobile number"
          >
        </label>

        <label>
          Delivery Address
          <textarea
            id="customerAddress"
            required
            rows="3"
            maxlength="500"
            placeholder="House, street, area, city and state"
          ></textarea>
        </label>

        <label>
          PIN Code
          <input
            type="text"
            id="customerPin"
            required
            pattern="[0-9]{6}"
            maxlength="6"
            inputmode="numeric"
            placeholder="6-digit PIN code"
          >
        </label>

        <button
          type="submit"
          class="btn btn-primary full"
        >
          Continue to WhatsApp
        </button>

        <p class="small muted">
          Your order is not placed automatically.
          Please review the message and press Send in WhatsApp.
          Availability, delivery charges and payment will
          be confirmed by our team.
        </p>
      </form>
    `;

    cartItems.insertAdjacentElement("afterend", checkout);

    const form = checkout.querySelector("#whatsappOrderForm");

    form.addEventListener("submit", placeWhatsAppOrder);
  }

  checkout.style.display = hasItems ? "" : "none";
}

function placeWhatsAppOrder(event) {
  event.preventDefault();

  const summary = cartSummary();

  if (!summary.lines.length) {
    alert("Your shopping bag is empty.");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const mobile = document.getElementById("customerMobile").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const pin = document.getElementById("customerPin").value.trim();

  if (!name || !address ||
      !/^[0-9]{10}$/.test(mobile) ||
      !/^[0-9]{6}$/.test(pin)) {
    alert("Please enter valid delivery details.");
    return;
  }

  const itemsText = summary.lines.map((line, index) => {
    return (
      (index + 1) + ". " + line.product.name +
      "\nPack: " + packLabel(line.grams) +
      "\nQuantity: " + line.qty +
      "\nPrice: " + rupees(line.subtotal)
    );
  }).join("\n\n");

  const message = [
    "Hello Suraj Kiran,",
    "",
    "I would like to enquire about placing this order:",
    "",
    itemsText,
    "",
    "Product Total: " + rupees(summary.total),
    "",
    "CUSTOMER DETAILS",
    "Name: " + name,
    "Mobile: " + mobile,
    "Address: " + address,
    "PIN Code: " + pin,
    "",
    "Please confirm availability, delivery charges and payment details."
  ].join("\n");

  const url = "https://wa.me/" + WHATSAPP_NUMBER +
    "?text=" + encodeURIComponent(message);

  window.location.href = url;
}

/* ==========================================
   CLICK HANDLERS
   ========================================== */

document.addEventListener("click", function (event) {
  const arrow = event.target.closest("[data-gallery-direction]");

  if (arrow) {
    event.preventDefault();
    event.stopPropagation();

    moveGallery(
      arrow,
      Number(arrow.dataset.galleryDirection)
    );
    return;
  }

  const dot = event.target.closest("[data-gallery-index]");

  if (dot) {
    event.preventDefault();
    event.stopPropagation();

    goToGalleryImage(dot, dot.dataset.galleryIndex);
    return;
  }

  const quickAdd = event.target.closest("[data-quick-add]");

  if (quickAdd) {
    event.preventDefault();
    event.stopPropagation();

    const product = getProduct(quickAdd.dataset.quickAdd);

    if (product) {
      add(product.id, defaultGrams(product), 1);
    }
    return;
  }

  const detailAdd = event.target.closest("[data-detail-add]");

  if (detailAdd) {
    const product = getProduct(detailAdd.dataset.detailAdd);
    if (!product) return;

    const pack = document.getElementById("detailPack");
    const quantity = document.getElementById("detailQuantity");

    const grams = pack
      ? Number(pack.value)
      : defaultGrams(product);

    const qty = quantity
      ? Math.max(1, Math.floor(Number(quantity.value) || 1))
      : 1;

    add(product.id, grams, qty);
    return;
  }

  const plus = event.target.closest("[data-cart-plus]");

  if (plus) {
    changeCartQuantity(Number(plus.dataset.cartPlus), 1);
    return;
  }

  const minus = event.target.closest("[data-cart-minus]");

  if (minus) {
    changeCartQuantity(Number(minus.dataset.cartMinus), -1);
    return;
  }

  const remove = event.target.closest("[data-cart-remove]");

  if (remove) {
    removeCartItem(Number(remove.dataset.cartRemove));
    return;
  }

  const cardElement = event.target.closest(".product-card");

  if (cardElement && !event.target.closest("a, button")) {
    if (event.target.closest(".product-slider")) return;

    window.location.href = "product.html?id=" +
      encodeURIComponent(cardElement.dataset.product);
  }
});

/* ==========================================
   IMAGE DOT UPDATES
   ========================================== */

document.addEventListener("scroll", function (event) {
  if (event.target.matches &&
      event.target.matches("[data-slider]")) {
    updateGalleryDots(event.target);
  }
}, true);

/* ==========================================
   MOBILE NAVIGATION
   ========================================== */

function setupNavigation() {
  const menuButton = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", function () {
      mainNav.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        mainNav.classList.contains("open") ? "true" : "false"
      );
    });
  }

  const searchButton = document.getElementById("searchBtn");

  if (searchButton) {
    searchButton.addEventListener("click", function () {
      window.location.href = "products.html";
    });
  }
}

/* ==========================================
   INITIALISE WEBSITE
   ========================================== */

function initialiseWebsite() {
  renderProducts();
  renderProductDetails();
  renderCart();
  updateCount();
  setupNavigation();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialiseWebsite);
} else {
  initialiseWebsite();
}
