import { getCategories, getProducts, addToCart, getCartCount } from './supabase.js';

let allProducts = [];
let categories = [];

async function initApp() {
  await loadCategories();
  await loadFeaturedProducts();
  await loadAllProducts();
  await updateCartCount();
  setupEventListeners();
}

async function loadCategories() {
  categories = await getCategories();
  renderCategoryNav();
  renderCategoriesGrid();
}

function renderCategoryNav() {
  const categoryNav = document.getElementById('categoryNav');
  if (!categoryNav) return;

  const limitedCategories = categories.slice(0, 6);
  categoryNav.innerHTML = limitedCategories
    .map(cat => `
      <a href="#" data-category="${cat.id}" class="hover:border border-white px-2 py-1 rounded whitespace-nowrap category-link">
        ${cat.name}
      </a>
    `)
    .join('');

  document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const categoryId = e.currentTarget.dataset.category;
      filterByCategory(categoryId);
    });
  });
}

function renderCategoriesGrid() {
  const categoriesGrid = document.getElementById('categoriesGrid');
  if (!categoriesGrid) return;

  categoriesGrid.innerHTML = categories
    .map(cat => `
      <a href="#" data-category="${cat.id}" class="category-card block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <img src="${cat.image_url}" alt="${cat.name}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="font-bold text-lg">${cat.name}</h3>
          <p class="text-sm text-gray-600 mt-1">${cat.description}</p>
        </div>
      </a>
    `)
    .join('');

  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const categoryId = e.currentTarget.dataset.category;
      filterByCategory(categoryId);
      document.getElementById('productsGrid').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

async function loadFeaturedProducts() {
  const products = await getProducts({ featured: true });
  const featuredProducts = document.getElementById('featuredProducts');
  if (!featuredProducts) return;

  featuredProducts.innerHTML = products
    .map(product => createProductCard(product))
    .join('');

  attachProductCardListeners();
}

async function loadAllProducts() {
  allProducts = await getProducts();
  renderProducts(allProducts);
}

function renderProducts(products) {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;

  if (products.length === 0) {
    productsGrid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500">No products found</div>';
    return;
  }

  productsGrid.innerHTML = products
    .map(product => createProductCard(product))
    .join('');

  attachProductCardListeners();
}

function createProductCard(product) {
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return `
    <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <a href="pages/product.html?slug=${product.slug}" class="block">
        <img src="${product.image_url}" alt="${product.name}" class="w-full h-64 object-cover">
        <div class="p-4">
          <h3 class="font-bold text-lg mb-2 line-clamp-2">${product.name}</h3>
          <div class="flex items-center gap-2 mb-2">
            <div class="flex items-center">
              ${renderStars(product.rating)}
            </div>
            <span class="text-sm text-gray-600">(${product.review_count})</span>
          </div>
          <div class="flex items-baseline gap-2 mb-3">
            <span class="text-2xl font-bold text-red-600">$${product.price.toFixed(2)}</span>
            ${product.original_price ? `
              <span class="text-sm text-gray-500 line-through">$${product.original_price.toFixed(2)}</span>
              <span class="text-sm text-green-600 font-semibold">${discount}% off</span>
            ` : ''}
          </div>
          ${product.stock > 0 ? `
            <span class="text-sm text-green-600">In Stock</span>
          ` : `
            <span class="text-sm text-red-600">Out of Stock</span>
          `}
        </div>
      </a>
      <div class="px-4 pb-4">
        <button onclick="handleAddToCart('${product.id}')" ${product.stock === 0 ? 'disabled' : ''}
          class="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-primary-500 font-bold py-2 px-4 rounded transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';

  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="text-yellow-400">★</span>';
  }
  if (hasHalfStar) {
    stars += '<span class="text-yellow-400">★</span>';
  }
  for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
    stars += '<span class="text-gray-300">★</span>';
  }

  return stars;
}

window.handleAddToCart = async function(productId) {
  const result = await addToCart(productId);
  if (result) {
    await updateCartCount();
    showNotification('Product added to cart!');
  }
}

function attachProductCardListeners() {
  feather.replace();
}

async function filterByCategory(categoryId) {
  const filtered = allProducts.filter(p => p.category_id === categoryId);
  renderProducts(filtered);
}

async function updateCartCount() {
  const count = await getCartCount();
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

function setupEventListeners() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');

  if (searchBtn && searchInput) {
    const handleSearch = async () => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        const products = await getProducts({ search: searchTerm });
        renderProducts(products);
        document.getElementById('productsGrid').scrollIntoView({ behavior: 'smooth' });
      } else {
        renderProducts(allProducts);
      }
    };

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  const priceRange = document.getElementById('priceRange');
  const maxPriceEl = document.getElementById('maxPrice');

  if (priceRange && maxPriceEl) {
    priceRange.addEventListener('input', (e) => {
      const maxPrice = parseFloat(e.target.value);
      maxPriceEl.textContent = `$${maxPrice}`;
      const filtered = allProducts.filter(p => p.price <= maxPrice);
      renderProducts(filtered);
    });
  }

  const ratingFilters = document.querySelectorAll('.rating-filter');
  ratingFilters.forEach(filter => {
    filter.addEventListener('change', () => {
      const checkedRatings = Array.from(ratingFilters)
        .filter(f => f.checked)
        .map(f => parseFloat(f.value));

      if (checkedRatings.length > 0) {
        const minRating = Math.min(...checkedRatings);
        const filtered = allProducts.filter(p => p.rating >= minRating);
        renderProducts(filtered);
      } else {
        renderProducts(allProducts);
      }
    });
  });

  const allCategoriesBtn = document.getElementById('allCategoriesBtn');
  if (allCategoriesBtn) {
    allCategoriesBtn.addEventListener('click', () => {
      renderProducts(allProducts);
      document.getElementById('productsGrid').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const accountBtn = document.getElementById('accountBtn');
  if (accountBtn) {
    accountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/pages/login.html';
    });
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('animate-fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
