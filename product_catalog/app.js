// ============================================
// PRODUCT CATALOG - Vanilla JavaScript
// ============================================

// Sample data
const products = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    price: 25990000,
    category: "phone",
    image:
      "https://images.unsplash.com/photo-1592286927505-1def25e88f6d?w=400&h=400&fit=crop",
    rating: 4.8,
    inStock: true,
    description:
      "Latest flagship phone with advanced camera system and A18 Pro chip.",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    price: 22990000,
    category: "phone",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf86cb5f9?w=400&h=400&fit=crop",
    rating: 4.6,
    inStock: true,
    description:
      "Premium Android phone with AI-powered features and AMOLED display.",
  },
  {
    id: 3,
    name: "Google Pixel 9",
    price: 19990000,
    category: "phone",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    rating: 4.5,
    inStock: true,
    description:
      "Google's flagship phone with exceptional computational photography.",
  },
  {
    id: 4,
    name: 'MacBook Pro 16"',
    price: 45990000,
    category: "laptop",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    rating: 4.9,
    inStock: true,
    description: "Powerful laptop with M4 Max chip, perfect for professionals.",
  },
  {
    id: 5,
    name: "Dell XPS 15",
    price: 35990000,
    category: "laptop",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    rating: 4.7,
    inStock: true,
    description: "Premium Windows laptop with stunning InfinityEdge display.",
  },
  {
    id: 6,
    name: "Lenovo ThinkPad X1",
    price: 28990000,
    category: "laptop",
    image:
      "https://images.unsplash.com/photo-1588872657840-790ff3bde08c?w=400&h=400&fit=crop",
    rating: 4.4,
    inStock: false,
    description: "Business laptop known for durability and keyboard quality.",
  },
  {
    id: 7,
    name: 'iPad Pro 12.9"',
    price: 18990000,
    category: "tablet",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop",
    rating: 4.7,
    inStock: true,
    description:
      "Powerful tablet with M4 chip and beautiful Liquid Retina display.",
  },
  {
    id: 8,
    name: "Samsung Galaxy Tab S9",
    price: 14990000,
    category: "tablet",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
    rating: 4.5,
    inStock: true,
    description: "Premium Android tablet with S-Pen and AMOLED screen.",
  },
  {
    id: 9,
    name: "Xiaomi Pad 6",
    price: 9990000,
    category: "tablet",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=400&h=400&fit=crop",
    rating: 4.3,
    inStock: true,
    description: "Budget-friendly tablet with good performance and display.",
  },
  {
    id: 10,
    name: "Sony WH-1000XM5 Headphones",
    price: 8990000,
    category: "accessory",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.8,
    inStock: true,
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery.",
  },
  {
    id: 11,
    name: "Apple AirPods Pro 2",
    price: 6990000,
    category: "accessory",
    image:
      "https://images.unsplash.com/photo-1606841836239-c5a1a4a07af7?w=400&h=400&fit=crop",
    rating: 4.6,
    inStock: true,
    description: "True wireless earbuds with active noise cancellation.",
  },
  {
    id: 12,
    name: "Samsung Buds2 Pro",
    price: 5990000,
    category: "accessory",
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
    rating: 4.4,
    inStock: true,
    description: "Feature-rich wireless earbuds with IPX7 water resistance.",
  },
  {
    id: 13,
    name: "Logitech MX Master 3S",
    price: 2990000,
    category: "accessory",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
    rating: 4.7,
    inStock: true,
    description:
      "Advanced wireless mouse perfect for productivity professionals.",
  },
];

// ============================================
// DOM ELEMENTS
// ============================================
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const categoryBtns = document.querySelectorAll(".category-btn");
const productsGrid = document.querySelector("#productsGrid");
const noResults = document.querySelector("#noResults");
const darkModeToggle = document.querySelector("#darkModeToggle");
const cartBadge = document.querySelector("#cartBadge");

const modal = document.querySelector("#productModal");
const modalClose = document.querySelector("#modalClose");
const modalImage = document.querySelector("#modalImage");
const modalName = document.querySelector("#modalName");
const modalPrice = document.querySelector("#modalPrice");
const modalRating = document.querySelector("#modalRating");
const modalRatingStars = document.querySelector("#modalRatingStars");
const modalCategory = document.querySelector("#modalCategory");
const modalDescription = document.querySelector("#modalDescription");
const modalStockStatus = document.querySelector("#modalStockStatus");
const modalAddCart = document.querySelector("#modalAddCart");

// ============================================
// STATE
// ============================================
let currentFilter = "all";
let currentSort = "default";
let cartCount = 0;

// ============================================
// 1. RENDER PRODUCTS
// ============================================
function renderProducts() {
  productsGrid.innerHTML = "";

  let filtered = filterProducts();
  let sorted = sortProducts(filtered);

  if (sorted.length === 0) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  sorted.forEach((product) => {
    const card = createProductCard(product);
    productsGrid.appendChild(card);
  });
}

// ============================================
// 2. CREATE PRODUCT CARD
// ============================================
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.id = product.id;

  const stars =
    "⭐".repeat(Math.floor(product.rating)) +
    (product.rating % 1 >= 0.5 ? "✨" : "");

  const stockClass = product.inStock ? "in-stock" : "out-stock";
  const stockText = product.inStock ? "In Stock" : "Out of Stock";

  card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${escapeHtml(product.name)}</h3>
            <div class="product-rating">
                <span class="stars">${stars}</span>
                <span>${product.rating.toFixed(1)}</span>
            </div>
            <div class="product-price">${formatPrice(product.price)}</div>
            <div class="product-stock ${stockClass}">${stockText}</div>
            <button class="btn-primary" ${!product.inStock ? "disabled" : ""}>
                ${product.inStock ? "View Details" : "Unavailable"}
            </button>
        </div>
    `;

  card.addEventListener("click", () => {
    openModal(product);
  });

  return card;
}

// ============================================
// 3. FILTER PRODUCTS
// ============================================
function filterProducts() {
  let filtered = products;

  // Category filter
  if (currentFilter !== "all") {
    filtered = filtered.filter((p) => p.category === currentFilter);
  }

  // Search filter
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm),
    );
  }

  return filtered;
}

// ============================================
// 4. SORT PRODUCTS
// ============================================
function sortProducts(productsToSort) {
  const sorted = [...productsToSort];

  switch (currentSort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "rating-desc":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
  }

  return sorted;
}

// ============================================
// 5. MODAL FUNCTIONS
// ============================================
function openModal(product) {
  const stars = "⭐".repeat(Math.floor(product.rating));
  const stockClass = product.inStock ? "in-stock" : "out-stock";
  const stockText = product.inStock ? "✅ In Stock" : "❌ Out of Stock";

  modalImage.src = product.image;
  modalName.textContent = product.name;
  modalPrice.textContent = formatPrice(product.price);
  modalRating.textContent = product.rating.toFixed(1);
  modalRatingStars.textContent = stars;
  modalCategory.textContent =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);
  modalDescription.textContent = product.description;

  const statusSpan = document.createElement("span");
  statusSpan.className = stockClass;
  statusSpan.textContent = stockText;
  modalStockStatus.innerHTML = "";
  modalStockStatus.appendChild(statusSpan);

  modalAddCart.disabled = !product.inStock;
  modalAddCart.textContent = product.inStock ? "Add to Cart" : "Out of Stock";

  modalAddCart.onclick = () => {
    if (product.inStock) {
      addToCart();
      closeModal();
    }
  };

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// ============================================
// 6. ADD TO CART
// ============================================
function addToCart() {
  cartCount++;
  updateCartBadge();
}

function updateCartBadge() {
  cartBadge.textContent = cartCount;
}

// ============================================
// 7. CATEGORY FILTER
// ============================================
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    categoryBtns.forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    currentFilter = e.target.dataset.category;
    renderProducts();
  });
});

// ============================================
// 8. SEARCH (REALTIME)
// ============================================
searchInput.addEventListener("input", () => {
  renderProducts();
});

// ============================================
// 9. SORT
// ============================================
sortSelect.addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderProducts();
});

// ============================================
// 10. DARK MODE
// ============================================
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeToggle.textContent = document.body.classList.contains("dark-mode")
    ? "☀️"
    : "🌙";
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode"),
  );
});

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
  darkModeToggle.textContent = "☀️";
}

// ============================================
// 11. UTILITY FUNCTIONS
// ============================================
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// 12. INITIAL RENDER
// ============================================
renderProducts();
