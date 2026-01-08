import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import OrderStatus from "./components/OrderStatus";
import ProductItem from "./components/ProductItem";
import TrackingHeader from "./components/TrackingHeader";
import FooterBenefits from "../shop/components/FooterBenefits";
import PageLoader from "../../components/PageLoader";
import { Search, AlertCircle } from "lucide-react";

const TrackingOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");

  const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.startsWith('http')) return url;
    return `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
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
        const res = await api.get(`Order/OrderDetails?orderId=${id}`);
        // Check if data is valid
        if (res.data && res.data.orderId) {
          setOrder(res.data);
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Order Info Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">Order Status</h2>
            <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Reference: #{id || 'N/A'}</p>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-sm">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Track another ID..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#205457]/10 focus:border-[#205457] transition-all text-sm font-medium"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#205457] transition-colors" size={18} />
              <button type="submit" className="hidden">Search</button>
            </form>
          </div>

          {order && (
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Estimated Delivery</p>
              <p className="text-sm font-bold text-[#205457]">3-5 Business Days</p>
            </div>
          )}
        </div>

        {error ? (
          <div className="text-center py-20 bg-red-50/30 rounded-[40px] border border-dashed border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Tracking Error</h3>
            <p className="text-gray-500 font-medium max-w-md mx-auto">{error}</p>
            <button
              onClick={() => { setOrder(null); setError(null); setSearchId(""); }}
              className="mt-8 text-sm font-bold text-[#205457] hover:underline"
            >
              Clear and search again
            </button>
          </div>
        ) : order ? (
          <>
            <OrderStatus status={order.status} />

            {/* Product List Section */}
            <div className="border border-gray-100 rounded-[30px] p-8 shadow-sm bg-white mt-12">
              <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
                <h2 className="text-xl font-bold text-gray-800">Order Items</h2>
                <span className="bg-[#205457]/5 text-[#205457] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {(order.items || order.orderItems)?.length || 0} Products
                </span>
              </div>

              <div className="space-y-6">
                {(order.items || order.orderItems)?.map((item) => (
                  <ProductItem key={item.orderItemId || item.id} product={{
                    id: item.orderItemId || item.id,
                    name: item.productName || item.name,
                    color: item.productColor || item.color,
                    image: getImageUrl(item.imagePath || item.image || item.productImage),
                    quantity: item.quantity,
                    price: item.unitPrice || item.price
                  }} />
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-50 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Value</span>
                <span className="text-3xl font-black text-[#205457]">${order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-24 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-8">
              <Search className="text-gray-200" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to track?</h3>
            <p className="text-gray-400 font-medium max-w-sm mx-auto mb-10">Enter your order reference ID in the search box above to see your package's progress.</p>

            <div className="max-w-md mx-auto">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Order Reference (e.g. 1045)"
                  className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#205457]/10 focus:border-[#205457] transition-all text-sm font-medium shadow-sm"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <button type="submit" className="px-8 py-4 bg-[#205457] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#205457]/20 hover:bg-[#1a4345] transition-all">
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