import React, { useState, useEffect } from 'react';
import { ChevronDown, Package, CreditCard, Calendar, Truck, X, MapPin, Printer } from 'lucide-react';
import api from '../../lib/axios';
import PageLoader from '../../components/PageLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import SafeImage from '../../components/SafeImage';

const OrderDetailsModal = ({ order, isOpen, onClose, loading }) => {
  if (!isOpen) return null;

  const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.startsWith('http')) return url;
    return `${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm print:bg-white print:p-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] print:max-h-none print:shadow-none print:w-full print:rounded-none"
      >
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-border print:border-gray-200">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Order Invoice</h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">#ID: {order?.orderId}</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button onClick={handlePrint} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#205457]" title="Print Invoice">
              <Printer size={18} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 print:overflow-visible text-gray-900">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 print:hidden">
              <div className="w-8 h-8 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin" />
              <p className="text-sm font-bold text-gray-400">Loading Invoice Details...</p>
            </div>
          ) : order ? (
            <>
              {/* Shipping & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-gray-50/50 p-4 sm:p-6 rounded-xl border border-border print:bg-white print:border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#205457] print:border flex-shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Billing Address</p>
                      <p className="text-sm font-bold text-gray-900 mb-0.5">{order.firstName} {order.lastName}</p>
                      <p className="text-sm font-medium text-gray-700 leading-tight">{order.address}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{order.city}, {order.country}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#205457] print:border flex-shrink-0">
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Payment Method</p>
                      <p className="text-sm font-bold text-gray-900">{order.paymentMethod}</p>
                      <p className={`text-[9px] font-black uppercase inline-block px-2 py-0.5 rounded-md mt-1 border ${order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Card List/Table */}
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 print:text-gray-600">Purchase Details</h3>

                {/* Desktop Table View */}
                <div className="hidden sm:block border border-border rounded-xl overflow-hidden print:border-gray-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-[10px] font-black uppercase text-muted-foreground tracking-widest border-b border-border print:bg-white">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border print:divide-gray-200">
                      {order.items?.map((item, idx) => {
                        const unitPrice = item.originalUnitPrice ?? item.unitPrice ?? item.price ?? 0;
                        const finalPrice = item.finalUnitPrice ?? unitPrice;
                        const total = item.total ?? item.subtotal ?? (finalPrice * item.quantity);
                        return (
                          <tr key={idx} className="bg-white">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-border print:hidden">
                                  <img
                                    src={getImageUrl(item.image || item.imagePath || item.productImage)}
                                    alt={item.productName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 break-words text-sm leading-tight">
                                    {item.productName}
                                    {item.isDeleted && (
                                      <span className="ml-2 text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase font-black tracking-widest leading-none align-middle">
                                        Deleted
                                      </span>
                                    )}
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-1" title={item.productColor}>
                                    <span className="text-[9px] text-muted-foreground font-black uppercase">Color:</span>
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-gray-100 shadow-sm inline-block"
                                      style={{ backgroundColor: item.productColor || '#ccc' }}
                                    />
                                    {(finalPrice < unitPrice) && (
                                      <span className="ml-2 text-[9px] text-green-600 font-bold uppercase">Discounted</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="text-sm font-bold text-gray-900">{item.quantity}x</span>
                              <div className="text-[10px] text-gray-500 font-medium">${finalPrice.toLocaleString()}</div>
                            </td>
                            <td className="px-4 py-4 text-right font-black text-gray-900">${total.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden space-y-3">
                  {order.items?.map((item, idx) => {
                    const unitPrice = item.originalUnitPrice ?? item.unitPrice ?? item.price ?? 0;
                    const finalPrice = item.finalUnitPrice ?? unitPrice;
                    const total = item.total ?? item.subtotal ?? (finalPrice * item.quantity);
                    return (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-border flex gap-3">
                        <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                          <img
                            src={getImageUrl(item.image || item.imagePath || item.productImage)}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 break-words leading-snug">{item.productName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-gray-500">{item.quantity}x</span>
                            <span className="text-[10px] font-medium text-gray-400">@ ${finalPrice.toLocaleString()}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-gray-100 shadow-sm"
                              style={{ backgroundColor: item.productColor || '#ccc' }}
                            />
                            {item.isDeleted && <span className="text-[8px] font-black text-red-500 uppercase">Deleted</span>}
                          </div>
                        </div>
                        <div className="text-right flex flex-col justify-center">
                          <div className="text-sm font-black text-gray-900">${total.toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-[#205457] p-5 sm:p-8 rounded-xl text-white flex justify-between items-center shadow-xl shadow-[#205457]/10 print:bg-white print:text-gray-900 print:border print:border-gray-200 print:shadow-none">
                <div>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1 print:opacity-100">Total Amount</p>
                  <h3 className="text-2xl sm:text-3xl font-black">${(order.orderTotal ?? order.totalPrice ?? 0).toLocaleString()}</h3>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-white/10 print:bg-white print:border-gray-200">
                    <Calendar size={14} className="flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">{order.orderDateFormatted}</span>
                  </div>
                </div>
              </div>

              <div className="hidden print:block text-center pt-8 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Thank you for shopping with Homesta</p>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-400 font-bold">Failed to load invoice.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Orders = () => {
  const navigate = useNavigate();
  const { showAlert } = useAppContext();
  const [filterStatus, setFilterStatus] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        api.get('Order/UserOrders'),
        api.get('Product/GetAllProducts').catch(() => ({ data: [] }))
      ]);

      const basicOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const products = productsRes.data || [];

      const enrichedOrders = await Promise.all(basicOrders.map(async (order) => {
        try {
          const detailRes = await api.get(`Order/OrderDetails?orderId=${order.orderId}`);
          const detailedOrder = detailRes.data;

          if (detailedOrder.items) {
            const enrichedItems = await Promise.all(detailedOrder.items.map(async (item) => {
              const currentOrderName = item.productName || item.name || "";
              let matchingProduct = item.productId
                ? products.find(p => (p.productId || p.id) == item.productId)
                : null;

              if (matchingProduct && currentOrderName) {
                const catName = (matchingProduct.name || "").toLowerCase();
                const ordName = currentOrderName.toLowerCase();
                if (!catName.includes(ordName) && !ordName.includes(catName)) {
                  matchingProduct = null;
                }
              }

              if (!matchingProduct && currentOrderName) {
                matchingProduct = products.find(p => p.name?.toLowerCase().trim() === currentOrderName.toLowerCase().trim());
              }

              const productId = item.productId || matchingProduct?.productId;
              let imageUrl = item.image || item.imagePath || item.productImage || matchingProduct?.imagePath || matchingProduct?.image;

              if (!imageUrl && productId) {
                try {
                  const imgRes = await api.get(`/ProductImages/product/${productId}`);
                  if (imgRes.data?.images?.length) {
                    imageUrl = imgRes.data.images[0].imageUrl;
                  } else if (imgRes.data?.imageUrls?.length) {
                    imageUrl = imgRes.data.imageUrls[0];
                  }
                  if (imageUrl) {
                    imageUrl = imageUrl.startsWith('http') ? imageUrl : `${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                  }
                } catch (err) { }
              }
              const isDeleted = !matchingProduct;

              return {
                ...item,
                name: currentOrderName,
                productName: currentOrderName,
                color: item.color || item.productColor,
                productId,
                image: imageUrl,
                imagePath: imageUrl,
                isDeleted
              };
            }));
            detailedOrder.items = enrichedItems;
          }
          return { ...order, ...detailedOrder };
        } catch (err) {
          return order;
        }
      }));

      setOrders(enrichedOrders);
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const handleTrackOrder = (orderId) => {
    navigate(`/tracking-order/${orderId}`);
  };

  const handleViewInvoice = async (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
    setOrderDetails(null);
    try {
      setLoadingDetails(true);
      const [orderRes, productsRes] = await Promise.all([
        api.get(`Order/OrderDetails?orderId=${orderId}`),
        api.get('Product/GetAllProducts').catch(() => ({ data: [] }))
      ]);

      const orderData = orderRes.data;
      const products = productsRes.data || [];

      if (orderData.items) {
        const enrichedItems = await Promise.all(
          orderData.items.map(async (item) => {
            const matchingProduct = products.find(p =>
              p.name?.toLowerCase().trim() === item.productName?.toLowerCase().trim()
            );
            const productId = item.productId || matchingProduct?.productId;
            let imageUrl = item.image || item.imagePath;

            if (!imageUrl && productId) {
              try {
                const imgRes = await api.get(`/ProductImages/product/${productId}`);
                if (imgRes.data?.images?.length) {
                  imageUrl = imgRes.data.images[0].imageUrl;
                } else if (imgRes.data?.imageUrls?.length) {
                  imageUrl = imgRes.data.imageUrls[0];
                }
                if (imageUrl) {
                  imageUrl = imageUrl.startsWith('http') ? imageUrl : `${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                }
              } catch (err) { }
            }
            const isDeleted = !products.some(p => (p.productId || p.id) == productId);
            return {
              ...item,
              productId,
              image: imageUrl,
              imagePath: imageUrl,
              isDeleted
            };
          })
        );
        orderData.items = enrichedItems;
      }
      setOrderDetails(orderData);
    } catch (err) {
      console.error("Invoice retrieval failed:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
      case 'Confirmed':
      case 'Processing':
        return 'bg-[#FFF1E3] text-[#B19470]';
      case 'Delivered':
        return 'bg-[#C5FBD2] text-[#7BC370]';
      case 'Shipped':
        return 'bg-blue-50 text-blue-600';
      case 'Cancelled':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredOrders = orders.filter(o =>
    filterStatus === 'All' || o.status === filterStatus
  ).sort((a, b) => b.orderId - a.orderId);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20 font-outfit print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto px-4 py-8 print:hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
              Purchase <span className="text-[#205457]">History</span>
              <span className="text-[10px] bg-[#205457]/5 text-[#205457] px-3 py-1.5 rounded-full font-black border border-[#205457]/10 uppercase tracking-widest leading-none">
                {orders.length} Orders
              </span>
            </h1>
            <p className="text-gray-400 mt-1 text-sm font-medium">Manage and track your platform orders</p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-border shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
            {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filterStatus === status ? 'bg-[#205457] text-white shadow-lg shadow-[#205457]/20' : 'text-gray-400 hover:text-gray-700'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6 lg:max-h-[850px] lg:overflow-y-auto lg:pr-4 custom-scrollbar scroll-smooth">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <div key={order.orderId || index} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all group">
                {/* Order Header */}
                <div className="bg-gray-50/80 px-5 py-5 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 border-b border-border text-left">
                  <div className="col-span-1">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-widest">Reference</p>
                    <p className="text-xs sm:text-sm font-bold text-foreground">#{order.orderId}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-widest">Amount</p>
                    <p className="text-xs sm:text-sm font-black text-[#205457]">${order.totalPrice?.toLocaleString()}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-widest">Method</p>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter bg-white px-3 py-1 rounded-lg border border-border inline-block break-words max-w-full">{order.paymentMethod}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-widest">Date</p>
                    <p className="text-[10px] font-bold text-gray-400 break-words">{order.orderDateFormatted}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-4 sm:px-6 py-4 space-y-4">
                  {(order.items || order.orderItems) ? (
                    (order.items || order.orderItems || []).map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-3 sm:gap-4 py-3 border-b border-gray-50 last:border-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                          <SafeImage
                            src={item.image || item.imagePath || item.productImage}
                            alt={item.productName}
                            type="product"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-foreground text-xs sm:text-sm break-words">
                            {item.productName}
                            {item.isDeleted && (
                              <span className="ml-2 text-[7px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded uppercase font-black tracking-widest border border-red-100">
                                Deleted
                              </span>
                            )}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">Qty: {item.quantity}</span>
                            <span className="text-muted-foreground text-[10px] hidden sm:inline">•</span>
                            <div className="flex items-center gap-1.5" title={item.productColor}>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Color:</span>
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-gray-100 shadow-sm"
                                style={{ backgroundColor: item.productColor || '#ccc' }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs sm:text-sm font-bold text-gray-900">${(item.total ?? (item.finalUnitPrice ?? item.unitPrice ?? 0) * item.quantity).toLocaleString()}</p>
                          <p className="text-[8px] sm:text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">Subtotal</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3 py-6 justify-center">
                      <div className="w-4 h-4 border-2 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Syncing...</span>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="px-4 sm:px-6 py-4 bg-gray-50/10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                      <Truck size={12} className="flex-shrink-0" />
                      {order.status === 'Cancelled' ? 'Retracted' :
                        order.status === 'Delivered' ? 'Delivered' :
                          'In transit'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleTrackOrder(order.orderId)}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-[#205457] text-white rounded-xl text-[11px] font-bold hover:bg-[#1a4345] transition-all shadow-md shadow-[#205457]/10"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() => handleViewInvoice(order.orderId)}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2 border border-border text-gray-600 rounded-xl text-[11px] font-bold hover:bg-white transition-all"
                    >
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border px-6">
              <Package size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold">No orders found matching this filter.</p>
              <button
                onClick={() => setFilterStatus('All')}
                className="mt-4 text-[#205457] font-bold text-sm underline hover:text-[#1a4345] transition-colors"
                disabled={loading}
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <OrderDetailsModal
            order={orderDetails}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            loading={loadingDetails}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
