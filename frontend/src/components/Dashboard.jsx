import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Dashboard({ costs = [] }) {
  const mockChartData = [
    { date: 'Mon', cost: 15.20 },
    { date: 'Tue', cost: 12.50 },
    { date: 'Wed', cost: 18.75 },
    { date: 'Thu', cost: 14.30 },
    { date: 'Fri', cost: 22.10 },
    { date: 'Sat', cost: 8.40 },
    { date: 'Sun', cost: 11.20 },
  ]

  const totalWeeklyCost = mockChartData.reduce((sum, day) => sum + day.cost, 0)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Cost Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={2} name="Daily Cost" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-center mt-4 text-gray-600">
          Weekly Total: <span className="font-bold text-gray-900">${totalWeeklyCost.toFixed(2)}</span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost by Agent</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costs.length > 0 ? Object.entries(costs).map(([name, data]) => ({
            name,
            cost: data.totalCost || 0,
          })) : []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Bar dataKey="cost" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
        {Object.keys(costs).length === 0 && (
          <p className="text-center text-gray-500 mt-4">No cost data available</p>
        )}
      </div>
    </div>
  )
}
