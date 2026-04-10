import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { theme } from '../styles/theme';
import AgentRowExpanded from './AgentRowExpanded';

export default function AgentPLTable({ agents }) {
  const [expanded, setExpanded] = useState(null);

  const getStatus = (roi) => {
    if (roi > 1) return { label: 'Profitable', color: theme.colors.accent };
    if (roi > 0.5) return { label: 'Watch', color: theme.colors.warning };
    return { label: 'Losing Money', color: theme.colors.danger };
  };

  return (
    <div style={{
      background: theme.colors.card,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
            <th style={{ padding: '12px', textAlign: 'left', fontFamily: theme.fonts.mono, fontSize: '12px', color: theme.colors.text.secondary }}>Agent</th>
            <th style={{ padding: '12px', textAlign: 'right', fontFamily: theme.fonts.mono, fontSize: '12px', color: theme.colors.text.secondary }}>Cost</th>
            <th style={{ padding: '12px', textAlign: 'right', fontFamily: theme.fonts.mono, fontSize: '12px', color: theme.colors.text.secondary }}>Tasks</th>
            <th style={{ padding: '12px', textAlign: 'right', fontFamily: theme.fonts.mono, fontSize: '12px', color: theme.colors.text.secondary }}>Value</th>
            <th style={{ padding: '12px', textAlign: 'center', fontFamily: theme.fonts.mono, fontSize: '12px', color: theme.colors.text.secondary }}>ROI</th>
            <th style={{ padding: '12px', textAlign: 'center', fontFamily: theme.fonts.mono, fontSize: '12px', color: theme.colors.text.secondary }}>Status</th>
            <th style={{ width: '40px' }} />
          </tr>
        </thead>
        <tbody>
          {agents.map(agent => {
            const status = getStatus(agent.roi);
            const isExpanded = expanded === agent.id;
            return (
              <tbody key={agent.id}>
                <tr
                  onClick={() => setExpanded(isExpanded ? null : agent.id)}
                  style={{
                    borderBottom: `1px solid ${theme.colors.border}`,
                    cursor: 'pointer',
                    background: isExpanded ? 'rgba(200,242,100,0.05)' : 'transparent',
                    transition: 'background 200ms',
                  }}
                >
                  <td style={{ padding: '12px', fontFamily: theme.fonts.mono }}>{agent.name}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: theme.fonts.mono }}>${agent.cost.toLocaleString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: theme.fonts.mono }}>{agent.tasks}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: theme.fonts.mono }}>${agent.value.toLocaleString()}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontFamily: theme.fonts.serif, color: status.color }}>{agent.roi.toFixed(1)}×</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontFamily: theme.fonts.mono,
                      background: `${status.color}20`,
                      color: status.color,
                      animation: 'pulse 2s infinite',
                    }}>
                      {status.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <ChevronDown size={16} style={{ transform: isExpanded ? 'rotate(180deg)' : '', transition: 'transform 200ms' }} />
                  </td>
                </tr>
                {isExpanded && <tr><td colSpan="7"><AgentRowExpanded agent={agent} /></td></tr>}
              </tbody>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
