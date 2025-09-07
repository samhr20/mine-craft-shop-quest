import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/use-supabase";
import LoadingSpinner from "./LoadingSpinner";
import { getProductImage } from "@/lib/image-utils";
import { useNavigate } from "react-router-dom";
import heroBanner from "@/assets/minecraft-hero-banner.jpg"; // Make sure this import exists

const ProductGrid = () => {
  const { products, loading, error } = useProducts();
  const navigate = useNavigate();

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  // Filter and transform only featured products
  const featuredProducts = products.filter(product => product.is_featured === true);
  
  // Transform Supabase data to match ProductCard props (limit to 6 featured products)
  const transformedProducts = featuredProducts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort by newest first
    .slice(0, 6) // Limit to 6 featured products
    .map((product, index) => ({
      id: product.id,
      name: product.name,
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

  if (loading) {
    return (
      <section className="py-16 bg-background relative overflow-hidden">
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-hero-bg-zoom z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(20,24,31,0.7),rgba(20,24,31,0.7)), url(${heroBanner})`,
            filter: "blur(2px) brightness(0.8)",
          }}
          aria-hidden="true"
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl text-white font-bold text-foreground mb-4 font-minecraft">
              Featured Products
            </h2>
            <p className="text-xl text-slate-200/90 font-minecraft">
              Loading amazing items for your Minecraft adventure...
            </p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background relative overflow-hidden">
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-hero-bg-zoom z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(20,24,31,0.7),rgba(20,24,31,0.7)), url(${heroBanner})`,
            filter: "blur(2px) brightness(0.8)",
          }}
          aria-hidden="true"
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">


            <h2 className="text-5xl text-white font-bold text-foreground mb-4 font-minecraft">
              Featured Products
            </h2>
            <p className="text-xl text-slate-200/90  font-minecraft">
              Error loading products: {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-hero-bg-zoom z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(20,24,31,0.7),rgba(20,24,31,0.7)), url(${heroBanner})`,
          filter: "blur(2px) brightness(0.8)",
        }}
        aria-hidden="true"
      ></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white text-foreground mb-4 font-minecraft">
            Featured Products
          </h2>
          <p className="text-xl text-slate-200/90  font-minecraft">
            Discover the best items for your Minecraft adventure
          </p>
        </div>

        {transformedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {transformedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <button 
                className="bg-grass-gradient text-primary-foreground px-8 py-3 block-shadow hover:shadow-block-hover transition-all font-minecraft font-bold hover:scale-105 transform"
                onClick={handleViewAllProducts}
              >
                View All Products
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-xl text-muted-foreground font-minecraft">
              No products found. Check back soon for new items!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;