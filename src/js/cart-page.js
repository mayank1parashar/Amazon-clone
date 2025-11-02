import { getCartItems, updateCartItem, removeFromCart, getCartCount } from './supabase.js';

let cartItems = [];

async function initCartPage() {
  await loadCart();
  await updateCartCount();
  setupEventListeners();
}

async function loadCart() {
  cartItems = await getCartItems();

  if (cartItems.length === 0) {
    showEmptyCart();
    return;
  }

  showCartContent();
  renderCartItems();
  updateSummary();
}

function showEmptyCart() {
  document.getElementById('emptyCart').classList.remove('hidden');
  document.getElementById('cartContent').classList.add('hidden');
  feather.replace();
}

function showCartContent() {
  document.getElementById('emptyCart').classList.add('hidden');
  document.getElementById('cartContent').classList.remove('hidden');
}

function renderCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById('itemCount').textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`;

  cartItemsContainer.innerHTML = cartItems.map(item => `
    <div class="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0" data-cart-id="${item.id}">
      <div class="flex items-center">
        <a href="/pages/product.html?slug=${item.products.slug}">
          <img src="${item.products.image_url}" alt="${item.products.name}" class="h-24 w-24 rounded-md object-cover">
        </a>
      </div>
      <div class="flex-1">
        <div class="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div>
            <a href="/pages/product.html?slug=${item.products.slug}" class="hover:text-accent-600">
              <h3 class="text-lg font-medium text-gray-900">${item.products.name}</h3>
            </a>
            <p class="text-sm text-green-600 mt-1">In Stock</p>
          </div>
          <p class="text-lg font-medium text-gray-900">$${item.products.price.toFixed(2)}</p>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <div class="flex items-center border border-gray-300 rounded-md">
            <button onclick="handleUpdateQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}
              class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">-</button>
            <span class="px-3 py-1">${item.quantity}</span>
            <button onclick="handleUpdateQuantity('${item.id}', ${item.quantity + 1})" ${item.quantity >= item.products.stock ? 'disabled' : ''}
              class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">+</button>
          </div>
          <button onclick="handleRemoveItem('${item.id}')" class="text-sm font-medium text-red-600 hover:text-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  `).join('');

  feather.replace();
}

window.handleUpdateQuantity = async function(itemId, newQuantity) {
  if (newQuantity < 1) return;

  const result = await updateCartItem(itemId, newQuantity);
  if (result) {
    await loadCart();
    await updateCartCount();
  }
}

window.handleRemoveItem = async function(itemId) {
  if (!confirm('Are you sure you want to remove this item?')) return;

  const success = await removeFromCart(itemId);
  if (success) {
    await loadCart();
    await updateCartCount();
    showNotification('Item removed from cart');
  }
}

function updateSummary() {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('summaryItemCount').textContent = `Items (${itemCount}):`;
  document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

async function updateCartCount() {
  const count = await getCartCount();
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

function setupEventListeners() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      showNotification('Checkout feature coming soon!');
    });
  }
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
  document.addEventListener('DOMContentLoaded', initCartPage);
} else {
  initCartPage();
}
