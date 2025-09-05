-- Add product_image column to order_items table
-- This will store the product image URL for each order item

ALTER TABLE order_items 
ADD COLUMN product_image TEXT;

-- Add a comment to explain the column
COMMENT ON COLUMN order_items.product_image IS 'Product image URL stored when order was created';

-- Update existing order items with placeholder images (optional)
-- You can run this if you want to add default images to existing orders
-- UPDATE order_items 
-- SET product_image = '/images/placeholder-product.png' 
-- WHERE product_image IS NULL;
