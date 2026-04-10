import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { theme } from '../styles/theme';

export default function SpendValueChart({ data }) {
  return (
    <div style={{
      background: theme.colors.card,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '40px',
    }}>
      <h3 style={{
        fontFamily: theme.fonts.serif,
        fontSize: '16px',
        marginBottom: '20px',
        color: theme.colors.text.primary,
      }}>
        Daily Spend vs Value Generated
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
          <XAxis dataKey="date" stroke={theme.colors.text.secondary} />
          <YAxis stroke={theme.colors.text.secondary} />
          <Tooltip
            contentStyle={{
              background: theme.colors.bg,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '4px',
            }}
            formatter={(value) => `$${value.toFixed(0)}`}
          />
          <Legend />
          <Bar dataKey="spend" fill="rgba(255,255,255,0.5)" name="Spend" />
          <Bar dataKey="value" fill={theme.colors.accent} name="Value Generated" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
