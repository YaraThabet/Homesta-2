import { NavLink } from 'react-router-dom';
import {
  User,
  CreditCard,
  Package,
  Heart,
  HelpCircle,
  Settings,
  LogOut,
  Notebook,
  LockIcon
} from "lucide-react";

const sidebarItems = [
  { icon: User, label: "Personal Data", to: "/account" },
  { icon: Package, label: "My Orders", to: "/account/orders" },
  { icon: Notebook, label: "Manage Address", to: "/account/address" },
  { icon: HelpCircle, label: "Help Center", to: "/account/help-center" },
];

const AccountSidebar = ({
  className = "",
  onNavigate,
  profileImage,
  firstName = "Maram",
  lastName = "Elamly"
}) => {
  return (
    <aside className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full ${className}`}>
      {/* User Profile Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-12 w-12 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
          {profileImage ? (
            <img
              src={profileImage}
              alt={`${firstName} ${lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-medium text-sm">
              {firstName?.[0]}{lastName?.[0]}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-[15px] truncate">{firstName} {lastName}</h3>
          <p className="text-sm text-gray-500 truncate">Customer Operations</p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      {/* Navigation Menu */}
      <nav className="space-y-2 flex-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${isActive
                  ? "text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
                } ${isActive ? 'bg-gradient-to-r from-[#46B6BD] to-[#205457]' : ''}`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>




    </aside>
  );
};

export default AccountSidebar;