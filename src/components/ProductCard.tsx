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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 max-w-sm">
      {/* Image Container */}
      <Link to={`/product/${id}`} className="block relative">
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-3 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            draggable={false}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <Badge className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-sm">
                NEW
              </Badge>
            )}
            <Badge
              className={`text-xs font-semibold px-2 py-1 rounded shadow-sm ${
                rarity === "legendary"
                  ? "bg-yellow-500 text-yellow-900"
                  : rarity === "epic"
                  ? "bg-purple-500 text-white"
                  : rarity === "rare"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {rarityLabels[rarity]}
            </Badge>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Category */}
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {category}
        </div>

        {/* Product Name */}
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer leading-tight">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ₹{price}
          </span>
          {originalPrice && (
            <span className="text-base text-gray-500 dark:text-gray-400 line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          {/* Wishlist Button */}
          <Button
            variant="outline"
            className={`flex-1 text-xs py-2 flex items-center justify-center transition-all duration-200 ${
              isInWishlist(id)
                ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
            onClick={handleWishlistToggle}
            aria-label={
              isInWishlist(id) ? "Remove from Wishlist" : "Add to Wishlist"
            }
          >
            <Heart
              className={`w-3.5 h-3.5 mr-1.5 ${
                isInWishlist(id)
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <span className="hidden sm:inline">
              {isInWishlist(id) ? "Remove" : "Wishlist"}
            </span>
            <span className="sm:hidden">
              {isInWishlist(id) ? "Remove" : "♥"}
            </span>
          </Button>

          {/* Add to Cart Button */}
          <Button
            className="flex-1 text-xs py-2 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            onClick={handleAddToCart}
            aria-label="Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;