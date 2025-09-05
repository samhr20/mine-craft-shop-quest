import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Shield, Truck, Clock, Users, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageSEO } from "@/hooks/useSEO";

const About = () => {
  // Set SEO for about page
  usePageSEO('about');
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Shopping",
      description: "100% secure transactions with encrypted payment processing",
      color: "bg-minecraft-diamond"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50, delivered within 3-5 business days",
      color: "bg-minecraft-gold"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help with any questions",
      color: "bg-minecraft-grass"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Join over 50,000 satisfied Minecraft enthusiasts worldwide",
      color: "bg-minecraft-redstone"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers", color: "text-minecraft-diamond" },
    { number: "1000+", label: "Products", color: "text-minecraft-gold" },
    { number: "99.9%", label: "Uptime", color: "text-minecraft-grass" },
    { number: "24/7", label: "Support", color: "text-minecraft-redstone" }
  ];

  const team = [
    {
      name: "Steve",
      role: "Founder & CEO",
      description: "Minecraft veteran with 10+ years of experience",
      avatar: "👨‍💼"
    },
    {
      name: "Alex",
      role: "Head of Products",
      description: "Expert in rare items and enchantments",
      avatar: "👩‍💼"
    },
    {
      name: "Enderman",
      role: "Logistics Manager",
      description: "Ensures fast and secure deliveries",
      avatar: "👾"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-grass-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-8 h-8 bg-minecraft-gold absolute top-10 right-10 animate-block-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-6 h-6 bg-minecraft-diamond absolute top-24 left-16 animate-block-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-10 h-10 bg-minecraft-redstone absolute bottom-16 right-1/4 animate-block-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="w-4 h-4 bg-minecraft-stone absolute top-40 left-1/3 animate-block-bounce" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl font-bold text-primary-foreground mb-6 font-minecraft">
              About MineCraft Store
            </h1>
            <p className="text-2xl text-primary-foreground/90 max-w-3xl mx-auto font-minecraft">
              We're passionate about bringing the world of Minecraft to life through premium items, tools, and merchandise
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-8 font-minecraft">Our Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground font-minecraft leading-relaxed">
              <p>
                Founded in 2020 by a group of passionate Minecraft players, MineCraft Store began as a simple idea: 
                what if you could own the legendary items from your favorite game in real life?
              </p>
              <p>
                Starting from a small garage workshop, we've grown into the world's leading destination for 
                premium Minecraft-inspired products. Every item in our store is carefully crafted with attention 
                to detail and built to last, just like the blocks in your favorite world.
              </p>
              <p>
                Today, we serve over 50,000 customers worldwide, from casual players to hardcore enthusiasts, 
                bringing the magic of Minecraft into their daily lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-minecraft">Why Choose Us?</h2>
            <p className="text-xl text-muted-foreground font-minecraft">
              We're committed to providing the best shopping experience for Minecraft fans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${feature.color} text-primary-foreground w-20 h-20 mx-auto mb-6 flex items-center justify-center block-shadow hover:shadow-block-hover transition-all duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 font-minecraft">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-minecraft">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`text-5xl font-bold ${stat.color} mb-2 font-minecraft`}>
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-minecraft">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-minecraft">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground font-minecraft">
              The craftspeople behind your favorite Minecraft store
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="bg-card border-2 border-border p-8 text-center block-shadow hover:shadow-block-hover transition-all duration-200 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-minecraft">
                  {member.name}
                </h3>
                <p className="text-minecraft-gold font-bold mb-3 font-minecraft">
                  {member.role}
                </p>
                <p className="text-muted-foreground font-minecraft">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-8 font-minecraft">Our Mission</h2>
            <div className="bg-grass-gradient text-primary-foreground p-12 block-shadow">
              <Heart className="w-16 h-16 mx-auto mb-6" />
              <p className="text-xl font-minecraft leading-relaxed">
                "To bridge the gap between the digital and physical worlds, bringing the joy, 
                creativity, and adventure of Minecraft into the hands of players everywhere. 
                We believe that the magic of crafting shouldn't end when you close the game."
              </p>
              <div className="mt-8">
                <Button variant="diamond" size="lg" asChild>
                  <Link to="/products">
                    Start Your Adventure
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;