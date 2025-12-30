import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, Star, ArrowLeft, Upload, ShoppingCart, Sparkles } from 'lucide-react';
import { products } from '../data/products';

const colors = [
  { name: "Green", value: "#5B8A8A" },
  { name: "Gold", value: "#C9A962" },
  { name: "White", value: "#E8E8E8" },
  { name: "Black", value: "#1A1A1A" },
];

const additionalInfo = [
  { feature: "Seat Material", description: "Leather" },
  { feature: "Color", description: "Green, Black, Brown" },
  { feature: "Item Weight", description: "10 Kilograms" },
  { feature: "Dimensions", description: '21"D * 21"W * 48"H' },
  { feature: "Brand", description: "KD Design" },
];

const reviews = [
  {
    id: 1,
    name: "Hend Mohamed",
    rating: 5,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: "3 months ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop&q=80",
    ],
  },
  {
    id: 2,
    name: "Ghada Talaat",
    rating: 5,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: "1 months ago",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80",
    images: [],
  },
  {
    id: 3,
    name: "Ghada Talaat",
    rating: 5,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: "1 months ago",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80",
    images: [],
  },
];

const ratingDistribution = [
  { stars: 5, percentage: 100 },
  { stars: 4, percentage: 80 },
  { stars: 3, percentage: 60 },
  { stars: 2, percentage: 40 },
  { stars: 1, percentage: 20 },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({
    fullName: '',
    email: '',
    review: '',
  });

  const product = products.find(p => p.id === parseInt(id));
  const relatedProducts = products.filter(p => p.id !== parseInt(id)).slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const productImages = [
    product.image,
    product.image.replace('w=400', 'w=600'),
    product.image.replace('w=400', 'w=500'),
    product.image.replace('w=400', 'w=450'),
  ];

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log('Review submitted:', reviewForm);
    setReviewForm({ fullName: '', email: '', review: '' });
  };

  return (
    <div className="min-h-screen bg-background pt-[120px]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </button>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="mb-4 bg-muted/30 rounded-lg p-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-[350px] object-contain"
              />
            </div>
            <div className="flex gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 border-2 rounded-lg overflow-hidden bg-muted/30 ${selectedImage === index ? 'border-primary' : 'border-border'
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-xl font-semibold text-foreground">{product.name}</h1>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                />
              </button>
            </div>

            <p className="text-lg font-semibold text-foreground underline mb-3">${product.price}</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-foreground font-medium">{product.rating}</span>
              <a href="#reviews" className="text-sm text-primary hover:underline">
                100 reviews
              </a>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-foreground mb-1">Product Details</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Nec aliquam morbi lacus habitasse amet.
                Nunc dui dictum facilisi faucibus amet sit aliquam morbi lacus habitasse amet.
                Nunc dui dictum facilisi faucibus amet sit
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-foreground mb-2">
                <span className="font-medium">Select Color : </span>
                <span className="text-primary">{colors[selectedColor].name}</span>
              </p>
              <div className="flex gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-7 h-7 rounded-full border-2 ${selectedColor === index ? 'border-foreground' : 'border-transparent'
                      }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="inline-flex items-center border border-border rounded-lg">
                <button
                  onClick={decreaseQuantity}
                  className="p-2 hover:bg-muted"
                >
                  <Minus className="w-4 h-4 text-muted-foreground" />
                </button>
                <span className="px-4 py-2 text-foreground font-medium text-sm">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="p-2 hover:bg-muted"
                >
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-[#5B8A8A] text-white py-3 rounded-lg font-medium hover:bg-[#4a7575] transition-colors text-sm">
                Add to cart
              </button>
              <button className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-[#4a7575]/90 transition-colors text-sm">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12">
          <div className="flex gap-8 border-b border-border mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'description'
                ? 'text-foreground border-b-2 border-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'additional'
                ? 'text-foreground border-b-2 border-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Additional Information
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'review'
                ? 'text-foreground border-b-2 border-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Review
            </button>
          </div>

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#5B8A8A]"></div>
                  <span className="text-muted-foreground text-sm">100% Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#5B8A8A]"></div>
                  <span className="text-muted-foreground text-sm">Ut labore et dolore magna aliqua.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#5B8A8A]"></div>
                  <span className="text-muted-foreground text-sm">Lorem ipsum dolor sit amet, consectetur.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#5B8A8A]"></div>
                  <span className="text-muted-foreground text-sm">Duis aute irure dolor in reprehenderit</span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information Tab */}
          {activeTab === 'additional' && (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#5B8A8A] text-white">
                    <th className="text-left py-3 px-6 font-medium text-sm">Feature</th>
                    <th className="text-left py-3 px-6 font-medium text-sm">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {additionalInfo.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{item.feature}</td>
                      <td className="py-4 px-6 text-sm text-foreground">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Review Tab */}
          {activeTab === 'review' && (
            <div id="reviews">
              {/* Rating Summary */}
              <div className="flex gap-12 mb-8">
                <div className="text-center">
                  <p className="text-4xl font-semibold text-foreground">4.8</p>
                  <div className="flex justify-center my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm">(110 Reviews)</p>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-3">{item.stars}</span>
                      <div className="flex-1 h-2 bg-[#5B8A8A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5B8A8A] rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6 mb-8">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-foreground text-sm">{review.name}</h4>
                        </div>
                      </div>
                      <span className="text-muted-foreground text-sm">{review.date}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {review.text}
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-foreground">{review.rating}.0</span>
                    </div>
                    {review.images.length > 0 && (
                      <div className="flex gap-2">
                        {review.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Review ${index + 1}`}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <div>
                <h3 className="font-medium text-foreground mb-2">Add your Review</h3>
                <p className="text-muted-foreground text-sm mb-4">Your email address will not be published. Required fields are marked *</p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Full Name*</label>
                      <input
                        type="text"
                        value={reviewForm.fullName}
                        onChange={(e) => setReviewForm({ ...reviewForm, fullName: e.target.value })}
                        placeholder="Maram"
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Email*</label>
                      <input
                        type="email"
                        value={reviewForm.email}
                        onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                        placeholder="maranahmed@gmail.com"
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Add detailed review</label>
                    <textarea
                      value={reviewForm.review}
                      onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                      placeholder="Write your review"
                      rows={4}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Add photo / video</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm">Drag photo or video</p>
                      <button type="button" className="text-primary text-sm font-medium mt-1 hover:underline">
                        Browse
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#5B8A8A] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a7575] transition-colors text-sm"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Explore Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                onClick={() => {
                  navigate(`/product/${relatedProduct.id}`);
                  setSelectedImage(0);
                  window.scrollTo(0, 0);
                }}
                className="group bg-card rounded-lg overflow-hidden border border-border/50 transition-all hover:shadow-md cursor-pointer"
              >
                <div className="relative aspect-square bg-muted/30 overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {relatedProduct.discount && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#205457] text-white text-[11px] font-medium rounded-full">
                      {relatedProduct.discount}% Off
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-medium text-foreground leading-tight">
                      {relatedProduct.name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart functionality here
                      }}
                      className="p-1.5 hover:bg-muted rounded transition-colors flex-shrink-0"
                    >
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        ${relatedProduct.price.toFixed(2)}
                      </span>
                      {relatedProduct.originalPrice > relatedProduct.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${relatedProduct.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{relatedProduct.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
