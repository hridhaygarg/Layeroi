import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';

const colors = {
  bgPrimary: '#050505',
  bgSurface: '#0f0f0f',
  bgSubtle: '#151515',
  bgProfit: 'rgba(34,197,94,0.08)',
  bgLoss: 'rgba(239,68,68,0.08)',
  bgWarning: 'rgba(245,158,11,0.08)',
  borderDefault: 'rgba(255,255,255,0.09)',
  borderStrong: 'rgba(255,255,255,0.14)',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.55)',
  textTertiary: 'rgba(255,255,255,0.38)',
  accentGreen: '#22c55e',
  accentGreenLight: 'rgba(34,197,94,0.08)',
  accentGreenBorder: 'rgba(34,197,94,0.22)',
  dangerRed: '#ef4444',
  dangerLight: 'rgba(239,68,68,0.08)',
  dangerBorder: 'rgba(239,68,68,0.22)',
  warningAmber: '#f59e0b',
  warningLight: 'rgba(245,158,11,0.08)',
  shadowSm: '0 0 0 1px rgba(255,255,255,0.06)',
  shadowMd: '0 0 0 1px rgba(255,255,255,0.06), 0 6px 20px rgba(0,0,0,0.3)',
};

export default function Overview() {
  const [metrics, setMetrics] = useState({
    totalSpend: 0,
    valueGenerated: 0,
    roiMultiple: 0,
    wastefulSpend: 0,
  });
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let orgId = authService.org?.id;

        // Fallback: try to extract orgId from JWT if authService.org is not set
        if (!orgId) {
          try {
            const token = localStorage.getItem('layeroi_token');
            if (token) {
              const payload = JSON.parse(atob(token.split('.')[1]));
              orgId = payload.orgId;
            }
          } catch (e) { /* ignore parse errors */ }
        }

        if (!orgId) {
          setError('Organization not found. Please log out and sign in again.');
          setLoading(false);
          return;
        }

        // Fetch dashboard stats and agents in parallel
        const [statsResponse, agentsResponse] = await Promise.all([
          apiService.getDashboardStats(orgId),
          apiService.getAgents(orgId),
        ]);

        if (statsResponse) {
          setMetrics({
            totalSpend: statsResponse.totalSpend || 0,
            valueGenerated: statsResponse.valueGenerated || 0,
            roiMultiple: statsResponse.roiMultiple || 0,
            wastefulSpend: statsResponse.wastefulSpend || 0,
          });
        }

        if (agentsResponse && Array.isArray(agentsResponse)) {
          setAgents(agentsResponse);
        } else if (agentsResponse && agentsResponse.agents) {
          setAgents(agentsResponse.agents);
        }

        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        // Fallback to empty state instead of mock data
        setMetrics({
          totalSpend: 0,
          valueGenerated: 0,
          roiMultiple: 0,
          wastefulSpend: 0,
        });
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = agents.map(agent => ({
    name: agent.name,
    cost: agent.cost || 0,
    value: agent.value || 0,
    roi: agent.roi || 0,
  }));

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>
        <div style={{ fontSize: '16px' }}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#fee2e2', border: `1px solid ${colors.dangerRed}`, color: colors.dangerRed, padding: '16px', borderRadius: '8px' }}>
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Error loading dashboard</div>
        <div style={{ fontSize: '14px' }}>{error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
      }}>
        {/* Total Spend Card */}
        <div style={{
          background: colors.bgSurface,
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: '8px',
          padding: '24px',
          boxShadow: colors.shadowSm,
        }}>
          <div style={{
            fontSize: '12px',
            fontFamily: 'IBM Plex Mono, monospace',
            color: colors.textTertiary,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Total AI Spend
          </div>
          <div style={{
            fontSize: '36px',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            color: colors.dangerRed,
            marginBottom: '8px',
          }}>
            ${(metrics?.totalSpend ?? 0).toLocaleString()}
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary,
            fontFamily: 'Inter, sans-serif',
          }}>
            this month
          </div>
        </div>

        {/* Value Generated Card */}
        <div style={{
          background: colors.bgSurface,
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: '8px',
          padding: '24px',
          boxShadow: colors.shadowSm,
        }}>
          <div style={{
            fontSize: '12px',
            fontFamily: 'IBM Plex Mono, monospace',
            color: colors.textTertiary,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Value Generated
          </div>
          <div style={{
            fontSize: '36px',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            color: colors.accentGreen,
            marginBottom: '8px',
          }}>
            ${(metrics?.valueGenerated ?? 0).toLocaleString()}
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary,
            fontFamily: 'Inter, sans-serif',
          }}>
            estimated value
          </div>
        </div>

        {/* ROI Multiple Card */}
        <div style={{
          background: colors.bgProfit,
          border: `1px solid ${colors.accentGreenBorder}`,
          borderRadius: '8px',
          padding: '24px',
          boxShadow: colors.shadowSm,
        }}>
          <div style={{
            fontSize: '12px',
            fontFamily: 'IBM Plex Mono, monospace',
            color: colors.textTertiary,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Net ROI Multiple
          </div>
          <div style={{
            fontSize: '36px',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            color: colors.accentGreen,
            marginBottom: '8px',
          }}>
            {metrics.roiMultiple}×
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary,
            fontFamily: 'Inter, sans-serif',
          }}>
            profitable return
          </div>
        </div>

        {/* Wasteful Spend Card */}
        <div style={{
          background: colors.bgSurface,
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: '8px',
          padding: '24px',
          boxShadow: colors.shadowSm,
        }}>
          <div style={{
            fontSize: '12px',
            fontFamily: 'IBM Plex Mono, monospace',
            color: colors.textTertiary,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Wasteful Spend
          </div>
          <div style={{
            fontSize: '36px',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            color: colors.dangerRed,
            marginBottom: '8px',
          }}>
            ${metrics.wastefulSpend}
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary,
            fontFamily: 'Inter, sans-serif',
          }}>
            being burned
          </div>
        </div>
      </div>

      {/* Agent Cost Chart */}
      {agents.length > 0 && (
        <div style={{
          background: colors.bgSurface,
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '40px',
          boxShadow: colors.shadowSm,
        }}>
          <h3 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '18px',
            fontWeight: '600',
            color: colors.textPrimary,
            marginBottom: '24px',
          }}>
            Cost by Agent
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.borderDefault} />
              <XAxis dataKey="name" tick={{ fill: colors.textSecondary, fontSize: 12 }} />
              <YAxis tick={{ fill: colors.textSecondary, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: colors.bgSurface,
                  border: `1px solid ${colors.borderDefault}`,
                  borderRadius: '6px',
                }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="cost" fill={colors.accentGreen} name="Cost" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Agent P&L Table */}
      <div style={{
        background: colors.bgSurface,
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: colors.shadowSm,
      }}>
        <h3 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '18px',
          fontWeight: '600',
          color: colors.textPrimary,
          marginBottom: '24px',
        }}>
          Agent P&L
        </h3>
        {agents.length === 0 ? (
          <div style={{ color: colors.textSecondary, textAlign: 'center', padding: '32px' }}>
            No agents connected yet
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.borderDefault}` }}>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: colors.textSecondary,
                    fontWeight: '600',
                    fontSize: '12px',
                  }}>Agent</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'right',
                    color: colors.textSecondary,
                    fontWeight: '600',
                    fontSize: '12px',
                    fontFamily: 'IBM Plex Mono, monospace',
                  }}>Cost (30d)</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'right',
                    color: colors.textSecondary,
                    fontWeight: '600',
                    fontSize: '12px',
                    fontFamily: 'IBM Plex Mono, monospace',
                  }}>Tasks</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'right',
                    color: colors.textSecondary,
                    fontWeight: '600',
                    fontSize: '12px',
                    fontFamily: 'IBM Plex Mono, monospace',
                  }}>Value Generated</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'right',
                    color: colors.textSecondary,
                    fontWeight: '600',
                    fontSize: '12px',
                    fontFamily: 'IBM Plex Mono, monospace',
                  }}>ROI</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent, i) => (
                  <tr key={agent.id} style={{
                    borderBottom: i < agents.length - 1 ? `1px solid ${colors.borderDefault}` : 'none',
                    background: i % 2 === 0 ? 'transparent' : colors.bgSubtle,
                  }}>
                    <td style={{
                      padding: '12px',
                      color: colors.textPrimary,
                      fontWeight: '500',
                    }}>{agent.name}</td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'right',
                      color: colors.textPrimary,
                      fontFamily: 'IBM Plex Mono, monospace',
                    }}>${(agent.cost || 0).toLocaleString()}</td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'right',
                      color: colors.textSecondary,
                      fontFamily: 'IBM Plex Mono, monospace',
                    }}>{agent.tasks || 0}</td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'right',
                      color: colors.accentGreen,
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontWeight: '600',
                    }}>${(agent.value || 0).toLocaleString()}</td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'right',
                      color: (agent.roi || 0) > 1 ? colors.accentGreen : colors.dangerRed,
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontWeight: '600',
                    }}>{(agent.roi || 0).toFixed(1)}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
