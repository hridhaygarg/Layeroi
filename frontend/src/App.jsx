import { useState, useEffect } from 'react'
import Sidebar from './layouts/Sidebar'
import Overview from './screens/Overview'
import Agents from './screens/Agents'
import Budget from './screens/Budget'
import Report from './screens/Report'
import Onboarding from './screens/Onboarding'
import Signup from './pages/Signup'
import Landing from './pages/Landing'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('overview')
  const [isProxyActive, setIsProxyActive] = useState(false)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const checkProxy = async () => {
      try {
        const res = await fetch('https://agentcfo-production.up.railway.app/health')
        setIsProxyActive(res.ok)
      } catch {
        setIsProxyActive(false)
      }
    }
    checkProxy()
    const interval = setInterval(checkProxy, 30000)
    return () => clearInterval(interval)
  }, [])

  const screens = {
    overview: Overview,
    agents: Agents,
    budget: Budget,
    report: Report,
    onboarding: Onboarding,
  }

  const CurrentScreen = screens[currentScreen] || Overview

  // Show landing page if on root
  if (currentPath === '/' || currentPath === '') {
    return <Landing />
  }

  // Show signup page if on /signup route
  if (currentPath === '/signup') {
    return <Signup onSuccess={() => window.location.href = '/dashboard'} />
  }

  // Show dashboard for /dashboard and any dashboard routes
  if (currentPath.startsWith('/dashboard')) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar active={currentScreen} onNavigate={setCurrentScreen} />
        <div style={{ marginLeft: '64px', width: 'calc(100% - 64px)' }}>
          <div style={{ height: '60px', background: '#141414', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
            <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '20px' }}>AgentCFO</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(232,230,225,0.7)' }}>System</span>
              <div style={{
                width: '8px',
                height: '8px',
                background: isProxyActive ? '#C8F264' : '#FF4D4D',
                borderRadius: '50%',
                animation: isProxyActive ? 'pulse 2s infinite' : 'none',
              }} />
            </div>
          </div>
          <main style={{ padding: '24px', background: '#080808', minHeight: 'calc(100vh - 60px)' }}>
            <CurrentScreen />
          </main>
        </div>
      </div>
    )
  }

  // Default to dashboard
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar active={currentScreen} onNavigate={setCurrentScreen} />
      <div style={{ marginLeft: '64px', width: 'calc(100% - 64px)' }}>
        <div style={{ height: '60px', background: '#141414', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '20px' }}>AgentCFO</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(232,230,225,0.7)' }}>System</span>
            <div style={{
              width: '8px',
              height: '8px',
              background: isProxyActive ? '#C8F264' : '#FF4D4D',
              borderRadius: '50%',
              animation: isProxyActive ? 'pulse 2s infinite' : 'none',
            }} />
          </div>
        </div>
        <main style={{ padding: '24px', background: '#080808', minHeight: 'calc(100vh - 60px)' }}>
          <CurrentScreen />
        </main>
      </div>
    </div>
  )
}
