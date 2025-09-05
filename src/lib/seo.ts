// SEO Utility Functions for Dynamic Meta Tags and Structured Data

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  structuredData?: any;
}

// Get base URL from environment or use current origin
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
};

export const defaultSEO: SEOData = {
  title: 'MineCraft Store - Premium Minecraft Items & Merchandise',
  description: 'Discover premium Minecraft items, tools, blocks, and merchandise. Shop weapons, pickaxes, plush toys and more with authentic Minecraft designs.',
  keywords: 'minecraft, items, tools, weapons, merchandise, blocks, gaming, ecommerce, shop, buy',
  image: '/og-image.jpg',
  url: getBaseURL(),
  type: 'website'
};

// Update document head with SEO data
export const updateSEO = (seoData: SEOData) => {
  const {
    title,
    description,
    keywords,
    image,
    url,
    type = 'website'
  } = { ...defaultSEO, ...seoData };

  // Update title
  document.title = title;

  // Update or create meta tags
  updateMetaTag('description', description);
  updateMetaTag('keywords', keywords);
  updateMetaTag('author', 'MineCraft Store');

  // Open Graph tags
  updateMetaTag('og:title', title, 'property');
  updateMetaTag('og:description', description, 'property');
  updateMetaTag('og:type', type, 'property');
  updateMetaTag('og:image', image, 'property');
  updateMetaTag('og:url', url, 'property');
  updateMetaTag('og:site_name', 'MineCraft Store', 'property');

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image', 'name');
  updateMetaTag('twitter:title', title, 'name');
  updateMetaTag('twitter:description', description, 'name');
  updateMetaTag('twitter:image', image, 'name');

  // Canonical URL
  updateCanonicalURL(url);

  // Structured Data
  if (seoData.structuredData) {
    updateStructuredData(seoData.structuredData);
  }
};

// Helper function to update meta tags
const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
  if (!content) return;

  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

// Update canonical URL
const updateCanonicalURL = (url: string) => {
  if (!url) return;

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  
  canonical.setAttribute('href', url);
};

// Update structured data (JSON-LD)
const updateStructuredData = (data: any) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// SEO data for different page types
export const pageSEO = {
  home: {
    title: 'MineCraft Store - Premium Minecraft Items & Merchandise',
    description: 'Discover premium Minecraft items, tools, blocks, and merchandise. Shop weapons, pickaxes, plush toys and more with authentic Minecraft designs.',
    keywords: 'minecraft, items, tools, weapons, merchandise, blocks, gaming, ecommerce, shop, buy',
    type: 'website' as const
  },
  
  products: {
    title: 'Minecraft Products - Tools, Weapons & Items | MineCraft Store',
    description: 'Browse our complete collection of Minecraft products including tools, weapons, blocks, and exclusive items. Premium quality with authentic designs.',
    keywords: 'minecraft products, tools, weapons, blocks, items, collection, shop',
    type: 'website' as const
  },
  
  product: (productName: string, productDescription: string, price: number) => ({
    title: `${productName} - Minecraft Item | MineCraft Store`,
    description: `${productDescription} Available at MineCraft Store for ₹${price}. Premium quality Minecraft items with authentic designs.`,
    keywords: `minecraft ${productName.toLowerCase()}, minecraft item, ${productName.toLowerCase()}, minecraft shop`,
    type: 'product' as const
  }),
  
  cart: {
    title: 'Shopping Cart - MineCraft Store',
    description: 'Review your selected Minecraft items in your shopping cart. Secure checkout and fast delivery available.',
    keywords: 'minecraft cart, shopping cart, checkout, minecraft items',
    type: 'website' as const
  },
  
  wishlist: {
    title: 'Wishlist - MineCraft Store',
    description: 'Your saved Minecraft items and favorites. Keep track of items you want to purchase later.',
    keywords: 'minecraft wishlist, saved items, favorites, minecraft',
    type: 'website' as const
  },
  
  about: {
    title: 'About Us - MineCraft Store',
    description: 'Learn about MineCraft Store - your trusted source for premium Minecraft items, tools, and merchandise since 2024.',
    keywords: 'about minecraft store, company, mission, minecraft merchandise',
    type: 'website' as const
  },
  
  contact: {
    title: 'Contact Us - MineCraft Store',
    description: 'Get in touch with MineCraft Store. Customer support, inquiries, and assistance for all your Minecraft shopping needs.',
    keywords: 'contact minecraft store, customer support, help, inquiries',
    type: 'website' as const
  },
  
  login: {
    title: 'Login - MineCraft Store',
    description: 'Sign in to your MineCraft Store account to access your orders, wishlist, and exclusive member benefits.',
    keywords: 'minecraft store login, sign in, account, member',
    type: 'website' as const
  },
  
  register: {
    title: 'Create Account - MineCraft Store',
    description: 'Join MineCraft Store today! Create your account to start shopping for premium Minecraft items and enjoy member benefits.',
    keywords: 'minecraft store register, create account, sign up, join',
    type: 'website' as const
  }
};

// Structured Data Generators
export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MineCraft Store",
    "url": getBaseURL(),
    "logo": `${getBaseURL()}/logo.png`,
    "description": "Premium Minecraft items, tools, and merchandise store",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-MINECRAFT",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://facebook.com/minecraftstore",
      "https://twitter.com/minecraftstore",
      "https://instagram.com/minecraftstore"
    ]
  },
  
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MineCraft Store",
    "url": getBaseURL(),
    "description": "Premium Minecraft items, tools, and merchandise",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${getBaseURL()}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  },
  
  product: (product: any) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image_url,
    "brand": {
      "@type": "Brand",
      "name": "Minecraft"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "INR",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "MineCraft Store"
      }
    },
    "category": product.category,
    "sku": product.id
  }),
  
  breadcrumbList: (items: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${getBaseURL()}${item.url}`
    }))
  })
};
