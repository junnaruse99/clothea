-- Datos iniciales de Clothea (ejecutar después de schema.sql)

insert into categories (id, name, slug) values
  ('cat-vestidos', 'Vestidos', 'vestidos'),
  ('cat-blusas', 'Blusas', 'blusas'),
  ('cat-pantalones', 'Pantalones', 'pantalones'),
  ('cat-faldas', 'Faldas', 'faldas'),
  ('cat-polos', 'Polos', 'polos'),
  ('cat-accesorios', 'Accesorios', 'accesorios')
on conflict (id) do nothing;

insert into products (code, name, description, category_id, color, price, sale_price, photos, variants) values
  ('VE-001', 'Vestido Floral Primavera', 'Vestido midi con estampado floral, tela fresca y ligera, ideal para el verano limeño. Corte que favorece todas las siluetas.', 'cat-vestidos', 'Rosado floral', 89.90, 69.90, '["/uploads/vestido-floral.svg"]', '[{"size":"S","quantity":8},{"size":"M","quantity":12},{"size":"L","quantity":5}]'),
  ('VE-002', 'Vestido Negro Elegante', 'El clásico vestido negro que no puede faltar. Perfecto para una cena o una reunión importante.', 'cat-vestidos', 'Negro', 119.90, null, '["/uploads/vestido-negro.svg"]', '[{"size":"S","quantity":6},{"size":"M","quantity":9},{"size":"L","quantity":4},{"size":"XL","quantity":3}]'),
  ('BL-001', 'Blusa Satinada Champagne', 'Blusa de satén con caída elegante y botones perlados. Combina con jeans o falda para un look versátil.', 'cat-blusas', 'Champagne', 59.90, 45.90, '["/uploads/blusa-satinada.svg"]', '[{"size":"S","quantity":10},{"size":"M","quantity":14},{"size":"L","quantity":7}]'),
  ('BL-002', 'Blusa Blanca Manga Bombacha', 'Blusa blanca de algodón con mangas bombachas y cuello cuadrado. Fresca, cómoda y muy femenina.', 'cat-blusas', 'Blanco', 49.90, null, '["/uploads/blusa-blanca.svg"]', '[{"size":"S","quantity":12},{"size":"M","quantity":15},{"size":"L","quantity":8}]'),
  ('PA-001', 'Jean Mom Fit Tiro Alto', 'Jean mom fit de tiro alto, denim suave con stretch. El básico favorito de todas.', 'cat-pantalones', 'Azul medio', 99.90, 79.90, '["/uploads/jean-momfit.svg"]', '[{"size":"26","quantity":6},{"size":"28","quantity":10},{"size":"30","quantity":8},{"size":"32","quantity":4}]'),
  ('PA-002', 'Pantalón Palazzo Lino', 'Pantalón palazzo de lino fresco color arena. Elegante y cómodo para el día a día.', 'cat-pantalones', 'Arena', 79.90, null, '["/uploads/pantalon-palazzo.svg"]', '[{"size":"S","quantity":7},{"size":"M","quantity":9},{"size":"L","quantity":5}]'),
  ('FA-001', 'Falda Plisada Midi', 'Falda plisada midi color terracota con cintura elástica. Movimiento y estilo en una sola prenda.', 'cat-faldas', 'Terracota', 65.90, 52.90, '["/uploads/falda-plisada.svg"]', '[{"size":"S","quantity":9},{"size":"M","quantity":11},{"size":"L","quantity":6}]'),
  ('PO-001', 'Polo Básico Algodón Pima', 'Polo de algodón pima peruano, suave y duradero. Disponible en color lila pastel.', 'cat-polos', 'Lila', 35.90, null, '["/uploads/polo-basico.svg"]', '[{"size":"S","quantity":20},{"size":"M","quantity":25},{"size":"L","quantity":15},{"size":"XL","quantity":10}]'),
  ('PO-002', 'Polo Crop Rib', 'Polo crop acanalado de manga corta. Juvenil y combinable con jeans de tiro alto.', 'cat-polos', 'Verde oliva', 29.90, 24.90, '["/uploads/polo-crop.svg"]', '[{"size":"S","quantity":14},{"size":"M","quantity":16},{"size":"L","quantity":9}]'),
  ('AC-001', 'Cartera Tote Vegana', 'Cartera tote de cuero vegano color camel. Amplia, resistente y con bolsillo interior.', 'cat-accesorios', 'Camel', 75.90, null, '["/uploads/cartera-tote.svg"]', '[{"size":"Única","quantity":12}]')
on conflict (code) do nothing;

insert into districts (id, name, lat, lng, surcharge) values
  ('dist-miraflores', 'Miraflores', -12.1211, -77.0297, 0),
  ('dist-san-isidro', 'San Isidro', -12.0976, -77.0365, 0),
  ('dist-barranco', 'Barranco', -12.14, -77.021, 0),
  ('dist-surco', 'Santiago de Surco', -12.1355, -76.993, 0),
  ('dist-la-molina', 'La Molina', -12.079, -76.939, 0),
  ('dist-san-borja', 'San Borja', -12.1027, -76.9989, 0),
  ('dist-jesus-maria', 'Jesús María', -12.0705, -77.048, 0),
  ('dist-lince', 'Lince', -12.085, -77.036, 0),
  ('dist-magdalena', 'Magdalena del Mar', -12.091, -77.071, 0),
  ('dist-pueblo-libre', 'Pueblo Libre', -12.074, -77.063, 0),
  ('dist-san-miguel', 'San Miguel', -12.077, -77.091, 0),
  ('dist-cercado', 'Cercado de Lima', -12.0464, -77.0428, 0),
  ('dist-brena', 'Breña', -12.057, -77.05, 0),
  ('dist-la-victoria', 'La Victoria', -12.065, -77.015, 0),
  ('dist-surquillo', 'Surquillo', -12.111, -77.017, 0),
  ('dist-chorrillos', 'Chorrillos', -12.168, -77.024, 0),
  ('dist-sjm', 'San Juan de Miraflores', -12.155, -76.97, 2),
  ('dist-ves', 'Villa El Salvador', -12.213, -76.939, 3),
  ('dist-sjl', 'San Juan de Lurigancho', -12.003, -77.008, 3),
  ('dist-los-olivos', 'Los Olivos', -11.991, -77.071, 3),
  ('dist-smp', 'San Martín de Porres', -12.009, -77.085, 3),
  ('dist-comas', 'Comas', -11.943, -77.062, 4),
  ('dist-ate', 'Ate', -12.026, -76.921, 3),
  ('dist-santa-anita', 'Santa Anita', -12.043, -76.971, 2),
  ('dist-callao', 'Callao', -12.056, -77.118, 3),
  ('dist-rimac', 'Rímac', -12.029, -77.028, 2)
on conflict (id) do nothing;

insert into settings (key, value) values
  ('delivery_config', '{"originLat": -12.1211, "originLng": -77.0297, "baseFee": 8, "perKmFee": 1.2, "minFee": 8, "freeThreshold": 200}')
on conflict (key) do nothing;
