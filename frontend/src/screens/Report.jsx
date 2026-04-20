import { useState, useEffect } from 'react';
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

export default function Report() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [reportData, setReportData] = useState({
    totalSpend: 0,
    valueGenerated: 0,
    roiMultiple: 0,
    problematicAgent: null,
    estimatedSavings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        let orgId = authService.org?.id;
        if (!orgId) { try { const t = localStorage.getItem("layeroi_token"); if (t) { orgId = JSON.parse(atob(t.split(".")[1])).orgId; } } catch(e) {} }

        if (!orgId) {
          setError('Organization not found');
          setLoading(false);
          return;
        }

        // Fetch dashboard stats and cost breakdown for report
        const [statsResponse, breakdownResponse] = await Promise.all([
          apiService.getDashboardStats(orgId),
          apiService.getCostsBreakdown(orgId, 'agent'),
        ]);

        if (statsResponse) {
          const problematicAgent = breakdownResponse?.agents?.find(a => a.roi < 1);
          setReportData({
            totalSpend: statsResponse.totalSpend || 0,
            valueGenerated: statsResponse.valueGenerated || 0,
            roiMultiple: statsResponse.roiMultiple || 0,
            problematicAgent: problematicAgent || null,
            estimatedSavings: problematicAgent ? (problematicAgent.cost * 2.5) : 0,
          });
        }

        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>
        <div style={{ fontSize: '16px' }}>Generating report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#fee2e2', border: `1px solid ${colors.dangerRed}`, color: colors.dangerRed, padding: '16px', borderRadius: '8px' }}>
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Error loading report</div>
        <div style={{ fontSize: '14px' }}>{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '32px',
        gap: isMobile ? '16px' : '0',
      }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: isMobile ? '24px' : '32px',
          fontWeight: '700',
          color: colors.textPrimary,
        }}>
          Reports
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            background: colors.accentGreen,
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 200ms',
          }}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
          >
            Send Now
          </button>
          <button style={{
            background: 'transparent',
            color: colors.accentGreen,
            border: `1.5px solid ${colors.accentGreen}`,
            padding: '10px 18px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 200ms',
          }}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
          >
            Schedule
          </button>
        </div>
      </div>

      <div style={{
        background: colors.bgSurface,
        color: colors.textPrimary,
        borderRadius: '8px',
        border: `1px solid ${colors.borderDefault}`,
        padding: '48px',
        maxWidth: '900px',
        boxShadow: colors.shadowSm,
      }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '12px',
          color: colors.textPrimary,
        }}>
          layeroi Weekly Report
        </h1>
        <p style={{
          color: colors.textSecondary,
          marginBottom: '32px',
          fontSize: '14px',
        }}>
          Month of {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>

        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '20px',
          fontWeight: '600',
          marginTop: '32px',
          marginBottom: '16px',
          color: colors.textPrimary,
        }}>
          Executive Summary
        </h2>
        <p style={{
          fontSize: '15px',
          lineHeight: '1.7',
          marginBottom: '32px',
          color: colors.textSecondary,
        }}>
          Your AI agents spent <span style={{ color: colors.textPrimary, fontWeight: '600', fontFamily: 'IBM Plex Mono, monospace' }}>${(reportData?.totalSpend ?? 0).toLocaleString()}</span> this month with <span style={{ color: colors.accentGreen, fontWeight: '600', fontFamily: 'IBM Plex Mono, monospace' }}>${(reportData?.valueGenerated ?? 0).toLocaleString()}</span> in estimated value generated. Overall ROI multiple: <span style={{ color: colors.accentGreen, fontWeight: '600', fontFamily: 'IBM Plex Mono, monospace' }}>{(reportData?.roiMultiple ?? 0).toFixed(2)}×</span>. {reportData.problematicAgent && 'One agent requires immediate attention.'}
        </p>

        {reportData.problematicAgent && (
          <div style={{
            background: '#fef2f2',
            border: `1px solid ${colors.dangerRed}`,
            borderRadius: '8px',
            padding: '20px',
            marginTop: '24px',
          }}>
            <h3 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px',
              color: colors.dangerRed,
            }}>
              ⚠️ Top Recommendation
            </h3>
            <p style={{
              fontSize: '14px',
              color: colors.dangerRed,
              lineHeight: '1.6',
            }}>
              <strong>Review the {reportData.problematicAgent.name} agent</strong> — It has spent <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>${(reportData?.problematicAgent?.cost ?? 0).toLocaleString()}</span> with <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{(reportData?.problematicAgent?.roi ?? 0).toFixed(1)}× ROI</span>. Estimated monthly savings if optimized: <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>${(reportData?.estimatedSavings ?? 0).toLocaleString()}</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
