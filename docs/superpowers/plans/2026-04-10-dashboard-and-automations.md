# Layeroi Dashboard Rebuild + Growth Automation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement task-by-task.

**Goal:** Rebuild frontend as premium financial dashboard + automate growth (email, SEO, free tier, intent detection)

**Architecture:**
- Frontend: Complete React redesign with design system (dark theme, specific colors/fonts), 5 screens, animations
- Backend: Add automation endpoints for cron jobs, email triggers, content generation
- Database: New tables for automations, content, leads, free tier users

**Tech Stack:** React 18, Recharts, Tailwind, Google Fonts (DM Serif, DM Mono, Inter), Resend (email), Clearbit/ipinfo (intent), Claude API (content), Supabase

---

## PART 1: DASHBOARD REBUILD (Tasks 1-25)

### Task 1: Setup Design System and Layout Foundation

**Files:**
- Create: `frontend/src/styles/theme.js`
- Create: `frontend/src/layouts/MainLayout.jsx`
- Create: `frontend/src/components/Sidebar.jsx`
- Create: `frontend/src/components/TopBar.jsx`
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Create theme.js with color system**

```javascript
export const theme = {
  colors: {
    bg: '#080808',
    card: '#141414',
    border: 'rgba(255,255,255,0.08)',
    accent: '#C8F264',
    danger: '#FF4D4D',
    warning: '#F5A623',
    text: {
      primary: 'rgba(232,230,225,1)',
      secondary: 'rgba(232,230,225,0.7)',
      tertiary: 'rgba(232,230,225,0.5)',
    },
  },
  fonts: {
    serif: '"DM Serif Display", serif',
    mono: '"DM Mono", monospace',
    body: '"Inter", sans-serif',
  },
};
```

- [ ] **Step 2: Update index.css with Google Fonts imports**

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:wght@400&family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500;600&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #080808;
  color: rgba(232,230,225,1);
  font-family: 'Inter', sans-serif;
  font-weight: 300;
}
```

- [ ] **Step 3: Create Sidebar.jsx (64px icon-only, expands to 220px on hover)**

```jsx
import { useState } from 'react';
import { Home, BarChart3, Settings, Users, FileText } from 'lucide-react';
import { theme } from '../styles/theme';

export default function Sidebar({ active }) {
  const [expanded, setExpanded] = useState(false);

  const items = [
    { icon: Home, label: 'Overview', id: 'overview' },
    { icon: Users, label: 'Agents', id: 'agents' },
    { icon: BarChart3, label: 'Budget', id: 'budget' },
    { icon: FileText, label: 'Report', id: 'report' },
    { icon: Settings, label: 'Settings', id: 'settings' },
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
```

- [ ] **Step 4: Create TopBar.jsx with status dot**

```jsx
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
    }}>
      <h1 style={{ fontFamily: theme.fonts.serif, fontSize: '20px' }}>Layeroi</h1>
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
```

- [ ] **Step 5: Create MainLayout.jsx**

```jsx
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { theme } from '../styles/theme';

export default function MainLayout({ children, active, isActive }) {
  return (
    <div style={{ background: theme.colors.bg, minHeight: '100vh' }}>
      <Sidebar active={active} />
      <TopBar isActive={isActive} />
      <main style={{ marginLeft: '64px', marginTop: '60px', padding: '24px' }}>
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 6: Add pulse animation to index.css**

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.card-hover {
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(200, 242, 100, 0.1);
}
```

- [ ] **Step 7: Commit**

```bash
git add frontend/src/styles/ frontend/src/layouts/ frontend/src/components/Sidebar.jsx frontend/src/components/TopBar.jsx frontend/src/index.css
git commit -m "feat: setup design system and layout foundation"
```

---

### Task 2: Build Overview Screen - Hero Metrics

**Files:**
- Create: `frontend/src/screens/Overview.jsx`
- Create: `frontend/src/components/MetricCard.jsx`

- [ ] **Step 1: Create MetricCard component**

```jsx
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
```

- [ ] **Step 2: Create Overview.jsx with hero metrics**

```jsx
import MetricCard from '../components/MetricCard';
import { theme } from '../styles/theme';

export default function Overview() {
  // TODO: Replace with real API data
  const metrics = {
    totalSpend: 12400,
    valueGenerated: 52100,
    roiMultiple: 4.2,
    wastefulSpend: 340,
  };

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
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/screens/Overview.jsx frontend/src/components/MetricCard.jsx
git commit -m "feat: build overview screen hero metrics"
```

---

### Task 3: Build Daily Spend vs Value Chart

**Files:**
- Modify: `frontend/src/screens/Overview.jsx`
- Create: `frontend/src/components/SpendValueChart.jsx`

- [ ] **Step 1: Create SpendValueChart with Recharts**

```jsx
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
            formatter={(value) => `$${value}`}
          />
          <Legend />
          <Bar dataKey="spend" fill="rgba(255,255,255,0.5)" name="Spend" />
          <Bar dataKey="value" fill={theme.colors.accent} name="Value Generated" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Add chart to Overview.jsx**

```jsx
// Add this import
import SpendValueChart from '../components/SpendValueChart';

// Add this data (replace with API call later)
const chartData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  spend: Math.random() * 500 + 300,
  value: Math.random() * 1500 + 1000,
}));

// Add to Overview component after metrics
return (
  <div>
    {/* ... metrics ... */}
    <SpendValueChart data={chartData} />
  </div>
);
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/SpendValueChart.jsx frontend/src/screens/Overview.jsx
git commit -m "feat: add daily spend vs value chart"
```

---

### Task 4: Build Agent P&L Table with Inline Expansion

**Files:**
- Create: `frontend/src/components/AgentPLTable.jsx`
- Create: `frontend/src/components/AgentRowExpanded.jsx`

- [ ] **Step 1: Create AgentRowExpanded component**

```jsx
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
```

- [ ] **Step 2: Create AgentPLTable component**

```jsx
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
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: theme.fonts.mono }}>${agent.cost}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: theme.fonts.mono }}>{agent.tasks}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: theme.fonts.mono }}>${agent.value}</td>
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
```

- [ ] **Step 3: Add to Overview.jsx**

```jsx
// Add agent data
const agents = [
  { id: 1, name: 'data-enrichment', cost: 4200, tasks: 150, value: 8500, roi: 2.0 },
  { id: 2, name: 'document-classifier', cost: 800, tasks: 200, value: 1200, roi: 1.5 },
  { id: 3, name: 'cost-optimizer', cost: 340, tasks: 10, value: 200, roi: 0.6 },
];

// Add to component
<AgentPLTable agents={agents} />
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/AgentPLTable.jsx frontend/src/components/AgentRowExpanded.jsx
git commit -m "feat: build agent P&L table with inline expansion"
```

---

### Task 5-8: Build Remaining 4 Screens (Agents, Budget, Report, Onboarding)

Due to token limits, I'll create these screens with complete code but abbreviated format.

**Task 5: Agents Screen**

```jsx
// frontend/src/screens/Agents.jsx
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
```

**Task 6: Budget Control Screen**

```jsx
// frontend/src/screens/Budget.jsx
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
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
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
```

**Task 7: Weekly Report Screen**

```jsx
// frontend/src/screens/Report.jsx
import { theme } from '../styles/theme';

export default function Report() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontSize: '28px' }}>Weekly Report</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            background: theme.colors.accent,
            color: theme.colors.bg,
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: theme.fonts.mono,
            fontSize: '12px',
          }}>Send Now</button>
          <button style={{
            background: 'transparent',
            color: theme.colors.accent,
            border: `1px solid ${theme.colors.accent}`,
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: theme.fonts.mono,
            fontSize: '12px',
          }}>Schedule</button>
        </div>
      </div>

      <div style={{
        background: 'white',
        color: '#000',
        borderRadius: '8px',
        padding: '40px',
        maxWidth: '800px',
      }}>
        <h1 style={{ fontFamily: theme.fonts.serif, fontSize: '28px', marginBottom: '8px' }}>Layeroi Weekly Report</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Week of April 7-13, 2026</p>

        <h2 style={{ fontFamily: theme.fonts.serif, fontSize: '16px', marginTop: '20px', marginBottom: '12px' }}>Executive Summary</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
          Your AI agents spent $5,340 this week with $9,240 in estimated value generated. Overall ROI multiple: 1.73×. One agent requires immediate attention.
        </p>

        <h2 style={{ fontFamily: theme.fonts.serif, fontSize: '16px', marginTop: '20px', marginBottom: '12px' }}>Top Recommendation</h2>
        <p style={{ fontSize: '14px', color: '#d32f2f' }}>
          <strong>Retire the cost-optimizer agent</strong> — It has spent $340 this month with 0.6× ROI. Estimated monthly savings if paused: $850.
        </p>
      </div>
    </div>
  );
}
```

**Task 8: Onboarding Screen**

```jsx
// frontend/src/screens/Onboarding.jsx
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { theme } from '../styles/theme';

export default function Onboarding() {
  const [copied, setCopied] = useState(false);
  const codeBlock = `const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://agentcfo-production.up.railway.app'
})`;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: theme.fonts.serif, fontSize: '28px', marginBottom: '24px' }}>Get Started in 4 Steps</h2>

      {[
        { step: 1, title: 'Name Your Agent', desc: 'Give your agent a human-readable name' },
        { step: 2, title: 'Change One Line of Code', desc: 'Update your baseURL to point to Layeroi' },
        { step: 3, title: 'Make an API Call', desc: 'Your agent will now route through Layeroi' },
        { step: 4, title: 'Watch the Dashboard', desc: 'Costs appear in real-time' },
      ].map(({ step, title, desc }) => (
        <div key={step} style={{
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '16px',
          display: 'flex',
          gap: '16px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: theme.colors.accent,
            color: theme.colors.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: theme.fonts.serif,
            flexShrink: 0,
          }}>
            {step}
          </div>
          <div>
            <h3 style={{ fontFamily: theme.fonts.serif, fontSize: '16px', marginBottom: '4px' }}>{title}</h3>
            <p style={{ color: theme.colors.text.secondary, fontSize: '14px' }}>{desc}</p>
          </div>
        </div>
      ))}

      <div style={{ marginTop: '32px', marginBottom: '32px' }}>
        <p style={{ fontFamily: theme.fonts.mono, fontSize: '12px', color: theme.colors.text.secondary, marginBottom: '8px' }}>Step 2 Code:</p>
        <div style={{
          background: theme.colors.bg,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '4px',
          padding: '16px',
          fontFamily: theme.fonts.mono,
          fontSize: '12px',
          color: theme.colors.accent,
          whiteSpace: 'pre-wrap',
          overflow: 'auto',
          position: 'relative',
        }}>
          {codeBlock}
          <button
            onClick={() => {
              navigator.clipboard.writeText(codeBlock);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: theme.colors.accent,
              color: theme.colors.bg,
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### Task 9: Integrate All Screens into App.jsx

**Files:**
- Modify: `frontend/src/App.jsx`

```jsx
import { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Overview from './screens/Overview';
import Agents from './screens/Agents';
import Budget from './screens/Budget';
import Report from './screens/Report';
import Onboarding from './screens/Onboarding';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('overview');
  const [isProxyActive, setIsProxyActive] = useState(false);

  useEffect(() => {
    // Check if proxy is active
    const checkProxy = async () => {
      try {
        const res = await fetch('https://agentcfo-production.up.railway.app/health');
        setIsProxyActive(res.ok);
      } catch {
        setIsProxyActive(false);
      }
    };
    checkProxy();
    const interval = setInterval(checkProxy, 30000);
    return () => clearInterval(interval);
  }, []);

  const screens = {
    overview: Overview,
    agents: Agents,
    budget: Budget,
    report: Report,
    onboarding: Onboarding,
  };

  const CurrentScreen = screens[currentScreen] || Overview;

  return (
    <MainLayout active={currentScreen} isActive={isProxyActive}>
      <CurrentScreen />
    </MainLayout>
  );
}
```

Commit all frontend changes and push to Vercel.

---

## PART 2: AUTOMATION SYSTEMS (Next Phase)

After dashboard is live, will build:
1. SEO Content Engine (Claude API + GitHub + Vercel)
2. Cold Email System (Apollo + Hunter + Resend)
3. Free Tier & Upgrade Automation (Email sequences)
4. Intent Detection (Clearbit + Slack alerts)

Ready to start Part 1 implementation?
