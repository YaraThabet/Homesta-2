import React from 'react'

const stats = [
  { id: 1, label: 'Total Products', value: 6 },
  { id: 2, label: 'Total Sales', value: 500 },
  { id: 3, label: 'Total Profit', value: '$88,650' },
]

const StatCard = ({ stat }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <p className="text-sm text-gray-500">{stat.label}</p>
    <p className="text-2xl font-semibold mt-2">{stat.value}</p>
  </div>
)

const Overview = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Sales Analytics</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(s => (
          <StatCard key={s.id} stat={s} />
        ))}
      </div>
    </div>
  )
}

export default Overview
