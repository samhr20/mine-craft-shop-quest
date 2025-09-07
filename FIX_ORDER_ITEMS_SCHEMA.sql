-- Fix order_items table schema to match the application code
-- This script addresses the "Could not find the 'price' column" error

-- First, let's check the current structure of order_items table
-- (You can run this to see what columns currently exist)
-- \d order_items;

-- Add missing columns to order_items table
-- The application expects these columns based on the TypeScript interfaces

-- Add price column (this is what the error is complaining about)
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Add product_price column (used by AdminOrders component)
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS product_price DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Add total_price column (used by AdminOrders component)
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Add product_image column if it doesn't exist (from previous migration)
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS product_image TEXT;

-- Add comments for clarity
COMMENT ON COLUMN order_items.price IS 'Price per unit of the product';
COMMENT ON COLUMN order_items.product_price IS 'Price per unit of the product (alias for price)';
COMMENT ON COLUMN order_items.total_price IS 'Total price for this line item (price * quantity)';
COMMENT ON COLUMN order_items.product_image IS 'Product image URL stored when order was created';

-- Update existing records to populate the new columns
-- Set product_price = price for existing records
UPDATE order_items 
SET product_price = price 
WHERE product_price = 0 AND price > 0;

-- Set total_price = price * quantity for existing records
UPDATE order_items 
SET total_price = price * quantity 
WHERE total_price = 0 AND price > 0;

-- If price column is empty but we have other data, try to calculate from total_amount
-- This is a fallback for existing data
UPDATE order_items 
SET price = total_price / quantity 
WHERE price = 0 AND total_price > 0 AND quantity > 0;

UPDATE order_items 
SET product_price = price 
WHERE product_price = 0 AND price > 0;

-- Verify the changes
SELECT 
  id,
  order_id,
  product_id,
  product_name,
  price,
  product_price,
  total_price,
  quantity,
  product_image,
  created_at
FROM order_items 
LIMIT 5;

-- Check if there are any NULL values that need to be addressed
SELECT COUNT(*) as null_price_count 
FROM order_items 
WHERE price IS NULL OR price = 0;

SELECT COUNT(*) as null_product_price_count 
FROM order_items 
WHERE product_price IS NULL OR product_price = 0;

SELECT COUNT(*) as null_total_price_count 
FROM order_items 
WHERE total_price IS NULL OR total_price = 0;
