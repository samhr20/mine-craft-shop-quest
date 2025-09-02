import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Share2, Star, ArrowLeft, Plus, Minus } from "lucide-react";
import diamondSword from "@/assets/diamond-sword.png";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock product data - in real app this would come from API
  const product = {
    id: "1",
    name: "Diamond Sword",
    price: 29.99,
    originalPrice: 39.99,
    images: [diamondSword, diamondSword, diamondSword],
    category: "Weapons",
    rating: 4.8,
    reviews: 127,
    rarity: "legendary",
    isNew: true,
    stock: 15,
    description: "The ultimate weapon for any Minecraft warrior. This legendary Diamond Sword deals massive damage and has incredible durability. Crafted with the finest diamonds and enchanted with powerful magic.",
    features: [
      "High damage output",
      "Excellent durability", 
      "Enchantable",
      "Rare drop chance",
      "Premium materials"
    ],
    specifications: {
      "Attack Damage": "7 hearts",
      "Durability": "1561 uses",
      "Enchantability": "10",
      "Material": "Diamond",
      "Rarity": "Legendary"
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
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4 animate-fade-in">
              <div className="aspect-square bg-muted/20 p-8 border-2 border-border block-shadow">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="pixelated w-full h-full object-contain hover:scale-110 transition-transform duration-300"
                />
                {product.isNew && (
                  <Badge className="absolute top-4 left-4 bg-minecraft-redstone text-primary-foreground animate-pulse">
                    NEW
                  </Badge>
                )}
              </div>
              
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
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
                      alt={`${product.name} ${index + 1}`}
                      className="pixelated w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${rarityColors[product.rarity as keyof typeof rarityColors]} capitalize`}>
                    {product.rarity}
                  </Badge>
                  <span className="text-sm text-muted-foreground font-minecraft uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-foreground font-minecraft mb-4">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-minecraft-gold text-minecraft-gold' : 'text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground font-minecraft">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-minecraft-gold font-minecraft">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through font-minecraft">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge className="bg-minecraft-redstone text-primary-foreground">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </Badge>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-minecraft-grass' : product.stock > 0 ? 'bg-minecraft-gold' : 'bg-minecraft-redstone'}`}></div>
                <span className="font-minecraft">
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground font-minecraft leading-relaxed">
                {product.description}
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
                      disabled={quantity >= product.stock}
                      className="h-10 w-10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="grass" size="lg" className="flex-1">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant={isWishlisted ? "gold" : "outline"}
                    size="lg"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                    Wishlist
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold font-minecraft">Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
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
                  {Object.entries(product.specifications).map(([key, value], index) => (
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