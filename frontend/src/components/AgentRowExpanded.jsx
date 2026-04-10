import { theme } from '../styles/theme';

export default function AgentRowExpanded({ agent }) {
  return (
    <div style={{
      background: theme.colors.bg,
      padding: '20px',
      borderTop: `1px solid ${theme.colors.border}`,
      fontSize: '12px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div>
          <div style={{ color: theme.colors.text.secondary, marginBottom: '4px' }}>Total Cost</div>
          <div style={{ fontFamily: theme.fonts.serif, fontSize: '18px', color: theme.colors.accent }}>
            ${agent.cost.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ color: theme.colors.text.secondary, marginBottom: '4px' }}>Value Generated</div>
          <div style={{ fontFamily: theme.fonts.serif, fontSize: '18px', color: theme.colors.accent }}>
            ${agent.value.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ color: theme.colors.text.secondary, marginBottom: '4px' }}>ROI Multiple</div>
          <div style={{ fontFamily: theme.fonts.serif, fontSize: '18px', color: agent.roi > 1 ? theme.colors.accent : theme.colors.danger }}>
            {agent.roi.toFixed(1)}×
          </div>
        </div>
      </div>
    </div>
  );
}
