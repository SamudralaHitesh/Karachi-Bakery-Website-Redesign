/**
 * Karachi Bakery Redesign — Core Application Logic
 * Day 1 Sprint: Customer Journey Switching, Pincode Validation, Cart Actions
 */

// Application State
const AppState = {
  activeJourney: 'retail', // 'retail' | 'b2b' | 'custom' | 'stores'
  cartItems: [],
  compareItems: [],
  pincodeVerified: null,
};

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
  initJourneyTabs();
  initPincodeChecker();
  initGlobalSearch();
});

/**
 * Initialize Journey Switching (Directly solves Issue #15)
 */
function initJourneyTabs() {
  const tabs = document.querySelectorAll('.journey-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const journey = tab.getAttribute('data-journey');
      switchJourney(journey);
    });
  });
}

/**
 * Switch Active Customer Journey
 * @param {string} journey 
 */
function switchJourney(journey) {
  AppState.activeJourney = journey;
  const tabs = document.querySelectorAll('.journey-tab');
  const badge = document.getElementById('currentJourneyBadge');

  tabs.forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
    if (t.getAttribute('data-journey') === journey) {
      t.classList.add('active');
      t.setAttribute('aria-selected', 'true');
    }
  });

  // Update Journey indicator badge
  switch (journey) {
    case 'retail':
      badge.innerHTML = 'Browsing: <strong>Retail Online Store (B2C)</strong>';
      showToast('Switched to Retail Online Store. Ready to order!', '🛍️');
      break;
    case 'b2b':
      badge.innerHTML = 'Browsing: <strong>Corporate & Bulk Orders (B2B)</strong>';
      showToast('Switched to Corporate B2B Portal (Volume pricing & custom tins)', '🏢');
      break;
    case 'custom':
      badge.innerHTML = 'Browsing: <strong>Custom Cake & Celebration Studio</strong>';
      showToast('Switched to Custom Cake Studio', '🎂');
      break;
    case 'stores':
      badge.innerHTML = 'Browsing: <strong>Store Locator & Flagship Outlets</strong>';
      showToast('Switched to Store Locator (50+ locations across India)', '📍');
      break;
  }
}

/**
 * Express Pincode Delivery Validator (Addresses Issue #12)
 */
function initPincodeChecker() {
  const input = document.getElementById('quickPincodeInput');
  const btn = document.getElementById('btnQuickPincodeCheck');
  const badge = document.getElementById('pincodeStatusBadge');

  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const val = input.value.trim();
    if (!/^\d{6}$/.test(val)) {
      showToast('Please enter a valid 6-digit Indian pincode.', '⚠️');
      return;
    }

    // Hyderabad City Pincodes (500xxx) get Same-Day Fresh
    if (val.startsWith('500') || val.startsWith('501') || val.startsWith('502')) {
      AppState.pincodeVerified = { pincode: val, type: 'local', speed: 'Same-day / 24 Hours' };
      badge.style.display = 'inline';
      badge.style.color = '#72E385';
      badge.textContent = `📍 ${val} (Same-Day Fresh Delivery)`;
      showToast(`Pincode ${val} verified! Same-day local delivery available.`, '⚡');
    } else {
      AppState.pincodeVerified = { pincode: val, type: 'national', speed: '3–5 Business Days' };
      badge.style.display = 'inline';
      badge.style.color = '#FFE194';
      badge.textContent = `📍 ${val} (Pan-India 3–5 Days)`;
      showToast(`Pincode ${val} verified! Pan-India express delivery eligible.`, '🚚');
    }
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btn.click();
  });
}

/**
 * Global Product Search (Addresses Issue #2)
 */
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
      const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
      const category = card.querySelector('.product-category-label')?.textContent.toLowerCase() || '';
      
      if (title.includes(query) || category.includes(query) || query === '') {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/**
 * Quick Filter Catalog Tabs
 * @param {string} category 
 * @param {HTMLElement} btn 
 */
function filterCatalog(category, btn) {
  document.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
  btn.classList.add('active');

  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Cart Manager
 * @param {string} productName 
 * @param {number} price 
 */
function addToCart(productName, price) {
  AppState.cartItems.push({ name: productName, price: price });
  
  const cartBadge = document.getElementById('cartCount');
  if (cartBadge) {
    cartBadge.textContent = AppState.cartItems.length;
    cartBadge.classList.add('bump');
  }

  showToast(`Added "${productName}" (₹${price}) to your cart!`, '🛒');
}

/**
 * Toast Notification Helper
 * @param {string} message 
 * @param {string} icon 
 */
let toastTimeout;
function showToast(message, icon = '✨') {
  const toast = document.getElementById('toastNotice');
  const msgEl = document.getElementById('toastMessage');
  const iconEl = document.getElementById('toastIcon');

  if (!toast) return;

  msgEl.textContent = message;
  iconEl.textContent = icon;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
