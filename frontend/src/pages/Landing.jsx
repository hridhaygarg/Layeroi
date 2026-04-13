import { useState, useEffect, useRef } from 'react';

const colors = {
  bgPrimary: '#fafaf9',
  bgSurface: '#ffffff',
  bgSubtle: '#f5f5f4',
  bgProfit: '#f0fdf4',
  bgLoss: '#fef2f2',
  bgWarning: '#fffbeb',
  borderDefault: 'rgba(0,0,0,0.08)',
  borderStrong: 'rgba(0,0,0,0.15)',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  accentGreen: '#16a34a',
  accentGreenLight: '#dcfce7',
  accentGreenBorder: '#86efac',
  dangerRed: '#dc2626',
  dangerLight: '#fef2f2',
  dangerBorder: '#fca5a5',
  warningAmber: '#d97706',
  warningLight: '#fffbeb',
  shadowSm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  shadowMd: '0 4px 6px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
  shadowLg: '0 10px 15px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.04)',
};

function useCountUp(target, duration = 1200, trigger = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const increment = target / (duration / 16);
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration, trigger]);
  return count;
}

function useInView(ref, threshold = 0.15) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return isVisible;
}

function FadeUp({ children, delay = 0 }) {
  const ref = useRef();
  const isVisible = useInView(ref, 0.15);
  return (
    <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(12px)', transition: `all 400ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const problemRef = useRef();

  useEffect(() => {
    window.addEventListener('scroll', () => setScrollY(window.scrollY));
    return () => window.removeEventListener('scroll', () => {});
  }, []);

  const scrollToSection = () => {
    problemRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div style={{ background: colors.bgPrimary, color: colors.textPrimary, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Navigation */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 999, background: colors.bgSurface, borderBottom: `1px solid ${colors.borderDefault}`, boxShadow: scrollY > 10 ? colors.shadowSm : 'none', transition: 'box-shadow 200ms ease' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: colors.accentGreen, borderRadius: '50%' }} />
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '600', color: colors.textPrimary }}>Layer ROI</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <button onClick={navigateToDashboard} style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: '500', color: colors.textSecondary, cursor: 'pointer', transition: 'color 200ms' }} onMouseEnter={(e) => (e.target.style.color = colors.textPrimary)} onMouseLeave={(e) => (e.target.style.color = colors.textSecondary)}>Sign in</button>
            <a href="/signup" style={{ background: colors.bgSurface, border: `1px solid ${colors.accentGreen}`, color: colors.accentGreen, padding: '8px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 200ms', display: 'inline-block' }} onMouseEnter={(e) => { e.target.style.background = colors.accentGreen; e.target.style.color = colors.bgSurface; }} onMouseLeave={(e) => { e.target.style.background = colors.bgSurface; e.target.style.color = colors.accentGreen; }}>Start free →</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ background: colors.bgSurface, padding: '96px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <FadeUp delay={0}>
            <div style={{ display: 'inline-block', padding: '8px 16px', border: `1px solid ${colors.accentGreenBorder}`, borderRadius: '20px', background: colors.accentGreenLight, marginBottom: '32px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '500', color: colors.accentGreen }}>Financial intelligence for AI teams</span>
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '72px', fontWeight: '700', lineHeight: 1.05, marginBottom: '16px', color: colors.textPrimary }}>
              Your AI agents are spending money.<br />
              <span style={{ color: colors.accentGreen, fontStyle: 'italic' }}>Are they earning it?</span>
            </h1>
          </FadeUp>

          <FadeUp delay={160}>
            <p style={{ fontSize: '20px', color: colors.textSecondary, marginBottom: '48px', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 48px' }}>
              Layer ROI is the only financial control layer for AI agents. See your agent P&L in 15 minutes — built for CFOs, not engineers.
            </p>
          </FadeUp>

          <FadeUp delay={240}>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '48px' }}>
              <a href="/signup" style={{ background: colors.accentGreen, color: colors.bgSurface, padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontSize: '16px', fontWeight: '500', fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'transform 200ms', display: 'inline-block' }} onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')} onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}>Start for free →</a>
              <button onClick={scrollToSection} style={{ background: colors.bgSurface, color: colors.textSecondary, padding: '12px 28px', borderRadius: '6px', border: 'none', fontSize: '16px', fontWeight: '500', fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'color 200ms', textDecoration: 'underline' }} onMouseEnter={(e) => (e.target.style.color = colors.textPrimary)} onMouseLeave={(e) => (e.target.style.color = colors.textSecondary)}>See how it works</button>
            </div>
          </FadeUp>

          <FadeUp delay={320}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '14px', color: colors.textTertiary, fontFamily: 'Inter, sans-serif' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: colors.accentGreen, fontSize: '16px' }}>✓</span> Free for 2 agents</span>
              <span>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: colors.accentGreen, fontSize: '16px' }}>✓</span> 15-min setup</span>
              <span>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: colors.accentGreen, fontSize: '16px' }}>✓</span> No credit card</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: colors.bgSubtle, borderTop: `1px solid ${colors.borderDefault}`, borderBottom: `1px solid ${colors.borderDefault}`, padding: '64px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
          <StatCard number={37} suffix="+" label="Average AI agents per enterprise in 2026" />
          <StatCard number={40} suffix="%" label="Of agentic AI projects cancelled due to unclear ROI" color={colors.dangerRed} />
          <StatCard number={0} suffix="" label="What most CFOs can prove their agents are earning" />
          <StatCard number={15} suffix=" min" label="To connect Layer ROI and see your first P&L" />
        </div>
      </section>

      {/* Problem Section */}
      <section ref={problemRef} style={{ background: colors.bgSurface, padding: '96px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ marginBottom: '80px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: colors.accentGreen, letterSpacing: '2px', textTransform: 'uppercase' }}>The Problem</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: '600', marginTop: '16px', marginBottom: '24px', color: colors.textPrimary }}>Every tool speaks engineer.<br /><span style={{ fontStyle: 'italic' }}>Nobody speaks CFO.</span></h2>
              <p style={{ fontSize: '18px', color: colors.textSecondary, maxWidth: '600px' }}>The gap between how your agents spend money and what your board sees is the difference between control and chaos.</p>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            <ProblemCard icon="👁️" title="Invisible Spending" description="CFO gets one invoice, cannot attribute costs to which agents are burning money." />
            <ProblemCard icon="⚠️" title="Runaway Loops" description="One agent can burn $4,000 in 90 minutes on API calls, undetected until the invoice arrives." />
            <ProblemCard icon="❓" title="No ROI Proof" description="Board asks what they're getting. Engineering says 'it's complicated.' CEO smiles nervously." />
          </div>
        </div>
      </section>

      {/* Dashboard Mockup */}
      <section style={{ background: colors.bgSubtle, padding: '96px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ marginBottom: '80px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: colors.accentGreen, letterSpacing: '2px', textTransform: 'uppercase' }}>The Product</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: '600', marginTop: '16px', color: colors.textPrimary }}>Your AI workforce profit & loss</h2>
            </div>
          </FadeUp>

          <FadeUp delay={100}>
            <div style={{ background: colors.bgSurface, border: `1px solid ${colors.borderDefault}`, borderRadius: '12px', overflow: 'hidden', boxShadow: colors.shadowLg }}>
              <div style={{ background: colors.bgSubtle, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${colors.borderDefault}` }}>
                <div style={{ width: '12px', height: '12px', background: '#ff5f56', borderRadius: '50%' }} />
                <div style={{ width: '12px', height: '12px', background: '#ffbd2e', borderRadius: '50%' }} />
                <div style={{ width: '12px', height: '12px', background: '#27c93f', borderRadius: '50%' }} />
                <div style={{ flex: 1, marginLeft: '16px', color: colors.textTertiary, fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace' }}>dashboard.layeroi.com/overview</div>
              </div>
              <div style={{ padding: '40px' }}>
                <DashboardMockupTable />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: colors.bgSurface, padding: '96px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ marginBottom: '80px', textAlign: 'center' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: colors.accentGreen, letterSpacing: '2px', textTransform: 'uppercase' }}>How It Works</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: '600', marginTop: '16px', color: colors.textPrimary }}>Three steps to financial visibility</h2>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px', position: 'relative' }}>
            {[
              { number: '01', title: 'Connect Agents', description: 'Copy one line into your agent code. Takes 5 minutes.' },
              { number: '02', title: 'Track Spending', description: 'Layer ROI monitors every API call, models, tokens, and cost in real-time.' },
              { number: '03', title: 'Optimize ROI', description: 'See which agents make money and which burn it. Kill the losers.' }
            ].map((step, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '64px', fontWeight: '700', color: 'rgba(0,0,0,0.03)', marginBottom: '16px' }}>{step.number}</div>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: '600', color: colors.textPrimary, marginBottom: '12px' }}>{step.title}</h3>
                  <p style={{ fontSize: '16px', color: colors.textSecondary, lineHeight: 1.6 }}>{step.description}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: colors.bgSubtle, padding: '96px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ marginBottom: '80px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: '600', color: colors.textPrimary }}>Built for CFOs. Used by engineers.</h2>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
            {[
              { title: 'Real-time cost attribution', desc: 'Know which agent, which model, which call is costing you money.' },
              { title: 'Runaway loop detection', desc: 'Automatically detect and alert when an agent enters an infinite loop.' },
              { title: 'Agent P&L statements', desc: 'Monthly reports showing revenue attribution and cost per task.', highlight: true },
              { title: 'Budget controls', desc: 'Set spend limits per agent and automatically pause at thresholds.' }
            ].map((feature, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div style={{ background: feature.highlight ? colors.bgProfit : colors.bgSurface, border: `1px solid ${feature.highlight ? colors.accentGreenBorder : colors.borderDefault}`, borderRadius: '12px', padding: '24px', transition: 'all 200ms', cursor: 'pointer', boxShadow: colors.shadowSm }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = colors.shadowMd; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = colors.shadowSm; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '8px' }}>{feature.title}</h3>
                  <p style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.6 }}>{feature.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section style={{ background: colors.bgPrimary, padding: '96px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ marginBottom: '80px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: '600', marginBottom: '16px', color: colors.textPrimary }}>Calculate your AI agent waste</h2>
              <p style={{ fontSize: '18px', color: colors.textSecondary, maxWidth: '600px', margin: '0 auto' }}>See how much your agents are costing you before Layer ROI.</p>
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <ROICalculator />
          </FadeUp>
        </div>
      </section>

      {/* Comparison */}
      <section style={{ background: colors.bgSurface, padding: '96px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ marginBottom: '80px', textAlign: 'center' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: colors.accentGreen, letterSpacing: '2px', textTransform: 'uppercase' }}>How We Compare</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: '600', marginTop: '16px', color: colors.textPrimary }}>Why CFOs choose Layer ROI</h2>
              <p style={{ fontSize: '18px', color: colors.textSecondary, maxWidth: '600px', margin: '24px auto 0' }}>Other tools monitor infrastructure. Layer ROI shows financial impact.</p>
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <div style={{ overflowX: 'auto', borderRadius: '12px', border: `1px solid ${colors.borderDefault}`, boxShadow: colors.shadowSm }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', backgroundColor: colors.bgSurface }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.borderDefault}`, backgroundColor: colors.bgSubtle }}>
                    <th style={{ textAlign: 'left', padding: '20px 24px', fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>Tool</th>
                    <th style={{ textAlign: 'left', padding: '20px 24px', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Built For</th>
                    <th style={{ textAlign: 'left', padding: '20px 24px', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>What It Shows</th>
                    <th style={{ textAlign: 'center', padding: '20px 24px', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>CFO-Ready</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { tool: 'Layer ROI', buildup: 'CFOs', shows: 'P&L per agent, ROI, cost per task, profitability', cfo: true, highlight: true },
                    { tool: 'Datadog', buildup: 'Engineers', shows: 'Tokens, traces, infrastructure logs', cfo: false },
                    { tool: 'Helicone', buildup: 'Engineers', shows: 'API logs, token usage, latency', cfo: false },
                    { tool: 'LiteLLM', buildup: 'Developers', shows: 'Spend by API key, model costs', cfo: false },
                    { tool: 'Bifrost', buildup: 'DevOps', shows: 'Cost by provider, infrastructure metrics', cfo: false },
                  ].map((row, i) => (
                    <tr key={i} style={{
                      borderBottom: `1px solid ${colors.borderDefault}`,
                      backgroundColor: row.highlight ? colors.bgProfit : (i % 2 === 0 ? colors.bgSurface : colors.bgSubtle),
                      transition: 'all 150ms'
                    }} onMouseEnter={(e) => !row.highlight && (e.currentTarget.style.backgroundColor = colors.bgSubtle)} onMouseLeave={(e) => !row.highlight && (e.currentTarget.style.backgroundColor = i % 2 === 0 ? colors.bgSurface : colors.bgSubtle)}>
                      <td style={{ padding: '20px 24px', fontFamily: 'Playfair Display, serif', fontSize: '16px', fontWeight: '600', color: colors.textPrimary }}>
                        {row.tool}
                        {row.highlight && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: '600', color: colors.accentGreen, backgroundColor: colors.accentGreenLight, padding: '4px 10px', borderRadius: '4px', marginLeft: '12px' }}>BEST FOR CFOS</span>}
                      </td>
                      <td style={{ padding: '20px 24px', color: colors.textSecondary, fontSize: '14px' }}>{row.buildup}</td>
                      <td style={{ padding: '20px 24px', color: colors.textSecondary, fontSize: '14px' }}>{row.shows}</td>
                      <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                        <span style={{
                          display: 'flex',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          backgroundColor: row.cfo ? colors.bgProfit : colors.bgLoss,
                          color: row.cfo ? colors.accentGreen : colors.dangerRed,
                          border: `1px solid ${row.cfo ? colors.accentGreenBorder : colors.dangerBorder}`
                        }}>
                          {row.cfo ? '✓' : '✗'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ background: colors.bgSurface, padding: '96px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ marginBottom: '80px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: '600', color: colors.textPrimary, marginBottom: '24px' }}>Simple, transparent pricing</h2>
              <p style={{ fontSize: '18px', color: colors.textSecondary, maxWidth: '600px', margin: '0 auto' }}>Start free with 2 agents. Upgrade anytime. No hidden fees.</p>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            <PricingCard title="Starter" price="$499" period="/ month" agents="Up to 5 agents" features={['Real-time tracking', 'Basic alerts', 'Monthly reports']} />
            <PricingCard title="Business" price="$2,500" period="/ month" agents="Up to 30 agents" features={['Everything in Starter', 'Advanced anomaly detection', 'API access', 'Quarterly reviews']} highlight badge="Most popular" />
            <PricingCard title="Enterprise" price="Custom" agents="Unlimited agents" features={['Everything in Business', 'Custom integrations', 'Dedicated support', 'Annual planning']} cta="Contact us" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: colors.bgSurface, padding: '96px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ marginBottom: '80px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: '600', marginBottom: '16px', color: colors.textPrimary }}>Frequently asked questions</h2>
              <p style={{ fontSize: '18px', color: colors.textSecondary }}>Everything you need to know about Layer ROI.</p>
            </div>
          </FadeUp>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FAQItem
              question="Does this add latency?"
              answer="Under 5ms overhead, imperceptible to your users. Layer ROI runs asynchronously and doesn't block API calls."
            />
            <FAQItem
              question="Is prompt data stored?"
              answer="No. We only store metadata: cost, tokens used, agent name, and timestamp. Your prompt content never leaves your system."
            />
            <FAQItem
              question="Works with Anthropic too?"
              answer="Yes. OpenAI, Anthropic, and any OpenAI-compatible endpoint. Full cost tracking across all providers."
            />
            <FAQItem
              question="How long is setup?"
              answer="15 minutes. Add one environment variable to your code and Layer ROI starts tracking immediately."
            />
            <FAQItem
              question="More than 30 agents?"
              answer="Contact our sales team for Enterprise pricing and custom configurations for unlimited agents."
            />
            <FAQItem
              question="If agent down, affects reliability?"
              answer="No. Layer ROI fallback to direct LLM calls. Your agents are never impacted if our service is unavailable."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: colors.accentGreen, padding: '96px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <FadeUp>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: '600', color: colors.bgSurface, marginBottom: '24px' }}>See your agent ROI in 15 minutes</h2>
          </FadeUp>
          <FadeUp delay={80}>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '48px', fontWeight: '300' }}>Join the early access program and get financial visibility into your AI agents today.</p>
          </FadeUp>
          <FadeUp delay={160}>
            <a href="/signup" style={{ background: colors.bgSurface, color: colors.accentGreen, padding: '14px 32px', borderRadius: '6px', textDecoration: 'none', fontSize: '16px', fontWeight: '600', fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'transform 200ms', display: 'inline-block' }} onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')} onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}>Get started free →</a>
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: colors.bgSurface, borderTop: `1px solid ${colors.borderDefault}`, padding: '40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: colors.textTertiary }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', background: colors.accentGreen, borderRadius: '50%' }} />
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: '600', color: colors.textPrimary }}>Layer ROI</span>
          </div>
          <span>© 2026 Layer ROI · Financial intelligence for AI teams</span>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: Inter, sans-serif; background: ${colors.bgPrimary}; color: ${colors.textPrimary}; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${colors.textTertiary}; border-radius: 4px; }
        ::selection { background: ${colors.accentGreenLight}; color: ${colors.accentGreen}; }
      `}</style>
    </div>
  );
}

function StatCard({ number, suffix, label, color = colors.accentGreen }) {
  const ref = useRef();
  const isVisible = useInView(ref, 0.1);
  const count = useCountUp(number, 1200, isVisible);
  return (
    <FadeUp>
      <div ref={ref} style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', fontWeight: '500', color: colors.textTertiary, textTransform: 'uppercase', marginBottom: '8px' }}>Metric</div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: '700', color: color, marginBottom: '8px' }}>
          {count}{suffix}
        </div>
        <div style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.6 }}>{label}</div>
      </div>
    </FadeUp>
  );
}

function ProblemCard({ icon, title, description }) {
  return (
    <FadeUp>
      <div style={{ background: colors.bgSurface, border: `1px solid ${colors.borderDefault}`, borderRadius: '12px', padding: '24px', transition: 'all 200ms', cursor: 'pointer', boxShadow: colors.shadowSm }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = colors.shadowMd; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = colors.shadowSm; e.currentTarget.style.transform = 'translateY(0)'; }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
        <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '8px' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.6 }}>{description}</p>
      </div>
    </FadeUp>
  );
}

function PricingCard({ title, price, period, agents, features, highlight, badge, cta = 'Start free' }) {
  return (
    <FadeUp>
      <div style={{ background: highlight ? colors.bgProfit : colors.bgSurface, border: `1px solid ${highlight ? colors.accentGreenBorder : colors.borderDefault}`, borderRadius: '12px', padding: '32px', position: 'relative', transform: highlight ? 'scale(1.05)' : 'scale(1)', transition: 'all 200ms', boxShadow: highlight ? colors.shadowMd : colors.shadowSm }}>
        {badge && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: colors.accentGreen, color: colors.bgSurface, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>{badge}</div>}
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: colors.textPrimary }}>{title}</h3>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', color: colors.textSecondary, marginBottom: '24px' }}>{agents}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px' }}>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: '700', color: colors.textPrimary }}>{price}</span>
          {period && <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', color: colors.textSecondary }}>{period}</span>}
        </div>
        <ul style={{ marginBottom: '32px', listStyle: 'none' }}>
          {features.map((f, i) => (
            <li key={i} style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: colors.accentGreen, fontWeight: 'bold' }}>✓</span> {f}
            </li>
          ))}
        </ul>
        <button onClick={() => window.location.href = '/signup'} style={{ width: '100%', background: highlight ? colors.accentGreen : colors.bgSurface, color: highlight ? colors.bgSurface : colors.accentGreen, border: `1px solid ${colors.accentGreen}`, padding: '12px 24px', borderRadius: '6px', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 200ms' }} onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')} onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}>{cta} →</button>
      </div>
    </FadeUp>
  );
}

function DashboardMockupTable() {
  const agents = [
    { name: 'Research Agent', cost: 3200, tasks: 1240, value: 12800, roi: '4.0×', status: 'profitable' },
    { name: 'Writing Engine', cost: 2100, tasks: 890, value: 8900, roi: '4.2×', status: 'profitable' },
    { name: 'Content Analyzer', cost: 1800, tasks: 320, value: 1600, roi: '0.9×', status: 'watch' },
    { name: 'Email Outreach', cost: 4200, tasks: 1100, value: 2200, roi: '0.5×', status: 'losing' },
    { name: 'Data Processor', cost: 950, tasks: 2100, value: 500, roi: '0.5×', status: 'losing' },
  ];

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${colors.borderDefault}`, color: colors.textSecondary, fontFamily: 'IBM Plex Mono, monospace' }}>
          <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}>Agent</th>
          <th style={{ textAlign: 'right', padding: '12px 0', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}>Cost/mo</th>
          <th style={{ textAlign: 'right', padding: '12px 0', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}>Tasks</th>
          <th style={{ textAlign: 'right', padding: '12px 0', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}>Value</th>
          <th style={{ textAlign: 'right', padding: '12px 0', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}>ROI</th>
          <th style={{ textAlign: 'right', padding: '12px 0', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {agents.map((agent, i) => (
          <tr key={i} style={{ borderBottom: `1px solid ${colors.borderDefault}`, transition: 'background 150ms' }} onMouseEnter={(e) => (e.currentTarget.style.background = colors.bgSubtle)} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
            <td style={{ padding: '16px 0', color: colors.textPrimary, fontWeight: '500' }}>{agent.name}</td>
            <td style={{ textAlign: 'right', padding: '16px 0', color: colors.textSecondary, fontFamily: 'IBM Plex Mono, monospace' }}>${agent.cost.toLocaleString()}</td>
            <td style={{ textAlign: 'right', padding: '16px 0', color: colors.textSecondary, fontFamily: 'IBM Plex Mono, monospace' }}>{agent.tasks.toLocaleString()}</td>
            <td style={{ textAlign: 'right', padding: '16px 0', color: colors.accentGreen, fontFamily: 'IBM Plex Mono, monospace', fontWeight: '500' }}>${agent.value.toLocaleString()}</td>
            <td style={{ textAlign: 'right', padding: '16px 0', color: agent.status === 'profitable' ? colors.accentGreen : agent.status === 'watch' ? colors.warningAmber : colors.dangerRed, fontFamily: 'IBM Plex Mono, monospace', fontWeight: '500' }}>{agent.roi}</td>
            <td style={{ textAlign: 'right', padding: '16px 0' }}>
              <span style={{ padding: '4px 12px', borderRadius: '4px', background: agent.status === 'profitable' ? colors.bgProfit : agent.status === 'watch' ? colors.bgWarning : colors.bgLoss, color: agent.status === 'profitable' ? colors.accentGreen : agent.status === 'watch' ? colors.warningAmber : colors.dangerRed, fontFamily: 'Inter, sans-serif', fontWeight: '500', fontSize: '12px' }}>
                {agent.status === 'profitable' ? '✓ Profitable' : agent.status === 'watch' ? '⚠ Watch' : '✗ Losing'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ROICalculator() {
  const [agents, setAgents] = useState(3);
  const [monthlySpend, setMonthlySpend] = useState(10000);
  const [hourlyRate, setHourlyRate] = useState(75);

  const wastefulSpend = monthlySpend * 0.23;
  const annualSavings = wastefulSpend * 12;

  const roiCost = agents < 5 ? 499 : agents <= 30 ? 2500 : 8000;
  const paybackDays = Math.ceil(roiCost / (wastefulSpend / 30));

  return (
    <div style={{ background: colors.bgSurface, border: `1px solid ${colors.borderDefault}`, borderRadius: '12px', padding: '48px', maxWidth: '900px', margin: '0 auto', boxShadow: colors.shadowMd }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '64px' }}>
        {/* Agents Slider */}
        <div>
          <label style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Number of AI Agents</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <input
              type="range"
              min="1"
              max="100"
              value={agents}
              onChange={(e) => setAgents(parseInt(e.target.value))}
              style={{ flex: 1, height: '6px', borderRadius: '3px', background: colors.accentGreenLight, outline: 'none', cursor: 'pointer' }}
            />
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: '700', color: colors.textPrimary, minWidth: '40px', textAlign: 'right' }}>{agents}</span>
          </div>
        </div>

        {/* Monthly Spend Input */}
        <div>
          <label style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Monthly LLM Spend</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: colors.textSecondary, fontWeight: '600' }}>$</span>
            <input
              type="number"
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(Math.max(0, parseInt(e.target.value) || 0))}
              style={{ width: '100%', padding: '12px 12px 12px 28px', border: `1px solid ${colors.borderDefault}`, borderRadius: '6px', fontSize: '16px', fontFamily: 'IBM Plex Mono, monospace', fontWeight: '600', color: colors.textPrimary, outline: 'none', transition: 'border-color 200ms', boxSizing: 'border-box' }}
              onFocus={(e) => (e.target.style.borderColor = colors.accentGreen)}
              onBlur={(e) => (e.target.style.borderColor = colors.borderDefault)}
            />
          </div>
        </div>

        {/* Hourly Rate Input */}
        <div>
          <label style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Employee Hourly Cost</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: colors.textSecondary, fontWeight: '600' }}>$</span>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Math.max(0, parseInt(e.target.value) || 0))}
              style={{ width: '100%', padding: '12px 12px 12px 28px', border: `1px solid ${colors.borderDefault}`, borderRadius: '6px', fontSize: '16px', fontFamily: 'IBM Plex Mono, monospace', fontWeight: '600', color: colors.textPrimary, outline: 'none', transition: 'border-color 200ms', boxSizing: 'border-box' }}
              onFocus={(e) => (e.target.style.borderColor = colors.accentGreen)}
              onBlur={(e) => (e.target.style.borderColor = colors.borderDefault)}
            />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
        {/* Monthly Wasteful Spend */}
        <div style={{ background: colors.bgProfit, border: `1px solid ${colors.accentGreenBorder}`, borderRadius: '8px', padding: '24px' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', marginBottom: '8px' }}>Monthly Wasteful Spend</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: '700', color: colors.accentGreen, marginBottom: '4px' }}>${wastefulSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>~23% of your LLM spend is wasted</div>
        </div>

        {/* Annual Savings Potential */}
        <div style={{ background: colors.bgProfit, border: `1px solid ${colors.accentGreenBorder}`, borderRadius: '8px', padding: '24px' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', marginBottom: '8px' }}>Annual Savings Potential</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: '700', color: colors.accentGreen, marginBottom: '4px' }}>${annualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>Year-over-year with optimization</div>
        </div>

        {/* Layer ROI Cost */}
        <div style={{ background: colors.bgSubtle, border: `1px solid ${colors.borderDefault}`, borderRadius: '8px', padding: '24px' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', marginBottom: '8px' }}>Layer ROI Monthly Cost</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: '700', color: colors.textPrimary, marginBottom: '4px' }}>${roiCost.toLocaleString()}/mo</div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>
            {agents < 5 ? 'Starter' : agents <= 30 ? 'Business' : 'Enterprise'} plan
          </div>
        </div>

        {/* Payback Period */}
        <div style={{ background: colors.bgSubtle, border: `1px solid ${colors.borderDefault}`, borderRadius: '8px', padding: '24px' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', marginBottom: '8px' }}>Payback Period</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: '700', color: colors.textPrimary, marginBottom: '4px' }}>{paybackDays} days</div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>Until Layer ROI pays for itself</div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <FadeUp>
      <div style={{ background: colors.bgSurface, border: `1px solid ${colors.borderDefault}`, borderRadius: '8px', overflow: 'hidden', transition: 'all 200ms' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            color: colors.textPrimary,
            fontFamily: 'Inter, sans-serif',
            transition: 'background-color 200ms'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.bgSubtle)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span>{question}</span>
          <span style={{ fontSize: '20px', fontWeight: '600', color: colors.accentGreen, transition: 'transform 200ms', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
        </button>
        {isOpen && (
          <div style={{ padding: '0 24px 20px 24px', color: colors.textSecondary, fontSize: '15px', lineHeight: 1.6, borderTop: `1px solid ${colors.borderDefault}`, marginTop: '0' }}>
            {answer}
          </div>
        )}
      </div>
    </FadeUp>
  );
}
