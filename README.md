# ShopZilla E-commerce Platform

A modern, full-featured e-commerce platform built with vanilla JavaScript, Tailwind CSS, and Supabase.

## Author
Mayank Parashar

## Features

- **Product Catalog**: Browse products by category with filtering and search
- **Product Details**: Detailed product pages with images, ratings, and reviews
- **Shopping Cart**: Add to cart with real-time updates and persistence
- **User Authentication**: Sign up and login with Supabase Auth
- **Responsive Design**: Mobile-first design that works on all devices
- **Database Integration**: Full CRUD operations with Supabase PostgreSQL
- **Modern UI**: Clean, professional design inspired by industry leaders

## Project Structure

```
shopzilla/
├── index.html              # Homepage
├── pages/                  # Additional pages
│   ├── cart.html          # Shopping cart
│   ├── product.html       # Product details
│   ├── login.html         # User login
│   └── signup.html        # User registration
├── src/
│   ├── js/                # JavaScript modules
│   │   ├── app.js         # Main app logic
│   │   ├── supabase.js    # Supabase client & API
│   │   ├── cart-page.js   # Cart functionality
│   │   ├── product.js     # Product page logic
│   │   └── auth.js        # Authentication
│   └── css/               # Custom styles
├── assets/
│   └── images/            # Image assets
├── components/            # Reusable components
├── package.json
└── vite.config.js
```

## Database Schema

The application uses Supabase PostgreSQL with the following tables:

- **categories**: Product categories
- **products**: Product catalog with pricing and stock
- **cart_items**: User shopping cart items
- **orders**: Customer orders
- **order_items**: Order line items
- **reviews**: Product reviews and ratings

All tables have Row Level Security (RLS) enabled for secure data access.

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Features in Detail

### Product Browsing
- Grid layout with responsive design
- Category filtering
- Price range filtering
- Rating filtering
- Real-time search

### Shopping Cart
- Add/remove items
- Update quantities
- Persistent cart (requires login)
- Real-time price calculations
- Tax and shipping estimates

### Authentication
- Email/password authentication
- Secure user registration
- Protected routes
- Session management

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: Tailwind CSS
- **Icons**: Feather Icons
- **Backend**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite

## Security

- Row Level Security (RLS) on all database tables
- Secure authentication with Supabase Auth
- Environment variables for sensitive data

## License

MIT

---

**ShopZilla** - Your Online Shopping Destination
