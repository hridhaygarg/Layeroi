import { theme } from '../styles/theme';

export default function Budget() {
  const monthlyBudget = 10000;
  const spent = 5340;
  const percent = (spent / monthlyBudget) * 100;

  return (
    <div>
      <h2 style={{ fontFamily: theme.fonts.serif, fontSize: '28px', marginBottom: '24px' }}>Budget Control</h2>

      <div style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontFamily: theme.fonts.mono, fontSize: '12px' }}>Monthly Budget</label>
          <input
            type="number"
            defaultValue={monthlyBudget}
            style={{
              background: theme.colors.bg,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.text.primary,
              padding: '8px 12px',
              borderRadius: '4px',
              fontFamily: theme.fonts.mono,
              width: '120px',
            }}
          />
        </div>
        <div style={{
          height: '4px',
          background: theme.colors.bg,
          borderRadius: '2px',
          overflow: 'hidden',
          marginTop: '12px',
        }}>
          <div style={{
            height: '100%',
            width: `${percent}%`,
            background: percent > 95 ? theme.colors.danger : percent > 80 ? theme.colors.warning : theme.colors.accent,
            transition: 'width 300ms',
          }} />
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: theme.colors.text.secondary }}>
          ${spent.toLocaleString()} / ${monthlyBudget.toLocaleString()} ({percent.toFixed(0)}%)
        </div>
      </div>
    </div>
  );
}
