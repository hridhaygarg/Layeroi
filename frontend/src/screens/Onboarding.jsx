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
        { step: 2, title: 'Change One Line of Code', desc: 'Update your baseURL to point to AgentCFO' },
        { step: 3, title: 'Make an API Call', desc: 'Your agent will now route through AgentCFO' },
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
