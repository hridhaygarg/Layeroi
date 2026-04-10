export default function Landing() {
  return (
    <div style={{ background: '#080808', color: 'rgba(232,230,225,1)' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <h1 style={{ fontSize: '24px' }}>AgentCFO</h1>
        <a href="/signup"><button style={{
          background: '#C8F264',
          color: '#080808',
          border: 'none',
          padding: '10px 24px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
        }}>Get Started Free</button></a>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '80px auto',
        textAlign: 'center',
        padding: '0 40px',
      }}>
        <h2 style={{ fontSize: '48px', marginBottom: '24px' }}>Financial Control for Your AI Agents</h2>
        <p style={{ fontSize: '18px', color: 'rgba(232,230,225,0.7)', marginBottom: '32px' }}>
          See which agents are profitable. Stop the ones burning money. Real-time P&L dashboard.
        </p>
        <a href="/dashboard"><button style={{
          fontSize: '16px',
          padding: '12px 32px',
          background: '#C8F264',
          color: '#080808',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
        }}>View Live Dashboard</button></a>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        margin: '80px 0',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '0 40px',
      }}>
        <div style={{
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '40px 24px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Starter</h3>
          <div style={{ fontSize: '32px', color: '#C8F264', marginBottom: '24px' }}>
            $499<span style={{ fontSize: '16px' }}>/mo</span>
          </div>
          <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '24px' }}>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ Up to 5 agents</li>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ 30 days history</li>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ Cost alerts</li>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ Email support</li>
          </ul>
          <button style={{
            width: '100%',
            background: '#C8F264',
            color: '#080808',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
          }}>Choose Plan</button>
        </div>

        <div style={{
          background: '#141414',
          border: '2px solid #C8F264',
          borderRadius: '12px',
          padding: '40px 24px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Business</h3>
          <div style={{ fontSize: '32px', color: '#C8F264', marginBottom: '24px' }}>
            $2,500<span style={{ fontSize: '16px' }}>/mo</span>
          </div>
          <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '24px' }}>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ Unlimited agents</li>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ Full history</li>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ API access</li>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ Slack integrations</li>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ Priority support</li>
          </ul>
          <button style={{
            width: '100%',
            background: '#C8F264',
            color: '#080808',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
          }}>Choose Plan</button>
        </div>

        <div style={{
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '40px 24px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Enterprise</h3>
          <div style={{ fontSize: '32px', color: '#C8F264', marginBottom: '24px' }}>Custom</div>
          <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '24px' }}>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ Everything in Business</li>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ Custom integrations</li>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ Dedicated account</li>
            <li style={{ padding: '8px 0', fontSize: '14px' }}>✓ SLA guarantee</li>
          </ul>
          <button style={{
            width: '100%',
            background: '#C8F264',
            color: '#080808',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
          }}>Contact Sales</button>
        </div>
      </div>

      <footer style={{
        textAlign: 'center',
        padding: '40px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        marginTop: '80px',
        color: 'rgba(232,230,225,0.5)',
      }}>
        <p>&copy; 2026 AgentCFO. All rights reserved.</p>
      </footer>
    </div>
  )
}
