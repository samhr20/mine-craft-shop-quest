import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/use-supabase";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePageSEO } from "@/hooks/useSEO";
import { getProductImage } from "@/lib/image-utils";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Set SEO for products page
  usePageSEO('products');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Get category and search from URL query parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');
    
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  // Transform Supabase data to match ProductCard props
  const transformedProducts = useMemo(() => {
    return products.map((product, index) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: undefined, // No original price in database
      image: getProductImage(product.image_url, product.name),
      category: product.category,
      rating: 4.5 + (index * 0.1), // Generate rating based on index
      rarity: (product.rarity as "common" | "rare" | "epic" | "legendary") || (() => {
        // Fallback: Assign rarity based on price if not set in database
        if (product.price >= 250) return "legendary" as const;
        if (product.price >= 150) return "epic" as const;
        if (product.price >= 50) return "rare" as const;
        return "common" as const;
      })(),
      isNew: index === 0, // Mark first product as new
    }));
  }, [products]);

  // Get unique categories from products
  const availableCategories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return ["all", ...uniqueCategories];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = transformedProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [transformedProducts, searchTerm, selectedCategory, sortBy]);

  // Loading state
  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="bg-grass-gradient py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-primary-foreground mb-4 font-minecraft">
                All Products
              </h1>
              <p className="text-xl text-primary-foreground/90 font-minecraft">
                Loading amazing items for your Minecraft adventure...
              </p>
            </div>
          </div>
        </section>
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (productsError || categoriesError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="bg-grass-gradient py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-primary-foreground mb-4 font-minecraft">
                All Products
              </h1>
              <p className="text-xl text-primary-foreground/90 font-minecraft">
                Error loading products: {productsError || categoriesError}
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

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
              {availableCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "grass" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    // Update URL with category filter
                    if (category === "all") {
                      setSearchParams({});
                    } else {
                      setSearchParams({ category });
                    }
                  }}
                  className="animate-scale-in"
                  style={{ animationDelay: `${availableCategories.indexOf(category) * 0.1}s` }}
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