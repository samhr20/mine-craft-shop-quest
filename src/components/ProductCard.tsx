import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  isNew?: boolean;
}

const rarityColors = {
  common: "bg-muted text-muted-foreground",
  rare: "bg-minecraft-diamond text-primary-foreground",
  epic: "bg-purple-600 text-primary-foreground",
  legendary: "bg-minecraft-gold text-primary-foreground",
};

const rarityLabels = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  rating,
  rarity,
  isNew,
}: ProductCardProps) => {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    addItem({
      name,
      price,
      image,
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        name,
        price,
        image,
        category,
        rarity,
      });
    }
  };

  return (
    <div className="bg-card border-2 border-border block-shadow hover:shadow-block-hover transition-all duration-200 p-3 sm:p-4 group card-hover rounded-xl relative overflow-hidden">
      {/* Decorative Glow Border */}
      <div
        className={`absolute inset-0 pointer-events-none rounded-xl z-0 transition-all duration-300 ${
          rarity === "legendary"
            ? "ring-4 ring-minecraft-gold/40"
            : rarity === "epic"
            ? "ring-4 ring-purple-500/30"
            : rarity === "rare"
            ? "ring-4 ring-minecraft-diamond/30"
            : ""
        } group-hover:ring-8 group-hover:ring-opacity-60`}
        aria-hidden="true"
      ></div>
      {/* Image Container */}
      <Link to={`/product/${id}`} className="block relative z-10">
        <div className="relative mb-3 sm:mb-4 bg-muted/20 p-2 sm:p-3 md:p-4 aspect-square flex items-center justify-center overflow-hidden rounded-lg shadow-inner group-hover:bg-minecraft-grass/10 transition-all duration-200">
          <img
            src={image}
            alt={name}
            className="pixelated max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-200 drop-shadow-lg"
            draggable={false}
          />
          {isNew && (
            <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-minecraft-redstone text-primary-foreground pulse-slow text-xs shadow-md border border-white/20">
              NEW
            </Badge>
          )}
          <Badge
            className={`absolute top-1 right-1 sm:top-2 sm:right-2 ${rarityColors[rarity]} capitalize glow text-xs shadow-md border border-white/20`}
            title={rarityLabels[rarity]}
          >
            {rarityLabels[rarity]}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="space-y-2 sm:space-y-3 relative z-10">
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground font-minecraft uppercase tracking-wide mb-1">
            {category}
          </p>
          <Link to={`/product/${id}`}>
            <h3 className="font-bold text-base sm:text-lg md:text-xl font-minecraft line-clamp-2 hover:text-minecraft-grass transition-colors cursor-pointer drop-shadow-sm">
              {name}
            </h3>
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                i < Math.floor(rating)
                  ? "fill-minecraft-gold text-minecraft-gold drop-shadow"
                  : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="text-xs sm:text-sm text-muted-foreground font-minecraft ml-1">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-minecraft-gold font-minecraft drop-shadow">
            ₹{price}
          </span>
          {originalPrice && (
            <span className="text-base sm:text-lg md:text-xl text-muted-foreground line-through font-minecraft">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          {/* Wishlist Button */}
          <Button
            variant={isInWishlist(id) ? "destructive" : "outline"}
            className={`flex-1 text-xs sm:text-sm py-2 flex items-center justify-center font-minecraft transition-all duration-200 ${
              isInWishlist(id)
                ? "border-minecraft-redstone bg-minecraft-redstone/10 text-minecraft-redstone"
                : ""
            }`}
            onClick={handleWishlistToggle}
            aria-label={
              isInWishlist(id) ? "Remove from Wishlist" : "Add to Wishlist"
            }
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-all duration-200 ${
                isInWishlist(id)
                  ? "fill-minecraft-redstone text-minecraft-redstone"
                  : "text-muted-foreground"
              }`}
            />
            <span className="hidden sm:inline">
              {isInWishlist(id) ? "Remove from Wishlist" : "Add to Wishlist"}
            </span>
            <span className="sm:hidden">
              {isInWishlist(id) ? "Remove" : "Wishlist"}
            </span>
          </Button>

          {/* Add to Cart Button */}
          <Button
            variant="grass"
            className="flex-1 text-xs sm:text-sm py-2 flex items-center justify-center font-minecraft shadow-md hover:scale-105 transition-all duration-200"
            onClick={handleAddToCart}
            aria-label="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;