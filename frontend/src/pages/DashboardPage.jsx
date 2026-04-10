import { useState, useEffect } from 'react'
import Dashboard from '../components/Dashboard'
import AgentMetrics from '../components/AgentMetrics'

const API_BASE = 'https://agentcfo-production.up.railway.app'

export default function DashboardPage() {
  const [costs, setCosts] = useState({})
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      const [costsRes, agentsRes] = await Promise.all([
        fetch(`${API_BASE}/api/costs`),
        fetch(`${API_BASE}/api/agents`),
      ])

      if (costsRes.ok && agentsRes.ok) {
        const costsData = await costsRes.json()
        const agentsData = await agentsRes.json()

        setCosts(costsData.costs || {})

        const agentList = agentsData.agents.map(name => ({
          name,
          ...costsData.costs?.[name],
        }))
        setAgents(agentList)
        setError(null)
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <p className="text-red-600 text-sm mt-2">Make sure the backend server is running</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Monitor AI agent costs and usage in real-time</p>
      </div>

      <Dashboard costs={costs} />

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Metrics</h2>
        <AgentMetrics agents={agents} />
      </div>
    </div>
  )
}
