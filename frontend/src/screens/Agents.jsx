import { Plus } from 'lucide-react';
import { theme } from '../styles/theme';

export default function Agents() {
  const agents = [
    { id: 1, name: 'data-enrichment', cost: 4200, roi: 2.0, tasks: 150 },
    { id: 2, name: 'document-classifier', cost: 800, roi: 1.5, tasks: 200 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontSize: '28px' }}>Agents</h2>
        <button style={{
          background: theme.colors.accent,
          color: theme.colors.bg,
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: theme.fonts.mono,
          fontSize: '12px',
        }}>
          <Plus size={16} /> Add Agent
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px',
      }}>
        {agents.map(agent => (
          <div key={agent.id} className="card-hover" style={{
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            padding: '20px',
          }}>
            <h3 style={{ fontFamily: theme.fonts.serif, fontSize: '16px', marginBottom: '12px' }}>{agent.name}</h3>
            <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
              <div>Cost this week: ${agent.cost}</div>
              <div>Tasks: {agent.tasks}</div>
              <div style={{ color: agent.roi > 1 ? theme.colors.accent : theme.colors.danger }}>
                ROI: {agent.roi.toFixed(1)}×
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
