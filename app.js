
const PRODUCTS = [
  {
    id: "premium-chai",
    name: "Premium Chai",
    price: 540,
    images: [
      "premium_chai_front.webp",
      "premium_chai_back.png"
    ],
    desc: "A rich everyday chai with satisfying aroma and character.",
    sizes: [250, 500, 1000]
  },
  {
    id: "dhaba-chai",
    name: "Dhaba Chai",
    price: 449,
    images: [
      "Dhaba chai.png",
      "Dhaba chai 2.png"
    ],
    desc: "A comforting, full-bodied chai inspired by classic roadside tea.",
    sizes: [250, 500, 1000]
  },
  {
    id: "green-tea",
    name: "Green Tea",
    price: 340,
    unit: "200g",
    image: "green tea.png",
    desc: "A clean, refreshing tea for a lighter everyday cup."
  },
  {
    id: "butterfly-pea",
    name: "Butterfly Pea Flower",
    price: 399,
    unit: "100g",
    image: "Butterfly Pea Flower Tea.png",
    desc: "A distinctive floral infusion with a naturally striking colour."
  },
  {
    id: "hibiscus-flower",
    name: "Hibiscus Flower Tea",
    price: 399,
    unit: "100g",
    image: "hibiscus flower tea.png",
    desc: "A vibrant floral infusion with a refreshing character."
  },
  {
    id: "chamomile-flower",
    name: "Chamomile Flower",
    price: 399,
    unit: "100g",
    image: "Chamomile flower tea.png",
    desc: "A gentle floral tea suited to calm, quiet moments."
  }
];

const WHATSAPP_NUMBER = "919942995694";
const CART_KEY = "surajKiranCart";

const rupees = n =>
  `₹${Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;

const imagesOf = p => p.images || [p.image];

const packLabel = grams =>
  Number(grams) === 1000 ? "1kg" : `${grams}g`;

const priceFor = (p, grams) => {
  if (!p.sizes) return p.price;

  return Math.round(
    (p.price * Number(grams) / 1000) * 100
  ) / 100;
};

const money = p =>
  p.price == null
    ? "Price on enquiry"
    : `${rupees(p.price)}/${p.unit || "kg"}`;

const escapeHtml = value =>
  String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

function card(p) {
  return `
    <article
      class="product-card"
      data-product="${p.id}"
      tabindex="0"
      role="button"
      aria-label="View ${escapeHtml(p.name)} details"
      style="cursor:pointer"
    >
      <div class="product-media">
        <div class="product-slider">
          ${imagesOf(p).map(img => `
            <img
              src="${escapeHtml(img)}"
              alt="${escapeHtml(p.name)}"
              loading="lazy"
            >
          `).join("")}
        </div>

        <button
          type="button"
          class="quick-add"
          data-add="${p.id}"
          aria-label="Add ${escapeHtml(p.name)}"
        >+</button>
      </div>

      <div class="product-body">
        <span class="product-cat">SURAJ KIRAN</span>
        <h3 class="product-name">${escapeHtml(p.name)}</h3>
        <p class="product-desc">${escapeHtml(p.desc)}</p>
        <div class="product-meta">
          <span class="price">${money(p)}</span>
        </div>
      </div>
    </article>
  `;
}

function getCart() {
  try {
    const cart = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );

    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCount();
  renderCart();
}

function updateCount() {
  const count = getCart().reduce(
    (sum, item) => sum + (Number(item.qty) || 0),
    0
  );

  document.querySelectorAll("#cartCount").forEach(el => {
    el.textContent = count;
  });
}

function cartPack(p, item) {
  if (!p.sizes) return null;

  const grams = Number(item.grams);

  return p.sizes.includes(grams) ? grams : 1000;
}

function add(id, grams) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const selected = p.sizes
    ? (
        p.sizes.includes(Number(grams))
          ? Number(grams)
          : 250
      )
    : null;

  const cart = getCart();

  const existing = cart.find(item =>
    item.id === id &&
    (
      p.sizes
        ? cartPack(p, item) === selected
        : true
    )
  );

  if (existing) {
    existing.qty = (Number(existing.qty) || 0) + 1;
  } else {
    cart.push({
      id,
      grams: selected,
      qty: 1
    });
  }

  saveCart(cart);
}

function cartSummary() {
  const items = [];
  let total = 0;

  getCart().forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return;

    const grams = cartPack(p, item);
    const qty = Number(item.qty) || 0;

    if (qty <= 0) return;

    const unitPrice = priceFor(p, grams);
    const line = Math.round(unitPrice * qty * 100) / 100;

    total += line;

    items.push({
      id: p.id,
      name: p.name,
      image: imagesOf(p)[0],
      grams,
      pack: p.sizes
        ? packLabel(grams)
        : (p.unit || "1kg"),
      qty,
      unitPrice,
      line
    });
  });

  return {
    items,
    total: Math.round(total * 100) / 100
  };
}

function ensureDetails() {
  if (document.querySelector("#skProductOverlay")) return;

  const style = document.createElement("style");

  style.textContent = `
    .sk-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.65);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow: auto;
    }

    .sk-dialog {
      position: relative;
      background: #fff;
      color: #222;
      width: min(900px,100%);
      max-height: 92vh;
      overflow: auto;
      border-radius: 16px;
      padding: clamp(18px,4vw,32px);
      box-shadow: 0 15px 60px #0004;
    }

    .sk-close {
      position: absolute;
      right: 12px;
      top: 10px;
      border: 0;
      background: #f2f2f2;
      color: #222;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      font-size: 24px;
      cursor: pointer;
      z-index: 1;
    }

    .sk-layout {
      display: grid;
      grid-template-columns: minmax(0,1fr) minmax(0,1fr);
      gap: 28px;
      align-items: start;
    }

    .sk-main-image {
      width: 100%;
      aspect-ratio: 1/1;
      object-fit: contain;
      background: #fafafa;
      border-radius: 12px;
    }

    .sk-thumbs {
      display: flex;
      gap: 10px;
      margin-top: 12px;
      flex-wrap: wrap;
    }

    .sk-thumbs button {
      border: 2px solid #ddd;
      border-radius: 8px;
      background: #fff;
      padding: 3px;
      cursor: pointer;
    }

    .sk-thumbs button[aria-pressed="true"] {
      border-color: #79542b;
    }

    .sk-thumbs img {
      width: 65px;
      height: 65px;
      object-fit: contain;
    }

    .sk-dialog h2 {
      margin: 8px 0 12px;
      font-size: clamp(24px,4vw,34px);
    }

    .sk-price {
      font-size: 26px;
      font-weight: 700;
      margin: 12px 0;
    }

    .sk-select {
      display: block;
      width: 100%;
      padding: 12px;
      border: 1px solid #bbb;
      border-radius: 8px;
      font: inherit;
      margin: 8px 0 16px;
    }

    .sk-add {
      background: #273e29;
      color: white;
      border: 0;
      border-radius: 8px;
      padding: 14px 22px;
      width: 100%;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .sk-description {
      line-height: 1.7;
    }

    .sk-checkout {
      margin-top: 28px;
      padding: 22px;
      border: 1px solid #ddd;
      border-radius: 14px;
      background: #fafaf8;
    }

    .sk-checkout h2 {
      margin: 0 0 8px;
    }

    .sk-checkout label {
      display: block;
      font-weight: 600;
      margin: 14px 0 6px;
    }

    .sk-checkout input,
    .sk-checkout textarea {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 12px;
      border: 1px solid #bbb;
      border-radius: 8px;
      background: white;
      color: #222;
      font: inherit;
    }

    .sk-checkout textarea {
      min-height: 95px;
      resize: vertical;
    }

    .sk-whatsapp {
      display: block;
      width: 100%;
      margin-top: 20px;
      padding: 15px;
      background: #128c47;
      color: #fff;
      border: 0;
      border-radius: 8px;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .sk-checkout-note {
      font-size: 13px;
      color: #555;
      line-height: 1.6;
      margin-top: 10px;
    }

    @media(max-width:620px) {
      .sk-layout {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .sk-dialog {
        max-height: 95vh;
      }

      .sk-checkout {
        padding: 16px;
      }
    }
  `;

  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "skProductOverlay";
  overlay.className = "sk-overlay";
  overlay.hidden = true;
  overlay.style.display = "none";

  overlay.innerHTML = `
    <section
      class="sk-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="Product details"
    >
      <button
        type="button"
        class="sk-close"
        data-close-details
        aria-label="Close product details"
      >×</button>

      <div id="skProductContent"></div>
    </section>
  `;

  document.body.appendChild(overlay);
}

function closeDetails() {
  const overlay = document.querySelector("#skProductOverlay");
  if (!overlay) return;

  overlay.hidden = true;
  overlay.style.display = "none";
  document.body.style.overflow = "";
}

function openDetails(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  ensureDetails();

  const pictures = imagesOf(p);
  const content = document.querySelector("#skProductContent");

  content.innerHTML = `
    <div class="sk-layout">
      <div>
        <img
          id="skMainImage"
          class="sk-main-image"
          src="${escapeHtml(pictures[0])}"
          alt="${escapeHtml(p.name)}"
        >

        ${pictures.length > 1 ? `
          <div class="sk-thumbs">
            ${pictures.map((img, i) => `
              <button
                type="button"
                data-image-index="${i}"
                aria-pressed="${i === 0}"
              >
                <img
                  src="${escapeHtml(img)}"
                  alt="${escapeHtml(p.name)} image ${i + 1}"
                >
              </button>
            `).join("")}
          </div>
        ` : ""}
      </div>

      <div>
        <span class="product-cat">SURAJ KIRAN</span>

        <h2>${escapeHtml(p.name)}</h2>

        <p class="sk-description">
          ${escapeHtml(p.desc)}
        </p>

        ${p.sizes ? `
          <label for="skPackSize">
            <strong>Select pack size</strong>
          </label>

          <select id="skPackSize" class="sk-select">
            ${p.sizes.map(g => `
              <option value="${g}">
                ${packLabel(g)} — ${rupees(priceFor(p, g))}
              </option>
            `).join("")}
          </select>
        ` : `
          <p>Pack: ${escapeHtml(p.unit || "1kg")}</p>
        `}

        <div id="skDetailsPrice" class="sk-price">
          ${p.sizes
            ? rupees(priceFor(p, 250))
            : rupees(p.price)}
        </div>

        <button
          type="button"
          class="sk-add"
          data-detail-add="${p.id}"
        >
          Add to Cart
        </button>
      </div>
    </div>
  `;

  const overlay = document.querySelector("#skProductOverlay");

  overlay.dataset.productId = id;
  overlay.hidden = false;
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";

  overlay.querySelector(".sk-close").focus();
}

function renderCart() {
  const box = document.querySelector("#cartItems");
  if (!box) return;

  const { items, total } = cartSummary();

  if (!items.length) {
    box.innerHTML = `
      <div class="panel">
        <h2>Your bag is empty.</h2>
        <a class="text-link" href="products.html">
          Explore our teas →
        </a>
      </div>
    `;

    const totalEl = document.querySelector("#cartTotal");
    if (totalEl) totalEl.textContent = "₹0";

    document.querySelector("#skCheckout")?.remove();
    return;
  }

  box.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="thumb">
        <img
          src="${escapeHtml(item.image)}"
          alt="${escapeHtml(item.name)}"
        >
      </div>

      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <div class="small">
          ${rupees(item.unitPrice)} / ${item.pack}
          × ${item.qty}
        </div>
      </div>

      <div class="cart-price">
        <strong>${rupees(item.line)}</strong>
      </div>
    </div>
  `).join("");

  const totalEl = document.querySelector("#cartTotal");

  if (totalEl) {
    totalEl.textContent = rupees(total);
  }

  ensureCheckout();
}

function ensureCheckout() {
  if (document.querySelector("#skCheckout")) return;

  const cartBox = document.querySelector("#cartItems");
  if (!cartBox) return;

  const checkout = document.createElement("section");
  checkout.id = "skCheckout";
  checkout.className = "sk-checkout";

  checkout.innerHTML = `
    <h2>Complete Your Order</h2>
    <p>
      Enter your delivery details and send your order
      to Suraj Kiran on WhatsApp.
    </p>

    <form id="skCheckoutForm">
      <label for="skCustomerName">Full Name *</label>
      <input
        id="skCustomerName"
        name="customerName"
        type="text"
        autocomplete="name"
        required
      >

      <label for="skCustomerPhone">Mobile Number *</label>
      <input
        id="skCustomerPhone"
        name="customerPhone"
        type="tel"
        inputmode="numeric"
        pattern="[0-9]{10}"
        maxlength="10"
        placeholder="10-digit mobile number"
        required
      >

      <label for="skCustomerAddress">Full Address *</label>
      <textarea
        id="skCustomerAddress"
        name="customerAddress"
        autocomplete="street-address"
        placeholder="House, street, area, city, state"
        required
      ></textarea>

      <label for="skCustomerPincode">PIN Code *</label>
      <input
        id="skCustomerPincode"
        name="customerPincode"
        type="text"
        inputmode="numeric"
        pattern="[0-9]{6}"
        maxlength="6"
        placeholder="6-digit PIN code"
        required
      >

      <button
        type="submit"
        class="sk-whatsapp"
      >
        Place Order on WhatsApp
      </button>

      <p class="sk-checkout-note">
        WhatsApp will open with your order details.
        Please press Send to place your order.
        Delivery charges and payment can be confirmed
        with Suraj Kiran.
      </p>
    </form>
  `;

  cartBox.insertAdjacentElement("afterend", checkout);
}

function placeWhatsAppOrder(event) {
  event.preventDefault();

  const form = event.currentTarget;

  if (!form.reportValidity()) return;

  const name = form.elements.customerName.value.trim();
  const phone = form.elements.customerPhone.value.trim();
  const address = form.elements.customerAddress.value.trim();
  const pincode = form.elements.customerPincode.value.trim();

  if (!name || !address) {
    alert("Please complete your name and address.");
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  if (!/^[0-9]{6}$/.test(pincode)) {
    alert("Please enter a valid 6-digit PIN code.");
    return;
  }

  const { items, total } = cartSummary();

  if (!items.length) {
    alert("Your cart is empty.");
    return;
  }

  const lines = [
    "*NEW ORDER - SURAJ KIRAN*",
    "",
    "*Customer Details*",
    `Name: ${name}`,
    `Mobile: ${phone}`,
    `Address: ${address}`,
    `PIN Code: ${pincode}`,
    "",
    "*Order Details*"
  ];

  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name}`,
      `Pack: ${item.pack}`,
      `Quantity: ${item.qty}`,
      `Price per pack: ${rupees(item.unitPrice)}`,
      `Subtotal: ${rupees(item.line)}`,
      ""
    );
  });

  lines.push(
    `*Total: ${rupees(total)}*`,
    "",
    "Delivery charges and payment to be confirmed.",
    "",
    "Please confirm my order."
  );

  const message = lines.join("\n");

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(message);

  window.location.href = url;
}

document.addEventListener("submit", event => {
  if (event.target.id === "skCheckoutForm") {
    placeWhatsAppOrder(event);
  }
});

document.addEventListener("click", e => {
  if (
    e.target.matches("#skProductOverlay") ||
    e.target.closest("[data-close-details]")
  ) {
    closeDetails();
    return;
  }

  const thumb = e.target.closest("[data-image-index]");

  if (thumb) {
    const overlay = document.querySelector("#skProductOverlay");
    const id = overlay?.dataset.productId;
    const p = PRODUCTS.find(x => x.id === id);

    if (p) {
      const index = Number(thumb.dataset.imageIndex);

      document.querySelector("#skMainImage").src =
        imagesOf(p)[index];

      overlay.querySelectorAll("[data-image-index]").forEach(b => {
        b.setAttribute(
          "aria-pressed",
          String(b === thumb)
        );
      });
    }

    return;
  }

  const detailAdd = e.target.closest("[data-detail-add]");

  if (detailAdd) {
    const grams = document.querySelector("#skPackSize")?.value;

    add(detailAdd.dataset.detailAdd, grams);

    detailAdd.textContent = "✓ Added to Cart";
    return;
  }

  const quick = e.target.closest("[data-add]");

  if (quick) {
    const p = PRODUCTS.find(x => x.id === quick.dataset.add);

    if (p?.sizes) {
      openDetails(p.id);
    } else {
      add(quick.dataset.add);
      quick.textContent = "✓";

      setTimeout(() => {
        if (quick.isConnected) quick.textContent = "+";
      }, 700);
    }

    return;
  }

  const product = e.target.closest("[data-product]");

  if (product) {
    openDetails(product.dataset.product);
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeDetails();
  }

  if (
    (e.key === "Enter" || e.key === " ") &&
    e.target.matches("[data-product]")
  ) {
    e.preventDefault();
    openDetails(e.target.dataset.product);
  }
});

document.addEventListener("change", e => {
  if (!e.target.matches("#skPackSize")) return;

  const id = document.querySelector(
    "#skProductOverlay"
  )?.dataset.productId;

  const p = PRODUCTS.find(x => x.id === id);

  if (p) {
    document.querySelector("#skDetailsPrice").textContent =
      rupees(priceFor(p, Number(e.target.value)));
  }
});

const featured = document.querySelector("#featuredProducts");

if (featured) {
  featured.innerHTML = PRODUCTS.slice(0, 3).map(card).join("");
}

const all = document.querySelector("#allProducts");

function renderAll(list = PRODUCTS) {
  if (all) {
    all.innerHTML = list.map(card).join("");
  }
}

renderAll();

document.querySelector("#productSearch")?.addEventListener(
  "input",
  e => {
    const query = e.target.value.toLowerCase();

    renderAll(
      PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query)
      )
    );
  }
);

document.querySelector("#menuBtn")?.addEventListener(
  "click",
  () => {
    document.querySelector("#mainNav")
      ?.classList.toggle("open");
  }
);

document.querySelector("#searchBtn")?.addEventListener(
  "click",
  () => {
    document.querySelector("#productSearch")?.focus();
  }
);

renderCart();
updateCount();


