import { Button } from "@/components/ui/button";
import { Pickaxe, Sword, ShoppingBag } from "lucide-react";
import heroBanner from "@/assets/minecraft-hero-banner.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-grass-gradient">
      {/* Background Image */}
      <div 
        className="absolute inset-0 pixelated bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBanner})` }}
      ></div>
      
      {/* Floating blocks animation - Enhanced */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-8 h-8 bg-minecraft-gold absolute top-20 left-10 animate-block-bounce float" style={{ animationDelay: '0s' }}></div>
        <div className="w-6 h-6 bg-minecraft-diamond absolute top-32 right-20 animate-block-bounce float-delayed glow" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-10 h-10 bg-minecraft-stone absolute bottom-20 left-20 animate-block-bounce float" style={{ animationDelay: '1s' }}></div>
        <div className="w-4 h-4 bg-minecraft-redstone absolute top-40 left-1/2 animate-block-bounce float-delayed" style={{ animationDelay: '1.5s' }}></div>
        <div className="w-6 h-6 bg-minecraft-grass absolute bottom-40 right-16 animate-block-bounce float" style={{ animationDelay: '2s' }}></div>
        <div className="w-5 h-5 bg-minecraft-dirt absolute top-60 right-1/3 animate-block-bounce float-delayed" style={{ animationDelay: '2.5s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 font-minecraft animate-fade-in">
          Craft Your
          <span className="block text-minecraft-diamond animate-scale-in stagger-2">Adventure</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 font-minecraft animate-slide-up stagger-3">
          Discover premium Minecraft items, blocks, and merchandise
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in stagger-4">
          <Button variant="diamond" size="lg" className="text-lg px-8">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shop Now
          </Button>
          <Button variant="gold" size="lg" className="text-lg px-8">
            <Pickaxe className="w-5 h-5 mr-2" />
            Explore Tools
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-12 max-w-md mx-auto">
          <div className="text-center animate-rotate-in stagger-5">
            <div className="text-3xl font-bold text-minecraft-gold font-minecraft">1000+</div>
            <div className="text-primary-foreground/80 font-minecraft">Items</div>
          </div>
          <div className="text-center animate-rotate-in stagger-6">
            <div className="text-3xl font-bold text-minecraft-diamond font-minecraft glow">50K+</div>
            <div className="text-primary-foreground/80 font-minecraft">Players</div>
          </div>
          <div className="text-center animate-rotate-in" style={{ animationDelay: '0.7s' }}>
            <div className="text-3xl font-bold text-minecraft-redstone font-minecraft">24/7</div>
            <div className="text-primary-foreground/80 font-minecraft">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;