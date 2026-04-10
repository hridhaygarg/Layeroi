export default function AgentMetrics({ agents = [] }) {
  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No agents found. Connect your first agent to see metrics.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map(agent => (
        <div key={agent.name} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{agent.name}</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Cost (30d)</span>
              <span className="text-2xl font-bold text-gray-900">${agent.totalCost?.toFixed(2) || '0.00'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Calls</span>
              <span className="text-xl text-gray-900">{agent.calls || 0}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Cost/Call</span>
              <span className="text-lg text-gray-900">${agent.avgCostPerCall?.toFixed(6) || '0.000000'}</span>
            </div>

            <div className="pt-3 mt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${agent.totalCost > 100 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {agent.totalCost > 100 ? '⚠️ High Cost' : '✓ Normal'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
