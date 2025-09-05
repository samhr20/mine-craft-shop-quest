import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pickaxe, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBanner from "@/assets/minecraft-hero-banner.jpg";

// Enhanced animation hook: allows custom animation class and delay
function useAnimateOnView(className = "animate-hero-fancy-in", delay = 0) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.classList.remove(className, "animated");

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            node.classList.add(className, "animated");
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [className, delay]);

  return ref;
}

const Hero = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/products');
  };

  const handleExploreTools = () => {
    navigate('/products?category=Tools');
  };

  // Animation refs with staggered delays for more dynamic entrance
  const titleRef = useAnimateOnView("animate-hero-fancy-in", 0);
  const subtitleRef = useAnimateOnView("animate-hero-fancy-in", 120);
  const buttonsRef = useAnimateOnView("animate-hero-fancy-in", 240);
  const statsRef = useAnimateOnView("animate-hero-fancy-in", 360);

  return (
    <section className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526]">
      {/* Responsive Glassy Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-hero-bg-zoom"
        style={{
          backgroundImage: `linear-gradient(rgba(20,24,31,0.7),rgba(20,24,31,0.7)), url(${heroBanner})`,
          filter: "blur(2px) brightness(0.8)",
        }}
      ></div>

      {/* Subtle Animated Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-tr from-minecraft-diamond/10 via-minecraft-gold/10 to-minecraft-redstone/10 animate-gradient-move" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16 md:py-20">
        <h1
          ref={titleRef}
          className="opacity-0 will-change-transform text-3xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 sm:mb-4 md:mb-6 drop-shadow-lg leading-tight"
        >
          <span className="block">Level Up Your</span>
          <span className="block bg-gradient-to-r from-minecraft-diamond via-minecraft-gold to-minecraft-redstone bg-clip-text text-transparent animate-gradient-text">
            Minecraft Experience
          </span>
        </h1>
        <p
          ref={subtitleRef}
          className="opacity-0 will-change-transform text-base xs:text-lg sm:text-xl md:text-2xl text-slate-200/90 mb-6 sm:mb-8 font-medium max-w-2xl mx-auto drop-shadow-sm"
        >
          Shop premium Minecraft items, blocks, and exclusive merchandise. Trusted by thousands of players worldwide.
        </p>

        <div
          ref={buttonsRef}
          className="opacity-0 will-change-transform flex flex-col xs:flex-row gap-3 xs:gap-4 w-full max-w-md mx-auto mb-8 sm:mb-10"
        >
          <Button
            variant="diamond"
            size="lg"
            className="flex-1 text-sm xs:text-base md:text-lg px-4 xs:px-6 md:px-8 py-2 xs:py-3 rounded-xl shadow-xl font-semibold bg-minecraft-diamond hover:bg-minecraft-diamond/90 text-white transition-all duration-200 focus:ring-2 focus:ring-minecraft-diamond/50 animate-btn-sparkle"
            onClick={handleShopNow}
          >
            <ShoppingBag className="w-4 h-4 xs:w-5 xs:h-5 mr-2 animate-icon-pop" />
            Shop Now
          </Button>
          <Button
            variant="gold"
            size="lg"
            className="flex-1 text-sm xs:text-base md:text-lg px-4 xs:px-6 md:px-8 py-2 xs:py-3 rounded-xl shadow-xl font-semibold bg-minecraft-gold hover:bg-minecraft-gold/90 text-white transition-all duration-200 focus:ring-2 focus:ring-minecraft-gold/50 animate-btn-sparkle delay-150"
            onClick={handleExploreTools}
          >
            <Pickaxe className="w-4 h-4 xs:w-5 xs:h-5 mr-2 animate-icon-pop" />
            Explore Tools
          </Button>
        </div>

        {/* Responsive Stats Section */}
        <div
          ref={statsRef}
          className="opacity-0 will-change-transform grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-2xl mx-auto"
        >
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl px-6 py-5 shadow-lg border border-white/10 hover:scale-110 hover:shadow-2xl transition-transform duration-300 animate-stat-bounce">
            <div className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-minecraft-gold mb-1">1,000+</div>
            <div className="text-xs xs:text-sm sm:text-base text-slate-200/80 font-medium tracking-wide">Unique Items</div>
          </div>
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl px-6 py-5 shadow-lg border border-white/10 hover:scale-110 hover:shadow-2xl transition-transform duration-300 mt-2 sm:mt-0 animate-stat-bounce delay-100">
            <div className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-minecraft-diamond mb-1">50,000+</div>
            <div className="text-xs xs:text-sm sm:text-base text-slate-200/80 font-medium tracking-wide">Happy Players</div>
          </div>
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl px-6 py-5 shadow-lg border border-white/10 hover:scale-110 hover:shadow-2xl transition-transform duration-300 mt-2 sm:mt-0 animate-stat-bounce delay-200">
            <div className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-minecraft-redstone mb-1">24/7</div>
            <div className="text-xs xs:text-sm sm:text-base text-slate-200/80 font-medium tracking-wide">Live Support</div>
          </div>
        </div>
      </div>
      {/* Animations CSS (Tailwind + custom) */}
      <style>
        {`
        /* Fancier fade-in with scale, rotate, and color pop */
        @keyframes hero-fancy-in {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.92) rotateX(20deg) skewY(2deg);
            filter: blur(6px) brightness(0.7);
          }
          60% {
            opacity: 1;
            transform: translateY(-8px) scale(1.04) rotateX(-2deg) skewY(-1deg);
            filter: blur(0.5px) brightness(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg) skewY(0deg);
            filter: blur(0) brightness(1);
          }
        }
        .animate-hero-fancy-in.animated {
          opacity: 1 !important;
          animation: hero-fancy-in 1.1s cubic-bezier(.22,1,.36,1) both;
        }

        /* Button sparkle effect */
        @keyframes btn-sparkle {
          0% { box-shadow: 0 0 0 0 rgba(0,255,255,0.3);}
          40% { box-shadow: 0 0 16px 4px rgba(0,255,255,0.5);}
          60% { box-shadow: 0 0 24px 8px rgba(255,215,0,0.4);}
          100% { box-shadow: 0 0 0 0 rgba(255,0,0,0);}
        }
        .animate-btn-sparkle {
          animation: btn-sparkle 1.2s cubic-bezier(.4,0,.2,1) 1;
        }
        .animate-btn-sparkle.delay-150 { animation-delay: 0.15s; }

        /* Icon pop with bounce and color flash */
        @keyframes icon-pop {
          0% { transform: scale(0.7) rotate(-20deg); filter: brightness(0.7);}
          60% { transform: scale(1.2) rotate(10deg); filter: brightness(1.3);}
          100% { transform: scale(1) rotate(0deg); filter: brightness(1);}
        }
        .animate-icon-pop {
          animation: icon-pop 0.9s cubic-bezier(.4,0,.2,1) 1;
        }

        /* Stats bounce with color pulse */
        @keyframes stat-bounce {
          0% { opacity: 0; transform: scale(0.7) translateY(40px);}
          60% { opacity: 1; transform: scale(1.08) translateY(-8px);}
          80% { transform: scale(0.98) translateY(2px);}
          100% { opacity: 1; transform: scale(1) translateY(0);}
        }
        .animate-stat-bounce {
          animation: stat-bounce 1s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-stat-bounce.delay-100 { animation-delay: 0.1s; }
        .animate-stat-bounce.delay-200 { animation-delay: 0.2s; }

        /* Animated background zoom and gradient shimmer */
        @keyframes hero-bg-zoom {
          0% { transform: scale(1);}
          100% { transform: scale(1.07);}
        }
        .animate-hero-bg-zoom {
          animation: hero-bg-zoom 14s ease-in-out alternate infinite;
        }
        @keyframes gradient-move {
          0% { background-position: 0% 50%;}
          50% { background-position: 100% 50%;}
          100% { background-position: 0% 50%;}
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s ease-in-out infinite;
        }
        /* Animated gradient text shimmer */
        @keyframes gradient-text {
          0% { background-position: 0% 50%;}
          100% { background-position: 100% 50%;}
        }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 3s linear infinite alternate;
        }
        `}
      </style>
    </section>
  );
};

export default Hero;