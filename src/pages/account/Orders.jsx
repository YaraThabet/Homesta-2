import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Orders = () => {
  const [sortBy, setSortBy] = useState('All');

  const orders = [
    {
      id: '#SDGT1254FD',
      totalPayment: 840.00,
      paymentMethod: 'Paypal',
      estimatedDelivery: '24 April 2024',
      status: 'Accepted',
      statusMessage: 'Your Order has been Accepted',
      items: [
        { name: 'Wingback Chair', color: 'Light Brown', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop' },
        { name: 'Wooden Sofa Chair', color: 'Grey', image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=100&h=100&fit=crop' },
        { name: 'Bar Stool', color: 'Brown', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=100&h=100&fit=crop' },
        { name: 'Brown Bean Bag Chair', color: 'Brown', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop' },
      ],
      actions: ['Track Order', 'Invoice', 'Cancel Order']
    },
    {
      id: '#SDGT1254FD',
      totalPayment: 375.00,
      paymentMethod: 'Cash',
      estimatedDelivery: '24 April 2024',
      status: 'Delivered',
      statusMessage: 'Your Order has been Delivered',
      items: [
        { name: 'Brown Bean Bag Chair', color: 'Brown', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop' },
      ],
      actions: ['Add Review', 'Invoice']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-[#FFF1E3] text-[#B19470]';
      case 'Delivered':
        return 'bg-[#C5FBD2] text-[#7BC370]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-foreground">Orders ({orders.length})</h1>
          <div className="relative">
            <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
            <button className="inline-flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-sm font-medium">
              {sortBy}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={index} className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Order Header */}
              <div className="bg-[#F0F3FF] px-6 py-4 grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                  <p className="text-sm font-semibold text-foreground">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Payment</p>
                  <p className="text-sm font-semibold text-foreground">${order.totalPayment.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                  <p className="text-sm font-semibold text-foreground">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Estimated Delivery Date</p>
                  <p className="text-sm font-semibold text-foreground">{order.estimatedDelivery}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 space-y-4 ">
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-4 py-2">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Status */}
              <div className="px-6 py-4 border-t border-border">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-sm text-foreground">{order.statusMessage}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {order.actions.map((action, actionIndex) => {
                    if (action === 'Cancel Order') {
                      return (
                        <button 
                          key={actionIndex}
                          className="ml-auto text-red-500 text-sm font-medium hover:text-red-600 transition-colors"
                        >
                          {action}
                        </button>
                      );
                    }
                    return (
                      <button 
                        key={actionIndex}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          actionIndex === 0 
                            ? 'bg-[#205457] text-white hover:bg-[#205457]/90' 
                            : 'border border-border text-[#205457] hover:bg-accent'
                        }`}
                      >
                        {action}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
