-- Fix RLS policies for production environment
-- These policies ensure admin users can access products

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read products (for public product display)
CREATE POLICY "Allow public read access to products" ON products
    FOR SELECT USING (true);

-- Allow admin users to manage products
CREATE POLICY "Allow admin users to manage products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            JOIN admin_roles ar ON au.role_id = ar.id
            WHERE au.user_id = auth.uid()
            AND au.is_active = true
            AND (ar.permissions->>'products' = 'true' OR ar.permissions->>'all' = 'true')
        )
    );

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read categories
CREATE POLICY "Allow public read access to categories" ON categories
    FOR SELECT USING (true);

-- Allow admin users to manage categories
CREATE POLICY "Allow admin users to manage categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            JOIN admin_roles ar ON au.role_id = ar.id
            WHERE au.user_id = auth.uid()
            AND au.is_active = true
            AND (ar.permissions->>'products' = 'true' OR ar.permissions->>'all' = 'true')
        )
    );

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow users to check their own admin status
CREATE POLICY "Allow users to check own admin status" ON admin_users
    FOR SELECT USING (user_id = auth.uid());

-- Allow super admins to manage admin users
CREATE POLICY "Allow super admins to manage admin users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            JOIN admin_roles ar ON au.role_id = ar.id
            WHERE au.user_id = auth.uid()
            AND au.is_active = true
            AND ar.permissions->>'all' = 'true'
        )
    );

