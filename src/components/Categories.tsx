import { Pickaxe, Sword, Shirt, Gem } from "lucide-react";
import { useCategories } from "@/hooks/use-supabase";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";

const categoryIconMap = [
  { keywords: ["weapon", "sword", "bow"], icon: Sword },
  { keywords: ["tool", "pickaxe", "shovel"], icon: Pickaxe },
  { keywords: ["block", "stone", "dirt"], icon: Gem },
  { keywords: ["merchandise", "plush", "toy"], icon: Shirt },
];

const categoryColorMap = [
  { keywords: ["weapon"], color: "from-minecraft-redstone to-minecraft-redstone/80" },
  { keywords: ["tool"], color: "from-minecraft-gold to-minecraft-gold/80" },
  { keywords: ["block"], color: "from-minecraft-diamond to-minecraft-diamond/80" },
  { keywords: ["merchandise", "decoration"], color: "from-minecraft-grass to-minecraft-grass/80" },
];

function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase();
  for (const { keywords, icon } of categoryIconMap) {
    if (keywords.some((k) => name.includes(k))) {
      return icon;
    }
  }
  return Gem;
}

function getCategoryColor(categoryName: string) {
  const name = categoryName.toLowerCase();
  for (const { keywords, color } of categoryColorMap) {
    if (keywords.some((k) => name.includes(k))) {
      return color;
    }
  }
  return "from-minecraft-stone to-minecraft-stone/80";
}

const Categories = () => {
  const { categories, loading, error } = useCategories();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-background/80 to-muted/60 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex items-center">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground mb-3 sm:mb-4 font-minecraft tracking-tight drop-shadow-lg">
              Shop by Category
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-minecraft mb-6 sm:mb-8">
              Loading categories...
            </p>
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-background/80 to-muted/60 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex items-center">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground mb-3 sm:mb-4 font-minecraft tracking-tight drop-shadow-lg">
              Shop by Category
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-red-500 font-minecraft">
              Error loading categories: {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-br from-background/80 to-muted/60 overflow-hidden">
      {/* Subtle animated background shapes */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-60 sm:w-80 md:w-96 h-60 sm:h-80 md:h-96 bg-minecraft-diamond/10 rounded-full blur-2xl md:blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-minecraft-gold/10 rounded-full blur-xl md:blur-2xl animate-pulse-slower" />
      </div>
      <div className="container mx-auto px-2 sm:px-4 relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-2 sm:mb-3 font-minecraft tracking-tight drop-shadow-lg">
            Shop by Category
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground font-minecraft px-2 sm:px-4 max-w-xl sm:max-w-2xl mx-auto">
            Discover the perfect items for your Minecraft world. Browse by category and level up your experience.
          </p>
        </div>

        {categories.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              xs:grid-cols-2
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-4
              gap-4
              sm:gap-6
              md:gap-8
            "
          >
            {categories.map((category, idx) => {
              const Icon = getCategoryIcon(category.name);
              const gradient = getCategoryColor(category.name);

              return (
                <div
                  key={category.id}
                  className="group cursor-pointer focus:outline-none"
                  onClick={() => handleCategoryClick(category.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCategoryClick(category.name);
                    }
                  }}
                >
                  <div
                    className={`
                      relative flex flex-col items-center justify-center
                      rounded-2xl sm:rounded-3xl
                      p-5 sm:p-7 md:p-8 lg:p-10
                      shadow-xl
                      bg-gradient-to-br ${gradient}
                      transition-all duration-200
                      group-hover:scale-[1.03] group-hover:shadow-2xl
                      group-focus:scale-[1.03] group-focus:shadow-2xl
                      border border-white/10
                      before:absolute before:inset-0 before:rounded-2xl sm:before:rounded-3xl before:bg-white/5 before:opacity-0 group-hover:before:opacity-100 group-focus:before:opacity-100 before:transition-opacity before:duration-200
                      overflow-hidden
                      w-full
                      min-h-[220px] sm:min-h-[240px] md:min-h-[260px] lg:min-h-[280px]
                    `}
                  >
                    <div className="flex items-center justify-center mb-3 sm:mb-5">
                      <span className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg p-3 sm:p-4 transition-all duration-200 group-hover:bg-white/20 group-focus:bg-white/20">
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-extrabold mb-1 sm:mb-2 font-minecraft text-white drop-shadow-sm tracking-wide text-center">
                      {category.name}
                    </h3>
                    <p className="text-white/80 font-minecraft text-xs sm:text-base md:text-lg min-h-[2.2em] sm:min-h-[2.5em] text-center">
                      {category.description || `${category.name} items`}
                    </p>
                    <span className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 text-white/70 text-xs font-minecraft bg-black/30 px-2 py-1 rounded-lg shadow">
                      View Items &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 sm:py-16">
            <p className="text-lg sm:text-2xl text-muted-foreground font-minecraft">
              No categories found. Check back soon!
            </p>
          </div>
        )}
      </div>
      {/* Animations */}
      <style>
        {`
        @keyframes category-in {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(60px) rotateX(10deg);
            filter: blur(6px) brightness(0.7);
          }
          60% {
            opacity: 1;
            transform: scale(1.04) translateY(-8px) rotateX(-2deg);
            filter: blur(0.5px) brightness(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotateX(0deg);
            filter: blur(0) brightness(1);
          }
        }
        .animate-category-in.animated {
          opacity: 1 !important;
          animation: category-in 1.1s cubic-bezier(.22,1,.36,1) both;
        }
        `}
      </style>
    </section>
  );
};

export default Categories;