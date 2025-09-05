-- Add UPI payment specific fields to orders table
-- This will allow us to store transaction ID and screenshot separately

-- Add UPI payment fields
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS upi_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT;

-- Add comments for clarity
COMMENT ON COLUMN orders.upi_transaction_id IS 'UPI transaction ID for payment verification';
COMMENT ON COLUMN orders.payment_screenshot_url IS 'URL to payment screenshot uploaded by customer';

-- Create index for faster UPI transaction lookups
CREATE INDEX IF NOT EXISTS idx_orders_upi_transaction_id ON orders(upi_transaction_id);

-- Update existing orders with UPI payment details from notes field
-- This extracts transaction ID from the notes field
UPDATE orders 
SET upi_transaction_id = (
  SELECT regexp_replace(
    regexp_replace(notes, '.*Transaction ID: ([A-Z0-9]+).*', '\1'),
    '.*Transaction ID: ([A-Z0-9]+).*', '\1'
  )
)
WHERE payment_method = 'upi' 
  AND notes LIKE '%Transaction ID:%'
  AND upi_transaction_id IS NULL;

-- Verify the changes
SELECT 
  id,
  order_number,
  payment_method,
  upi_transaction_id,
  payment_screenshot_url,
  notes
FROM orders 
WHERE payment_method = 'upi' 
LIMIT 5;

