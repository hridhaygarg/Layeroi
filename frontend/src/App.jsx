import { useState } from 'react'
import DashboardPage from './pages/DashboardPage'
import OnboardingPage from './pages/OnboardingPage'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-gray-900">AgentCFO</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-4 py-2 rounded ${currentPage === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('onboarding')}
              className={`px-4 py-2 rounded ${currentPage === 'onboarding' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Onboarding
            </button>
          </div>
        </div>
      </nav>

      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'onboarding' && <OnboardingPage />}
    </div>
  )
}
