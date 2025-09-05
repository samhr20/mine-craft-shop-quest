import { ShoppingCart, Menu, User, Search, TrendingUp, Clock, X, LogOut, Heart, Crown, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAdmin } from "../contexts/AdminContext";
import heroBanner from "../assets/minecraft-hero-banner.jpg";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const { items: cartItems, totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { isAdmin } = useAdmin();

  // Popular search suggestions
  const popularSearches = [
    "Diamond Sword",
    "Golden Pickaxe",
    "Creeper Plush",
    "Minecraft Tools",
    "Weapons",
    "Armor",
    "Blocks",
    "Decorations"
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (search: string) => {
    const trimmed = search.trim();
    if (!trimmed) return;

    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm);
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    saveRecentSearch(suggestion);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  // Handle recent search click
  const handleRecentSearchClick = (search: string) => {
    setSearchTerm(search);
    navigate(`/products?search=${encodeURIComponent(search)}`);
    setShowSuggestions(false);
  };

  // Remove recent search
  const removeRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== search);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Close suggestions and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      // Close mobile menu when clicking outside
      const target = event.target as Element;
      if (!target.closest('.mobile-menu-container') && !target.closest('[data-mobile-menu-button]')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter popular searches based on current input
  const filteredPopularSearches = popularSearches.filter(search =>
    search.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header
      className="relative border-b border-white/10 py-1 lg:p-0 sticky top-0 z-50 shadow-2xl"
      style={{
        minHeight: "4rem",
      }}
    >
      {/* Background image with blur */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(20,24,31,0.7),rgba(20,24,31,0.7)), url(${heroBanner})`,
          filter: "blur(2px) brightness(1.7)",
          zIndex: 0,
        }}
        aria-hidden="true"
      ></div>
      {/* Overlay to darken and allow content to be readable */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(rgba(20,24,31,0.7),rgba(20,24,31,0.7))",
          zIndex: 1,
        }}
        aria-hidden="true"
      ></div>
      <div className="relative container mx-auto px-4" style={{ zIndex: 2 }}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-minecraft-diamond to-minecraft-gold border-2 border-white/20 rounded-lg shadow-lg group-hover:shadow-neon-glow transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"></div>
            <h1 className="text-xl font-bold text-white font-minecraft group-hover:text-minecraft-diamond transition-colors duration-300">
              MineCraft Store
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/products" className="text-white hover:text-minecraft-diamond font-minecraft transition-all duration-300 hover:scale-105 relative group">
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-minecraft-diamond transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-white hover:text-minecraft-diamond font-minecraft transition-all duration-300 hover:scale-105 relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-minecraft-diamond transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-white hover:text-minecraft-diamond font-minecraft transition-all duration-300 hover:scale-105 relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-minecraft-diamond transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Search Bar with Suggestions */}
          <div ref={searchRef} className="hidden md:block relative">
            <form
              onSubmit={handleSearch}
              className="flex items-center border border-white/20 px-3 py-2 max-w-sm rounded-lg bg-black/40 hover:border-minecraft-diamond/50 transition-all duration-300 hover:shadow-neon-glow"
            >
              <Search className="w-4 h-4 text-white/60 mr-2" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                className="bg-transparent text-white placeholder:text-white/60 outline-none flex-1 font-minecraft"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-background/20 px-2 py-1 h-auto"
                disabled={!searchTerm.trim()}
              >
                Search
              </Button>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="font-minecraft">Recent Searches</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRecentSearches}
                        className="text-xs text-muted-foreground hover:text-foreground h-auto p-1"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer group"
                          onClick={() => handleRecentSearchClick(search)}
                        >
                          <span className="text-sm font-minecraft text-foreground">{search}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => removeRecentSearch(search, e)}
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground  p-1 w-6 h-6"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-minecraft">Popular Searches</span>
                  </div>
                  <div className="space-y-1">
                    {filteredPopularSearches.length > 0 ? (
                      filteredPopularSearches.map((search, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-muted/50 rounded cursor-pointer"
                          onClick={() => handleSuggestionClick(search)}
                        >
                          <span className="text-sm font-minecraft text-foreground">{search}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground font-minecraft">
                        No matching suggestions
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-3 border-t border-border bg-muted/20">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/products')}
                      className="text-xs h-8 font-minecraft"
                    >
                      View All Products
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/products?category=Weapons')}
                      className="text-xs h-8 font-minecraft"
                    >
                      Browse Weapons
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-primary-foreground/80 font-minecraft text-sm">
                  <span>Welcome, {user.user_metadata?.username || user.email?.split('@')[0]}</span>
                </div>
                {isAdmin && (
                  <Link to="/admin">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary-foreground hover:text-primary-foreground/80 bg-minecraft-diamond/20"
                      title="Admin Dashboard"
                    >
                      <Crown className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                <Link to="/profile" className="relative group flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:text-minecraft-diamond font-minecraft transition-all duration-300 hover:scale-105 hover:bg-transparent focus:bg-transparent active:bg-transparent"
                    title="View Profile"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-minecraft-diamond transition-all duration-300 group-hover:w-4/5"></span>
                </Link>
                <Link to="/orders" className="relative group flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:text-minecraft-diamond font-minecraft transition-all duration-300 hover:scale-105 hover:bg-transparent focus:bg-transparent active:bg-transparent"
                    title="My Orders"
                  >
                    <Package className="w-5 h-5" />
                  </Button>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-minecraft-diamond transition-all duration-300 group-hover:w-4/5"></span>
                </Link>
                <div className="relative group flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      try {
                        await signOut();
                      } catch (error) {
                        // Optionally handle error, but do not log to console in production
                      }
                    }}
                    className="text-primary-foreground hover:text-minecraft-diamond font-minecraft transition-all duration-300 hover:scale-105 hover:bg-transparent focus:bg-transparent active:bg-transparent"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-minecraft-diamond transition-all duration-300 group-hover:w-4/5"></span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="relative group flex items-center">
                  <Button variant="ghost" className="text-primary-foreground hover:text-minecraft-diamond font-minecraft transition-all duration-300 hover:scale-105 hover:bg-transparent focus:bg-transparent active:bg-transparent">
                    Sign In
                  </Button>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-minecraft-diamond transition-all duration-300 group-hover:w-4/5"></span>
                </Link>
                <Link to="/register" className="relative group flex items-center">
                  <Button className="bg-minecraft-diamond text-accent-foreground hover:bg-minecraft-diamond/90 font-minecraft transition-all duration-300 hover:scale-105 hover:bg-minecraft-diamond/80">
                    Sign Up
                  </Button>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-minecraft-diamond transition-all duration-300 group-hover:w-4/5"></span>
                </Link>
              </div>
            )}

            <Link to="/wishlist" className="relative group flex items-center">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-minecraft-diamond font-minecraft transition-all duration-300 hover:scale-105 hover:bg-transparent focus:bg-transparent active:bg-transparent relative">
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-minecraft-diamond text-xs px-1 min-w-[1.25rem] h-5">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-minecraft-diamond transition-all duration-300 group-hover:w-4/5"></span>
            </Link>

            <Link to="/cart" className="relative group flex items-center">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-minecraft-diamond font-minecraft transition-all duration-300 hover:scale-105 hover:bg-transparent focus:bg-transparent active:bg-transparent relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-minecraft-redstone text-xs px-1 min-w-[1.25rem] h-5">
                    {totalItems}
                  </Badge>
                )}
              </Button>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-minecraft-diamond transition-all duration-300 group-hover:w-4/5"></span>
            </Link>
          </div>

          {/* Mobile-only Cart and Wishlist buttons */}
          <div className="flex md:hidden items-center space-x-2">
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-foreground/80 relative">
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-minecraft-diamond text-xs px-1 min-w-[1.25rem] h-5">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-foreground/80 relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-minecraft-redstone text-xs px-1 min-w-[1.25rem] h-5">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle mobile menu"
              data-mobile-menu-button
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-lg border-t-4 border-minecraft-diamond shadow-2xl mobile-menu-container animate-slide-in-right">
            <div className="px-6 py-8 space-y-8">
              {/* Mobile Navigation Links */}
              <nav className="space-y-4">
                <Link
                  to="/products"
                  className="block text-white hover:text-minecraft-diamond font-minecraft py-4 px-4 rounded-lg hover:bg-minecraft-diamond/20 transition-all duration-300 border border-slate-700 hover:border-minecraft-diamond shadow-md hover:shadow-lg"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-lg font-semibold">Products</span>
                </Link>
                <Link
                  to="/about"
                  className="block text-white hover:text-minecraft-diamond font-minecraft py-4 px-4 rounded-lg hover:bg-minecraft-diamond/20 transition-all duration-300 border border-slate-700 hover:border-minecraft-diamond shadow-md hover:shadow-lg"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-lg font-semibold">About</span>
                </Link>
                <Link
                  to="/contact"
                  className="block text-white hover:text-minecraft-diamond font-minecraft py-4 px-4 rounded-lg hover:bg-minecraft-diamond/20 transition-all duration-300 border border-slate-700 hover:border-minecraft-diamond shadow-md hover:shadow-lg"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-lg font-semibold">Contact</span>
                </Link>
              </nav>

              {/* Mobile Search */}
              <div className="pt-6 border-t border-slate-700">
                <form onSubmit={handleSearch} className="flex items-center bg-slate-800/50 border-2 border-slate-600 px-4 py-4 rounded-lg shadow-md backdrop-blur-sm">
                  <Search className="w-5 h-5 text-slate-300 mr-3" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex-1 bg-transparent text-white placeholder:text-slate-400 font-minecraft outline-none text-lg font-medium"
                  />
                </form>
              </div>

              {/* Mobile User Actions */}
              {user ? (
                <div className="pt-6 border-t border-slate-700 space-y-6">
                  <div className="text-slate-200 font-minecraft text-lg px-2 text-center">
                    Welcome, <span className="text-minecraft-diamond font-semibold">{user.user_metadata?.username || user.email?.split('@')[0]}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setShowMobileMenu(false)}>
                        <Button variant="outline" size="sm" className="font-minecraft w-full bg-slate-800/50 border-slate-600 text-white hover:bg-minecraft-diamond hover:text-white hover:border-minecraft-diamond transition-all duration-300 shadow-md">
                          <Crown className="w-4 h-4 mr-2" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="outline" size="sm" className="font-minecraft w-full bg-slate-800/50 border-slate-600 text-white hover:bg-minecraft-diamond hover:text-white hover:border-minecraft-diamond transition-all duration-300 shadow-md">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Link to="/orders" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="outline" size="sm" className="font-minecraft w-full bg-slate-800/50 border-slate-600 text-white hover:bg-minecraft-diamond hover:text-white hover:border-minecraft-diamond transition-all duration-300 shadow-md">
                        <Package className="w-4 h-4 mr-2" />
                        Orders
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {

                        try {
                          await signOut();
                        } catch (error) {
                        }
                      }}
                      className="font-minecraft w-full bg-slate-800/50 border-slate-600 text-white hover:bg-minecraft-redstone hover:text-white hover:border-minecraft-redstone transition-all duration-300 shadow-md relative z-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-6 border-t border-slate-700 space-y-4">
                  <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                    <Button variant="outline" className="w-full font-minecraft py-4 bg-slate-800/50 border-slate-600 text-white hover:bg-minecraft-diamond hover:text-white hover:border-minecraft-diamond transition-all duration-300 shadow-md text-lg">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setShowMobileMenu(false)}>
                    <Button className="w-full bg-minecraft-diamond text-white hover:bg-minecraft-diamond/90 font-minecraft py-4 shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;