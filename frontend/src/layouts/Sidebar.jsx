import { useState } from 'react';
import { Home, BarChart3, Settings, Users, FileText } from 'lucide-react';
import { theme } from '../styles/theme';

export default function Sidebar({ active, onNavigate }) {
  const [expanded, setExpanded] = useState(false);

  const items = [
    { icon: Home, label: 'Overview', id: 'overview' },
    { icon: Users, label: 'Agents', id: 'agents' },
    { icon: BarChart3, label: 'Budget', id: 'budget' },
    { icon: FileText, label: 'Report', id: 'report' },
    { icon: Settings, label: 'Onboarding', id: 'onboarding' },
  ];

  return (
    <nav
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        width: expanded ? '220px' : '64px',
        background: theme.colors.card,
        borderRight: `1px solid ${theme.colors.border}`,
        transition: 'width 200ms',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 0',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            width: '100%',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: 'none',
            background: active === item.id ? theme.colors.accent : 'transparent',
            color: active === item.id ? theme.colors.bg : theme.colors.text.primary,
            cursor: 'pointer',
            transition: 'all 200ms',
            borderLeft: active === item.id ? `3px solid ${theme.colors.accent}` : '3px solid transparent',
            fontSize: '14px',
            fontFamily: theme.fonts.mono,
          }}
        >
          <item.icon size={20} style={{ flexShrink: 0 }} />
          {expanded && <span>{item.label}</span>}
        </button>
      ))}
    </nav>
  );
}
