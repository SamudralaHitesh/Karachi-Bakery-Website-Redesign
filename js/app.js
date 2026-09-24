/**
 * Karachi Bakery Redesign — Core Application Logic
 * Day 2 Sprint: Category Architecture, Visual Mega Menu, Mobile Drawer, 5-Pillar Catalog
 */

// Application State
const AppState = {
  activeJourney: 'retail', // 'retail' | 'b2b' | 'custom' | 'stores'
  activeCategory: 'all',
  cartItems: [],
  compareItems: [],
  pincodeVerified: null,
};

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
  initJourneyTabs();
  initPincodeChecker();
  initGlobalSearch();
  initMegaMenu();
  initMobileDrawer();
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

  // Sync mobile drawer journey buttons if present
  document.querySelectorAll('.mobile-j-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Update Journey indicator badge
  switch (journey) {
    case 'retail':
      if (badge) badge.innerHTML = 'Browsing: <strong>Retail Online Store (B2C)</strong>';
      showToast('Switched to Retail Online Store. Ready to order!', '🛍️');
      break;
    case 'b2b':
      if (badge) badge.innerHTML = 'Browsing: <strong>Corporate & Bulk Orders (B2B)</strong>';
      showToast('Switched to Corporate B2B Portal (Volume pricing & custom tins)', '🏢');
      break;
    case 'custom':
      if (badge) badge.innerHTML = 'Browsing: <strong>Custom Cake & Celebration Studio</strong>';
      showToast('Switched to Custom Cake Studio', '🎂');
      break;
    case 'stores':
      if (badge) badge.innerHTML = 'Browsing: <strong>Store Locator & Flagship Outlets</strong>';
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
 * ============================================================================
 * Day 2 Feature: Visual Mega Menu Logic (Resolves Issue #1 & #15)
 * ============================================================================
 */
let megaMenuTimer = null;

function initMegaMenu() {
  const trigger = document.getElementById('btnMegaMenu');
  const dropdown = document.getElementById('megaMenuDropdown');
  const parentLi = document.querySelector('.has-mega-menu');

  if (!trigger || !dropdown) return;

  const openMega = () => {
    clearTimeout(megaMenuTimer);
    dropdown.classList.add('open');
    dropdown.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
  };

  const closeMega = () => {
    megaMenuTimer = setTimeout(() => {
      dropdown.classList.remove('open');
      dropdown.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
    }, 180);
  };

  // Hover support with intent delay buffer
  if (parentLi) {
    parentLi.addEventListener('mouseenter', openMega);
    parentLi.addEventListener('mouseleave', closeMega);
  }
  dropdown.addEventListener('mouseenter', () => clearTimeout(megaMenuTimer));
  dropdown.addEventListener('mouseleave', closeMega);

  // Click / Keyboard support
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    if (isOpen) {
      dropdown.classList.remove('open');
      dropdown.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
    } else {
      openMega();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
      dropdown.classList.remove('open');
      dropdown.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('open')) {
      dropdown.classList.remove('open');
      dropdown.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    }
  });
}

/**
 * Direct selection from Mega Menu or Category Showcase Cards
 * @param {string} category 
 * @param {string} subquery 
 */
function selectCategoryFromMega(category, subquery = '') {
  // Close mega menu
  const dropdown = document.getElementById('megaMenuDropdown');
  const trigger = document.getElementById('btnMegaMenu');
  if (dropdown) {
    dropdown.classList.remove('open');
    dropdown.setAttribute('aria-hidden', 'true');
  }
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
  }

  // Close mobile drawer if open
  closeMobileDrawer();

  // Find corresponding pill
  const targetPill = document.querySelector(`.filter-pill[data-filter="${category}"]`);
  filterCatalog(category, targetPill);

  // If subquery is passed, set search input and filter
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput && subquery) {
    searchInput.value = subquery;
    applyGlobalSearch(subquery);
  } else if (searchInput && !subquery) {
    searchInput.value = '';
  }

  // Smooth scroll to catalog section
  const shopSection = document.getElementById('shopPreview');
  if (shopSection) {
    shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const categoryNames = {
    'all': 'All Delicacies',
    'biscuits': 'Iconic Biscuits & Cookies',
    'cakes': 'Artisanal Cakes & Pastries',
    'sweets': 'Royal Mithai & Confectionery',
    'hampers': 'Luxury Hampers & Gift Tins',
    'healthy': 'Healthy Bakes & Savoury'
  };

  const label = categoryNames[category] || category;
  showToast(`Filtering by: ${label}${subquery ? ` (${subquery})` : ''}`, '🔍');
}

/**
 * ============================================================================
 * Day 2 Feature: Mobile Navigation Drawer (Addresses Issue #1 & #15)
 * ============================================================================
 */
function initMobileDrawer() {
  const btnOpen = document.getElementById('mobileMenuBtn');
  const btnClose = document.getElementById('btnDrawerClose');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');

  if (btnOpen) {
    btnOpen.addEventListener('click', openMobileDrawer);
  }
  if (btnClose) {
    btnClose.addEventListener('click', closeMobileDrawer);
  }
  if (backdrop) {
    backdrop.addEventListener('click', closeMobileDrawer);
  }
}

function openMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/**
 * Accordion Toggle in Mobile Drawer
 * @param {HTMLElement} btn 
 */
function toggleMobileAcc(btn) {
  const body = btn.nextElementSibling;
  const isOpen = body.classList.contains('open');

  // Close all other accordions
  document.querySelectorAll('.mobile-acc-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.mobile-acc-header').forEach(h => h.classList.remove('active'));

  if (!isOpen) {
    body.classList.add('open');
    btn.classList.add('active');
  }
}

/**
 * ============================================================================
 * Day 2 Feature: 5-Pillar Catalog Filtering
 * ============================================================================
 */
function filterCatalog(category, btn) {
  AppState.activeCategory = category;

  // Update pills active status
  document.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    const matching = document.querySelector(`.filter-pill[data-filter="${category}"]`);
    if (matching) matching.classList.add('active');
  }

  // Filter product cards
  const cards = document.querySelectorAll('.product-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Update count badge
  updateCatalogCountBadge(visibleCount);
}

/**
 * Global Product Search (Addresses Issue #2)
 */
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    applyGlobalSearch(query);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const shopSection = document.getElementById('shopPreview');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

function applyGlobalSearch(query) {
  const cards = document.querySelectorAll('.product-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
    const category = card.querySelector('.product-category-label')?.textContent.toLowerCase() || '';
    const tags = card.getAttribute('data-tags')?.toLowerCase() || '';
    
    if (title.includes(query) || category.includes(query) || tags.includes(query) || query === '') {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  updateCatalogCountBadge(visibleCount);
}

function updateCatalogCountBadge(count) {
  const badge = document.getElementById('catalogCountBadge');
  if (badge) {
    badge.innerHTML = `Showing <strong>${count}</strong> authentic ${count === 1 ? 'delicacy' : 'delicacies'}`;
  }
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
    setTimeout(() => cartBadge.classList.remove('bump'), 300);
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
