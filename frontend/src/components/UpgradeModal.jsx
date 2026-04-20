import { useState, useEffect } from 'react';

export function UpgradeModal({ isOpen, onClose, currentPlan = 'free' }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('https://api.layeroi.com/payments/plans')
        .then(r => r.json())
        .then(res => setPlans(res.data || []))
        .catch(() => setError('Could not load plans'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpgrade = async (planId) => {
    setLoading(planId);
    setError(null);
    try {
      const token = localStorage.getItem('layeroi_token');
      const res = await fetch('https://api.layeroi.com/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.success && data.data?.checkout_url) {
        window.location.href = data.data.checkout_url;
      } else {
        setError(data.error?.message || 'Could not create checkout');
        setLoading(null);
      }
    } catch {
      setError('Something went wrong');
      setLoading(null);
    }
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflow: 'auto',
      }}>
        <div style={{ padding: '32px 32px 0', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: '32px', color: 'white', margin: 0 }}>Upgrade layeroi</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '8px 0 0' }}>Unlock full financial intelligence for your AI agents</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '28px', padding: '4px' }}>×</button>
        </div>

        {error && (
          <div style={{ margin: '16px 32px 0', padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '13px' }}>{error}</div>
        )}

        <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {plans.map(plan => (
            <div key={plan.id} style={{
              background: plan.highlighted ? 'linear-gradient(180deg, rgba(34,197,94,0.05) 0%, #141414 100%)' : '#141414',
              border: plan.highlighted ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', padding: '28px 24px', position: 'relative',
            }}>
              {plan.badge && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: '#050505', fontSize: '10px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', padding: '4px 12px', borderRadius: '100px', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                  {plan.badge.toUpperCase()}
                </div>
              )}
              <div style={{ fontSize: '24px', color: 'white', marginBottom: '12px', fontWeight: 600 }}>{plan.name}</div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '36px', color: 'white', letterSpacing: '-0.03em' }}>{plan.price_display.split('/')[0]}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginLeft: '4px' }}>/month</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#22c55e', letterSpacing: '0.06em', marginBottom: '24px' }}>
                {plan.agent_limit === -1 ? 'UNLIMITED AGENTS' : `UP TO ${plan.agent_limit} AGENTS`}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', padding: '5px 0', display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#22c55e', flexShrink: 0 }}>→</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleUpgrade(plan.id)} disabled={loading === plan.id || currentPlan === plan.id} style={{
                width: '100%', padding: '12px',
                background: currentPlan === plan.id ? 'rgba(255,255,255,0.06)' : plan.highlighted ? '#22c55e' : 'rgba(255,255,255,0.9)',
                color: currentPlan === plan.id ? 'rgba(255,255,255,0.4)' : '#050505',
                border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
                cursor: currentPlan === plan.id ? 'default' : 'pointer',
                opacity: loading && loading !== plan.id ? 0.5 : 1,
              }}>
                {loading === plan.id ? 'Redirecting...' : currentPlan === plan.id ? 'Current plan' : `Upgrade to ${plan.name} →`}
              </button>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 32px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em', margin: 0 }}>
            SECURE PAYMENT BY DODO · CANCEL ANYTIME · HELLO@LAYEROI.COM
          </p>
        </div>
      </div>
    </div>
  );
}
