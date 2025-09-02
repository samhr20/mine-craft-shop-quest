import ProductCard from "./ProductCard";
import diamondSword from "@/assets/diamond-sword.png";
import goldenPickaxe from "@/assets/golden-pickaxe.png";
import creeperPlush from "@/assets/creeper-plush.jpg";

const ProductGrid = () => {
  const products = [
    {
      id: "1",
      name: "Diamond Sword",
      price: 29.99,
      originalPrice: 39.99,
      image: diamondSword,
      category: "Weapons",
      rating: 4.8,
      rarity: "legendary" as const,
      isNew: true,
    },
    {
      id: "2", 
      name: "Golden Pickaxe",
      price: 24.99,
      image: goldenPickaxe,
      category: "Tools",
      rating: 4.6,
      rarity: "epic" as const,
    },
    {
      id: "3",
      name: "Creeper Plush Toy",
      price: 19.99,
      originalPrice: 24.99,
      image: creeperPlush,
      category: "Merchandise",
      rating: 4.9,
      rarity: "rare" as const,
    },
    {
      id: "4",
      name: "Enchanted Bow",
      price: 34.99,
      image: diamondSword, // placeholder
      category: "Weapons",
      rating: 4.7,
      rarity: "legendary" as const,
    },
    {
      id: "5",
      name: "Redstone Block Set",
      price: 15.99,
      image: goldenPickaxe, // placeholder
      category: "Blocks",
      rating: 4.4,
      rarity: "common" as const,
    },
    {
      id: "6",
      name: "Minecraft Hoodie",
      price: 49.99,
      originalPrice: 59.99,
      image: creeperPlush, // placeholder
      category: "Merchandise",
      rating: 4.5,
      rarity: "rare" as const,
      isNew: true,
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-minecraft">
            Featured Products
          </h2>
          <p className="text-xl text-muted-foreground font-minecraft">
            Discover the best items for your Minecraft adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-grass-gradient text-primary-foreground px-8 py-3 block-shadow hover:shadow-block-hover transition-all font-minecraft font-bold">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;