-- Check if products table exists and has data
SELECT COUNT(*) as product_count FROM products;

-- Check RLS policies on products table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'products';

-- Check if admin_users table has your user
SELECT au.*, ar.role_name, ar.permissions
FROM admin_users au
JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.is_active = true;

-- Check categories table
SELECT COUNT(*) as category_count FROM categories;

-- Check if there are any RLS policies blocking access
SELECT * FROM pg_policies WHERE tablename IN ('products', 'categories', 'admin_users');

