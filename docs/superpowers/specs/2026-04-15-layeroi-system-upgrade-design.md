# Layeroi System Upgrade - Comprehensive Design Specification

> **Status:** Design approved | Ready for implementation planning

**Goal:** Transform Layeroi from good to world-class, institutional, enterprise-grade system with maximum utility across all 14 dimensions (backend, frontend, database, AI, automation, analytics, security, integrations, performance, DevOps, user features, mobile, advanced features, documentation).

**Architecture:** Modular Monolith on Railway with clean service layers (auth, agents, outreach, analytics, integrations, webhooks), ready for future microservice extraction. PostgreSQL + Redis + React frontend with real-time WebSocket support. All 14 dimensions built simultaneously for complete excellence.

**Tech Stack:** Express.js, React 18, PostgreSQL 15+, Redis, Supabase, Claude API, Framer Motion, TanStack Query, Zustand, WebSocket, Railway, Datadog, Sentry, GitHub Actions, Docker, Node.js 20+.

---

## 1. Backend Architecture & APIs

### Service Layer Structure

```
Backend (Express.js on Railway)
├── Auth Service (JWT, OAuth, MFA)
├── Agent Service (Claude orchestration, streaming)
├── Outreach Service (queue, automation, tracking)
├── Analytics Service (events, predictions, dashboards)
├── Integration Service (webhooks, adapters, retry)
├── Webhook Service (routing, verification, replay)
└── Shared (middleware, utilities, logging)
```

### API Design

**REST + WebSocket Architecture:**
- RESTful endpoints for CRUD and queries
- WebSocket for real-time dashboards, live notifications, team presence
- All endpoints support filtering, pagination (limit/offset), sorting (field:asc|desc)
- Standard response envelope: `{ success: boolean, data: any, error?: { code, message }, meta: { pagination?, timestamp } }`
- Rate limiting: 1000 req/min per API key (configurable per tier)
- Request/response logging with structured JSON

**Core Endpoints (80+ total):**

Auth:
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/oauth/callback/:provider` - OAuth callback
- `POST /api/auth/mfa/verify` - MFA verification
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user
- `POST /api/auth/api-keys` - Create API key
- `GET /api/auth/api-keys` - List keys
- `DELETE /api/auth/api-keys/:id` - Revoke key

Prospects:
- `GET /api/prospects` - List (with filters: status, industry, title, engagement_level, created_at, custom_fields)
- `POST /api/prospects` - Create
- `GET /api/prospects/:id` - Get details
- `PATCH /api/prospects/:id` - Update
- `DELETE /api/prospects/:id` - Delete
- `POST /api/prospects/bulk-import` - CSV import with validation
- `POST /api/prospects/:id/bulk-action` - Apply action to multiple (add to sequence, update status, export)
- `POST /api/prospects/:id/research` - Trigger Claude research
- `GET /api/prospects/:id/research` - Get research results

Outreach:
- `GET /api/outreach/queue` - Queue status
- `POST /api/outreach/send` - Send email
- `GET /api/outreach/sent` - Sent emails (with filters: opened, clicked, replied)
- `POST /api/outreach/sequence/:id/start` - Start automation sequence
- `GET /api/outreach/sequences` - List sequences
- `POST /api/outreach/sequences` - Create sequence
- `PATCH /api/outreach/sequences/:id` - Update sequence
- `GET /api/outreach/templates` - List email templates
- `POST /api/outreach/templates` - Create template
- `POST /api/outreach/:prospectId/reply` - Log reply

Analytics:
- `GET /api/analytics/dashboard` - Dashboard metrics (prospects, sent, opened, replied, rates)
- `GET /api/analytics/metrics` - Custom metrics query (aggregate, group by)
- `GET /api/analytics/events` - Event log (filters: type, entity_id, user_id, date_range)
- `GET /api/analytics/reports` - Saved reports
- `POST /api/analytics/reports` - Create report
- `GET /api/analytics/predictions` - ML predictions (reply likelihood, best send time, prospect quality)
- `GET /api/analytics/export` - Export data (CSV, PDF)

Integrations:
- `GET /api/integrations` - Installed integrations
- `POST /api/integrations/:type/connect` - Start OAuth flow (Salesforce, HubSpot, etc)
- `GET /api/integrations/:type/callback` - OAuth callback
- `DELETE /api/integrations/:id` - Disconnect
- `GET /api/integrations/:id/sync-status` - Sync health check
- `POST /api/integrations/:id/test` - Test connection
- `PATCH /api/integrations/:id/settings` - Update settings (frequency, field mapping)

Webhooks:
- `GET /api/webhooks` - List outgoing webhooks
- `POST /api/webhooks` - Create webhook (URL, events, headers)
- `PATCH /api/webhooks/:id` - Update
- `DELETE /api/webhooks/:id` - Delete
- `GET /api/webhooks/:id/logs` - Event logs (last 30 days)
- `POST /api/webhooks/:id/retry` - Retry failed deliveries
- `POST /api/webhooks/test` - Test webhook with sample payload

### Error Handling

Standardized error codes with HTTP status and recovery guidance:

```
400 BAD_REQUEST - Invalid input, validation failed
401 UNAUTHORIZED - Missing or invalid authentication
403 FORBIDDEN - Authenticated but no permission
404 NOT_FOUND - Resource doesn't exist
409 CONFLICT - Resource already exists (duplicate)
429 RATE_LIMITED - Rate limit exceeded, retry after X seconds
500 INTERNAL_ERROR - Server error, contact support
503 SERVICE_UNAVAILABLE - Dependency down (DB, external API)
```

Client receives: `{ error: { code: "RATE_LIMITED", message: "API rate limit exceeded. Retry after 60 seconds.", retryAfter: 60 } }`

Server logs: Full stack trace + request context (user_id, org_id, endpoint, input, timestamp).

### Documentation

OpenAPI 3.0 spec auto-generated from JSDoc comments. Swagger UI at `/api/docs`. Client SDKs auto-generated (JavaScript, Python, Go). Each endpoint documented with:
- Request/response examples
- Error scenarios
- Rate limit info
- Required scopes
- Version history

---

## 2. Frontend UX

### Design System

**Typography Hierarchy:**
- Headings: Playfair Display (serif, institutional luxury feel)
  - h1: 48px (mobile: 32px) / 700 weight / 1.2 line-height
  - h2: 36px (mobile: 28px) / 700 weight / 1.25 line-height
  - h3: 24px (mobile: 20px) / 600 weight / 1.3 line-height
- Body: Inter (humanist sans-serif)
  - Base: 16px (mobile: 14px) / 400 weight / 1.5 line-height
  - Small: 14px / 400 weight / 1.4 line-height
- Code: IBM Plex Mono (monospace)
  - Base: 14px / 400 weight / 1.6 line-height

**Responsive Breakpoints:**
```
375px - Mobile (iPhone SE)
768px - Tablet (iPad)
1024px - Desktop (small monitors)
1280px - Desktop (typical)
1536px - Ultra-wide (4K monitors)
```

**Spacing System (8px grid):**
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
4xl: 96px
```

**Color Palette:**
- Primary: #2563eb (blue, modern, trustworthy)
- Secondary: #7c3aed (purple, premium)
- Success: #10b981 (green)
- Warning: #f59e0b (amber)
- Error: #ef4444 (red)
- Neutral-50 to Neutral-900 (grayscale)
- Dark mode variants

**Component Library (80+ components):**

Input Components:
- `<TextInput />` - Text, email, password, tel, url
- `<TextArea />` - Multi-line with auto-expand, character count
- `<Select />` - Dropdown, multi-select, searchable, grouped options
- `<DatePicker />` - Calendar, range, presets (Today, Last 7 Days, etc)
- `<TimePicker />` - Hour/minute select with timezone
- `<Checkbox />` - Single, indeterminate, disabled states
- `<Radio />` - Group, vertical/horizontal layout
- `<Toggle />` - On/off switch with icon support
- `<ComboBox />` - Searchable select with create option
- `<Slider />` - Range slider, marks, tooltips
- `<FileUpload />` - Single/multi, drag-drop, progress

Surface Components:
- `<Card />` - Container with shadow, hover states, responsive padding
- `<Modal />` - Centered dialog, backdrop, focus trap, keyboard close (Escape)
- `<Drawer />` - Side panel, slide animation, overlay
- `<Tooltip />` - Hover/focus, positioned (top/right/bottom/left), auto-flip
- `<Popover />` - Context menu, anchor element, keyboard navigation
- `<Alert />` - Info/warning/error/success with icon and action
- `<Badge />` - Label, color variants, dismissible
- `<Toast />` - Notification stack, auto-dismiss, action button
- `<Skeleton />` - Content loader, shimmer animation

Layout Components:
- `<Grid />` - Responsive grid (12 columns by default, 6 on mobile)
- `<Stack />` - Flex container (vertical/horizontal gap control)
- `<Flex />` - Flexbox wrapper with alignment helpers
- `<Container />` - Max-width wrapper with horizontal padding
- `<Spacer />` - Flexible spacing
- `<Divider />` - Visual separator (horizontal/vertical)

Navigation Components:
- `<Tabs />` - Tab groups, underline/pill style, content switching
- `<Breadcrumbs />` - Navigation trail with links
- `<Pagination />` - Page numbers, prev/next, jump to page
- `<Stepper />` - Progress indicator (linear or vertical)
- `<Sidebar />` - Navigation menu, collapsible, active state
- `<TopBar />` - Header with logo, search, user menu, notifications

Data Display:
- `<Table />` - Sortable, filterable, selectable rows, sticky header on scroll
- `<List />` - Virtual list for large datasets (10K+ items)
- `<Chart />` - Line, bar, funnel, heatmap (Recharts wrapper)
- `<DataGrid />` - Excel-like grid (edit inline, resize columns, freeze panes)

### State Management

**TanStack Query (server state):**
- Query: `useQuery({ queryKey: ['prospects'], queryFn: () => api.getProspects() })`
- Mutation: `useMutation({ mutationFn: (data) => api.createProspect(data) })`
- Optimistic updates: Pre-update UI, rollback if mutation fails
- Auto-refetch on focus, background refetch every 5 min
- Cache time: 5 min (configurable per query), stale time: 1 min
- Devtools: Inspector at bottom-right in dev mode

**Zustand (client state):**
```javascript
// Example store
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    const user = await api.login(email, password);
    set({ user, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### Real-Time Features

**WebSocket Connection:**
- Automatic connection on app load
- Auto-reconnect with exponential backoff (1s → 2s → 4s → 8s max)
- Message queuing during disconnects, flush on reconnect
- Heartbeat every 30 seconds to detect stale connections
- Events subscribed per user role and workspace

**Real-Time Updates:**
- Prospect updated: Refetch prospect details, update list
- Email sent: Update outreach queue, trigger celebration animation
- Reply received: Toast notification, update prospect status
- Team member joined: Add to presence indicator
- Dashboard metric: Update chart in real-time (no re-query)

### Animations (Framer Motion)

**Micro-interactions:**
- Button hover: Scale 1.02, shadow increase
- Drawer open: Slide from left, fade backdrop (0.3s easing: easeOut)
- Modal appear: Scale from 0.95 + fade (0.2s)
- List item enter: Stagger by 30ms per item, fade + slide up
- Loading state: Skeleton shimmer animation (gradient sweep)
- Success toast: Slide up + fade, auto-dismiss after 3s

**Spring Physics:**
- Drawer close: Spring with stiffness 400, damping 40
- Notification stack: Add/remove with spring ease
- Tooltip appear: Spring animation for scale

### Performance Targets

- Lighthouse score: 95+ (all metrics)
- Largest Contentful Paint (LCP): <2.5s (good)
- First Input Delay (FID): <100ms (good)
- Cumulative Layout Shift (CLS): <0.1 (good)
- Time to Interactive: <3.5s
- Bundle size: <200KB gzipped (main), <50KB per route
- Code splitting: Per-route chunks, lazy load components
- Image optimization: WebP with fallbacks, responsive srcset, lazy load
- Font preload: Preload Playfair + Inter

---

## 3. Database Schema

### Core Tables (40+)

**Authentication & Multi-Tenancy:**
```sql
-- Users (encrypted passwords, OAuth links)
users (id, email, password_hash, first_name, last_name, avatar_url,
       timezone, language, created_at, updated_at, deleted_at)

-- Organizations (workspace)
organizations (id, name, logo_url, created_by, subscription_tier,
               subscription_status, stripe_customer_id, created_at, updated_at)

-- Team membership with roles
team_members (id, org_id, user_id, role, permissions_json,
              created_at, updated_at)

-- API keys (hashed)
api_keys (id, org_id, user_id, name, key_hash, scopes_json,
          last_used_at, created_at, expires_at)
```

**Core Data:**
```sql
-- Prospects (deduplicated across integrations)
prospects (id, org_id, name, title, email, phone, company,
           industry, website, company_size, location, linkedin_url,
           research_data_json, icp_score, fit_reason, status,
           source, created_at, updated_at, deleted_at)

-- Outreach queue (partitioned by date)
outreach_queue (id, org_id, prospect_id, status, message,
                personalized_message, generated_at, sent_at,
                opened_at, clicked_at, replied_at, response_message,
                queue_week, attempt_count, last_error, created_at, updated_at)
         PARTITION BY RANGE (created_at) for 10M+ rows

-- Email tracking
email_events (id, org_id, outreach_id, event_type, timestamp,
              user_agent, location_json, created_at)
         INDEX on (outreach_id, event_type, timestamp)

-- Automation sequences
automation_sequences (id, org_id, name, description, trigger_type,
                      trigger_config_json, actions_json, status,
                      created_at, updated_at)

-- Integrations
integrations (id, org_id, integration_type, name, config_json,
              sync_status, last_sync_at, created_at, updated_at)

-- Webhooks (outgoing)
webhooks (id, org_id, url, events_json, headers_json, is_active,
          created_at, updated_at)

-- Webhook delivery logs
webhook_logs (id, webhook_id, event_type, payload_json, response_status,
              response_body, attempt_count, next_retry_at, created_at)

-- Custom fields per organization
custom_fields (id, org_id, entity_type, field_name, field_type,
               validation_json, display_order, created_at)

-- Saved searches
saved_searches (id, org_id, user_id, name, filters_json,
                created_at, updated_at)

-- Dashboards
dashboards (id, org_id, user_id, name, widgets_json, created_at, updated_at)

-- Analytics events (for predictions and reporting)
analytics_events (id, org_id, event_type, entity_type, entity_id,
                  user_id, properties_json, created_at)

-- Audit log (compliance)
audit_logs (id, org_id, user_id, action, entity_type, entity_id,
            changes_json, ip_address, user_agent, created_at)
```

### Indexes (Strategic)

```sql
-- Prospects
CREATE INDEX idx_prospects_org_status ON prospects(org_id, status);
CREATE INDEX idx_prospects_email ON prospects(email);
CREATE INDEX idx_prospects_created ON prospects(created_at);
CREATE UNIQUE INDEX idx_prospects_unique_per_org ON prospects(org_id, email, deleted_at);

-- Outreach queue
CREATE INDEX idx_outreach_status ON outreach_queue(status, created_at);
CREATE INDEX idx_outreach_prospect ON outreach_queue(prospect_id);
CREATE INDEX idx_outreach_sent ON outreach_queue(sent_at, opened_at);
CREATE INDEX idx_outreach_week ON outreach_queue(queue_week);

-- Email events
CREATE INDEX idx_email_events_outreach ON email_events(outreach_id, event_type);
CREATE INDEX idx_email_events_time ON email_events(created_at);

-- Audit
CREATE INDEX idx_audit_logs_org ON audit_logs(org_id, created_at);
```

### Row-Level Security (RLS)

```sql
-- Prospects visible only to org members
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
CREATE POLICY prospect_access ON prospects
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- Outreach queue same
ALTER TABLE outreach_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY outreach_access ON outreach_queue
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));
```

### Advanced Features

**Materialized Views (refresh every 5 min):**
```sql
-- Outreach stats for dashboards
CREATE MATERIALIZED VIEW outreach_stats AS
  SELECT org_id, queue_week,
         COUNT(*) as total_prospects,
         COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_count,
         COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as opened_count,
         COUNT(CASE WHEN replied_at IS NOT NULL THEN 1 END) as replied_count,
         ROUND(100.0 * COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END)
               / NULLIF(COUNT(CASE WHEN status = 'sent' THEN 1 END), 0), 2) as open_rate
  FROM outreach_queue
  GROUP BY org_id, queue_week;
```

**Full-Text Search:**
```sql
-- Prospect research full-text search
CREATE INDEX idx_prospects_fts ON prospects USING GIN(
  to_tsvector('english', name || ' ' || company || ' ' || COALESCE(research_data_json::text, ''))
);
```

**Temporal Tables (audit history):**
```sql
-- Version tracking for compliance
CREATE TABLE prospects_history AS TABLE prospects WITH NO DATA;
CREATE TRIGGER prospect_audit BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION audit_table_update('prospects_history');
```

---

## 4. AI Integration (Claude API)

### Model Strategy

**Primary:** Claude 3.5 Sonnet (fast, cost-effective, 200K context window)
- Prospect research analysis
- Message generation
- Email reply classification
- Quick insights

**Secondary:** Claude 3 Opus (complex reasoning, 200K context)
- Deal analysis (requires deeper understanding)
- Strategic recommendations
- Multi-step reasoning

**Fallback:** Use smaller model if primary unavailable (cost optimization)

### Core Use Cases

**Prospect Research (Async via Claude Batch API):**
```javascript
// Batch 100 prospects for overnight processing
const batch = prospects.map(p => ({
  custom_id: p.id,
  params: {
    model: "claude-3-5-sonnet-20241022",
    messages: [{
      role: "user",
      content: `Research this prospect and provide ICP fit score (0-1), key insights, and outreach angle:
      Name: ${p.name}
      Title: ${p.title}
      Company: ${p.company}
      ${p.linkedin_url ? `LinkedIn: ${p.linkedin_url}` : ''}`
    }],
    max_tokens: 500
  }
}));

// Submit batch, get results async (next day)
const batch_id = await client.beta.batches.create({ requests: batch });
```

**Message Generation (Real-time streaming):**
```javascript
// Real-time compose as user types
const stream = await client.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 300,
  stream: true,
  system: `You are an expert sales development rep. Generate personalized, brief (2-3 sentences)
           outreach emails. Be specific to their role and company. Focus on value, not features.`,
  messages: [{
    role: "user",
    content: `Write email to ${prospect.name}, ${prospect.title} at ${prospect.company}.
    Our value prop: Layeroi helps sales teams automate outreach at scale.
    Their context: ${prospect.research_data.key_info}`
  }]
});

// Stream to frontend via WebSocket
stream.on('text', (text) => {
  ws.send(JSON.stringify({ type: 'message_chunk', text }));
});
```

**Vision API (Document analysis):**
```javascript
// Analyze contracts, proposals, PDFs
const response = await client.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1000,
  messages: [{
    role: "user",
    content: [
      {
        type: "text",
        text: "Extract key terms from this contract: payment terms, cancellation clause, renewal date"
      },
      {
        type: "image",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: base64_pdf
        }
      }
    ]
  }]
});
```

**Function Calling (Tool integration):**
```javascript
// Define tools Claude can call
const tools = [
  {
    name: "update_crm",
    description: "Update prospect status in Salesforce",
    input_schema: {
      type: "object",
      properties: {
        prospect_id: { type: "string" },
        status: { type: "string", enum: ["qualified", "unqualified", "follow-up"] },
        notes: { type: "string" }
      },
      required: ["prospect_id", "status"]
    }
  },
  {
    name: "send_email",
    description: "Send email to prospect",
    input_schema: {
      type: "object",
      properties: {
        prospect_email: { type: "string" },
        subject: { type: "string" },
        body: { type: "string" }
      },
      required: ["prospect_email", "subject", "body"]
    }
  }
];

// Claude decides which tools to call
const response = await client.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  tools: tools,
  messages: [{
    role: "user",
    content: "This prospect is qualified. Update their status to 'qualified' and send them our pricing info."
  }]
});

// Handle tool calls
if (response.stop_reason === 'tool_use') {
  response.content.forEach(block => {
    if (block.type === 'tool_use') {
      const result = await executeTool(block.name, block.input);
      // Send result back to Claude for next decision
    }
  });
}
```

### Advanced Features

**Prompt Caching (save costs):**
```javascript
// Expensive context (company profile, research frameworks) cached across requests
const response = await client.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 500,
  system: [
    {
      type: "text",
      text: "You are an expert sales analyst. Analyze prospects for ICP fit."
    },
    {
      type: "text",
      text: `Research Framework:
      1. Company fit (industry, size, growth)
      2. Role fit (decision maker vs influencer)
      3. Problem fit (do they have the problem we solve?)`,
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [...]
});
// First call: processes cache (slightly higher cost)
// Subsequent calls: use cached context (10% cost savings)
```

**Cost Tracking:**
```javascript
// Log every API call for usage analytics
const logApiCall = async (model, input_tokens, output_tokens) => {
  const cost = calculateCost(model, input_tokens, output_tokens);
  await db.insertOne('api_calls', {
    org_id, user_id, model, input_tokens, output_tokens,
    cost, created_at: new Date()
  });
};

// Per-feature cost analysis
const getCostByFeature = async (org_id) => {
  // Group costs by feature (research, message_generation, etc)
  const costs = await db.aggregate([
    { $match: { org_id } },
    { $group: { _id: '$feature', total_cost: { $sum: '$cost' } } }
  ]);
  return costs;
};
```

### Guardrails

**Content Moderation:**
```javascript
// Check generated content for issues before sending
const isContentSafe = async (text) => {
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 100,
    messages: [{
      role: "user",
      content: `Check this email for: (1) professional tone, (2) no lies/exaggerations,
                (3) no spam language. Response: "SAFE" or "ISSUES: [list]"\n\n${text}`
    }]
  });
  return response.content[0].text.startsWith('SAFE');
};
```

**PII Filtering:**
```javascript
// Remove sensitive data before logging
const sanitizeForLogging = (text) => {
  // Regex for emails, phone, SSN, etc
  return text
    .replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '[EMAIL]')
    .replace(/\+?\d{1,3}\s?\d{3}\s?\d{3}\s?\d{4}/g, '[PHONE]')
    .replace(/\d{3}-\d{2}-\d{4}/g, '[SSN]');
};
```

---

## 5. Automation Engine

### Workflow Builder (Visual)

**UI Components:**
- Canvas (drag-drop triggers, actions, logic gates)
- Trigger panel: Time-based (schedule), Event-based (webhook), Manual trigger
- Action panel: Send email, update CRM, create task, call API, execute Claude analysis, log event
- Logic: If/else, loops (for each prospect), parallel execution, delays

**Execution:**
```javascript
// Workflow structure
{
  id: 'sequence-1',
  name: 'Monday morning outreach',
  triggers: [{
    type: 'schedule',
    config: {
      dayOfWeek: 'monday',
      hour: 6,
      minute: 0,
      timezone: 'IST'
    }
  }],
  actions: [
    {
      id: 'step-1',
      type: 'fetch_prospects',
      config: {
        filter: { status: 'queued', queue_week: 'current' }
      }
    },
    {
      id: 'step-2',
      type: 'for_each',
      loopVar: 'prospect',
      actions: [
        {
          type: 'generate_message',
          config: { prospectVar: 'prospect' }
        },
        {
          type: 'send_email',
          config: {
            to: 'prospect.email',
            subject: 'Personalized subject',
            body: 'message from step above'
          }
        },
        {
          type: 'wait',
          config: { seconds: 5 } // Stagger sends
        }
      ]
    },
    {
      id: 'step-3',
      type: 'notify_slack',
      config: {
        channel: '#outreach',
        message: 'Sent {{ step-1.count }} emails'
      }
    }
  ]
}
```

### Background Job Processing (Bull + Redis)

**Job Types:**

```javascript
// Email send queue
emailQueue.add('send', {
  prospectId, messageBody, subject
}, {
  priority: 10,
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 }
});

// Weekly analytics aggregation
analyticsQueue.add('aggregate_weekly', {
  org_id, week
}, {
  repeat: { pattern: '0 0 * * MON' } // Every Monday midnight
});

// CRM sync (Salesforce, HubSpot)
crmSyncQueue.add('sync_prospects', {
  org_id, integrationId
}, {
  repeat: { pattern: '0 */4 * * *' } // Every 4 hours
});

// Prospect warm-up email sequence
warmupQueue.add('send_warmup', {
  prospectId, sequenceStep
}, {
  delay: calculateNextSendTime(prospect)
});

// Engagement scoring
scoringQueue.add('score_prospects', {
  org_id
}, {
  repeat: { pattern: '0 */12 * * *' } // Twice daily
});

// Failed job retry
jobQueue.on('failed', async (job, err) => {
  if (job.attemptsMade < job.opts.attempts) {
    // Retry with backoff
    await job.retry();
  } else {
    // Alert user
    await notificationService.send(org_id, {
      type: 'job_failed',
      jobType: job.name,
      prospectId: job.data.prospectId,
      error: err.message
    });
  }
});
```

### Validation Engine

**Email Validation:**
```javascript
const validateEmail = async (email) => {
  // Syntax check
  if (!email.match(/^[\w\.-]+@[\w\.-]+\.\w+$/)) {
    return { valid: false, reason: 'INVALID_FORMAT' };
  }

  // MX record check (domain accepts mail)
  const mxRecords = await dns.resolveMx(email.split('@')[1]);
  if (!mxRecords || mxRecords.length === 0) {
    return { valid: false, reason: 'INVALID_DOMAIN' };
  }

  // SMTP check (if aggressive validation enabled)
  const isDeliverable = await smtpValidator.verify(email);
  if (!isDeliverable) {
    return { valid: false, reason: 'NOT_DELIVERABLE' };
  }

  return { valid: true };
};
```

**Prospect Deduplication:**
```javascript
const findDuplicates = async (name, email, company) => {
  // Exact match
  const exact = await db.prospects.findOne({
    name: { $eq: name },
    email: { $eq: email }
  });

  // Fuzzy match (typos, variations)
  const fuzzy = await db.prospects.find({
    $or: [
      { name: { $regex: levenshtein(name, 2) } }, // 2 char difference
      { email: { $regex: email.split('@')[0] } }, // Same email prefix
      { company: { $eq: company } }
    ]
  });

  return fuzzy.filter(f => similarity(name, f.name) > 0.8);
};
```

### Rate Limiting

**Email Send Limits:**
```javascript
// Per-domain warm-up (avoid spam filters)
const canSendToEmail = async (email, org_id) => {
  const domain = email.split('@')[1];
  const sentToday = await redis.get(`email_sent:${org_id}:${domain}:today`);
  const limit = 50; // Max 50 per domain per day

  return (sentToday || 0) < limit;
};

// Stagger sends (avoid burst detection)
const getNextSendTime = async (prospect) => {
  // Last sent to this domain: 5 min ago
  // Send next one: 5-10 min from last send
  const lastSent = await db.outreachQueue.findOne(
    { email: /.*@domain.com$/ },
    { sort: { sent_at: -1 } }
  );

  const delay = randomInt(5, 10) * 60 * 1000; // 5-10 min
  return new Date(lastSent.sent_at.getTime() + delay);
};

// API call limits
const checkRateLimit = async (org_id, integrationId) => {
  const calls = await redis.incr(`api_calls:${org_id}:${integrationId}:min`);
  redis.expire(`api_calls:${org_id}:${integrationId}:min`, 60);

  if (calls > 500) { // HubSpot 500/min limit
    throw new Error('Rate limit exceeded. Retry after 60 seconds.');
  }
};
```

---

## 6. Analytics & Insights

### Real-Time Dashboards

**Primary Dashboard (Hero Metrics):**
- Prospects in queue (count, trend)
- Emails sent today (count, open rate live)
- Replies received (count, reply rate)
- Reply time (avg hours between send and reply)
- Engagement rate (opened + clicked / sent)

**Charts:**
- Line chart: Metrics over last 30 days (email volume, open rate trend)
- Bar chart: Performance by team member (emails sent, replies received)
- Funnel chart: Qualification funnel (added → contacted → replied → qualified)
- Heatmap: Best send times (hour × day of week for highest open rate)
- Pie chart: Reply reason breakdown (interested, not interested, busy, etc)

**Real-Time Updates:**
```javascript
// Server broadcasts metrics every 10 seconds
const broadcastDashboard = async (org_id) => {
  const metrics = {
    prospects_queued: await countProspectsInQueue(org_id),
    emails_sent_today: await countEmailsSentToday(org_id),
    replies_received: await countRepliesReceived(org_id),
    open_rate: await calculateOpenRate(org_id),
    reply_rate: await calculateReplyRate(org_id),
    avg_response_time: await calculateAvgResponseTime(org_id)
  };

  io.to(`org:${org_id}`).emit('dashboard:update', metrics);
};

setInterval(() => broadcastDashboard, 10000);
```

### Predictive Analytics (ML Models)

**Reply Likelihood Prediction:**
```python
# Train on historical data weekly
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# Features: prospect tenure, title level, industry, company size, message sentiment
data = pd.read_sql("""
  SELECT p.id, p.title, p.company_size, p.industry,
         LENGTH(m.message) as msg_length,
         CASE WHEN r.replied_at IS NOT NULL THEN 1 ELSE 0 END as replied
  FROM prospects p
  JOIN outreach_queue o ON p.id = o.prospect_id
  JOIN messages m ON o.id = m.outreach_id
  LEFT JOIN replies r ON o.id = r.outreach_id
  WHERE o.sent_at > CURRENT_DATE - INTERVAL '90 days'
""")

model = RandomForestClassifier(n_estimators=100)
model.fit(data[features], data['replied'])

# Serve predictions via API
@app.post('/api/analytics/predict-reply')
def predict_reply(prospect_id: str):
  prospect = db.prospects.findOne({ '_id': prospect_id })
  features = extract_features(prospect)
  probability = model.predict_proba([features])[0][1]
  return { 'reply_probability': probability, 'confidence': 0.95 }
```

**Best Send Time Prediction:**
```python
# Analyze by: recipient timezone, title, industry, day of week, hour
data = pd.read_sql("""
  SELECT DATE_TRUNC('hour', o.sent_at) as send_hour,
         EXTRACT(DOW FROM o.sent_at) as day_of_week,
         p.timezone, p.title, p.industry,
         CASE WHEN r.opened_at IS NOT NULL THEN 1 ELSE 0 END as opened
  FROM outreach_queue o
  JOIN prospects p ON o.prospect_id = p.id
  LEFT JOIN email_events r ON o.id = r.outreach_id
  WHERE o.sent_at > CURRENT_DATE - INTERVAL '180 days'
""")

# Group by (timezone, title, day_of_week) and find hour with highest open rate
best_times = data.groupby(['timezone', 'title', 'day_of_week'])
  .apply(lambda g: g[g['opened'] == 1].shape[0] / len(g))
  .idxmax()
```

**Prospect Quality Score:**
```javascript
// Composite score: engagement history, firmographic fit, intent signals
const calculateProspectScore = async (prospect_id) => {
  const prospect = await db.prospects.findOne({ _id: prospect_id });
  const history = await db.outreachQueue.find({ prospect_id });

  const engagementScore = calculateEngagementScore(history); // 0-30
  const firmographicScore = calculateFirmographicScore(prospect); // 0-30
  const intentScore = calculateIntentScore(prospect.research_data); // 0-40

  const totalScore = engagementScore + firmographicScore + intentScore; // 0-100

  return {
    score: totalScore,
    engagement: engagementScore,
    firmographic: firmographicScore,
    intent: intentScore,
    recommendation: totalScore > 70 ? 'HIGH_PRIORITY' :
                    totalScore > 40 ? 'MEDIUM' : 'LOW'
  };
};
```

### Custom Reports

**Report Builder:**
```javascript
// User-defined report
{
  id: 'report-1',
  name: 'Weekly Team Performance',
  metrics: ['emails_sent', 'open_rate', 'reply_rate', 'avg_response_time'],
  groupBy: 'team_member',
  filters: {
    date_range: 'last_7_days',
    status: 'sent'
  },
  export_formats: ['pdf', 'csv', 'excel'],
  schedule: { frequency: 'weekly', day: 'friday', hour: 9 }
}
```

**Scheduled Report Delivery:**
```javascript
// Every Friday 9am: generate report, send to email/Slack
const sendScheduledReport = async (reportId, org_id) => {
  const report = await db.reports.findOne({ _id: reportId });
  const data = await queryReportData(report);

  // Render PDF
  const pdf = await generatePdf(data, report.template);

  // Send via email + Slack
  await emailService.send({
    to: report.recipients,
    subject: `${report.name} - ${new Date().toLocaleDateString()}`,
    body: `Attached is your weekly report.`,
    attachments: [{ filename: `${report.name}.pdf`, content: pdf }]
  });

  await slackService.send({
    channel: report.slack_channel,
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `📊 ${report.name} Generated` }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: formatMetrics(data) }
      }
    ]
  });
};
```

---

## 7. Security & Compliance

### Authentication & Authorization

**Multi-Factor Authentication (MFA):**
```javascript
// TOTP (Google Authenticator, Authy)
const generateMfaSecret = () => {
  const secret = speakeasy.generateSecret({
    name: 'Layeroi',
    length: 32
  });
  return { secret: secret.base32, qr_code: secret.qr_svg };
};

const verifyMfaToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2
  });
};

// Backup codes (stored hashed)
const generateBackupCodes = () => {
  return Array(10).fill(0).map(() =>
    crypto.randomBytes(4).toString('hex')
  );
};
```

**OAuth2 + OIDC (Passwordless):**
```javascript
// Google OAuth
const oauth = new google.auth.OAuth2(
  CLIENT_ID, CLIENT_SECRET, REDIRECT_URL
);

app.get('/api/auth/oauth/google', (req, res) => {
  const authUrl = oauth.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email']
  });
  res.redirect(authUrl);
});

app.get('/api/auth/oauth/callback/google', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth.getToken(code);

  // Get user info
  const { data } = await google.oauth2('v2').userinfo.get({
    auth: oauth
  });

  // Upsert user
  const user = await db.users.findOneAndUpdate(
    { email: data.email },
    {
      $set: {
        first_name: data.given_name,
        last_name: data.family_name,
        avatar_url: data.picture,
        oauth_provider: 'google',
        oauth_id: data.id
      }
    },
    { upsert: true, returnDocument: 'after' }
  );

  // Create session
  const jwt = createJWT(user);
  res.cookie('session', jwt, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.redirect(`${FRONTEND_URL}/dashboard`);
});
```

**Role-Based Access Control (RBAC):**
```javascript
const roles = {
  OWNER: { permissions: ['*'] }, // Full access
  ADMIN: {
    permissions: ['read:*', 'write:*', 'delete:prospects', 'manage:team']
  },
  LEAD: {
    permissions: ['read:*', 'write:outreach', 'read:analytics', 'manage:team_limited']
  },
  MEMBER: {
    permissions: ['read:prospects', 'write:outreach', 'read:own_analytics']
  },
  VIEWER: {
    permissions: ['read:dashboards', 'read:analytics']
  }
};

// Middleware to check permissions
const requirePermission = (required) => {
  return async (req, res, next) => {
    const user = req.user;
    const org_id = req.params.org_id;

    const member = await db.team_members.findOne({
      org_id, user_id: user.id
    });

    const role = roles[member.role];
    const hasPermission = required.some(perm =>
      role.permissions.includes(perm) ||
      role.permissions.includes('*')
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }

    next();
  };
};

// Usage
app.delete('/api/prospects/:id',
  requirePermission(['delete:prospects']),
  deleteProspect
);
```

**API Key Authentication:**
```javascript
// Scoped API keys for integrations
const createApiKey = async (org_id, scopes) => {
  const key = crypto.randomBytes(32).toString('hex');
  const key_hash = crypto.createHash('sha256').update(key).digest('hex');

  await db.api_keys.insertOne({
    org_id,
    key_hash,
    scopes, // ['read:prospects', 'write:outreach', 'read:analytics']
    created_at: new Date(),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
  });

  return key; // Return to user only once
};

// Middleware to authenticate via API key
const authenticateApiKey = async (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (!key) return res.status(401).json({ error: 'UNAUTHORIZED' });

  const key_hash = crypto.createHash('sha256').update(key).digest('hex');
  const apiKey = await db.api_keys.findOne({ key_hash });

  if (!apiKey || apiKey.expires_at < new Date()) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  req.org_id = apiKey.org_id;
  req.scopes = apiKey.scopes;

  next();
};
```

### Data Protection

**Encryption at Rest:**
```javascript
// Field-level encryption for sensitive data
const encryptField = (plaintext, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    ciphertext: encrypted,
    authTag: authTag.toString('hex')
  };
};

const decryptField = (encrypted, key) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(encrypted.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));

  let decrypted = decipher.update(encrypted.ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

// Usage: Store API keys encrypted
const apiKey = 'sk_live_...';
const encrypted = encryptField(apiKey, ENCRYPTION_KEY);
await db.integrations.updateOne(
  { _id: integration_id },
  { $set: { api_key_encrypted: encrypted } }
);
```

**Encryption in Transit:**
- TLS 1.3 for all connections
- HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- Certificate pinning for API clients (prevent MITM attacks)

**Data Residency:**
```javascript
// User can select data residency region
const createOrganization = async (name, dataResidency) => {
  // dataResidency: 'us-east-1', 'eu-west-1', 'ap-southeast-1'

  const org = {
    name,
    data_residency: dataResidency,
    database_url: getDatabaseUrlForRegion(dataResidency)
  };

  return org;
};
```

### Compliance

**GDPR/CCPA Data Subject Rights:**
```javascript
// Right to access: Export all personal data
app.get('/api/privacy/export', async (req, res) => {
  const user = req.user;

  const data = {
    user: await db.users.findOne({ _id: user.id }),
    prospects: await db.prospects.find({ created_by: user.id }),
    outreach: await db.outreachQueue.find({ user_id: user.id }),
    emails: await db.email_events.find({ user_id: user.id })
  };

  const zip = new AdmZip();
  zip.addFile('user.json', JSON.stringify(data.user, null, 2));
  zip.addFile('prospects.json', JSON.stringify(data.prospects, null, 2));
  // ... etc

  res.setHeader('Content-Type', 'application/zip');
  res.send(zip.toBuffer());
});

// Right to be forgotten: Delete all user data
app.delete('/api/privacy/erase', async (req, res) => {
  const user = req.user;

  // Anonymize instead of delete (for analytics)
  await db.users.updateOne(
    { _id: user.id },
    { $set: {
      email: `deleted_${user.id}@deleted.local`,
      first_name: 'Deleted',
      last_name: 'User',
      avatar_url: null,
      deleted_at: new Date()
    }}
  );

  // Delete personally identifiable info
  await db.outreachQueue.updateMany(
    { user_id: user.id },
    { $set: { recipient_name: null, recipient_email: null } }
  );

  res.json({ success: true });
});
```

**Audit Logging (SOC2, HIPAA):**
```javascript
const auditLog = async (org_id, user_id, action, details) => {
  await db.audit_logs.insertOne({
    org_id,
    user_id,
    action, // 'prospect_created', 'email_sent', 'api_key_created'
    entity_type: details.entity_type,
    entity_id: details.entity_id,
    changes: details.changes, // { before: {}, after: {} }
    ip_address: details.ip_address,
    user_agent: details.user_agent,
    created_at: new Date()
  });
};

// Usage
auditLog(org_id, user_id, 'prospect_created', {
  entity_type: 'prospect',
  entity_id: prospect_id,
  changes: { before: null, after: prospectData },
  ip_address: req.ip,
  user_agent: req.get('user-agent')
});
```

---

## 8. Integrations (20+ Services)

### Email Providers
- **Gmail API** - Send, track opens/clicks via webhooks
- **Outlook/Microsoft Graph** - Send, read/unread tracking
- **HubSpot Sequences** - Bi-directional sync

### CRM Integrations
- **Salesforce** - Sync prospects to leads, update opportunities
- **HubSpot** - Create contacts, update properties, trigger workflows
- **Pipedrive** - Sync to deals, activity tracking
- **Close** - Native API integration for sales sequences

### Sales & Productivity
- **Jira** - Create issues from customer feedback, link conversations
- **Asana** - Sync tasks, create from email replies
- **Notion** - Embed dashboards in Notion workspace
- **Calendly** - Schedule calls with prospects
- **Zoom** - Embed meeting links, track attendance

### Communication
- **Slack** - Notifications (new reply, campaign milestone), command slash, bot home
- **Discord** - Channel notifications for team updates
- **Twilio** - SMS follow-ups and phone calling
- **WhatsApp Business** - Message prospects via WhatsApp
- **Vonage** - Voice calling, SMS

### Automation Platforms
- **Zapier** - Connect 10K+ apps (Google Sheets, Stripe, Mailchimp, etc)
- **Make (Integromat)** - Visual workflows, scenario builder

### Analytics & Tracking
- **Segment** - Unified event tracking, CDP
- **Google Analytics 4** - User behavior, conversion tracking
- **Amplitude** - Advanced analytics, cohort analysis
- **Mixpanel** - User behavior, funnels, retention
- **Datadog** - Metrics, logs, APM integration

### Marketing & Ads
- **Google Ads** - Sync campaigns, ROI tracking
- **Facebook Ads API** - Campaign management, pixel tracking
- **LinkedIn Ads** - B2B campaign management
- **HubSpot Marketing Hub** - Email campaigns, landing pages

### Payment Processing
- **Stripe** - Subscriptions, usage-based billing, invoicing
- **PayPal** - Alternative payment method
- **2Checkout (Verifone)** - Global payment processing

### Knowledge Management
- **Confluence** - Sync documentation, embed in dashboards
- **GitHub** - Sync code examples, link PRs to issues
- **Internal Wikis** - Embed knowledge base articles

### Monitoring
- **Datadog** - Full platform monitoring, alerts, logs
- **Sentry** - Error tracking, performance monitoring
- **PagerDuty** - On-call incident management

---

## 9. Performance Targets

### Backend Performance

**Response Times (p95):**
- Simple queries (prospects, outreach): <50ms
- List endpoints (pagination, filtering): <100ms
- AI operations (message generation): <2s (streaming) or <30s (batch)
- Complex analytics queries: <500ms

**Database Performance:**
- All queries: <50ms p95 (via query analysis + indexing)
- Connection pool: 30 connections, auto-scaling
- Materialized view refresh: 5 minutes
- Backup: Daily, point-in-time recovery

**Server Resources:**
- Memory: <200MB baseline, <500MB under load
- CPU: Multi-core utilization (clustering)
- Disk: 50GB+ for database, auto-scaling storage

### Frontend Performance (Lighthouse 95+)

**Core Web Vitals:**
- Largest Contentful Paint (LCP): <2.5s
- First Input Delay (FID): <100ms
- Cumulative Layout Shift (CLS): <0.1

**Load Performance:**
- Time to Interactive: <3.5s
- Bundle size: <200KB gzipped (main)
- Per-route chunks: <50KB gzipped

**Image Optimization:**
- WebP format with fallbacks
- Responsive srcset (1x, 2x, 3x)
- Lazy load below-the-fold images
- Compression: AVIF > WebP > JPEG

**Font Optimization:**
- Preload critical fonts (Playfair + Inter)
- Font-display: swap (show fallback, swap when loaded)
- Subset fonts (Latin only)

### Database Performance

**Query Optimization:**
- Explain plan review on all queries
- Indexes on foreign keys, composite keys, filters
- Partition large tables (outreach_queue by date)
- Query plan cache

**Caching Strategy:**
- Redis for session store (24hr TTL)
- HTTP cache headers (max-age, ETag)
- Database query caching (TanStack Query)
- CDN cache for static assets (immutable, versioned)

### Deployment Performance

**Infrastructure Scalability:**
- Auto-scaling: 2-4 Railway dynos based on load
- Database replicas for read-heavy analytics
- Redis cluster for caching and job queue
- CDN (CloudFlare) for static assets

**Monitoring & Alerting:**
- Datadog: Metrics on every endpoint, database query, external API
- Alerts: Latency spikes >100ms p95, error rate >1%, dependencies down
- Incident response: PagerDuty integration, runbooks linked in alerts

---

## 10. DevOps & Monitoring

### CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
name: CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm test -- --coverage
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/build-push-action@v4
        with:
          push: true
          tags: ghcr.io/org/layeroi:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Railway
        run: |
          curl -X POST https://api.railway.app/deploy \
            -H "Authorization: Bearer ${{ secrets.RAILWAY_TOKEN }}" \
            -d '{"service": "layeroi", "image": "ghcr.io/org/layeroi:${{ github.sha }}"}'
```

**Branch Strategy:**
- `main`: Production, deploy on merge
- `develop`: Staging, auto-deploys
- Feature branches: PR required, pass tests before merge

### Monitoring & Observability

**Datadog Monitoring:**

```python
# APM for tracing
from ddtrace import tracer

@app.route('/api/prospects')
@tracer.wrap()
def get_prospects():
    # Automatically traced
    return db.prospects.find()

# Custom metrics
from datadog import initialize, api

options = {
    'api_key': os.environ['DD_API_KEY'],
    'app_key': os.environ['DD_APP_KEY']
}
initialize(**options)

# Metrics on every feature
api.Metric.send(
    metric='layer_roi.prospects.added',
    points=1,
    tags=['org_id:123', 'team:sales']
)

api.Metric.send(
    metric='layer_roi.emails.sent',
    points=1,
    tags=['provider:gmail', 'domain:gmail.com']
)
```

**Alert Rules:**
- P99 latency > 200ms (page)
- Error rate > 1% (page-wide)
- Database connection pool > 25 (nearing limit)
- Redis memory > 80% (cache pressure)
- Dependency failure (external API down)

**Error Tracking (Sentry):**

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% of transactions
});

app.use((err, req, res, next) => {
  Sentry.captureException(err, {
    tags: {
      endpoint: req.path,
      method: req.method,
      org_id: req.org_id
    }
  });

  res.status(500).json({ error: 'INTERNAL_ERROR' });
});
```

**Logs (Structured JSON):**

```javascript
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Log with context
logger.info('Email sent', {
  org_id: '123',
  prospect_id: '456',
  domain: 'gmail.com',
  timestamp: new Date().toISOString(),
  duration_ms: 250
});

// Aggregated in Datadog
```

### Incident Response

**PagerDuty Integration:**

```javascript
const pd = require('node-pagerduty');

const raiseIncident = async (severity, title, description) => {
  const incident = await pd.post('/incidents', {
    incident: {
      type: 'incident',
      title: title,
      service: { id: 'service_id', type: 'service_reference' },
      urgency: severity === 'critical' ? 'high' : 'low',
      body: {
        type: 'incident_body',
        details: description
      }
    }
  });

  return incident;
};

// Trigger from alert
alertService.on('critical_error', (alert) => {
  raiseIncident('critical', alert.title, alert.details);
});
```

---

## 11. User Features

### Team Collaboration

**Workspaces & Teams:**
- Organization owns one workspace
- Workspace contains multiple teams (Sales, Operations, etc)
- Teams have members with role-based permissions
- Switch between workspaces via quick switcher (Cmd+Shift+O)

**Shared Resources:**
- Prospects: See who's currently outreaching the same person (live indicator)
- Messages: Templates shared across team
- Saved searches: Reusable filters across team
- Dashboards: Shared views (read-only via link)
- Reports: Scheduled delivery to team channels

**Activity Feed:**
- Recent actions: "John sent 50 emails", "Sarah replied to 5 prospects"
- @mentions in comments: "Hey @john, can you follow up on this?"
- Real-time presence: See who's online (green dot)
- Team activity digest: Daily summary via email/Slack

### Permissions System

**Role Hierarchy:**
- **Owner** (1 per org): Full access, billing, delete org
- **Admin**: All except billing, can manage team
- **Lead**: Team management, analytics, limited delete
- **Member**: Own outreach only, read all analytics
- **Viewer**: Read-only dashboards, analytics

**Custom Roles:**
- Create custom roles with granular permissions
- Permissions: read:*, write:*, delete:*, manage:*

### Notifications

**Channels:**
- In-app: Badge count on bell icon, notification center
- Email: Daily digest (default), or real-time for critical
- Slack: Real-time for high-priority (reply received, budget alert)
- SMS: Only for critical (emergency alerts)

**Types:**
- New reply received (high priority)
- Email opened (medium)
- Campaign milestone reached (medium)
- Budget limit approaching (high)
- Team member joined/left (low)

---

## 12. Mobile Experience

### Responsive Design (Mobile-First)

**Viewport & Touch:**
- Viewport: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">`
- Touch targets: 48px minimum (WCAG AAA)
- Gesture support: Swipe back, swipe to dismiss

**Navigation (Mobile):**
- Bottom tab bar (5 items max): Home, Compose, Inbox, Analytics, Menu
- Hamburger menu for secondary actions
- Search bar always visible (search prospects)

**Layout Adaptations:**
- Vertical layout (no sidebars)
- Full-width cards, stacked sections
- Collapsible sections (research, history)
- Swipe to reveal actions (archive, delete)

### Native Mobile Apps

**React Native (iOS + Android):**

```javascript
// App.js
import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import PushNotification from 'react-native-push-notification';
import * as SecureStore from 'expo-secure-store';

export default function App() {
  useEffect(() => {
    // Configure push notifications
    PushNotification.configure({
      onNotification: (notification) => {
        if (notification.foreground) {
          navigation.navigate('Inbox', { prospectId: notification.data.prospectId });
        }
      }
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TabNavigator />
    </View>
  );
}

// Secure storage for auth tokens
const storeToken = async (token) => {
  await SecureStore.setItemAsync('auth_token', token);
};

const getToken = async () => {
  return await SecureStore.getItemAsync('auth_token');
};
```

**Offline Support:**
- Draft emails (sync when online)
- View cached prospects
- Offline indicator shows sync status

### Progressive Web App (PWA)

**Service Worker:**

```javascript
// service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('layeroi-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/main.css',
        '/js/app.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Network-first for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
  // Cache-first for static assets
  else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

**Install Prompt:**
- Show "Install App" banner on mobile
- Add to home screen shortcut
- Standalone mode (fullscreen, no browser UI)

---

## 13. Advanced Features

### Webhooks (Outgoing)

**Webhook Manager:**
```javascript
// User configures webhook
{
  id: 'webhook-1',
  url: 'https://customer.com/api/webhooks',
  events: ['prospect.added', 'email.opened', 'email.replied'],
  headers: { 'Authorization': 'Bearer token', 'X-Custom': 'value' },
  is_active: true,
  signing_secret: 'whsk_...'
}

// Every event triggers webhook
app.on('email.opened', async (event) => {
  const webhooks = await db.webhooks.find({
    org_id: event.org_id,
    events: { $in: ['email.opened'] }
  });

  for (const webhook of webhooks) {
    // Sign request with HMAC-SHA256
    const signature = crypto
      .createHmac('sha256', webhook.signing_secret)
      .update(JSON.stringify(event))
      .digest('hex');

    // Send webhook
    await axios.post(webhook.url, event, {
      headers: {
        ...webhook.headers,
        'X-Signature': signature,
        'X-Timestamp': Date.now()
      },
      timeout: 10000
    }).catch(async (err) => {
      // Retry with exponential backoff
      await webhookQueue.add('retry', {
        webhook_id: webhook.id,
        event: event,
        attempt: 1
      }, {
        delay: 5000, // 5 seconds
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 }
      });
    });
  }
});
```

**Webhook Testing UI:**
- Send sample payload to webhook URL
- View past deliveries (success/failure)
- Retry failed deliveries
- View request/response bodies

### Custom Fields

**Field Configuration:**
```javascript
// Admin creates custom field
{
  id: 'field-1',
  org_id: 'org-123',
  entity_type: 'prospect',
  field_name: 'num_employees',
  field_type: 'number', // text, email, date, checkbox, select
  validation: { min: 1, max: 1000000 },
  display_order: 1,
  required: false
}

// Display in UI
<CustomField
  field={customField}
  value={prospect[customField.field_name]}
  onChange={(newValue) => updateProspect({ [customField.field_name]: newValue })}
/>
```

### Saved Searches

**Smart Filters:**
```javascript
// User creates saved search
{
  id: 'search-1',
  name: 'High Priority - Tech Companies',
  filters: {
    industry: { $in: ['Technology', 'SaaS'] },
    company_size: { $gte: 100 },
    icp_score: { $gte: 0.7 },
    status: { $ne: 'replied' }
  }
}

// Reuse in UI
<SavedSearches
  onSelect={(search) => {
    applyFilters(search.filters);
    setActiveSearch(search.id);
  }}
/>
```

### Email Templates

**Template Variables:**
```
Hi {{ prospect.first_name }},

I noticed {{ prospect.company }} just raised a Series A round.
We help {{ prospect.industry }} companies like yours...

Our value prop: {{ company.value_prop }}

Best regards,
{{ user.name }}
```

**A/B Testing:**
```javascript
// Create variant
{
  template_id: 'template-1',
  subject_a: 'Series A Congrats!',
  subject_b: 'Wanted to share something',
  body_a: 'Congratulations on your Series A...',
  body_b: 'Hi {{ prospect.first_name }}...'
}

// Randomly assign (50/50 split)
const variant = Math.random() < 0.5 ? 'a' : 'b';
const message = variant === 'a' ? template.body_a : template.body_b;

// Track which variant got reply
outreach_queue.update(
  { _id: outreach_id },
  { $set: { ab_variant: variant, replied_at: new Date() } }
);

// Analyze results
const resultsA = db.outreach_queue.aggregate([
  { $match: { ab_variant: 'a' } },
  { $group: { _id: null, replied: { $sum: { $cond: ['$replied_at', 1, 0] } } } }
]);
```

### Bulk Actions

**Bulk Operations:**
```javascript
// Select multiple prospects
selectedProspects: ['p1', 'p2', 'p3', ...]

// Apply action
const bulkAction = async (action, prospects) => {
  const ops = prospects.map(p => {
    switch(action) {
      case 'add_to_sequence':
        return { updateOne: { filter: { _id: p }, update: { $set: { automation_id } } } };
      case 'change_status':
        return { updateOne: { filter: { _id: p }, update: { $set: { status: 'qualified' } } } };
      case 'export':
        return null; // Handle separately
      case 'delete':
        return { deleteOne: { filter: { _id: p } } };
    }
  }).filter(Boolean);

  await db.prospects.bulkWrite(ops);
};
```

---

## 14. Documentation & Support

### Developer Documentation

**API Documentation:**
- OpenAPI 3.0 spec (auto-generated from JSDoc)
- Swagger UI at `/api/docs`
- Code examples in JavaScript, Python, Go
- Authentication guide (JWT, OAuth, API keys)
- Rate limiting and error handling
- Webhook guide with signature verification
- SDK documentation (JS package, Python package, Go module)

**Guides:**
- Getting started (5 min setup)
- Building workflows (visual builder + API)
- Integrations guide (Salesforce, HubSpot, etc)
- Custom fields implementation
- Webhook management
- Analytics API querying

### Help Center

**Knowledge Base:**
- FAQs organized by feature (prospects, outreach, integrations, analytics)
- Video tutorials (2-5 min per feature)
- Troubleshooting guides (common errors + solutions)
- Integration documentation (setup, field mapping, sync frequency)
- Feature announcements + changelog

**In-App Help:**
- Contextual help modals (click ? icon)
- Tour on first login (highlights key features)
- Command palette (Cmd+K): Search features, navigate, run actions
- Tooltips on complex inputs (explain what field means)

### Customer Support

**Support Channels:**
- Email: support@layeroi.com (24hr SLA for paid tiers)
- Slack community: Join 500+ users
- Twitter support: @Layeroi support team
- Feature request voting board (upvote, comment)

**Premium Support (Enterprise tier):**
- Priority email (4hr SLA)
- Dedicated success manager (quarterly QBR)
- Private Slack channel
- Custom training sessions

### Onboarding

**Signup Flow:**
1. Email verification
2. Create organization + team
3. Interactive setup wizard:
   - Add email account (Gmail, Outlook)
   - Import prospects (CSV upload)
   - Send first email (template + customize)
4. Email course: 5 emails over 5 days (tips, use cases, best practices)

**Template Library:**
- 20+ pre-built templates for common scenarios
- Industry-specific (Tech, Finance, Healthcare)
- Use case-specific (cold outreach, follow-up, re-engagement)
- Quick-start sequences (monday morning, series A research)

---

## Implementation Approach

This specification covers the complete Layeroi system across 14 dimensions. Implementation will follow this sequence:

1. **Backend architecture refactor** (service layers, API contracts, database schema)
2. **Frontend component library** (80+ components, responsive, accessible)
3. **Database optimization** (indexes, RLS, materialized views, audit logging)
4. **AI integration** (Claude API endpoints, message generation, research)
5. **Automation engine** (workflow builder, job processing, validation)
6. **Analytics & insights** (dashboards, predictions, reports)
7. **Security & compliance** (auth, encryption, audit trails)
8. **Integrations** (20+ services, OAuth, webhooks, sync)
9. **Performance** (monitoring, caching, optimization)
10. **DevOps & CI/CD** (GitHub Actions, Railway, observability)
11. **User features** (collaboration, permissions, notifications)
12. **Mobile** (responsive, native apps, PWA)
13. **Advanced features** (webhooks, custom fields, bulk actions)
14. **Documentation** (API docs, guides, support)

Each dimension will be executed with:
- **Test-Driven Development (TDD)** - Write failing test first, implement, verify pass
- **Modular implementation** - Clean boundaries, isolated units, well-defined interfaces
- **Frequent commits** - Complete a task, commit, move to next
- **Full autonomy** - Execute without pausing for approval between tasks

**Goal:** Ship a world-class, institutional, enterprise-grade system that exceeds expectations across all dimensions.

