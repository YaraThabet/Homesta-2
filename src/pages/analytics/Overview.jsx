import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, TrendingUp } from 'lucide-react';

const stats = [
  { id: 1, label: 'Store Earnings', value: '$12,850', icon: ShoppingBag, color: '#205457' },
  { id: 2, label: 'Sold Items', value: '482', icon: Package, color: '#89917D' },
  { id: 3, label: 'Conversion Rate', value: '3.8%', icon: TrendingUp, color: '#B19470' },
];

const StatCard = ({ stat }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-gray-50 flex items-center gap-5"
  >
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
      style={{ backgroundColor: stat.color }}
    >
      <stat.icon size={24} />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
    </div>
  </motion.div>
);

const Overview = () => {
  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Performance Overview</h2>
        <div className="h-[2px] w-20 bg-[#205457]/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(s => (
          <StatCard key={s.id} stat={s} />
        ))}
      </div>
    </div>
  );
};

export default Overview;
