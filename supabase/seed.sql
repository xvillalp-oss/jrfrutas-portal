-- JR Frutas Portal - Seed Data
-- Ejecutar DESPUÉS del schema.sql

-- Categorías
INSERT INTO categories (name, slug, emoji) VALUES
  ('Frutas',              'frutas',     '🍎'),
  ('Verduras',            'verduras',   '🥦'),
  ('Cítricos',            'citricos',   '🍊'),
  ('Hierbas y Condimentos','hierbas',   '🌿'),
  ('Tropicales',          'tropicales', '🍍');

-- Frutas
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Manzana Golden',         'kg', 32.00,  5, true, true  FROM categories WHERE slug = 'frutas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Manzana Red Delicious',  'kg', 30.00,  5, true FROM categories WHERE slug = 'frutas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Pera Bartlett',          'kg', 45.00,  5, true FROM categories WHERE slug = 'frutas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Uva Verde sin semilla',  'kg', 85.00,  3, true, true FROM categories WHERE slug = 'frutas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Uva Roja sin semilla',   'kg', 90.00,  3, true FROM categories WHERE slug = 'frutas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Durazno Criollo',        'kg', 55.00,  5, true FROM categories WHERE slug = 'frutas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Fresa',                  'kg', 65.00,  2, true, true FROM categories WHERE slug = 'frutas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Zarzamora',              'kg',180.00,  1, true FROM categories WHERE slug = 'frutas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Arándano',               'kg',220.00,  1, true FROM categories WHERE slug = 'frutas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Frambuesa',              'kg',195.00,  1, true FROM categories WHERE slug = 'frutas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Ciruela Roja',           'kg', 48.00,  5, true FROM categories WHERE slug = 'frutas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Kiwi',                   'kg', 95.00,  3, true FROM categories WHERE slug = 'frutas';

-- Verduras
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Tomate Saladet',         'kg', 22.00, 10, true, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Tomate Cherry',          'kg', 55.00,  3, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Chile Serrano',          'kg', 35.00,  5, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Chile Jalapeño',         'kg', 38.00,  5, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Chile Poblano',          'kg', 32.00,  5, true, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Chile Manzano',          'kg', 65.00,  3, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Cebolla Blanca',         'kg', 18.00, 10, true, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Cebolla Morada',         'kg', 25.00,  5, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Ajo Nacional',           'kg', 85.00,  3, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Papa Blanca',            'kg', 15.00, 20, true, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Zanahoria',              'kg', 14.00, 10, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Calabacita',             'kg', 20.00, 10, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Brócoli',                'kg', 28.00,  5, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Coliflor',               'kg', 25.00,  5, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Lechuga Romana',         'kg', 22.00,  5, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Espinaca',               'kg', 40.00,  3, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Betabel',                'kg', 18.00,  5, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Apio',                   'kg', 22.00,  5, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Pimiento Rojo',          'kg', 55.00,  3, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Pimiento Verde',         'kg', 35.00,  3, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Nopal',                  'kg', 20.00,  5, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Elote',                  'kg', 18.00, 10, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Chayote',                'kg', 16.00,  5, true FROM categories WHERE slug = 'verduras';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Ejote',                  'kg', 30.00,  3, true FROM categories WHERE slug = 'verduras';

-- Cítricos
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Limón Persa',            'kg', 18.00, 10, true, true FROM categories WHERE slug = 'citricos';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Naranja Valencia',       'kg', 14.00, 20, true, true FROM categories WHERE slug = 'citricos';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Toronja',                'kg', 16.00, 10, true FROM categories WHERE slug = 'citricos';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Mandarina',              'kg', 22.00, 10, true FROM categories WHERE slug = 'citricos';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Lima',                   'kg', 20.00,  5, true FROM categories WHERE slug = 'citricos';

-- Hierbas
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Cilantro',               'kg', 45.00,  2, true, true FROM categories WHERE slug = 'hierbas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Perejil',                'kg', 50.00,  2, true FROM categories WHERE slug = 'hierbas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Epazote',                'kg', 40.00,  2, true FROM categories WHERE slug = 'hierbas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Hierba Santa',           'kg', 60.00,  1, true FROM categories WHERE slug = 'hierbas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Romero',                 'kg', 80.00,  1, true FROM categories WHERE slug = 'hierbas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Tomillo',                'kg', 85.00,  1, true FROM categories WHERE slug = 'hierbas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Albahaca',               'kg', 90.00,  1, true FROM categories WHERE slug = 'hierbas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Hierbabuena',            'kg', 55.00,  1, true FROM categories WHERE slug = 'hierbas';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Hoja de Laurel',         'kg',120.00,  1, true FROM categories WHERE slug = 'hierbas';

-- Tropicales
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Mango Ataulfo',          'kg', 28.00, 10, true, true FROM categories WHERE slug = 'tropicales';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Mango Tommy',            'kg', 22.00, 10, true FROM categories WHERE slug = 'tropicales';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Papaya Maradol',         'kg', 16.00, 10, true FROM categories WHERE slug = 'tropicales';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Piña Miel',              'kg', 18.00,  5, true, true FROM categories WHERE slug = 'tropicales';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Sandía',                 'kg', 10.00, 20, true FROM categories WHERE slug = 'tropicales';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Melón Cantaloupe',       'kg', 14.00, 10, true FROM categories WHERE slug = 'tropicales';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available, featured)
SELECT id, 'Aguacate Hass',          'kg', 65.00,  5, true, true FROM categories WHERE slug = 'tropicales';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Plátano Tabasco',        'kg', 15.00, 10, true FROM categories WHERE slug = 'tropicales';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Maracuyá',               'kg', 85.00,  3, true FROM categories WHERE slug = 'tropicales';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Coco',                   'kg', 22.00,  5, true FROM categories WHERE slug = 'tropicales';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Guayaba',                'kg', 25.00,  5, true FROM categories WHERE slug = 'tropicales';
INSERT INTO products (category_id, name, unit, price_per_kg, min_quantity_kg, available)
SELECT id, 'Tamarindo',              'kg', 35.00,  3, true FROM categories WHERE slug = 'tropicales';

-- NOTA: Para crear el primer admin, ejecuta esto reemplazando el UUID real del usuario:
-- INSERT INTO admin_users (user_id, name, email) VALUES ('uuid-del-usuario-admin', 'Admin JR Frutas', 'admin@jrfrutas.com');
