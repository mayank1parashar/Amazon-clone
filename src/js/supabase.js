const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase credentials not found. Please check your .env file.');
}

export const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data || [];
}

export async function getProducts(filters = {}) {
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false });

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters.featured) {
    query = query.eq('is_featured', true);
  }

  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters.minRating) {
    query = query.gte('rating', filters.minRating);
  }

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  return data;
}

export async function addToCart(productId, quantity = 1) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = '/pages/login.html';
    return null;
  }

  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cart:', error);
      return null;
    }
    return data;
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({ user_id: user.id, product_id: productId, quantity })
    .select()
    .single();

  if (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
  return data;
}

export async function getCartItems() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
  return data || [];
}

export async function updateCartItem(itemId, quantity) {
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating cart item:', error);
    return null;
  }
  return data;
}

export async function removeFromCart(itemId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
  return true;
}

export async function getCartCount() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return 0;

  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching cart count:', error);
    return 0;
  }

  return data.reduce((sum, item) => sum + item.quantity, 0);
}
