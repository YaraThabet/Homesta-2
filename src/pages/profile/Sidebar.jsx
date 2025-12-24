import React from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart2, PlusSquare, Box, TrendingUp, Settings, LogOut } from 'lucide-react'
import { logo } from '../../assets'

const Sidebar = () => {
  const menu = [
    { id: 1, icon: BarChart2, label: 'Company Data', to: '/analytics/company' },
    { id: 2, icon: PlusSquare, label: 'Add Product', to: '/analytics/add' },
    { id: 3, icon: Box, label: 'Product', to: '/analytics/product' },
    { id: 4, icon: TrendingUp, label: 'Analytics', to: '/analytics' },
  ]

  return (
    <aside className="w-[260px] min-h-screen bg-white rounded-lg shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-200">
            <img src={logo} alt="CasaLux" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-medium">CasaLux</p>
            <p className="text-sm text-gray-400">Company</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-4 flex flex-col gap-2 px-2">
          {menu.map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-[#46B6BD] to-[#205457] shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t p-6">
        <NavLink
          to="/analytics/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </NavLink>

        <button className="w-full mt-3 flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200">
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
