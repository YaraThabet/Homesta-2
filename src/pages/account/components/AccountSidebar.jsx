import { useState } from 'react';
import { 
  User, 
  CreditCard, 
  Package, 
  Heart, 
  HelpCircle, 
  Settings, 
  LogOut 
} from "lucide-react";

const sidebarItems = [
  { icon: User, label: "Personal Data", href: "/account", active: true },
  { icon: CreditCard, label: "Payment Account", href: "/account/payment" },
  { icon: Package, label: "My Orders", href: "/account/orders" },
  { icon: Heart, label: "Wishlist", href: "/account/wishlist" },
  { icon: HelpCircle, label: "Help Center", href: "/account/help" },
];

const AccountSidebar = ({ className = "" }) => {
  return (
    <aside className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col ${className}`}>
      {/* User Profile Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm border-2 border-blue-300">
          MA
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-[15px] truncate">Maram Ahmed</h3>
          <p className="text-sm text-gray-500 truncate">Customer Operations</p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 my-4"></div>
      
      {/* Navigation Menu */}
      <nav className="space-y-2 flex-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                item.active
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
      
      {/* Settings - Separate Section */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <a
          href="/account/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          <span>Settings</span>
        </a>
      </div>
      
      {/* Logout Button */}
      <div className="mt-auto pt-6">
        <button
          className="w-full flex items-center justify-start gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default AccountSidebar;
