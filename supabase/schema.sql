-- JR Frutas Portal - Schema SQL
-- Ejecutar en Supabase SQL Editor

-- Categorías de productos
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  emoji TEXT DEFAULT '🌿',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Productos del catálogo
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL DEFAULT 'kg',
  price_per_kg DECIMAL(10,2) NOT NULL,
  min_quantity_kg DECIMAL(10,2) DEFAULT 1,
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Perfiles de restaurantes (ligados a auth de Supabase)
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  municipality TEXT NOT NULL,
  city TEXT NOT NULL CHECK (city IN ('CDMX', 'Estado de Mexico')),
  rfc TEXT,
  restaurant_type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE,
  restaurant_id UUID REFERENCES restaurants(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'delivered', 'cancelled')),
  delivery_date DATE NOT NULL,
  total_kg DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artículos del pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usuarios admin
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Función para generar número de pedido
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_num INTEGER;
  year_str TEXT;
BEGIN
  year_str := TO_CHAR(NOW(), 'YY');
  SELECT COUNT(*) + 1 INTO seq_num
  FROM orders
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  NEW.order_number := 'JRF-' || year_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_order_insert
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Productos y categorías: lectura pública
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);

-- Restaurantes: cada usuario ve solo el suyo
CREATE POLICY "restaurants_own_select" ON restaurants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "restaurants_own_insert" ON restaurants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "restaurants_own_update" ON restaurants FOR UPDATE USING (auth.uid() = user_id);

-- Pedidos: restaurante ve solo los suyos
CREATE POLICY "orders_own_select" ON orders FOR SELECT
  USING (restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid()));
CREATE POLICY "orders_own_insert" ON orders FOR INSERT
  WITH CHECK (restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid() AND status = 'approved'));

-- Order items
CREATE POLICY "order_items_own_select" ON order_items FOR SELECT
  USING (order_id IN (
    SELECT o.id FROM orders o
    JOIN restaurants r ON o.restaurant_id = r.id
    WHERE r.user_id = auth.uid()
  ));
CREATE POLICY "order_items_own_insert" ON order_items FOR INSERT
  WITH CHECK (order_id IN (
    SELECT o.id FROM orders o
    JOIN restaurants r ON o.restaurant_id = r.id
    WHERE r.user_id = auth.uid()
  ));

-- Admin: solo lectura del propio registro (operaciones admin usan service role)
CREATE POLICY "admin_own_select" ON admin_users FOR SELECT USING (auth.uid() = user_id);
