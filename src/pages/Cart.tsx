import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import diamondSword from "@/assets/diamond-sword.png";
import goldenPickaxe from "@/assets/golden-pickaxe.png";
import creeperPlush from "@/assets/creeper-plush.jpg";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Diamond Sword",
      price: 29.99,
      image: diamondSword,
      quantity: 1,
      rarity: "legendary",
    },
    {
      id: "2",
      name: "Golden Pickaxe", 
      price: 24.99,
      image: goldenPickaxe,
      quantity: 2,
      rarity: "epic",
    },
    {
      id: "3",
      name: "Creeper Plush Toy",
      price: 19.99,
      image: creeperPlush,
      quantity: 1,
      rarity: "rare",
    },
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const rarityColors = {
    common: "bg-muted text-muted-foreground",
    rare: "bg-minecraft-diamond text-primary-foreground",
    epic: "bg-purple-600 text-primary-foreground",
    legendary: "bg-minecraft-gold text-primary-foreground",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="bg-grass-gradient py-16">
        <div className="container mx-auto px-4">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-bold text-primary-foreground mb-4 font-minecraft">
              Shopping Cart
            </h1>
            <p className="text-xl text-primary-foreground/90 font-minecraft">
              Review your items before checkout
            </p>
          </div>
        </div>
      </section>

      {cartItems.length === 0 ? (
        // Empty Cart
        <section className="py-16">
          <div className="container mx-auto px-4 text-center animate-fade-in">
            <div className="max-w-md mx-auto">
              <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4 font-minecraft">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8 font-minecraft">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button variant="grass" size="lg" asChild>
                <Link to="/products">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : (
        // Cart with Items
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-minecraft">
                    Cart Items ({cartItems.length})
                  </h2>
                  <Button variant="outline" asChild>
                    <Link to="/products">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>

                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-card border-2 border-border p-6 block-shadow animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-muted/20 p-2 border border-border flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="pixelated w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className={`inline-block px-2 py-1 text-xs ${rarityColors[item.rarity]} capitalize mb-1`}>
                              {item.rarity}
                            </div>
                            <h3 className="text-lg font-bold font-minecraft">
                              {item.name}
                            </h3>
                            <p className="text-2xl font-bold text-minecraft-gold font-minecraft">
                              ${item.price}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <span className="font-minecraft">Qty:</span>
                          <div className="flex items-center border-2 border-border">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="px-3 py-1 font-minecraft">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <span className="text-lg font-bold font-minecraft ml-auto">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border-2 border-border p-6 block-shadow sticky top-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-xl font-bold font-minecraft mb-6">Order Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between font-minecraft">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between font-minecraft">
                      <span>Shipping:</span>
                      <span className={shipping === 0 ? "text-minecraft-grass" : ""}>
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between font-minecraft">
                      <span>Tax:</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    <hr className="border-border" />
                    
                    <div className="flex justify-between text-lg font-bold font-minecraft">
                      <span>Total:</span>
                      <span className="text-minecraft-gold">${total.toFixed(2)}</span>
                    </div>

                    {subtotal < 50 && (
                      <div className="text-sm text-muted-foreground font-minecraft bg-muted/20 p-3 border border-border">
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button variant="grass" size="lg" className="w-full">
                      Proceed to Checkout
                    </Button>
                    <Button variant="outline" size="lg" className="w-full">
                      Save for Later
                    </Button>
                  </div>

                  {/* Promo Code */}
                  <div className="mt-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="flex-1 px-3 py-2 border-2 border-border bg-background font-minecraft"
                      />
                      <Button variant="outline">Apply</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Cart;