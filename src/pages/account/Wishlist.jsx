import { useState } from "react";
import { X } from "lucide-react";
import FooterBenefits from "../shop/components/FooterBenefits";

const initialWishlistItems = [
  {
    id: 1,
    name: "Wingback Chair",
    color: "Light Brown",
    price: 160.00,
    dateAdded: "18 April 2025",
    inStock: true,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop"
  },
  {
    id: 2,
    name: "Wooden Sofa Chair",
    color: "Grey",
    price: 80.00,
    dateAdded: "17 April 2025",
    inStock: true,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Bar Stool",
    color: "Brown",
    price: 48.00,
    dateAdded: "11 April 2025",
    inStock: true,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=200&h=200&fit=crop"
  },
  {
    id: 4,
    name: "Wooden Nightstand",
    color: "Light Grey",
    price: 54.00,
    dateAdded: "05 April 2025",
    inStock: true,
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=200&h=200&fit=crop"
  },
  {
    id: 5,
    name: "Brown Bean Bag Chair",
    color: "Brown",
    price: 90.00,
    dateAdded: "05 April 2025",
    inStock: true,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop"
  }
];

const Wishlist = () => {
  const [items, setItems] = useState(initialWishlistItems);
  const [wishlistLink] = useState("https://www.example.com");

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(wishlistLink);
  };

  return (
    <div className="min-h-screen bg-background pt-[150px]">
      {/* Header */}
      <header className="bg-[#F6F6F6] py-14 text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Wishlist</h1>
        <nav className="text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer">Home</span>
          <span className="mx-1.5 text-muted-foreground/50">/</span>
          <span className="text-foreground font-medium">Wishlist</span>
        </nav>
      </header>

      {/* Content */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10">
        {/* Table Header - Hidden on mobile */}
        <div className="hidden md:block bg-[#205457] text-white rounded-lg mb-1">
          <div className="grid grid-cols-12 py-4 px-2 sm:px-6 text-sm font-medium">
            <div className="col-span-12 md:col-span-5">Product</div>
            <div className="col-span-12 md:col-span-2 text-center">Price</div>
            <div className="col-span-12 md:col-span-2 text-center">Date Added</div>
            <div className="col-span-12 md:col-span-2 text-center">Status</div>
            <div className="col-span-12 md:col-span-1"></div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 p-4 sm:p-6   mb-4">
              {/* Product - Full width on mobile, 5 columns on desktop */}
              <div className="col-span-1 sm:col-span-2 md:col-span-5 flex items-start sm:items-center gap-4">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-foreground mt-1 sm:mt-0"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted/30 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm sm:text-base">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Color: {item.color}</p>
                    {/* Mobile price - Only show on small screens */}
                    <div className="md:hidden mt-2">
                      <span className="text-sm font-medium text-foreground">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price - Hidden on mobile */}
              <div className="hidden md:flex md:col-span-2 items-center justify-center text-foreground">
                ${item.price.toFixed(2)}
              </div>

              {/* Date Added */}
              <div className="col-span-1 sm:col-span-2 md:col-span-2 flex items-center justify-start sm:justify-center text-xs sm:text-sm text-muted-foreground">
                <span className="md:hidden mr-2 font-medium text-foreground">Added:</span>
                {item.dateAdded}
              </div>

              {/* Stock Status */}
              <div className="col-span-1 sm:col-span-2 md:col-span-2 flex items-center justify-start sm:justify-center">
                <span className="md:hidden mr-2 font-medium text-foreground">Status:</span>
                <span className="inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full font-semibold text-sm sm:text-base" 
                      style={{ background: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(180deg, #7DDCC9 36.54%, #43766C 83.17%)' }}>
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Add to Cart */}
              <div className="col-span-1 sm:col-span-2 md:col-span-1 flex items-center justify-end sm:justify-end mt-2 sm:mt-0">
                <button className="bg-[#205457] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#205457]/90 transition-colors w-full sm:w-auto">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex-1 flex flex-col sm:flex-row gap-2 sm:items-center">
              <span className="text-sm font-medium text-foreground">Wishlist link:</span>
              <input 
                type="text" 
                value={wishlistLink}
                readOnly
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background w-full"
              />
            </div>
            <button 
              onClick={copyLink}
              className="bg-[#205457] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#205457]/90 transition-colors w-full sm:w-auto"
            >
              Copy Link
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={clearWishlist}
              className="text-sm text-foreground underline hover:text-primary transition-colors text-center py-2"
            >
              Clear Wishlist
            </button>
            <button className="bg-[#205457] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#205457]/90 transition-colors w-full sm:w-auto">
              Add All to Cart
            </button>
          </div>
        </div>
      </div>
      <FooterBenefits/>
    </div>
  );
};

export default Wishlist;
