import React, { useState, useEffect } from 'react';
import { ChevronDown, Package, CreditCard, Calendar, Truck, X, MapPin, Printer } from 'lucide-react';
import api from '../../lib/axios';
import PageLoader from '../../components/PageLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const OrderDetailsModal = ({ order, isOpen, onClose, loading }) => {
  if (!isOpen) return null;

  const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.startsWith('http')) return url;
    return `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm print:bg-white print:p-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:w-full print:rounded-none"
      >
        <div className="flex justify-between items-center p-6 border-b border-border print:border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Invoice</h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">#ID: {order?.orderId}</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button onClick={handlePrint} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#205457]" title="Print Invoice">
              <Printer size={20} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 print:overflow-visible">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 print:hidden">
              <div className="w-8 h-8 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin" />
              <p className="text-sm font-bold text-gray-400">Loading Invoice Details...</p>
            </div>
          ) : order ? (
            <>
              {/* Shipping & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-xl border border-border print:bg-white print:border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#205457] print:border">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Billing Address</p>
                      <p className="text-sm font-bold text-gray-900">{order.address}</p>
                      <p className="text-xs text-gray-500 font-medium">{order.city}, {order.country}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#205457] print:border">
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Payment Method</p>
                      <p className="text-sm font-bold text-gray-900">{order.paymentMethod}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">{order.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.2em] mb-4 print:text-gray-600">Purchase Details</h3>
                <div className="space-y-0 border border-border rounded-xl overflow-hidden print:border-gray-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-[10px] font-black uppercase text-muted-foreground tracking-widest border-b border-border print:bg-white">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Price</th>
                        <th className="px-4 py-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border print:divide-gray-200">
                      {order.items?.map((item, idx) => (
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
                                <p className="font-bold text-gray-900 line-clamp-1">{item.productName}</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">{item.productColor}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-4 text-right font-medium text-gray-600">${item.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-4 text-right font-black text-gray-900">${(item.unitPrice * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-[#205457] p-8 rounded-xl text-white flex justify-between items-center shadow-xl shadow-[#205457]/10 print:bg-white print:text-gray-900 print:border print:border-gray-200 print:shadow-none">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1 print:opacity-100">Total Amount Paid</p>
                  <h3 className="text-3xl font-black">${order.totalPrice?.toLocaleString()}</h3>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10 print:bg-white print:border-gray-200">
                    <Calendar size={14} />
                    <span className="text-xs font-bold">{order.orderDateFormatted}</span>
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
  const [filterStatus, setFilterStatus] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.startsWith('http')) return url;
    return `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('Order/UserOrders');
        const basicOrders = Array.isArray(res.data) ? res.data : [];
        setOrders(basicOrders);

        for (const order of basicOrders) {
          api.get(`Order/OrderDetails?orderId=${order.orderId}`)
            .then(detailRes => {
              setOrders(prev => prev.map(o =>
                o.orderId === order.orderId ? { ...o, ...detailRes.data } : o
              ));
            })
            .catch(err => console.error(`Failed to fetch items for order ${order.orderId}`, err));
        }
      } catch (err) {
        console.error("Failed to fetch user orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  const handleTrackOrder = (orderId) => {
    navigate(`/tracking-order/${orderId}`);
  };

  const handleViewInvoice = async (orderId) => {
    // Selection and modal opening
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
    setOrderDetails(null);
    try {
      setLoadingDetails(true);
      const res = await api.get(`Order/OrderDetails?orderId=${orderId}`);
      setOrderDetails(res.data);
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
              Purchase <span className="text-[#205457] mr-3">History</span>
              <span className="text-[10px] bg-[#205457]/5 text-[#205457] px-3 py-1.5 rounded-full font-black border border-[#205457]/10 uppercase tracking-widest leading-none">
                {orders.length} Orders
              </span>
            </h1>
            <p className="text-gray-400 mt-1 text-sm font-medium">Manage and track your recent platform orders</p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-border shadow-sm overflow-x-auto no-scrollbar">
            {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filterStatus === status ? 'bg-[#205457] text-white shadow-lg shadow-[#205457]/20' : 'text-gray-400 hover:text-gray-700'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List with Scroller */}
        <div className="space-y-6 max-h-[850px] overflow-y-auto pr-4 custom-scrollbar scroll-smooth">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <div key={order.orderId || index} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all group">
                {/* Order Header */}
                <div className="bg-gray-50/80 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-border text-center md:text-left font-outfit">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Order Reference</p>
                    <p className="text-sm font-bold text-foreground uppercase">#{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Amount Paid</p>
                    <p className="text-sm font-black text-[#205457]">${order.totalPrice?.toLocaleString()}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Method</p>
                    <p className="text-[11px] font-bold text-gray-600 uppercase tracking-tighter bg-white px-3 py-1 rounded-lg border border-border inline-block">{order.paymentMethod}</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Date</p>
                    <p className="text-[11px] font-bold text-gray-400">{order.orderDateFormatted}</p>
                  </div>
                </div>

                {/* Order Items Section */}
                <div className="px-6 py-4 space-y-4">
                  {(order.items || order.orderItems) ? (
                    (order.items || order.orderItems || []).map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-border shadow-inner">
                          <img
                            src={getImageUrl(item.image || item.imagePath || item.productImage)}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Product' }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground text-sm">{item.productName}</h3>
                          <p className="text-xs text-muted-foreground font-medium mt-1">Qty: {item.quantity} · {item.productColor}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">${(item.unitPrice * item.quantity).toLocaleString()}</p>
                          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">Subtotal</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3 py-4 opacity-50 justify-center">
                      <div className="w-4 h-4 border-2 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Loading items...</span>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="px-6 py-4 bg-gray-50/10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                      <Truck size={12} />
                      {order.status === 'Cancelled' ? 'Retracted' :
                        order.status === 'Delivered' ? 'Order in your hands' :
                          'In transit to you'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleTrackOrder(order.orderId)}
                      className="flex-1 md:flex-none px-6 py-2 bg-[#205457] text-white rounded-xl text-xs font-bold hover:bg-[#1a4345] transition-all shadow-md shadow-[#205457]/10"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() => handleViewInvoice(order.orderId)}
                      className="flex-1 md:flex-none px-6 py-2 border border-border text-gray-600 rounded-xl text-xs font-bold hover:bg-white transition-all font-outfit"
                    >
                      View Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-border">
              <Package size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold">No orders found matching this filter.</p>
              <button onClick={() => setFilterStatus('All')} className="mt-4 text-[#205457] font-bold text-sm underline">Reset</button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        <OrderDetailsModal
          order={orderDetails}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          loading={loadingDetails}
        />
      </AnimatePresence>
    </div>
  );
};

export default Orders;
