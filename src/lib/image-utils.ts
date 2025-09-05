// Image utility functions for handling product images

// Map of product names to local asset imports
const productImageMap: Record<string, string> = {
  'diamond-sword': '/src/assets/diamond-sword.png',
  'golden-pickaxe': '/src/assets/golden-pickaxe.png',
  'creeper-plush': '/src/assets/creeper-plush.jpg',
};

// Get the correct image path for a product
export const getProductImage = (imageUrl: string, productName: string): string => {
  // If imageUrl is a base64 data URL, use it directly
  if (imageUrl.startsWith('data:image/')) {
    return imageUrl;
  }
  
  // If imageUrl is a valid URL, use it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If imageUrl is a local path, try to map it
  if (imageUrl.startsWith('/')) {
    const cleanPath = imageUrl.replace('/', '');
    if (productImageMap[cleanPath]) {
      return productImageMap[cleanPath];
    }
  }
  
  // Try to find a matching image by product name
  const cleanName = productName.toLowerCase().replace(/\s+/g, '-');
  for (const [key, path] of Object.entries(productImageMap)) {
    if (cleanName.includes(key)) {
      return path;
    }
  }
  
  // Fallback to placeholder
  return '/placeholder.svg';
};

// Get multiple images for a product (for gallery view)
export const getProductImages = (imageUrl: string, productName: string): string[] => {
  const mainImage = getProductImage(imageUrl, productName);
  return [mainImage]; // For now, just return the main image
};
