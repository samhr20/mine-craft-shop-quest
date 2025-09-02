import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-stone-gradient border-t-4 border-minecraft-stone/50 text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-minecraft-dirt bg-dirt-gradient border-2 border-minecraft-dirt/50"></div>
              <h3 className="text-xl font-bold font-minecraft">MineCraft Store</h3>
            </div>
            <p className="text-primary-foreground/80 font-minecraft">
              Your one-stop shop for all Minecraft items, tools, and merchandise.
            </p>
            <div className="flex space-x-3">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-minecraft-diamond transition-colors" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-minecraft-diamond transition-colors" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-minecraft-diamond transition-colors" />
              <Youtube className="w-5 h-5 cursor-pointer hover:text-minecraft-diamond transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-minecraft">Quick Links</h4>
            <ul className="space-y-2 font-minecraft">
              <li><a href="#" className="hover:text-minecraft-diamond transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-minecraft-diamond transition-colors">Products</a></li>
              <li><a href="#" className="hover:text-minecraft-diamond transition-colors">Categories</a></li>
              <li><a href="#" className="hover:text-minecraft-diamond transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-minecraft">Customer Service</h4>
            <ul className="space-y-2 font-minecraft">
              <li><a href="#" className="hover:text-minecraft-diamond transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-minecraft-diamond transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-minecraft-diamond transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-minecraft-diamond transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-minecraft">Stay Updated</h4>
            <p className="text-primary-foreground/80 font-minecraft">
              Get the latest news about new products and exclusive offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-background/20 border-2 border-background/30 text-primary-foreground placeholder:text-primary-foreground/60 outline-none font-minecraft"
              />
              <button className="bg-minecraft-diamond text-accent-foreground px-4 py-2 hover:bg-minecraft-diamond/90 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 font-minecraft">
            © 2024 MineCraft Store. All rights reserved. Not affiliated with Mojang Studios.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;