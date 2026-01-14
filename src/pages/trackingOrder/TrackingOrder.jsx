import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import OrderStatus from "./components/OrderStatus";
import ProductItem from "./components/ProductItem";
import TrackingHeader from "./components/TrackingHeader";
import FooterBenefits from "../shop/components/FooterBenefits";
import PageLoader from "../../components/PageLoader";
import { Search, AlertCircle, XCircle } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const TrackingOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");
  const { showAlert } = useAppContext();

  const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.startsWith('http')) return url;
    return `${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setOrder(null);
      setError(null);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch order details and all products in parallel
        const [orderRes, productsRes] = await Promise.all([
          api.get(`Order/OrderDetails?orderId=${id}`),
          api.get('Product/GetAllProducts').catch(() => ({ data: [] }))
        ]);

        // Check if data is valid
        if (orderRes.data && orderRes.data.orderId) {
          const orderData = orderRes.data;
          const products = productsRes.data || [];

          console.log('📦 Order items for tracking:', orderData.items);
          console.log('🏪 Products from API:', products);

          // Enrich order items with productId from products
          if (orderData.items) {
            const enrichedItems = await Promise.all(
              orderData.items.map(async (item) => {
                // Priority 1: Use productId from item response
                // Priority 2: Match product catalog by productId (if item has it)
                // Priority 3: Fallback match by name (if item lacks productId)
                const matchingProduct = item.productId
                  ? products.find(p => (p.productId || p.id) == item.productId)
                  : products.find(p => p.name?.toLowerCase().trim() === item.productName?.toLowerCase().trim());

                const productId = item.productId || matchingProduct?.productId;
                let imageUrl = item.imagePath || item.image || item.productImage || matchingProduct?.imagePath || matchingProduct?.image;

                // Fetch image from secondary API if still missing
                if (!imageUrl && productId) {
                  try {
                    console.log(`🖼️ Fetching image for: ${item.productName} (ID: ${productId})`);
                    const imgRes = await api.get(`/ProductImages/product/${productId}`);

                    if (imgRes.data?.images?.length) {
                      imageUrl = imgRes.data.images[0].imageUrl;
                    } else if (imgRes.data?.imageUrls?.length) {
                      imageUrl = imgRes.data.imageUrls[0];
                    }

                    if (imageUrl) {
                      console.log(`✅ Image loaded for ${item.productName}`);
                    }
                  } catch (err) {
                    console.log(`❌ Failed to load image for ${item.productName}:`, err.message);
                  }
                }

                const isDeleted = !products.some(p => (p.productId || p.id) == productId);

                return {
                  ...item,
                  // Normalize for ProductItem component
                  name: item.name || item.productName,
                  color: item.color || item.productColor,
                  price: item.price || item.finalUnitPrice || (item.total && item.quantity ? item.total / item.quantity : 0),
                  productId,
                  imagePath: imageUrl,
                  image: imageUrl,
                  isDeleted
                };
              })
            );

            orderData.items = enrichedItems;
          }

          setOrder(orderData);
        } else {
          setError("Order not found. Please check your Reference ID.");
          setOrder(null);
        }
      } catch (err) {
        console.error("Failed to fetch order for tracking:", err);
        setError("Unable to retrieve order details. Please verify the Reference ID and try again.");
        setOrder(null);
      } finally {
        setLoading(false);
        // Ensure page resets to top when data is loaded/changed
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/tracking-order/${searchId.trim()}`);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="bg-white min-h-screen pb-10 font-outfit">
      <TrackingHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        {/* Order Info Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Order Status</h2>
            <p className="text-gray-400 font-bold mt-1.5 uppercase tracking-[0.2em] text-[10px] sm:text-[11px]">Reference: <span className="text-[#205457]">#{id || 'N/A'}</span></p>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-sm w-full mx-auto md:mx-0 order-3 md:order-2">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Track another ID..."
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#205457]/5 focus:border-[#205457] transition-all text-sm font-bold placeholder:text-gray-300"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-[#205457] transition-colors" size={18} />
              <button type="submit" className="hidden">Search</button>
            </form>
          </div>

          {order && (
            <div className="text-center md:text-right flex flex-col items-center md:items-end gap-1 order-2 md:order-3">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Estimated Arrival</p>
              <p className="text-sm font-bold text-[#205457] bg-[#205457]/5 px-3 py-1 rounded-full inline-block">3-5 Business Days</p>
            </div>
          )}
        </div>

        {error ? (
          <div className="text-center py-16 sm:py-24 bg-red-50/30 rounded-[30px] sm:rounded-[40px] border border-dashed border-red-200 px-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Tracking Error</h3>
            <p className="text-gray-500 font-medium max-w-md mx-auto text-sm sm:text-base">{error}</p>
            <button
              onClick={() => { setOrder(null); setError(null); setSearchId(""); }}
              className="mt-8 text-sm font-bold text-[#205457] hover:underline bg-[#205457]/5 px-5 py-2 rounded-full transition-all"
            >
              Clear and search again
            </button>
          </div>
        ) : order ? (
          <>
            <OrderStatus status={order.status} />

            {/* Product List Section */}
            <div className="border border-gray-100 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 sm:p-10 shadow-sm bg-white mt-8 sm:mt-12 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-gray-50 pb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                <div className="flex items-center gap-3">
                  <span className="bg-gray-50 text-gray-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
                    ID: {order.orderId}
                  </span>
                  <span className="bg-[#205457]/5 text-[#205457] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#205457]/10">
                    {(order.items || order.orderItems)?.length || 0} Products
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {(order.items || order.orderItems)?.map((item) => (
                  <ProductItem key={item.orderItemId || item.id} product={{
                    id: item.orderItemId || item.id,
                    name: item.productName || item.name,
                    color: item.productColor || item.color,
                    image: getImageUrl(item.imagePath || item.image || item.productImage),
                    quantity: item.quantity,
                    price: item.finalUnitPrice ?? item.unitPrice ?? item.price,
                    isDeleted: item.isDeleted
                  }} />
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-right">
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em] mb-1">Total Order Value</span>
                  <p className="text-[10px] text-gray-400 font-medium">Includes taxes and shipping</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-gray-400">$</span>
                  <span className="text-4xl sm:text-5xl font-black text-[#205457] tracking-tighter">
                    {(order.totalPrice || (order.items || order.orderItems)?.reduce((sum, item) => {
                      const price = item.finalUnitPrice ?? item.unitPrice ?? item.price ?? 0;
                      return sum + (Number(price) * (item.quantity || 1));
                    }, 0))?.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-[#205457] tracking-widest opacity-40">USD</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 sm:py-24 bg-gray-50/30 rounded-[30px] sm:rounded-[40px] border border-dashed border-gray-200 px-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-[24px] sm:rounded-[30px] shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-8 animate-pulse text-[#205457]/20">
              <Search size={40} className="sm:size-48" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 tracking-tight">Ready to track?</h3>
            <p className="text-gray-400 font-medium max-w-sm mx-auto mb-10 text-sm sm:text-base">Enter your order reference ID in the search box above to see your package's progress.</p>

            <div className="max-w-md mx-auto">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter Reference (e.g. 1045)"
                  className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#205457]/5 focus:border-[#205457] transition-all text-sm font-bold shadow-sm placeholder:text-gray-300"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <button type="submit" className="px-8 py-4 bg-[#205457] text-white rounded-2xl font-black text-sm shadow-xl shadow-[#205457]/20 hover:bg-[#1a4345] hover:-translate-y-1 transition-all active:translate-y-0">
                  Track Now
                </button>
              </form>
            </div>
          </div>
        )}
      </div>


      <FooterBenefits />
    </div>
  );
};

export default TrackingOrder;