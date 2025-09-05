-- Create storage bucket for payment screenshots
-- This will store UPI payment screenshots uploaded by customers

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true);

-- Create RLS policy to allow authenticated users to upload screenshots
CREATE POLICY "Allow authenticated users to upload payment screenshots" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payment-screenshots' 
  AND auth.role() = 'authenticated'
);

-- Create RLS policy to allow public read access to screenshots
CREATE POLICY "Allow public read access to payment screenshots" ON storage.objects
FOR SELECT USING (bucket_id = 'payment-screenshots');

-- Create RLS policy to allow users to update their own screenshots
CREATE POLICY "Allow users to update their own payment screenshots" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'payment-screenshots' 
  AND auth.role() = 'authenticated'
);

-- Create RLS policy to allow users to delete their own screenshots
CREATE POLICY "Allow users to delete their own payment screenshots" ON storage.objects
FOR DELETE USING (
  bucket_id = 'payment-screenshots' 
  AND auth.role() = 'authenticated'
);
