import { Facebook, Twitter, Instagram, Youtube, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // In a real app, you would send this to your backend
      setIsSubscribed(true);
      setEmail("");
      // Reset subscription status after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const handleSocialMediaClick = (platform: string) => {
    const urls = {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com"
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className="bg-stone-gradient border-t-4 border-minecraft-stone/50 text-primary-foreground py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-minecraft-dirt bg-dirt-gradient border-2 border-minecraft-dirt/50"></div>
              <h3 className="text-lg sm:text-xl font-bold font-minecraft">MineCraft Store</h3>
            </Link>
            <p className="text-sm sm:text-base text-primary-foreground/80 font-minecraft">
              Your one-stop shop for all Minecraft items, tools, and merchandise.
            </p>
            <div className="flex space-x-3">
              <div 
                className="w-5 h-5 cursor-pointer hover:text-minecraft-diamond transition-colors flex items-center justify-center"
                onClick={() => handleSocialMediaClick('facebook')}
                title="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </div>
              <div 
                className="w-5 h-5 cursor-pointer hover:text-minecraft-diamond transition-colors flex items-center justify-center"
                onClick={() => handleSocialMediaClick('twitter')}
                title="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </div>
              <div 
                className="w-5 h-5 cursor-pointer hover:text-minecraft-diamond transition-colors flex items-center justify-center"
                onClick={() => handleSocialMediaClick('instagram')}
                title="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </div>
              <div 
                className="w-5 h-5 cursor-pointer hover:text-minecraft-diamond transition-colors flex items-center justify-center"
                onClick={() => handleSocialMediaClick('youtube')}
                title="Follow us on YouTube"
              >
                <Youtube className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-bold font-minecraft">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2 font-minecraft text-sm sm:text-base">
              <li>
                <Link to="/" className="hover:text-minecraft-diamond transition-colors flex items-center group">
                  Home
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-minecraft-diamond transition-colors flex items-center group">
                  Products
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-minecraft-diamond transition-colors flex items-center group">
                  Categories
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-minecraft-diamond transition-colors flex items-center group">
                  About Us
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-minecraft-diamond transition-colors flex items-center group">
                  Sign In
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-minecraft-diamond transition-colors flex items-center group">
                  Sign Up
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-minecraft-diamond transition-colors flex items-center group">
                  My Wishlist
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-bold font-minecraft">Customer Service</h4>
            <ul className="space-y-1 sm:space-y-2 font-minecraft text-sm sm:text-base">
              <li>
                <Link to="/contact" className="hover:text-minecraft-diamond transition-colors flex items-center group">
                  Contact Us
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <a 
                  href="#shipping" 
                  className="hover:text-minecraft-diamond transition-colors flex items-center group cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    // Scroll to shipping info section or show modal
                    alert("Shipping information will be displayed here. In a real app, this would show shipping details or open a modal.");
                  }}
                >
                  Shipping Info
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="#returns" 
                  className="hover:text-minecraft-diamond transition-colors flex items-center group cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    // Show returns policy
                    alert("Returns policy will be displayed here. In a real app, this would show return details or open a modal.");
                  }}
                >
                  Returns
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="#faq" 
                  className="hover:text-minecraft-diamond transition-colors flex items-center group cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    // Show FAQ
                    alert("FAQ will be displayed here. In a real app, this would show frequently asked questions or open a modal.");
                  }}
                >
                  FAQ
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-bold font-minecraft">Stay Updated</h4>
            <p className="text-sm sm:text-base text-primary-foreground/80 font-minecraft">
              Get the latest news about new products and exclusive offers.
            </p>
            {isSubscribed ? (
              <div className="bg-minecraft-grass/20 border-2 border-minecraft-grass p-3 rounded text-center">
                <p className="text-minecraft-grass font-minecraft text-sm">
                  ✅ Thank you for subscribing!
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-background/20 border-2 border-background/30 text-primary-foreground placeholder:text-primary-foreground/60 outline-none font-minecraft focus:border-minecraft-diamond transition-colors text-sm"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-minecraft-diamond text-accent-foreground px-3 sm:px-4 py-2 hover:bg-minecraft-diamond/90 transition-colors text-sm"
                  disabled={!email.trim()}
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-primary-foreground/60 font-minecraft">
            © 2024 MineCraft Store. All rights reserved. Not affiliated with Mojang Studios.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;