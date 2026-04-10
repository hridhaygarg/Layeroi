import { theme } from '../styles/theme';

export default function Report() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontSize: '28px' }}>Weekly Report</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            background: theme.colors.accent,
            color: theme.colors.bg,
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: theme.fonts.mono,
            fontSize: '12px',
          }}>Send Now</button>
          <button style={{
            background: 'transparent',
            color: theme.colors.accent,
            border: `1px solid ${theme.colors.accent}`,
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: theme.fonts.mono,
            fontSize: '12px',
          }}>Schedule</button>
        </div>
      </div>

      <div style={{
        background: 'white',
        color: '#000',
        borderRadius: '8px',
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <h1 style={{ fontFamily: theme.fonts.serif, fontSize: '28px', marginBottom: '8px' }}>AgentCFO Weekly Report</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Week of April 7-13, 2026</p>

        <h2 style={{ fontFamily: theme.fonts.serif, fontSize: '16px', marginTop: '20px', marginBottom: '12px' }}>Executive Summary</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
          Your AI agents spent $5,340 this week with $9,240 in estimated value generated. Overall ROI multiple: 1.73×. One agent requires immediate attention.
        </p>

        <h2 style={{ fontFamily: theme.fonts.serif, fontSize: '16px', marginTop: '20px', marginBottom: '12px' }}>Top Recommendation</h2>
        <p style={{ fontSize: '14px', color: '#d32f2f' }}>
          <strong>Retire the cost-optimizer agent</strong> — It has spent $340 this month with 0.6× ROI. Estimated monthly savings if paused: $850.
        </p>
      </div>
    </div>
  );
}
