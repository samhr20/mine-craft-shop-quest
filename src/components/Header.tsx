import { ShoppingCart, Menu, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [cartItems] = useState(3);

  return (
    <header className="bg-grass-gradient border-b-4 border-minecraft-grass/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-minecraft-dirt bg-dirt-gradient border-2 border-minecraft-dirt/50"></div>
            <h1 className="text-xl font-bold text-primary-foreground font-minecraft">
              MineCraft Store
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/products" className="text-primary-foreground hover:text-primary-foreground/80 font-minecraft transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-primary-foreground hover:text-primary-foreground/80 font-minecraft transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-primary-foreground hover:text-primary-foreground/80 font-minecraft transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-background/20 border-2 border-background/30 px-3 py-1 max-w-sm">
            <Search className="w-4 h-4 text-primary-foreground/60 mr-2" />
            <input
              type="text"
              placeholder="Search items..."
              className="bg-transparent text-primary-foreground placeholder:text-primary-foreground/60 outline-none flex-1 font-minecraft"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-foreground/80">
              <User className="w-5 h-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-foreground/80 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-minecraft-redstone text-xs px-1 min-w-[1.25rem] h-5">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;