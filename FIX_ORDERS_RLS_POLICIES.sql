-- HOW TO RUN THESE COMMANDS?

-- You can copy and paste the entire script below into your SQL client (such as psql, Supabase SQL editor, or pgAdmin) and run it all at once.
-- All statements are independent and safe to run together.
-- If you prefer, you can also run each command one by one, but it's not necessary.

-- Fix RLS policies for orders table to resolve 406 errors
-- This ensures users can only access their own orders

-- 1. Check if RLS is enabled on orders table (shows current RLS status)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'orders';

-- 2. Enable RLS on orders table if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

-- 4. Create RLS policies for orders table
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- 5. Enable RLS on order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies for order_items if they exist
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;

-- 7. Create RLS policies for order_items table
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- 8. Enable RLS on order_status_history table
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- 9. Drop existing policies for order_status_history if they exist
DROP POLICY IF EXISTS "Users can view their own order status history" ON order_status_history;
DROP POLICY IF EXISTS "Users can insert their own order status history" ON order_status_history;

-- 10. Create RLS policies for order_status_history table
CREATE POLICY "Users can view their own order status history" ON order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order status history" ON order_status_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- 11. Grant necessary permissions
    GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;
    GRANT SELECT, INSERT ON order_items TO authenticated;
    GRANT SELECT, INSERT ON order_status_history TO authenticated;

-- 12. Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items', 'order_status_history')
ORDER BY tablename, policyname;
