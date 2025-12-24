import React, { useState } from "react";
import { logo } from "../../assets/index";
import { NavLink } from "react-router-dom";
import {
  PlusSquare,
  Box,
  TrendingUp,
  Settings,
  LogOut,
  Building,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Trash2,
  Home,
  Package,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import { FaCheck } from "react-icons/fa";

const stats = [
  { id: 1, label: "Companies", value: 1, icon: Building },
  { id: 2, label: "Products", value: 200, icon: Package },
  { id: 3, label: "Orders", value: 200, icon: ShoppingBag },
  { id: 4, label: "Revenue", value: "$15,000", icon: DollarSign },
];

const Sidebar = () => {
  const menu = [
    { id: 1, icon: Home, label: "Dashboard", to: "/dashboard" },
    { id: 2, icon: PlusSquare, label: "AddProduct", to: "/addproduct" },
    { id: 3, icon: Box, label: "Product", to: "/product" },
    { id: 4, icon: TrendingUp, label: "Analytics", to: "/analytics" },
  ];

  return (
    <aside className="w-full bg-white rounded-lg shadow-sm h-fit">
      <div className="flex items-center gap-4 p-5">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-200">
          <img
            src={logo}
            alt="CasaLux"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium text-gray-800">CasaLux</p>
          <p className="text-sm text-gray-400">Company</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 px-4 py-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium 
                transition-colors duration-200 
                ${
                  isActive
                    ? "text-white bg-gradient-to-r from-[#46B6BD] to-[#205457] shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t p-6 mt-4">
        <NavLink
          to="/analytics/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </NavLink>

        <button className="w-full mt-3 flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200">
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow duration-200">
      <div className="p-3 rounded-full bg-gradient-to-r from-[#46B6BD] to-[#205457] mb-3">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
      <p className="text-2xl font-bold text-[#205457]">{stat.value}</p>
    </div>
  );
};

const Dashboard = () => {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "HomeStyle",
      email: "info@HomeStyle.com",
      status: "Pending",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} />
            Active
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} />
            Pending
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 mt-40">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="col-span-1">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="col-span-1 lg:col-span-3">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <StatCard key={stat.id} stat={stat} />
                ))}
              </div>

              {/* Registered Companies Section */}
              <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="p-6 ">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Registered Companies
                      </h3>
                    </div>
                    
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="p-6 ">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#46B6BD]"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#46B6BD]"
                        >
                          <option value="All">All Status</option>
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Companies Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCompanies.map((company) => (
                        <tr
                          key={company.id}
                          className=" hover:bg-gray-50 transition-colors"
                        >
                          {/* Company Column */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                             
                              <div>
                                <p className="font-medium text-gray-800">
                                  {company.name}
                                </p>
                                
                               
                              </div>
                            </div>
                          </td>

                          {/* Email Column */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <Mail size={16} />
                              <span className="text-sm">{company.email}</span>
                            </div>
                           
                          </td>

                          {/* Status Column */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              {getStatusBadge(company.status)}
                            </div>
                          </td>

                          {/* Action Column */}
                          <td className="px-6 py-4">
                            <div className="flex justify-end items-center gap-2">
                              <button
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <FaCheck size={18} />
                              </button>
                              <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>







              
              <div className="bg-white rounded-lg shadow-sm">
                
                <br />
                <div className="p-6 ">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Registered Companies
                      </h3>
                    </div>
                  </div>
                </div>
              

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCompanies.map((company) => (
                      <tr
                        key={company.id}
                        className=" hover:bg-gray-50 transition-colors"
                      >
                        {/* Company Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                           
                            <div>
                              <p className="font-medium text-gray-800">
                                {company.name}
                              </p>
                              
                          
                            </div>
                          </div>
                        </td>

                        {/* Email Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Mail size={16} />
                            <span className="text-sm">{company.email}</span>
                          </div>
                       
                        </td>

                        {/* Status Column */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            {getStatusBadge(company.status)}
                          </div>
                        </td>

                        {/* Action Column */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
