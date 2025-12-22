import React from 'react'
import { logo } from '../../assets/index'
import { NavLink } from 'react-router-dom'
import { BarChart2, PlusSquare, Box, TrendingUp, Settings, LogOut } from 'lucide-react'

const stats = [
  { id: 1, label: 'Total Products', value: 6 },
  { id: 2, label: 'Total Sales', value: 500 },
  { id: 3, label: 'Total Profit', value: '$88,650' },
]

const bestSelling = [
  { id: 1, title: 'Ergonomic Office Chair', category: 'Office Furniture', sales: '230 units', percentage: '46.0%', profit: '$28,000' },
  { id: 2, title: 'Modern Leather Sofa', category: 'Furniture', sales: '145 units', percentage: '29.0%', profit: '$35,000' },
  { id: 3, title: 'Outdoor Lounge Set', category: 'Outdoor', sales: '98 units', percentage: '19.6%', profit: '$22,000' },
]

const leastSelling = [
  { id: 1, title: 'Ceramic Table Lamp', category: 'Office Furniture', sales: '12 units', percentage: '2.4%', profit: '$3,200' },
  { id: 2, title: 'Dinnerware Set', category: 'Kitchen', sales: '15 units', percentage: '3.0%', profit: '$450' },
  { id: 3, title: 'Oak Dining Table', category: 'Furniture', sales: '30 units', percentage: '19.6%', profit: '$10,000' },
]

const Sidebar = () => {
  const menu = [
    { id: 1, icon: BarChart2, label: 'Company Data', to: '/analytics/company' },
    { id: 2, icon: PlusSquare, label: 'Add Product', to: '/analytics/add' },
    { id: 3, icon: Box, label: 'Product', to: '/analytics/product' },
    { id: 4, icon: TrendingUp, label: 'Analytics', to: '/analytics' },
  ]

  return (
    <aside className="w-full bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-4 mt-5 p-5">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-200">
          <img src={logo} alt="CasaLux" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-medium">CasaLux</p>
          <p className="text-sm text-gray-400">Company</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-2 px-2">
        {menu.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${isActive ? 'text-white bg-gradient-to-r from-[#46B6BD] to-[#205457] shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-6 border-t p-6">
        <NavLink to="/analytics/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
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

const StatCard = ({ stat }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center justify-center text-center">
    <p className="text-sm text-gray-500">{stat.label}</p>
    <p className="text-3xl font-bold mt-3">{stat.value}</p>
  </div>
)

const ProductRow = ({ item, rankColor }) => (
  <div className="bg-white rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm">
    <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${rankColor}`}>{item.id}</div>
      <div>
        <p className="font-medium">{item.title}</p>
        <p className="text-sm text-gray-400">{item.category}</p>
      </div>
    </div>
    <div className="mt-3 sm:mt-0 text-sm text-gray-500 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto">
      <div className="text-left sm:text-right">
        <p className="text-black">{item.sales.split(' ')[0]}</p>
        <p className="text-gray-400">Sales</p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-black">{item.percentage}</p>
        <p className="text-gray-400">Percentage</p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-black">{item.profit}</p>
        <p className="text-gray-400">Profit</p>
      </div>
    </div>
  </div>
)

const Analytics = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 mt-[168px]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-1">
            <Sidebar />
          </div>

          <main className="col-span-1 lg:col-span-3 p-5">
            <div className="space-y-6">
              
              <div >
                <div className='w-full h-10 p-1 mb-4 bg-white'>
                  <h2 className="text-xl font-semibold mb-4">Sales Analytics</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.map(s => (
                    <StatCard key={s.id} stat={s} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold ">Best Selling Products</h3>
                  <div className="mt-4 flex flex-col gap-4">
                    {bestSelling.map((p, i) => (
                      <ProductRow key={p.id} item={p} rankColor={['bg-gradient-to-b from-[#46B6BD] to-[#205457]','bg-gradient-to-b from-[#46B6BD] to-[#205457]','bg-gradient-to-b from-[#46B6BD] to-[#205457]'][i] || 'bg-gray-300'} />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">Least Selling Products</h3>
                  <div className="mt-4 flex flex-col gap-4">
                    {leastSelling.map((p, i) => (
                      <ProductRow key={p.id} item={p} rankColor={['bg-[#DB1E01]','bg-[#DB1E01]','bg-[#DB1E01]'][i] || 'bg-gray-300'} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Analytics
