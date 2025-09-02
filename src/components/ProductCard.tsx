import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";

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

const ProductCard = ({ 
  name, 
  price, 
  originalPrice, 
  image, 
  category, 
  rating, 
  rarity, 
  isNew 
}: ProductCardProps) => {
  return (
    <div className="bg-card border-2 border-border block-shadow hover:shadow-block-hover transition-all duration-200 p-4 group">
      {/* Image Container */}
      <div className="relative mb-4 bg-muted/20 p-4 aspect-square flex items-center justify-center overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="pixelated max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-200"
        />
        {isNew && (
          <Badge className="absolute top-2 left-2 bg-minecraft-redstone text-primary-foreground">
            NEW
          </Badge>
        )}
        <Badge className={`absolute top-2 right-2 ${rarityColors[rarity]} capitalize`}>
          {rarity}
        </Badge>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground font-minecraft uppercase tracking-wide">
            {category}
          </p>
          <h3 className="font-bold text-lg font-minecraft line-clamp-2">
            {name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-minecraft-gold text-minecraft-gold' : 'text-muted-foreground'}`} 
            />
          ))}
          <span className="text-sm text-muted-foreground font-minecraft ml-1">
            ({rating})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-minecraft-gold font-minecraft">
            ${price}
          </span>
          {originalPrice && (
            <span className="text-lg text-muted-foreground line-through font-minecraft">
              ${originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button 
          variant="grass" 
          className="w-full"
          onClick={() => console.log(`Added ${name} to cart`)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;