import { theme } from '../styles/theme';

export default function TopBar({ isActive }) {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  return (
    <div style={{
      height: '60px',
      background: theme.colors.card,
      borderBottom: `1px solid ${theme.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      marginLeft: '64px',
      position: 'fixed',
      width: 'calc(100% - 64px)',
      top: 0,
      zIndex: 50,
    }}>
      <h1 style={{ fontFamily: theme.fonts.serif, fontSize: '20px' }}>AgentCFO</h1>
      <span style={{ fontFamily: theme.fonts.mono, fontSize: '12px', color: theme.colors.text.secondary }}>
        {startOfWeek.toLocaleDateString()} — {endOfWeek.toLocaleDateString()}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: theme.colors.text.secondary }}>System</span>
        <div style={{
          width: '8px',
          height: '8px',
          background: isActive ? theme.colors.accent : theme.colors.danger,
          borderRadius: '50%',
          animation: isActive ? 'pulse 2s infinite' : 'none',
        }} />
      </div>
    </div>
  );
}
