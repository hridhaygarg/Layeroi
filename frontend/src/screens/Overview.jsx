import MetricCard from '../components/MetricCard';
import SpendValueChart from '../components/SpendValueChart';
import AgentPLTable from '../components/AgentPLTable';
import { theme } from '../styles/theme';

export default function Overview() {
  const metrics = {
    totalSpend: 12400,
    valueGenerated: 52100,
    roiMultiple: 4.2,
    wastefulSpend: 340,
  };

  const chartData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    spend: Math.random() * 500 + 300,
    value: Math.random() * 1500 + 1000,
  }));

  const agents = [
    { id: 1, name: 'data-enrichment', cost: 4200, tasks: 150, value: 8500, roi: 2.0 },
    { id: 2, name: 'document-classifier', cost: 800, tasks: 200, value: 1200, roi: 1.5 },
    { id: 3, name: 'cost-optimizer', cost: 340, tasks: 10, value: 200, roi: 0.6 },
  ];

  return (
    <div>
      <h2 style={{
        fontFamily: theme.fonts.serif,
        fontSize: '28px',
        marginBottom: '24px',
        color: theme.colors.text.primary,
      }}>
        Overview
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '40px',
      }}>
        <MetricCard
          label="Total AI Spend"
          value={`$${metrics.totalSpend.toLocaleString()}`}
          unit="this month"
          isLarge
        />
        <MetricCard
          label="Value Generated"
          value={`$${metrics.valueGenerated.toLocaleString()}`}
          unit="estimated ROI"
          color="primary"
          isLarge
        />
        <MetricCard
          label="Net ROI Multiple"
          value={`${metrics.roiMultiple}×`}
          unit={metrics.roiMultiple > 1 ? 'profitable' : 'negative'}
          color={metrics.roiMultiple > 1 ? 'primary' : 'danger'}
          isLarge
        />
        <MetricCard
          label="Wasteful Spend"
          value={`$${metrics.wastefulSpend}`}
          unit="being burned"
          color="danger"
          isLarge
        />
      </div>

      <SpendValueChart data={chartData} />

      <div>
        <h3 style={{
          fontFamily: theme.fonts.serif,
          fontSize: '18px',
          marginBottom: '16px',
          color: theme.colors.text.primary,
        }}>
          Agent P&L
        </h3>
        <AgentPLTable agents={agents} />
      </div>
    </div>
  );
}
