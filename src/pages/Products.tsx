import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List } from "lucide-react";
import diamondSword from "@/assets/diamond-sword.png";
import goldenPickaxe from "@/assets/golden-pickaxe.png";
import creeperPlush from "@/assets/creeper-plush.jpg";

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const allProducts = [
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
      image: diamondSword,
      category: "Weapons",
      rating: 4.7,
      rarity: "legendary" as const,
    },
    {
      id: "5",
      name: "Redstone Block Set",
      price: 15.99,
      image: goldenPickaxe,
      category: "Blocks",
      rating: 4.4,
      rarity: "common" as const,
    },
    {
      id: "6",
      name: "Minecraft Hoodie",
      price: 49.99,
      originalPrice: 59.99,
      image: creeperPlush,
      category: "Merchandise",
      rating: 4.5,
      rarity: "rare" as const,
      isNew: true,
    },
    {
      id: "7",
      name: "Iron Armor Set",
      price: 44.99,
      image: diamondSword,
      category: "Armor",
      rating: 4.3,
      rarity: "epic" as const,
    },
    {
      id: "8",
      name: "TNT Block",
      price: 12.99,
      image: goldenPickaxe,
      category: "Blocks",
      rating: 4.2,
      rarity: "common" as const,
    },
  ];

  const categories = ["all", "Weapons", "Tools", "Blocks", "Merchandise", "Armor"];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header with Animation */}
      <section className="bg-grass-gradient py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-6 h-6 bg-minecraft-gold absolute top-10 right-10 animate-block-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 bg-minecraft-diamond absolute top-20 left-20 animate-block-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-8 h-8 bg-minecraft-redstone absolute bottom-10 right-1/4 animate-block-bounce" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-bold text-primary-foreground mb-4 font-minecraft">
              All Products
            </h1>
            <p className="text-xl text-primary-foreground/90 font-minecraft">
              Discover our complete collection of Minecraft items
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-card border-b-2 border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-minecraft"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "grass" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="animate-scale-in"
                  style={{ animationDelay: `${categories.indexOf(category) * 0.1}s` }}
                >
                  {category === "all" ? "All" : category}
                </Button>
              ))}
            </div>

            {/* View Mode and Sort */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "grass" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "grass" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-border bg-background px-3 py-2 font-minecraft"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className={`${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
          }`}>
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-foreground mb-2 font-minecraft">
                No products found
              </h3>
              <p className="text-muted-foreground font-minecraft">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;