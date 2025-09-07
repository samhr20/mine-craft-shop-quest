import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Share2, Star, ArrowLeft, Plus, Minus } from "lucide-react";
import { useProducts } from "@/hooks/use-supabase";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getProductImage, getProductImages } from "@/lib/image-utils";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { pageSEO, structuredData, updateSEO } from "@/lib/seo";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const { products, loading, error } = useProducts();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Find the specific product by ID
  const product = products.find(p => p.id === id);

  // Set SEO for product page
  useEffect(() => {
    if (product) {
      const seoData = {
        ...pageSEO.product(product.name, product.description, product.price),
        url: `/product/${product.id}`,
        image: getProductImage(product.image_url, product.name),
        structuredData: structuredData.product(product)
      };
      updateSEO(seoData);
    }
  }, [product]);

  // If product not found, redirect to products page
  useEffect(() => {
    if (!loading && !product && id) {
      navigate('/products');
    }
  }, [loading, product, id, navigate]);

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addItem({
          name: product.name,
          price: product.price,
          image: getProductImage(product.image_url, product.name),
        }, quantity);
        
        // Show success message
        setShowAddedMessage(true);
        setTimeout(() => setShowAddedMessage(false), 3000);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist({
          name: product.name,
          price: product.price,
          image: getProductImage(product.image_url, product.name),
          category: product.category,
          rarity: product.rarity as "common" | "rare" | "epic" | "legendary",
        });
      }
    }
  };

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Check out this amazing ${product.name} for ₹${product.price}!`,
      url: window.location.href,
    };

    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Fallback to copy link if share fails
          copyToClipboard();
        }
      }
    } else {
      // Fallback to copy link
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Show success message
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    }
  };

  const shareToSocial = (platform: string) => {
    if (!product) return;

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(product.name);
    const text = encodeURIComponent(`Check out this amazing ${product.name} for ₹${product.price}!`);

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4 font-minecraft">
              Error loading product
            </h1>
            <p className="text-muted-foreground font-minecraft">
              {error}
            </p>
            <Button onClick={() => navigate('/products')} className="mt-4">
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4 font-minecraft">
              Product not found
            </h1>
            <p className="text-muted-foreground font-minecraft">
              The product you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/products')} className="mt-4">
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Transform product data for display
  const transformedProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: undefined, // No original price in database
    images: getProductImages(product.image_url, product.name), // Use the image utility
    category: product.category,
    rating: 4.5, // Default rating
    reviews: 127, // Default reviews
    rarity: product.rarity || (() => {
      // Fallback: Assign rarity based on price if not set in database
      if (product.price >= 250) return "legendary";
      if (product.price >= 150) return "epic";
      if (product.price >= 50) return "rare";
      return "common";
    })(),
    isNew: true, // Mark as new for now
    stock: 15, // Default stock
    description: product.description || "A fantastic Minecraft item for your collection!",
    features: product.description ? product.description.split('.').filter(f => f.trim()).map(f => f.trim() + '.') : [
      "High quality materials",
      "Authentic Minecraft design", 
      "Durable construction",
      "Perfect for collectors",
      "Great gift idea"
    ],
    specifications: {
      "Category": product.category,
      "Price": `₹${product.price}`,
      "Material": "Premium",
      "Rarity": product.rarity ? product.rarity.charAt(0).toUpperCase() + product.rarity.slice(1) : (() => {
        if (product.price >= 250) return "Legendary";
        if (product.price >= 150) return "Epic";
        if (product.price >= 50) return "Rare";
        return "Common";
      })(),
      "Availability": "In Stock"
    }
  };

  const rarityColors = {
    common: "bg-muted text-muted-foreground",
    rare: "bg-minecraft-diamond text-primary-foreground",
    epic: "bg-purple-600 text-primary-foreground", 
    legendary: "bg-minecraft-gold text-primary-foreground",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <section className="py-4 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-minecraft animate-fade-in">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/products" className="text-muted-foreground hover:text-foreground">Products</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{transformedProduct.name}</span>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4 animate-fade-in">
              <div className="aspect-square bg-muted/20 p-8 border-2 border-border block-shadow relative">
                <img
                  src={transformedProduct.images[selectedImage]}
                  alt={transformedProduct.name}
                  className="pixelated w-full h-full object-contain hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                {transformedProduct.isNew && (
                  <Badge className="absolute top-4 left-4 bg-minecraft-redstone text-primary-foreground animate-pulse">
                    NEW
                  </Badge>
                )}
              </div>
              
              {transformedProduct.images.length > 1 && (
              <div className="flex space-x-2">
                  {transformedProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 border-2 ${
                      selectedImage === index ? 'border-minecraft-grass' : 'border-border'
                    } p-2 bg-muted/20 hover:border-minecraft-grass transition-colors animate-scale-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <img
                      src={image}
                        alt={`${transformedProduct.name} ${index + 1}`}
                      className="pixelated w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                    />
                  </button>
                ))}
              </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${rarityColors[transformedProduct.rarity as keyof typeof rarityColors]} capitalize`}>
                    {transformedProduct.rarity}
                  </Badge>
                  <span className="text-sm text-muted-foreground font-minecraft uppercase tracking-wide">
                    {transformedProduct.category}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-foreground font-minecraft mb-4">
                  {transformedProduct.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(transformedProduct.rating) ? 'fill-minecraft-gold text-minecraft-gold' : 'text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground font-minecraft">
                    {transformedProduct.rating} ({transformedProduct.reviews} reviews)
                  </span>

                </div>

              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-minecraft-gold font-minecraft">
                  ₹{transformedProduct.price}
                </span>
                {transformedProduct.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through font-minecraft">
                    ₹{transformedProduct.originalPrice}
                  </span>
                )}
                {transformedProduct.originalPrice && (
                  <Badge className="bg-minecraft-redstone text-primary-foreground">
                    Save ₹{(transformedProduct.originalPrice - transformedProduct.price).toFixed(2)}
                  </Badge>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${transformedProduct.stock > 10 ? 'bg-minecraft-grass' : transformedProduct.stock > 0 ? 'bg-minecraft-gold' : 'bg-minecraft-redstone'}`}></div>
                <span className="font-minecraft">
                  {transformedProduct.stock > 10 ? 'In Stock' : transformedProduct.stock > 0 ? `Only ${transformedProduct.stock} left!` : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground font-minecraft leading-relaxed">
                {transformedProduct.description}
              </p>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-minecraft">Quantity:</span>
                  <div className="flex items-center border-2 border-border">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-10 w-10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 font-minecraft">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= transformedProduct.stock}
                      className="h-10 w-10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="grass" size="lg" className="flex-1" onClick={handleAddToCart}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart ({quantity})
                  </Button>
                  <Button
                    variant={product && isInWishlist(product.id) ? "gold" : "outline"}
                    size="lg"
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${product && isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    {product && isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setShowShareOptions(true)}>
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Success Message */}
                {showAddedMessage && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="font-minecraft text-green-800">
                        {quantity} {quantity === 1 ? 'item' : 'items'} added to cart successfully!
                      </span>
                    </div>
                  </div>
                )}

                {/* Share Options Modal */}
                {showShareOptions && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-minecraft font-bold text-gray-800">Share Product</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowShareOptions(false)}
                          className="font-minecraft"
                        >
                          ✕
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="font-minecraft text-gray-600 text-sm">
                          Share "{product?.name}" with your friends!
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            onClick={() => shareToSocial('whatsapp')}
                            className="font-minecraft flex items-center gap-2"
                          >
                            <span className="text-green-600">📱</span>
                            WhatsApp
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => shareToSocial('telegram')}
                            className="font-minecraft flex items-center gap-2"
                          >
                            <span className="text-blue-600">✈️</span>
                            Telegram
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => shareToSocial('facebook')}
                            className="font-minecraft flex items-center gap-2"
                          >
                            <span className="text-blue-600">📘</span>
                            Facebook
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => shareToSocial('twitter')}
                            className="font-minecraft flex items-center gap-2"
                          >
                            <span className="text-blue-400">🐦</span>
                            Twitter
                          </Button>
                        </div>
                        
                        <div className="pt-3 border-t space-y-2">
                          {/* Native Share for mobile devices */}
                          {navigator.share && (
                            <Button
                              variant="default"
                              onClick={handleShare}
                              className="w-full font-minecraft flex items-center gap-2 bg-minecraft-diamond hover:bg-minecraft-diamond/90"
                            >
                              <Share2 className="w-4 h-4" />
                              Share (Native)
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            onClick={copyToClipboard}
                            className="w-full font-minecraft flex items-center gap-2"
                          >
                            <span>📋</span>
                            Copy Link
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold font-minecraft">Features:</h3>
                <ul className="space-y-2">
                  {transformedProduct.features.map((feature, index) => (
                    <li 
                      key={index} 
                      className="flex items-center space-x-2 animate-fade-in"
                      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                    >
                      <div className="w-2 h-2 bg-minecraft-grass"></div>
                      <span className="font-minecraft">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold font-minecraft">Specifications:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(transformedProduct.specifications).map(([key, value], index) => (
                    <div 
                      key={key} 
                      className="flex justify-between p-3 bg-muted/20 border border-border animate-fade-in"
                      style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                    >
                      <span className="font-minecraft text-muted-foreground">{key}:</span>
                      <span className="font-minecraft font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;