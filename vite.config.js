import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
        cart: './pages/cart.html',
        product: './pages/product.html',
        login: './pages/login.html',
        signup: './pages/signup.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
