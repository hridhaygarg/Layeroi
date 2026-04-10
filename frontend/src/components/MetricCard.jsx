import { theme } from '../styles/theme';

export default function MetricCard({ label, value, unit, color = 'primary', isLarge = false }) {
  const colorMap = {
    primary: theme.colors.accent,
    danger: theme.colors.danger,
    warning: theme.colors.warning,
  };

  return (
    <div className="card-hover" style={{
      background: theme.colors.card,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '8px',
      padding: '24px',
      flex: 1,
    }}>
      <div style={{
        fontSize: '12px',
        color: theme.colors.text.tertiary,
        fontFamily: theme.fonts.mono,
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: isLarge ? '36px' : '24px',
        fontFamily: theme.fonts.serif,
        color: colorMap[color],
        fontWeight: 'bold',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '12px',
        color: theme.colors.text.secondary,
        marginTop: '8px',
        fontFamily: theme.fonts.mono,
      }}>
        {unit}
      </div>
    </div>
  );
}
