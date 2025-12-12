import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, Star, ThumbsUp, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';

const colors = [
  { name: "Green", value: "#5B8A8A" },
  { name: "Gold", value: "#C9A962" },
  { name: "White", value: "#E8E8E8" },
  { name: "Black", value: "#1A1A1A" },
];

const reviews = [
  {
    id: 1,
    title: "Modern Chair",
    rating: 5,
    text: "Wooow it's very nice and suitable to my living room.I recommended it to anyone who wants to buy it.",
    helpful: 10,
    date: "Nov.20 .2025",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Modern Chair",
    rating: 5,
    text: "Wooow it's very nice and suitable to my living room.I recommended it to anyone who wants to buy it.",
    helpful: 10,
    date: "Nov.20 .2025",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Modern Chair",
    rating: 5,
    text: "Wooow it's very nice and suitable to my living room.I recommended it to anyone who wants to buy it.",
    helpful: 10,
    date: "Nov.20 .2025",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Modern Chair",
    rating: 5,
    text: "Wooow it's very nice and suitable to my living room.I recommended it to anyone who wants to buy it.",
    helpful: 10,
    date: "Nov.20 .2025",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop&q=80",
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center ">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-teal-600 hover:underline"
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

  return (
    <div className="min-h-screen bg-white pt-[150px]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </button>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-[400px] object-contain"
              />
            </div>
            <div className="flex gap-4 justify-center">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-gray-400' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart
                  className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <p className="text-xl font-semibold text-gray-900 underline">${product.price.toFixed(2)}</p>
              <p className="text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
              {product.discount && (
                <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                  {product.discount}% Off
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-gray-900 font-medium">{product.rating}</span>
              <a href="#reviews" className="text-teal-600 hover:underline">
                100 reviews
              </a>
            </div>

            <div className="mb-6">
              <h3 className="text-gray-600 font-medium mb-2">Product Details</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Nec aliquam morbi lacus habitasse amet. 
                Nunc dui dictum facilisi faucibus amet sit aliquam morbi lacus habitasse amet.
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-900 mb-3">
                <span className="font-medium">Select Color : </span>
                <span className="text-teal-600">{colors[selectedColor].name}</span>
              </p>
              <div className="flex gap-3">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === index ? 'border-gray-400' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="inline-flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decreaseQuantity}
                  className="p-3 hover:bg-gray-100"
                >
                  <Minus className="w-5 h-5 text-gray-600" />
                </button>
                <span className="px-6 py-3 text-gray-900 font-medium">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="p-3 hover:bg-gray-100"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <button className="w-full max-w-[200px] bg-[#205457] text-white py-4 rounded-lg font-medium hover:bg-[#205457]/90 transition-colors">
              Add to Cart &gt;&gt;&gt;
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews">
          <h2 className="text-2xl font-semibold text-teal-700 mb-6">Reviews</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="min-w-[280px] bg-gray-50 rounded-xl p-4"
              >
                <div className="flex gap-3 mb-3">
                  <img
                    src={review.image}
                    alt={review.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{review.title}</h4>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{review.text}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful({review.helpful})
                  </button>
                  <span>{review.date}</span>
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
