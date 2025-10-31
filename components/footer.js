class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .footer {
          background-color: #232f3e;
        }
        .footer-link:hover {
          text-decoration: underline;
        }
        .back-to-top {
          background-color: #37475a;
        }
        .back-to-top:hover {
          background-color: #485769;
        }
      </style>
      <footer class="footer text-white">
        <div class="back-to-top py-3 text-center cursor-pointer">
          <span class="text-sm font-medium">Back to top</span>
        </div>
        
        <div class="container mx-auto px-4 py-10">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 class="text-lg font-bold mb-3">Get to Know Us</h3>
              <ul class="space-y-2">
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Blog</a></li>
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">About ShopZilla</a></li>
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Investor Relations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-lg font-bold mb-3">Make Money with Us</h3>
              <ul class="space-y-2">
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Sell products</a></li>
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Become an Affiliate</a></li>
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Advertise Your Products</a></li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-lg font-bold mb-3">Payment Products</h3>
              <ul class="space-y-2">
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">ShopZilla Business Card</a></li>
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Shop with Points</a></li>
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Reload Your Balance</a></li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-lg font-bold mb-3">Let Us Help You</h3>
              <ul class="space-y-2">
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Your Account</a></li>
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Your Orders</a></li>
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Shipping Rates & Policies</a></li>
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Returns & Replacements</a></li>
                <li><a href="#" class="footer-link text-sm text-gray-300 hover:text-white">Help</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-800 py-6">
          <div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <div class="flex items-center mb-4 md:mb-0">
              <i data-feather="globe" class="mr-2"></i>
              <span class="text-sm">English</span>
            </div>
            <div class="text-sm text-gray-400">
              &copy; 2023 ShopZilla, Inc. or its affiliates
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}
customElements.define('custom-footer', CustomFooter);