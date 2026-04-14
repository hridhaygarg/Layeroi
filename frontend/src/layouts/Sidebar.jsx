import { Home, BarChart3, Settings, Users, FileText, Target } from 'lucide-react';

export default function Sidebar({ active, onNavigate, colors }) {
  const items = [
    { icon: Home, label: 'Overview', id: 'overview' },
    { icon: Users, label: 'Agents', id: 'agents' },
    { icon: BarChart3, label: 'Budget', id: 'budget' },
    { icon: FileText, label: 'Reports', id: 'report' },
    { icon: Target, label: 'Outreach', id: 'outreach' },
    { icon: Settings, label: 'Onboarding', id: 'onboarding' },
  ];

  return (
    <nav
      style={{
        width: '240px',
        background: colors.bgSurface,
        borderRight: `1px solid ${colors.borderDefault}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: `1px solid ${colors.borderDefault}`,
      }}>
        <div style={{ width: '8px', height: '8px', background: colors.accentGreen, borderRadius: '50%' }} />
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '16px',
          fontWeight: '600',
          color: colors.textPrimary,
        }}>
          Layer ROI
        </span>
      </div>

      {/* Navigation items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              width: '100%',
              padding: '12px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: 'none',
              background: active === item.id ? colors.bgSubtle : 'transparent',
              color: active === item.id ? colors.accentGreen : colors.textSecondary,
              cursor: 'pointer',
              transition: 'all 200ms',
              borderLeft: active === item.id ? `4px solid ${colors.accentGreen}` : '4px solid transparent',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: active === item.id ? '600' : '500',
            }}
            onMouseEnter={(e) => {
              if (active !== item.id) {
                e.target.style.background = colors.bgSubtle;
              }
            }}
            onMouseLeave={(e) => {
              if (active !== item.id) {
                e.target.style.background = 'transparent';
              }
            }}
          >
            <item.icon size={18} style={{ flexShrink: 0 }} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
