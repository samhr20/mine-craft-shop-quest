-- Clean up all demo orders and related data
-- WARNING: This will delete ALL orders and related data!

-- First, let's see how many orders we have
SELECT COUNT(*) as total_orders FROM orders;

-- Delete order status history first (due to foreign key constraints)
DELETE FROM order_status_history;

-- Delete order items
DELETE FROM order_items;

-- Delete all orders
DELETE FROM orders;

-- Verify cleanup
SELECT COUNT(*) as remaining_orders FROM orders;
SELECT COUNT(*) as remaining_order_items FROM order_items;
SELECT COUNT(*) as remaining_status_history FROM order_status_history;

-- Optional: Reset order number sequence (if you want to start from 1 again)
-- This will make the next order start from 20250904-0001
-- Note: This only works if you have a sequence for order numbers

