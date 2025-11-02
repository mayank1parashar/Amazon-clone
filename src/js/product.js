import { getProductBySlug, addToCart, getCartCount } from './supabase.js';

let currentProduct = null;
let quantity = 1;

async function initProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    showError();
    return;
  }

  currentProduct = await getProductBySlug(slug);

  if (!currentProduct) {
    showError();
    return;
  }

  renderProduct();
  setupEventListeners();
  await updateCartCount();
}

function renderProduct() {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('productDetail').classList.remove('hidden');

  document.getElementById('mainImage').src = currentProduct.image_url;
  document.getElementById('mainImage').alt = currentProduct.name;
  document.getElementById('productName').textContent = currentProduct.name;
  document.getElementById('breadcrumbProduct').textContent = currentProduct.name;

  if (currentProduct.categories) {
    document.getElementById('breadcrumbCategory').textContent = currentProduct.categories.name;
  }

  const ratingEl = document.getElementById('productRating');
  ratingEl.innerHTML = renderStars(currentProduct.rating);

  document.getElementById('reviewCount').textContent = `${currentProduct.review_count} ratings`;

  const priceEl = document.getElementById('productPrice');
  priceEl.textContent = `$${currentProduct.price.toFixed(2)}`;

  if (currentProduct.original_price) {
    const originalPriceEl = document.getElementById('originalPrice');
    originalPriceEl.textContent = `$${currentProduct.original_price.toFixed(2)}`;
    originalPriceEl.classList.remove('hidden');

    const discount = Math.round((1 - currentProduct.price / currentProduct.original_price) * 100);
    const discountEl = document.getElementById('discount');
    discountEl.textContent = `${discount}% off`;
    discountEl.classList.remove('hidden');
  }

  const stockEl = document.getElementById('stockStatus');
  if (currentProduct.stock > 0) {
    stockEl.textContent = 'In Stock';
    stockEl.className = 'text-sm text-green-600 font-semibold';
  } else {
    stockEl.textContent = 'Out of Stock';
    stockEl.className = 'text-sm text-red-600 font-semibold';
    document.getElementById('addToCartBtn').disabled = true;
    document.getElementById('addToCartBtn').classList.add('opacity-50', 'cursor-not-allowed');
    document.getElementById('buyNowBtn').disabled = true;
    document.getElementById('buyNowBtn').classList.add('opacity-50', 'cursor-not-allowed');
  }

  document.getElementById('productDescription').textContent = currentProduct.description;

  const featuresEl = document.getElementById('productFeatures');
  if (currentProduct.features && Array.isArray(currentProduct.features)) {
    featuresEl.innerHTML = currentProduct.features
      .map(feature => `<li class="flex items-start gap-2"><span class="text-green-600">✓</span><span class="text-gray-700">${feature}</span></li>`)
      .join('');
  }

  document.title = `${currentProduct.name} - ShopZilla`;
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';

  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="text-yellow-400 text-xl">★</span>';
  }
  if (hasHalfStar) {
    stars += '<span class="text-yellow-400 text-xl">★</span>';
  }
  for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
    stars += '<span class="text-gray-300 text-xl">★</span>';
  }

  return stars + `<span class="ml-2 text-gray-700">${rating.toFixed(1)}</span>`;
}

function setupEventListeners() {
  document.getElementById('decreaseQty').addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      document.getElementById('quantity').textContent = quantity;
    }
  });

  document.getElementById('increaseQty').addEventListener('click', () => {
    if (quantity < currentProduct.stock) {
      quantity++;
      document.getElementById('quantity').textContent = quantity;
    }
  });

  document.getElementById('addToCartBtn').addEventListener('click', async () => {
    const result = await addToCart(currentProduct.id, quantity);
    if (result) {
      await updateCartCount();
      showNotification('Product added to cart!');
    }
  });

  document.getElementById('buyNowBtn').addEventListener('click', async () => {
    const result = await addToCart(currentProduct.id, quantity);
    if (result) {
      window.location.href = '/pages/cart.html';
    }
  });
}

async function updateCartCount() {
  const count = await getCartCount();
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

function showError() {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('errorMessage').classList.remove('hidden');
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductPage);
} else {
  initProductPage();
}
