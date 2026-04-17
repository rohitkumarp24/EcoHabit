// ===== CONFIG =====
const API = 'https://ecohabit-backend-eo2q.onrender.com/api';
let SESSION_ID = localStorage.getItem('eco_session') || (() => {
  const id = 'sess_' + Math.random().toString(36).slice(2, 11);
  localStorage.setItem('eco_session', id);
  return id;
})();

const HEADERS = { 'Content-Type': 'application/json', 'x-session-id': SESSION_ID };

// Product emoji mapping
const EMOJI = {
  'p001': '🪥', 'p002': '🧻', 'p003': '🚿', 'p004': '🧽',
  'p005': '🍽️', 'p006': '☕', 'p007': '🥗', 'p008': '🥣',
  'p009': '🍯', 'p010': '🫙', 'p011': '🛍️', 'p012': '🥡',
  'p013': '🧴', 'p014': '🫧', 'p015': '🧺', 'p016': '🍋',
};

const CAT_LABELS = {
  'bamboo-cleaning': 'Bamboo Cleaning',
  'biodegradable-kitchenware': 'Kitchenware',
  'reusable-storage': 'Reusable Storage',
  'eco-cleaning-agents': 'Cleaning Agents',
};

// ===== STATE =====
let allProducts = [];
let cartData = { items: [], total: 0, itemCount: 0 };

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  loadHomePage();
  updateCartBadge();
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
  });
});

// ===== NAVIGATION =====
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) { target.classList.add('active'); window.scrollTo(0, 0); }
  const link = document.querySelector(`[data-page="${page}"]`);
  if (link) link.classList.add('active');
  if (page === 'shop') loadShopPage();
  if (page === 'cart') loadCartPage();
  if (page === 'orders') loadOrdersPage();
  if (page === 'checkout') loadCheckoutPage();
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ===== API HELPERS =====
async function apiFetch(url, options = {}) {
  try {
    const res = await fetch(API + url, { ...options, headers: { ...HEADERS, ...(options.headers || {}) } });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Request failed');
    }
    return res.json();
  } catch (e) {
    if (e.message !== 'Failed to fetch') toast(e.message, 'error');
    throw e;
  }
}

// ===== TOAST =====
function toast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> ${msg}`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

// ===== HOME PAGE =====
async function loadHomePage() {
  await Promise.all([loadCategories(), loadFeatured(), loadStats()]);
}

async function loadCategories() {
  try {
    const cats = await apiFetch('/categories');
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = cats.map(c => `
      <div class="category-card" onclick="showCategoryInShop('${c.id}')">
        <div class="cat-icon">${c.icon}</div>
        <div class="cat-name">${c.name}</div>
        <div class="cat-desc">${c.description}</div>
        <span class="cat-count">${c.productCount} products</span>
      </div>
    `).join('');
  } catch {}
}

async function loadFeatured() {
  const grid = document.getElementById('featuredGrid');
  grid.innerHTML = renderSkeletons(4);
  try {
    const products = await apiFetch('/products?featured=true');
    allProducts = products;
    grid.innerHTML = products.map(p => renderProductCard(p)).join('');
  } catch {
    grid.innerHTML = '<p style="color:var(--gray-500);text-align:center;padding:2rem">Could not load products. Make sure the backend is running!</p>';
  }
}

async function loadStats() {
  try {
    const stats = await apiFetch('/products/stats');
    const el = document.getElementById('heroStats');
    if (el) el.innerHTML = `
      <div class="stat"><span class="stat-num">${stats.totalProducts}+</span><span class="stat-label">Products</span></div>
      <div class="stat-divider"></div>
      <div class="stat"><span class="stat-num">${stats.categories}</span><span class="stat-label">Categories</span></div>
      <div class="stat-divider"></div>
      <div class="stat"><span class="stat-num">${stats.avgEcoScore}</span><span class="stat-label">Avg Eco Score</span></div>
    `;
  } catch {}
}

// ===== SHOP PAGE =====
let currentFilters = { category: 'all', maxPrice: 2500, sort: '', search: '' };

async function loadShopPage() {
  const grid = document.getElementById('shopGrid');
  grid.innerHTML = renderSkeletons(8);
  try {
    const products = await apiFetch('/products');
    allProducts = products;
    applyFilters();
  } catch {
    grid.innerHTML = '<p style="color:var(--gray-500);text-align:center;padding:2rem;grid-column:1/-1">Could not load products. Make sure the backend is running on port 3000.</p>';
  }
}

function applyFilters() {
  const cat = document.querySelector('input[name="cat"]:checked')?.value || 'all';
  const maxPrice = parseInt(document.getElementById('maxPriceSlider')?.value || 2500);
  const sort = document.getElementById('sortSelect')?.value || '';
  currentFilters = { ...currentFilters, category: cat, maxPrice, sort };
  renderShopProducts();
}

function renderShopProducts() {
  let filtered = [...allProducts];
  if (currentFilters.category !== 'all') filtered = filtered.filter(p => p.category === currentFilters.category);
  if (currentFilters.maxPrice) filtered = filtered.filter(p => p.price <= currentFilters.maxPrice);
  if (currentFilters.search) {
    const s = currentFilters.search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || p.tags?.some(t => t.includes(s)));
  }
  if (currentFilters.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (currentFilters.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (currentFilters.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  if (currentFilters.sort === 'eco-score') filtered.sort((a, b) => b.ecoScore - a.ecoScore);

  const grid = document.getElementById('shopGrid');
  const empty = document.getElementById('shopEmpty');
  const title = document.getElementById('shopTitle');
  const count = document.getElementById('productCount');
  const catLabel = currentFilters.category === 'all' ? 'All Products' : (CAT_LABELS[currentFilters.category] || currentFilters.category);
  if (title) title.textContent = catLabel;
  if (count) count.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
  } else {
    if (empty) empty.style.display = 'none';
    grid.innerHTML = filtered.map(p => renderProductCard(p)).join('');
  }
}

function resetFilters() {
  currentFilters = { category: 'all', maxPrice: 2500, sort: '', search: '' };
  const catInput = document.querySelector('input[name="cat"][value="all"]');
  if (catInput) catInput.checked = true;
  const slider = document.getElementById('maxPriceSlider');
  if (slider) { slider.value = 2500; updatePriceLabel(2500); }
  const sortSel = document.getElementById('sortSelect');
  if (sortSel) sortSel.value = '';
  renderShopProducts();
}

function updatePriceLabel(val) {
  const el = document.getElementById('priceLabel');
  if (el) el.textContent = '₹' + parseInt(val).toLocaleString('en-IN');
}

function handleSearch(val) {
  currentFilters.search = val.toLowerCase().trim();
  if (document.getElementById('page-shop').classList.contains('active')) {
    renderShopProducts();
  } else {
    showPage('shop');
    setTimeout(() => renderShopProducts(), 300);
  }
}

function showCategoryInShop(cat) {
  showPage('shop');
  setTimeout(() => {
    const radio = document.querySelector(`input[name="cat"][value="${cat}"]`);
    if (radio) { radio.checked = true; applyFilters(); }
  }, 100);
}

// ===== PRODUCT CARD RENDER =====
function renderProductCard(p) {
  const badgeClass = getBadgeClass(p.badge);
  const stars = renderStars(p.rating);
  const disc = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  return `
    <div class="product-card" onclick="openProductModal('${p.id}')">
      <div class="product-image img-${p.image}">
        ${p.badge ? `<span class="product-badge ${badgeClass}">${p.badge}</span>` : ''}
        <span class="eco-score-chip">🌿 ${p.ecoScore}/10</span>
        <span style="font-size:4.5rem">${EMOJI[p.id] || '🌿'}</span>
      </div>
      <div class="product-body">
        <div class="product-category">${CAT_LABELS[p.category] || p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description}</div>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-num">${p.rating}</span>
          <span class="review-count">(${p.reviewCount})</span>
        </div>
        <div class="product-footer">
          <div class="price-wrap">
            <span class="price">₹${p.price.toLocaleString('en-IN')}</span>
            ${p.originalPrice ? `<span class="price-orig">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <button class="add-cart-btn" onclick="event.stopPropagation(); addToCart('${p.id}')" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `;
}

function getBadgeClass(badge) {
  if (!badge) return '';
  const b = badge.toLowerCase();
  if (b.includes('best')) return 'badge-bestseller';
  if (b.includes('new')) return 'badge-new';
  if (b.includes('sale')) return 'badge-sale';
  if (b.includes('eco')) return 'badge-ecochoice';
  return 'badge-default';
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function renderSkeletons(n) {
  return Array(n).fill('<div class="skeleton skel-card"></div>').join('');
}

// ===== PRODUCT MODAL =====
async function openProductModal(id) {
  try {
    const p = allProducts.find(x => x.id === id) || await apiFetch('/products/' + id);
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('modalOverlay');
    const badgeClass = getBadgeClass(p.badge);
    const stars = renderStars(p.rating);

    document.getElementById('modalContent').innerHTML = `
      <div class="modal-image img-${p.image}">
        <span style="font-size:7rem">${EMOJI[p.id] || '🌿'}</span>
      </div>
      <div class="modal-body">
        ${p.badge ? `<span class="modal-badge product-badge ${badgeClass}">${p.badge}</span>` : ''}
        <h2 class="modal-name">${p.name}</h2>
        <div class="modal-rating">
          <span class="stars">${stars}</span>
          <span class="rating-num">${p.rating}</span>
          <span class="review-count">(${p.reviewCount} reviews)</span>
        </div>
        <p class="modal-desc">${p.description}</p>
        <div class="modal-meta">
          <div class="meta-item"><div class="meta-label">Category</div><div class="meta-val">${CAT_LABELS[p.category]}</div></div>
          <div class="meta-item"><div class="meta-label">Weight</div><div class="meta-val">${p.weight}</div></div>
          <div class="meta-item"><div class="meta-label">In Stock</div><div class="meta-val">${p.stock} units</div></div>
        </div>
        <div class="modal-materials">
          <div class="modal-materials-title">Materials</div>
          <div class="materials-chips">${p.materials.map(m => `<span class="chip">${m}</span>`).join('')}</div>
        </div>
        <div class="eco-meter">
          <div class="eco-meter-label">
            <span>🌿 Eco Score</span>
            <span>${p.ecoScore} / 10</span>
          </div>
          <div class="eco-bar">
            <div class="eco-fill" style="width: ${p.ecoScore * 10}%"></div>
          </div>
        </div>
        <div class="modal-actions">
          <div class="modal-price-wrap">
            <span class="modal-price">₹${p.price.toLocaleString('en-IN')}</span>
            ${p.originalPrice ? `<span class="modal-price-orig">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <button class="btn-primary modal-add-btn" onclick="addToCart('${p.id}'); closeModal()">🛒 Add to Cart</button>
        </div>
      </div>
    `;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  } catch {}
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== CART =====
async function addToCart(productId) {
  try {
    await apiFetch('/cart/add', { method: 'POST', body: JSON.stringify({ productId, quantity: 1 }) });
    await updateCartBadge();
    const p = allProducts.find(x => x.id === productId);
    toast(`${p ? p.name : 'Product'} added to cart!`);
  } catch {}
}

async function updateCartBadge() {
  try {
    const data = await apiFetch('/cart');
    cartData = data;
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = data.itemCount || 0;
  } catch {}
}

async function loadCartPage() {
  try {
    const data = await apiFetch('/cart');
    cartData = data;
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = data.itemCount || 0;
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    const empty = document.getElementById('cartEmpty');

    if (!data.items || data.items.length === 0) {
      container.innerHTML = '';
      summary.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    container.innerHTML = data.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-image img-${item.product?.image}">
          ${EMOJI[item.product?.id] || '🌿'}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.product?.name || 'Unknown'}</div>
          <div class="cart-item-price">₹${(item.product?.price || 0).toLocaleString('en-IN')} each</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty('${item.cartItemId}', ${item.quantity - 1})">−</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQty('${item.cartItemId}', ${item.quantity + 1})">+</button>
        </div>
        <div style="font-weight:700;color:var(--green-800);min-width:80px;text-align:right">₹${item.subtotal.toLocaleString('en-IN')}</div>
        <button class="remove-btn" onclick="removeFromCart('${item.cartItemId}')">🗑</button>
      </div>
    `).join('');

    const shipping = data.total >= 999 ? 0 : 79;
    const gst = Math.round(data.total * 0.05);
    summary.innerHTML = `
      <div class="summary-title">Order Summary</div>
      <div class="summary-line"><span>Subtotal (${data.itemCount} items)</span><span>₹${data.total.toLocaleString('en-IN')}</span></div>
      <div class="summary-line"><span>GST (5%)</span><span>₹${gst}</span></div>
      <div class="summary-line"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:var(--green-600);font-weight:600">FREE</span>' : '₹' + shipping}</span></div>
      <div class="summary-line total"><span>Total</span><span>₹${(data.total + gst + shipping).toLocaleString('en-IN')}</span></div>
      <div class="eco-note"><span>🌱</span> Free shipping on orders above ₹999</div>
      <button class="btn-primary btn-large" onclick="showPage('checkout')">Proceed to Checkout →</button>
      <button class="btn-outline" style="margin-top:0.75rem" onclick="clearCart()">Clear Cart</button>
    `;
  } catch {}
}

async function updateQty(cartItemId, quantity) {
  try {
    await apiFetch(`/cart/update/${cartItemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
    await loadCartPage();
  } catch {}
}

async function removeFromCart(cartItemId) {
  try {
    await apiFetch(`/cart/remove/${cartItemId}`, { method: 'DELETE' });
    await loadCartPage();
    toast('Item removed from cart');
  } catch {}
}

async function clearCart() {
  if (!confirm('Clear all items from your cart?')) return;
  try {
    await apiFetch('/cart/clear', { method: 'DELETE' });
    await loadCartPage();
    toast('Cart cleared');
  } catch {}
}

// ===== CHECKOUT =====
async function loadCheckoutPage() {
  try {
    const data = await apiFetch('/cart');
    cartData = data;
    const summary = document.getElementById('checkoutSummary');
    if (!summary) return;

    if (!data.items || data.items.length === 0) {
      showPage('cart');
      toast('Your cart is empty', 'error');
      return;
    }

    const shipping = data.total >= 999 ? 0 : 79;
    const gst = Math.round(data.total * 0.05);
    summary.innerHTML = `
      <div class="summary-title">Your Order</div>
      ${data.items.map(i => `
        <div class="summary-line">
          <span>${i.product?.name} × ${i.quantity}</span>
          <span>₹${i.subtotal.toLocaleString('en-IN')}</span>
        </div>
      `).join('')}
      <div class="summary-line"><span>GST (5%)</span><span>₹${gst}</span></div>
      <div class="summary-line"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '₹' + shipping}</span></div>
      <div class="summary-line total"><span>Total</span><span>₹${(data.total + gst + shipping).toLocaleString('en-IN')}</span></div>
      <div class="eco-note" style="margin-top:1rem"><span>🌳</span> 1 tree will be planted with this order!</div>
    `;
  } catch {}
}

async function placeOrder() {
  const name = document.getElementById('co-name')?.value.trim();
  const email = document.getElementById('co-email')?.value.trim();
  const address = document.getElementById('co-address')?.value.trim();
  const city = document.getElementById('co-city')?.value.trim();
  const pincode = document.getElementById('co-pincode')?.value.trim();

  if (!name || !email || !address || !city || !pincode) {
    toast('Please fill in all fields', 'error'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast('Enter a valid email address', 'error'); return;
  }
  if (!/^\d{6}$/.test(pincode)) {
    toast('Enter a valid 6-digit PIN code', 'error'); return;
  }

  try {
    const order = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify({ customerInfo: { name, email, address, city, pincode } }),
    });
    await updateCartBadge();
    showOrderSuccess(order);
  } catch {}
}

function showOrderSuccess(order) {
  showPage('success');
  const card = document.getElementById('successCard');
  card.innerHTML = `
    <div class="success-icon">🎉</div>
    <h2>Order Placed Successfully!</h2>
    <p>Thank you <strong>${order.customerInfo.name}</strong> for your eco-friendly purchase!</p>
    <p>A confirmation has been sent to <strong>${order.customerInfo.email}</strong></p>
    <span class="order-id">${order.id}</span>
    <div style="background:var(--green-50);border-radius:var(--radius-lg);padding:1.25rem;margin:1.25rem 0;text-align:left">
      <div style="font-weight:700;color:var(--green-800);margin-bottom:0.75rem">🌱 Order Details</div>
      ${order.items.map(i => `
        <div style="display:flex;justify-content:space-between;font-size:0.9rem;padding:0.3rem 0;color:var(--gray-700)">
          <span>${i.productName} × ${i.quantity}</span>
          <span>₹${(i.price * i.quantity).toLocaleString('en-IN')}</span>
        </div>
      `).join('')}
      <div style="display:flex;justify-content:space-between;font-weight:700;padding-top:0.75rem;border-top:1px solid var(--gray-200);margin-top:0.5rem">
        <span>Total Paid</span><span>₹${order.total.toLocaleString('en-IN')}</span>
      </div>
    </div>
    <p style="color:var(--green-700);font-weight:500">🌳 We've planted 1 tree in your honor!</p>
    <div class="success-actions">
      <button class="btn-primary" onclick="showPage('orders')">View My Orders</button>
      <button class="btn-ghost" onclick="showPage('shop')">Continue Shopping</button>
    </div>
  `;
}

// ===== ORDERS PAGE =====
async function loadOrdersPage() {
  try {
    const orders = await apiFetch('/orders/my-orders');
    const list = document.getElementById('ordersList');
    const empty = document.getElementById('ordersEmpty');

    if (!orders || orders.length === 0) {
      list.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    list.innerHTML = [...orders].reverse().map(o => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-id-text">${o.id}</div>
            <div class="order-date">${new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <span class="order-status status-${o.status}">${o.status}</span>
        </div>
        <div class="order-items">
          ${o.items.map(i => `
            <div class="order-item-row">
              <span>${i.productName} × ${i.quantity}</span>
              <span>₹${(i.price * i.quantity).toLocaleString('en-IN')}</span>
            </div>
          `).join('')}
        </div>
        <div class="order-total">
          <span>Order Total</span>
          <span>₹${o.total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    `).join('');
  } catch {}
}

// ===== SEARCH =====
function toggleSearch() {
  const bar = document.getElementById('searchBar');
  bar.classList.toggle('open');
  if (bar.classList.contains('open')) {
    document.getElementById('searchInput').focus();
  }
}