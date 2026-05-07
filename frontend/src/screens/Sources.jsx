import { useState, useEffect } from 'react';
import { Icon } from './components/Icon';

const API = 'https://api.layeroi.com';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', desc: 'Import spend data from your OpenAI organization. Requires an admin API key (sk-admin-...).', keyLabel: 'Admin API Key', placeholder: 'sk-admin-...', helpUrl: 'https://platform.openai.com/settings/organization/admin-keys', ready: true },
  { id: 'anthropic', name: 'Anthropic', desc: 'Import spend data from your Anthropic workspace. Requires an admin API key.', keyLabel: 'Admin API Key', placeholder: 'sk-ant-admin-...', helpUrl: 'https://console.anthropic.com/settings/admin-keys', ready: true },
  { id: 'bedrock', name: 'AWS Bedrock', desc: 'Import AI spend from AWS Cost Explorer filtered to Bedrock. Requires IAM credentials with CostExplorerReadOnly.', keyLabel: 'Access Key ID', placeholder: 'AKIA...', isAws: true, ready: false },
];

export default function Sources() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectModal, setConnectModal] = useState(null);
  const [formData, setFormData] = useState({ apiKey: '', nickname: '', accessKeyId: '', secretKey: '', region: 'us-east-1' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const org = JSON.parse(localStorage.getItem('layeroi_org') || 'null');
  const token = localStorage.getItem('layeroi_token');
  let orgId = org?.id;
  if (!orgId) { try { orgId = JSON.parse(atob(token.split('.')[1])).orgId; } catch(e) {} }

  const fetchSources = async () => {
    if (!orgId) { setLoading(false); return; }
    try {
      const res = await fetch(`${API}/api/sources?orgId=${orgId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSources(data.sources || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchSources(); }, []);

  const handleConnect = async () => {
    setSubmitting(true); setError('');
    try {
      const provider = connectModal;
      const credentials = provider === 'bedrock'
        ? { access_key_id: formData.accessKeyId, secret_access_key: formData.secretKey, region: formData.region }
        : { api_key: formData.apiKey };

      const res = await fetch(`${API}/api/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orgId, provider, nickname: formData.nickname || null, credentials }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to connect'); setSubmitting(false); return; }
      setConnectModal(null);
      setFormData({ apiKey: '', nickname: '', accessKeyId: '', secretKey: '', region: 'us-east-1' });
      await fetchSources();
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  const handleSync = async (id) => {
    await fetch(`${API}/api/sources/${id}/sync`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    await fetchSources();
  };

  const handleDisconnect = async (id) => {
    await fetch(`${API}/api/sources/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    await fetchSources();
  };

  const timeAgo = (d) => {
    if (!d) return 'Never';
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'Just now';
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return `${Math.floor(s/86400)}d ago`;
  };

  const statusColor = { active: '#22c55e', pending: '#f59e0b', error: '#ef4444', disabled: 'rgba(255,255,255,0.38)' };

  return (
    <>
      <header style={{ marginBottom: '32px' }}>
        <h1 className='serif' style={{ fontSize: '40px', lineHeight: 1.1, color: 'white', margin: 0 }}>Sources</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', marginTop: '6px' }}>Connect your AI spend data. layeroi imports billing records automatically.</p>
      </header>

      {/* Provider cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {PROVIDERS.map(p => (
          <div key={p.id} style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {!p.ready && (
              <span className='mono' style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '9px', color: '#f59e0b', letterSpacing: '0.12em', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '100px', padding: '3px 10px', fontWeight: 500 }}>COMING SOON</span>
            )}
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>{p.name}</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, flex: 1, marginBottom: '20px' }}>{p.desc}</p>
            {p.ready ? (
              <button onClick={() => { setConnectModal(p.id); setError(''); }} style={{
                width: '100%', padding: '10px', background: '#22c55e', color: '#050505', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}>Connect {p.name}</button>
            ) : (
              <button onClick={() => {}} style={{
                width: '100%', padding: '10px', background: 'transparent', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'default',
              }}>Notify me when ready</button>
            )}
          </div>
        ))}
        <div style={{ gridColumn: '1 / -1', marginTop: '4px' }}>
          <p style={{ fontSize: '13px', color: '#a1a1aa', fontStyle: 'italic', margin: 0 }}>
            AWS Bedrock integration is in final testing. OpenAI and Anthropic are fully supported — Bedrock ships in the next release.
          </p>
        </div>
      </section>

      {/* Connected sources */}
      <section style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className='serif' style={{ fontSize: '22px', color: 'white', margin: 0 }}>Connected sources</h2>
        </div>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.55)' }}>Loading...</div>
        ) : sources.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div className='mono' style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.1em', marginBottom: '8px' }}>NO SOURCES YET</div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>Connect your first source above to start importing real agent spend data.</p>
          </div>
        ) : (
          <div>
            {sources.map(s => (
              <div key={s.id} style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{s.nickname || s.provider}</div>
                  <div className='mono' style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)' }}>{s.provider} · Last synced: {timeAgo(s.last_synced_at)}</div>
                  {s.last_error && <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{s.last_error.slice(0, 80)}</div>}
                </div>
                <span className='mono' style={{ fontSize: '10px', color: statusColor[s.status] || 'white', letterSpacing: '0.08em', fontWeight: 500 }}>{s.status.toUpperCase()}</span>
                <button onClick={() => handleSync(s.id)} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '12px', cursor: 'pointer' }}>Sync now</button>
                <button onClick={() => handleDisconnect(s.id)} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Disconnect</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Connect Modal */}
      {connectModal && (() => {
        const p = PROVIDERS.find(x => x.id === connectModal);
        return (
          <div onClick={e => e.target === e.currentTarget && setConnectModal(null)} style={{
            position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          }}>
            <div style={{ background: '#151515', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '14px', width: '100%', maxWidth: '480px', padding: '32px' }}>
              <h3 className='serif' style={{ fontSize: '24px', color: 'white', margin: '0 0 8px' }}>Connect {p.name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', marginBottom: '24px', lineHeight: 1.5 }}>
                Your credentials are encrypted at rest with AES-256-GCM. Read-only access to billing data only.
              </p>

              {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px' }}>Nickname (optional)</label>
                <input value={formData.nickname} onChange={e => setFormData({ ...formData, nickname: e.target.value })} placeholder="e.g. Production OpenAI"
                  style={{ width: '100%', padding: '10px 14px', background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>

              {p.isAws ? (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px' }}>Access Key ID</label>
                    <input value={formData.accessKeyId} onChange={e => setFormData({ ...formData, accessKeyId: e.target.value })} placeholder="AKIA..."
                      style={{ width: '100%', padding: '10px 14px', background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px' }}>Secret Access Key</label>
                    <input type="password" value={formData.secretKey} onChange={e => setFormData({ ...formData, secretKey: e.target.value })} placeholder="Secret..."
                      style={{ width: '100%', padding: '10px 14px', background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px' }}>Region</label>
                    <select value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}>
                      <option value="us-east-1">us-east-1</option><option value="us-west-2">us-west-2</option><option value="eu-west-1">eu-west-1</option><option value="ap-southeast-1">ap-southeast-1</option>
                    </select>
                  </div>
                </>
              ) : (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px' }}>{p.keyLabel}</label>
                  <input type="password" value={formData.apiKey} onChange={e => setFormData({ ...formData, apiKey: e.target.value })} placeholder={p.placeholder}
                    style={{ width: '100%', padding: '10px 14px', background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                  {p.helpUrl && <a href={p.helpUrl} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: '8px', fontSize: '12px', color: '#22c55e' }}>How do I get this key?</a>}
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.38)' }}>Tip: prefix with <span className='mono'>sk-admin-test-</span> to demo with mock data (no real API call).</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setConnectModal(null)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '8px', color: 'rgba(255,255,255,0.75)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleConnect} disabled={submitting} style={{ flex: 1, padding: '10px', background: '#22c55e', color: '#050505', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', opacity: submitting ? 0.5 : 1 }}>
                  {submitting ? 'Connecting...' : 'Connect & sync'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
