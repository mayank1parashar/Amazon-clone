class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .navbar {
          background-color: #131921;
        }
        .search-input:focus {
          outline: 3px solid #f3a847;
        }
        .nav-link:hover {
          border-color: white;
        }
        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          font-size: 0.75rem;
        }
      </style>
      <nav class="navbar text-white">
        <div class="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center">
          <div class="flex items-center flex-1 mb-3 md:mb-0">
            <a href="/" class="flex items-center">
              <i data-feather="shopping-cart" class="mr-2"></i>
              <span class="text-xl font-bold">ShopZilla</span>
            </a>
          </div>
          
          <div class="flex-1 w-full md:mx-4 mb-3 md:mb-0">
            <div class="relative">
              <input type="text" placeholder="Search ShopZilla" class="search-input w-full py-2 px-4 rounded text-gray-900">
              <button class="absolute right-0 top-0 h-full bg-primary-500 hover:bg-primary-600 px-4 rounded-r">
                <i data-feather="search"></i>
              </button>
            </div>
          </div>
          
          <div class="flex items-center space-x-6">
            <a href="/account" class="nav-link flex items-center border border-transparent py-1 px-2">
              <div class="text-xs">
                <div>Hello, Sign in</div>
                <div class="font-bold">Account & Lists</div>
              </div>
            </a>
            
            <a href="/orders" class="nav-link flex items-center border border-transparent py-1 px-2">
              <div class="text-xs">
                <div>Returns</div>
                <div class="font-bold">& Orders</div>
              </div>
            </a>
            
            <a href="/cart" class="nav-link flex items-center border border-transparent py-1 px-2 relative">
              <i data-feather="shopping-cart" class="mr-1"></i>
              <span class="font-bold text-sm">Cart</span>
              <span class="cart-count bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </a>
          </div>
        </div>
      </nav>
    `;
  }
}
customElements.define('custom-navbar', CustomNavbar);