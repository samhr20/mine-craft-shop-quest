import { Pickaxe, Sword, Shirt, Gem } from "lucide-react";

const Categories = () => {
  const categories = [
    {
      icon: <Sword className="w-8 h-8" />,
      name: "Weapons",
      count: "150+ items",
      color: "bg-minecraft-redstone",
    },
    {
      icon: <Pickaxe className="w-8 h-8" />,
      name: "Tools",
      count: "200+ items", 
      color: "bg-minecraft-gold",
    },
    {
      icon: <Gem className="w-8 h-8" />,
      name: "Blocks",
      count: "300+ items",
      color: "bg-minecraft-diamond",
    },
    {
      icon: <Shirt className="w-8 h-8" />,
      name: "Merchandise",
      count: "100+ items",
      color: "bg-minecraft-grass",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-minecraft">
            Shop by Category
          </h2>
          <p className="text-xl text-muted-foreground font-minecraft">
            Find exactly what you need for your world
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="group cursor-pointer"
            >
              <div className={`${category.color} text-primary-foreground p-8 text-center block-shadow hover:shadow-block-hover transition-all duration-200 group-hover:brightness-110`}>
                <div className="flex justify-center mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 font-minecraft">
                  {category.name}
                </h3>
                <p className="text-primary-foreground/80 font-minecraft">
                  {category.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;