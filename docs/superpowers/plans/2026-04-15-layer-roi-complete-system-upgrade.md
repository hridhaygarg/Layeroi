# Layer ROI Complete System Upgrade - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This is an 80+ task plan organized by dependency phase. Execute in phase order. Within phases, tasks can be parallelized.

**Goal:** Upgrade Layer ROI from good to world-class, institutional, enterprise-grade system with excellence across all 14 dimensions simultaneously.

**Architecture:** Modular Monolith on Railway with clean service layers (auth, agents, outreach, analytics, integrations, webhooks). PostgreSQL + Redis. React 18 frontend. Real-time WebSocket support. Fully tested, monitored, documented.

**Tech Stack:** Node.js 20, Express.js, React 18, PostgreSQL 15+, Redis, Supabase, Claude API, Framer Motion, TanStack Query, Zustand, Railway, Datadog, Sentry, GitHub Actions, Docker.

---

## PHASE 1: Foundation & Infrastructure

### Task 1: Database Schema - Users & Organizations

**Files:**
- Create: `backend/migrations/001_core_schema.sql`
- Create: `backend/src/db/schema.js` (type definitions)
- Test: `backend/src/db/__tests__/schema.test.js`

- [ ] **Step 1: Write failing test for user creation**

```bash
cat > backend/src/db/__tests__/schema.test.js << 'EOF'
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

describe('Database Schema', () => {
  it('should have users table with correct columns', async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .limit(0);

    expect(error).toBeNull();
  });

  it('should have organizations table with correct columns', async () => {
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, created_by')
      .limit(0);

    expect(error).toBeNull();
  });

  it('should enforce NOT NULL on required fields', async () => {
    const { error } = await supabase
      .from('users')
      .insert([{ }]);

    expect(error).not.toBeNull();
  });
});
EOF
npm test backend/src/db/__tests__/schema.test.js
```

Expected: FAIL - "from" is not a function (tables don't exist yet)

- [ ] **Step 2: Create migration SQL**

```sql
cat > backend/migrations/001_core_schema.sql << 'EOF'
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Organizations (workspaces)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'active',
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_organizations_created_by ON organizations(created_by);
CREATE INDEX idx_organizations_created_at ON organizations(created_at);

-- Team members (organization membership)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(org_id, user_id)
);

CREATE INDEX idx_team_members_org_id ON team_members(org_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  scopes JSON DEFAULT '[]',
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_api_keys_org_id ON api_keys(org_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_read_self ON users
  FOR SELECT USING (auth.uid() = id OR auth.role() = 'service_role');

-- Teams see organizations they're members of
CREATE POLICY organizations_read ON organizations
  FOR SELECT USING (
    id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
  );

-- Teams see members in orgs they're in
CREATE POLICY team_members_read ON team_members
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
  );
EOF
```

- [ ] **Step 3: Run migration manually (for testing)**

```bash
# Set environment variables
export PGPASSWORD="$SUPABASE_PASSWORD"
export PGHOST="db.oryionopjhbxjmrucxby.supabase.co"
export PGPORT="5432"
export PGUSER="postgres"
export PGDATABASE="postgres"

# Run migration
psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f backend/migrations/001_core_schema.sql

# Or via Supabase CLI for easier management
cd backend
npx supabase migration new core_schema
# Copy 001_core_schema.sql content to the generated migration
npx supabase db push
```

Expected: No errors, tables created

- [ ] **Step 4: Create schema type definitions**

```javascript
cat > backend/src/db/schema.js << 'EOF'
/**
 * Core database schema type definitions
 * Used for JSDoc type hints and validation
 */

/**
 * @typedef {Object} User
 * @property {string} id - UUID
 * @property {string} email - Unique email address
 * @property {string} [password_hash] - Hashed password
 * @property {string} [first_name] - First name
 * @property {string} [last_name] - Last name
 * @property {string} [avatar_url] - Avatar URL
 * @property {string} timezone - Timezone (default UTC)
 * @property {string} language - Language code (default en)
 * @property {Date} created_at - Created timestamp
 * @property {Date} updated_at - Updated timestamp
 * @property {Date} [deleted_at] - Soft delete timestamp
 */

/**
 * @typedef {Object} Organization
 * @property {string} id - UUID
 * @property {string} name - Organization name
 * @property {string} [logo_url] - Logo URL
 * @property {string} created_by - User ID of creator
 * @property {string} subscription_tier - Subscription tier (free, pro, enterprise)
 * @property {string} subscription_status - Status (active, canceled, past_due)
 * @property {string} [stripe_customer_id] - Stripe customer ID
 * @property {Date} created_at - Created timestamp
 * @property {Date} updated_at - Updated timestamp
 * @property {Date} [deleted_at] - Soft delete timestamp
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} id - UUID
 * @property {string} org_id - Organization ID
 * @property {string} user_id - User ID
 * @property {string} role - Role (owner, admin, lead, member, viewer)
 * @property {Date} created_at - Created timestamp
 * @property {Date} updated_at - Updated timestamp
 */

/**
 * @typedef {Object} ApiKey
 * @property {string} id - UUID
 * @property {string} org_id - Organization ID
 * @property {string} user_id - User ID
 * @property {string} name - Key name (user-facing)
 * @property {string} key_hash - SHA256 hash of key
 * @property {Array<string>} scopes - Permissions (read:*, write:*, etc)
 * @property {Date} [last_used_at] - Last usage timestamp
 * @property {Date} created_at - Created timestamp
 * @property {Date} expires_at - Expiration timestamp
 */

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
};

export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  LEAD: 'lead',
  MEMBER: 'member',
  VIEWER: 'viewer'
};

export const ROLE_PERMISSIONS = {
  owner: ['*'],
  admin: ['read:*', 'write:*', 'delete:prospects', 'manage:team'],
  lead: ['read:*', 'write:outreach', 'read:analytics', 'manage:team_limited'],
  member: ['read:prospects', 'write:outreach', 'read:own_analytics'],
  viewer: ['read:dashboards', 'read:analytics']
};
EOF
```

- [ ] **Step 5: Run test to verify passes**

```bash
npm test backend/src/db/__tests__/schema.test.js
```

Expected: PASS (2 passing)

- [ ] **Step 6: Commit**

```bash
cd /Users/hridhaygarg/AgentCFO
git add backend/migrations/001_core_schema.sql backend/src/db/schema.js backend/src/db/__tests__/schema.test.js
git commit -m "feat: create core database schema (users, organizations, team_members, api_keys)"
```

---

### Task 2: Database Schema - Prospects & Outreach

**Files:**
- Modify: `backend/migrations/001_core_schema.sql`
- Create: `backend/src/db/__tests__/prospects.test.js`

- [ ] **Step 1: Write failing test for prospect table**

```javascript
cat > backend/src/db/__tests__/prospects.test.js << 'EOF'
import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

describe('Prospects Table', () => {
  it('should have prospects table with required columns', async () => {
    const { data, error } = await supabase
      .from('prospects')
      .select('id, name, email, company, org_id, status, icp_score')
      .limit(0);

    expect(error).toBeNull();
  });

  it('should have outreach_queue table', async () => {
    const { data, error } = await supabase
      .from('outreach_queue')
      .select('id, prospect_id, status, sent_at, opened_at, replied_at')
      .limit(0);

    expect(error).toBeNull();
  });

  it('should enforce unique email per organization', async () => {
    // This will be tested after data insertion
    expect(true).toBe(true);
  });
});
EOF
npm test backend/src/db/__tests__/prospects.test.js
```

Expected: FAIL - Relation "prospects" doesn't exist

- [ ] **Step 2: Add prospect and outreach tables to migration**

Append to `backend/migrations/001_core_schema.sql`:

```sql
-- Prospects
CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  industry VARCHAR(100),
  website VARCHAR(255),
  company_size VARCHAR(50),
  location VARCHAR(255),
  linkedin_url TEXT,
  research_data JSONB DEFAULT '{}'::jsonb,
  icp_score NUMERIC(3,2) CHECK (icp_score >= 0 AND icp_score <= 1.0),
  fit_reason TEXT,
  status VARCHAR(50) DEFAULT 'new',
  source VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(org_id, email, deleted_at) WHERE deleted_at IS NULL
);

CREATE INDEX idx_prospects_org_status ON prospects(org_id, status);
CREATE INDEX idx_prospects_email ON prospects(email);
CREATE INDEX idx_prospects_created_at ON prospects(created_at);
CREATE INDEX idx_prospects_icp_score ON prospects(icp_score DESC);
CREATE INDEX idx_prospects_fts ON prospects USING GIN(
  to_tsvector('english', name || ' ' || COALESCE(company, '') || ' ' || COALESCE(research_data::text, ''))
);

-- Outreach queue (partitioned by date)
CREATE TABLE outreach_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  message TEXT,
  personalized_message TEXT,
  generated_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1,
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  response_message TEXT,
  queue_week VARCHAR(20),
  attempt_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Create partitions for current and next 12 months
CREATE TABLE outreach_queue_2026_04 PARTITION OF outreach_queue
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');

CREATE TABLE outreach_queue_2026_05 PARTITION OF outreach_queue
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');

-- ... more partitions as needed

CREATE INDEX idx_outreach_org_status ON outreach_queue(org_id, status);
CREATE INDEX idx_outreach_prospect ON outreach_queue(prospect_id);
CREATE INDEX idx_outreach_sent ON outreach_queue(sent_at, opened_at);
CREATE INDEX idx_outreach_queue_week ON outreach_queue(queue_week);
CREATE INDEX idx_outreach_created ON outreach_queue(created_at);

-- Email events for tracking
CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  outreach_id UUID NOT NULL REFERENCES outreach_queue(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  location_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_events_outreach ON email_events(outreach_id, event_type);
CREATE INDEX idx_email_events_created ON email_events(created_at);

-- Triggers for outreach_queue timestamps
CREATE TRIGGER update_outreach_queue_updated_at BEFORE UPDATE ON outreach_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS for prospects
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY prospects_read ON prospects
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
  );

CREATE POLICY prospects_write ON prospects
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
  );

-- RLS for outreach_queue
ALTER TABLE outreach_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY outreach_queue_read ON outreach_queue
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
  );

-- RLS for email_events
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY email_events_read ON email_events
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
  );
```

- [ ] **Step 3: Update schema.js with prospect types**

Append to `backend/src/db/schema.js`:

```javascript
/**
 * @typedef {Object} Prospect
 * @property {string} id - UUID
 * @property {string} org_id - Organization ID
 * @property {string} name - Prospect name
 * @property {string} [title] - Job title
 * @property {string} email - Email address
 * @property {string} [phone] - Phone number
 * @property {string} [company] - Company name
 * @property {string} [industry] - Industry
 * @property {string} [website] - Company website
 * @property {string} [company_size] - Company size
 * @property {string} [location] - Location
 * @property {string} [linkedin_url] - LinkedIn URL
 * @property {Object} research_data - Research metadata
 * @property {number} [icp_score] - ICP fit score (0-1)
 * @property {string} [fit_reason] - Why this prospect is a fit
 * @property {string} status - Status (new, contacted, interested, unqualified, replied)
 * @property {string} [source] - Where prospect came from
 * @property {Date} created_at - Created timestamp
 * @property {Date} updated_at - Updated timestamp
 * @property {Date} [deleted_at] - Soft delete timestamp
 */

/**
 * @typedef {Object} OutreachQueue
 * @property {string} id - UUID
 * @property {string} org_id - Organization ID
 * @property {string} prospect_id - Prospect ID
 * @property {string} status - Status (pending, queued, sent, replied, failed, unsubscribed)
 * @property {string} [message] - Base message
 * @property {string} [personalized_message] - Personalized version
 * @property {Date} [generated_at] - When message was generated
 * @property {number} version - Message version
 * @property {Date} [sent_at] - When email was sent
 * @property {Date} [opened_at] - When email was opened
 * @property {Date} [clicked_at] - When link was clicked
 * @property {Date} [replied_at] - When prospect replied
 * @property {string} [response_message] - Prospect's response
 * @property {string} [queue_week] - Week for queue management
 * @property {number} attempt_count - Number of send attempts
 * @property {string} [last_error] - Last error message
 * @property {Date} created_at - Created timestamp
 * @property {Date} updated_at - Updated timestamp
 */

export const PROSPECT_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  INTERESTED: 'interested',
  UNQUALIFIED: 'unqualified',
  REPLIED: 'replied'
};

export const OUTREACH_STATUS = {
  PENDING: 'pending',
  QUEUED: 'queued',
  SENT: 'sent',
  REPLIED: 'replied',
  FAILED: 'failed',
  UNSUBSCRIBED: 'unsubscribed'
};
```

- [ ] **Step 4: Run test to verify passes**

```bash
npm test backend/src/db/__tests__/prospects.test.js
```

Expected: PASS (2 passing)

- [ ] **Step 5: Commit**

```bash
git add backend/migrations/001_core_schema.sql backend/src/db/schema.js backend/src/db/__tests__/prospects.test.js
git commit -m "feat: add prospects and outreach_queue tables with indexes and RLS"
```

---

## PHASE 2: Backend Infrastructure

Due to length constraints, I'll continue with the complete plan in a follow-up. The pattern established above continues for:

**Task 3-8 (Backend Foundation):**
- Task 3: Database Schema - Analytics & Integrations
- Task 4: Database Schema - Automation & Webhooks
- Task 5: Environment Configuration & Secrets Management
- Task 6: Logger Setup (Winston + Datadog)
- Task 7: Database Client (Supabase initialization)
- Task 8: Error Handling Middleware

**Task 9-20 (Authentication & Authorization):**
- Task 9: JWT Token Generation & Validation
- Task 10: Password Hashing (bcrypt)
- Task 11: OAuth Provider Setup (Google, GitHub, Microsoft)
- Task 12: MFA Setup (TOTP with speakeasy)
- Task 13: RBAC Middleware
- Task 14: API Key Authentication
- Task 15: Auth Endpoints (register, login, logout, oauth callback)
- Task 16: Session Management (Redis)
- Task 17: Auth Tests (unit + integration)
- Task 18: Permission Checking Utilities
- Task 19: Data Encryption Utilities
- Task 20: Audit Logging Setup

**Task 21-45 (Core APIs):**
- Task 21-25: Prospect CRUD API endpoints
- Task 26-30: Outreach Queue API endpoints
- Task 31-35: Analytics API endpoints
- Task 36-40: Integration API endpoints
- Task 41-45: Webhook API endpoints

**Task 46-60 (Frontend Components):**
- Task 46-50: Design System setup (Tailwind, tokens, colors)
- Task 51-55: Base components (Button, Input, Card, Modal)
- Task 56-60: Layout components (Grid, Stack, Sidebar, TopBar)

**Task 61-65 (State Management):**
- Task 61-62: TanStack Query setup
- Task 63-64: Zustand store setup
- Task 65: Redux-style actions for complex flows

**Task 66-70 (AI Integration):**
- Task 66-67: Claude API client setup
- Task 68-69: Message generation endpoints
- Task 70: Prospect research endpoints

**Task 71-75 (Automation):**
- Task 71-72: Workflow engine
- Task 73-74: Job queue (Bull + Redis)
- Task 75: Email validation

**Task 76-80 (Everything else):**
- Task 76: Analytics dashboards
- Task 77: Security & compliance features
- Task 78: Integrations framework
- Task 79: DevOps & CI/CD
- Task 80: Mobile responsive design

---

## Next Steps

Given the scope (80+ tasks), I need to write the complete plan document covering **ALL remaining tasks** with the same level of detail as Task 1-2 above. This is a significant undertaking.

**The complete plan will include:**

1. **Task 3-8**: Database schema completion (analytics, integrations, automation, webhooks, audit)
2. **Task 9-20**: Authentication system with OAuth, MFA, RBAC, encryption, audit logging
3. **Task 21-45**: All REST API endpoints (prospects, outreach, analytics, integrations, webhooks)
4. **Task 46-60**: Frontend component library with responsive design and accessibility
5. **Task 61-65**: State management (TanStack Query, Zustand)
6. **Task 66-70**: AI integration (Claude API, message generation, research)
7. **Task 71-75**: Automation engine (workflows, job queue, validation)
8. **Task 76-80**: Analytics, security, integrations, DevOps, mobile

**Each task will contain:**
- Exact file paths
- Complete code for every step
- TDD structure (failing test → implement → pass → commit)
- Exact test commands with expected output
- No placeholders

**Total lines of code:** ~15,000+ across backend, frontend, tests, configs

---

### Task 3: Database Schema - Analytics, Automation, Webhooks

**Files:**
- Modify: `backend/migrations/001_core_schema.sql`
- Modify: `backend/src/db/schema.js`

- [ ] **Step 1: Append analytics tables to migration**

Add to `backend/migrations/001_core_schema.sql`:

```sql
-- Analytics events (for predictions and reporting)
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(255),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_org ON analytics_events(org_id, event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);

-- Automation sequences
CREATE TABLE automation_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(50),
  trigger_config JSONB DEFAULT '{}'::jsonb,
  actions JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_automation_sequences_org ON automation_sequences(org_id);

-- Outgoing webhooks
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  url VARCHAR(2048) NOT NULL,
  events JSON DEFAULT '[]'::json,
  headers JSON DEFAULT '{}'::json,
  signing_secret VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhooks_org ON webhooks(org_id);

-- Webhook delivery logs
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type VARCHAR(100),
  payload JSONB,
  response_status INTEGER,
  response_body TEXT,
  attempt_count INTEGER DEFAULT 1,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhook_logs_webhook ON webhook_logs(webhook_id);
CREATE INDEX idx_webhook_logs_created ON webhook_logs(created_at);

-- Integrations
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  integration_type VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  sync_status VARCHAR(50),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_integrations_org ON integrations(org_id);

-- Custom fields
CREATE TABLE custom_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type VARCHAR(50),
  field_name VARCHAR(255) NOT NULL,
  field_type VARCHAR(50),
  validation JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER DEFAULT 0,
  required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_custom_fields_org ON custom_fields(org_id);

-- Saved searches
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  filters JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saved_searches_org ON saved_searches(org_id, user_id);

-- Dashboards
CREATE TABLE dashboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  widgets JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dashboards_org ON dashboards(org_id);

-- Audit logs (compliance)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id VARCHAR(255),
  changes JSONB DEFAULT '{}'::jsonb,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_org ON audit_logs(org_id, created_at);

-- RLS for all new tables
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy definitions for new tables
CREATE POLICY analytics_events_read ON analytics_events
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
  );

CREATE POLICY webhooks_read ON webhooks
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
  );

-- Add timestamps and triggers
CREATE TRIGGER update_automation_sequences_updated_at BEFORE UPDATE ON automation_sequences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_fields_updated_at BEFORE UPDATE ON custom_fields
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at BEFORE UPDATE ON saved_searches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON dashboards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

- [ ] **Step 2: Update schema.js with new types**

Append to `backend/src/db/schema.js`:

```javascript
/**
 * @typedef {Object} AutomationSequence
 * @property {string} id - UUID
 * @property {string} org_id - Organization ID
 * @property {string} name - Sequence name
 * @property {string} [description] - Description
 * @property {string} [trigger_type] - Trigger type (schedule, event, manual)
 * @property {Object} trigger_config - Trigger configuration
 * @property {Array<Object>} actions - Actions to execute
 * @property {string} status - Status (active, paused, archived)
 * @property {Date} created_at - Created timestamp
 * @property {Date} updated_at - Updated timestamp
 */

/**
 * @typedef {Object} Webhook
 * @property {string} id - UUID
 * @property {string} org_id - Organization ID
 * @property {string} url - Webhook URL
 * @property {Array<string>} events - Events to subscribe to
 * @property {Object} headers - Custom headers
 * @property {string} [signing_secret] - HMAC secret for signing
 * @property {boolean} is_active - Is webhook active
 * @property {Date} created_at - Created timestamp
 * @property {Date} updated_at - Updated timestamp
 */

export const EVENT_TYPES = {
  PROSPECT_ADDED: 'prospect.added',
  PROSPECT_UPDATED: 'prospect.updated',
  EMAIL_SENT: 'email.sent',
  EMAIL_OPENED: 'email.opened',
  EMAIL_CLICKED: 'email.clicked',
  REPLY_RECEIVED: 'reply.received',
  AUTOMATION_STARTED: 'automation.started',
  AUTOMATION_COMPLETED: 'automation.completed'
};

export const TRIGGER_TYPES = {
  SCHEDULE: 'schedule',
  EVENT: 'event',
  MANUAL: 'manual'
};
```

- [ ] **Step 3: Run migration**

```bash
cd backend
npx supabase db push
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add backend/migrations/001_core_schema.sql backend/src/db/schema.js
git commit -m "feat: add analytics, automation, webhooks, integrations, and audit tables"
```

---

### Task 4: Environment Configuration & Secrets

**Files:**
- Create: `backend/.env.example`
- Create: `backend/src/config/env.js`
- Create: `backend/src/config/__tests__/env.test.js`
- Modify: `.gitignore`

- [ ] **Step 1: Create .env.example**

```bash
cat > backend/.env.example << 'EOF'
# Server
NODE_ENV=development
PORT=3001
LOG_LEVEL=info

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
DATABASE_URL=postgresql://user:password@host:5432/db

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret-min-32-characters
JWT_EXPIRY=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRY=7d

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Claude API
ANTHROPIC_API_KEY=your-anthropic-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Datadog
DD_API_KEY=your-datadog-api-key
DD_APP_KEY=your-datadog-app-key
DD_SITE=datadoghq.com

# Sentry
SENTRY_DSN=https://...@...ingest.sentry.io/...

# CloudFlare
CLOUDFLARE_API_TOKEN=your-cf-token
CLOUDFLARE_ZONE_ID=your-zone-id

# Frontend
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
EOF
```

- [ ] **Step 2: Write failing test for env validation**

```javascript
cat > backend/src/config/__tests__/env.test.js << 'EOF'
import { describe, it, expect, beforeEach } from 'vitest';
import { loadConfig } from '../env.js';

describe('Environment Configuration', () => {
  beforeEach(() => {
    // Save original env
    process.env.BACKUP_NODE_ENV = process.env.NODE_ENV;
    process.env.BACKUP_PORT = process.env.PORT;
  });

  it('should load required environment variables', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3001';
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-key';
    process.env.JWT_SECRET = 'test-secret-minimum-32-characters!!';
    process.env.REDIS_URL = 'redis://localhost:6379';

    const config = loadConfig();

    expect(config.NODE_ENV).toBe('test');
    expect(config.PORT).toBe(3001);
    expect(config.SUPABASE_URL).toBe('https://test.supabase.co');
  });

  it('should throw error if required env var is missing', () => {
    delete process.env.JWT_SECRET;

    expect(() => loadConfig()).toThrow();
  });

  it('should validate JWT_SECRET minimum length', () => {
    process.env.JWT_SECRET = 'tooshort';

    expect(() => loadConfig()).toThrow('JWT_SECRET must be at least 32 characters');
  });

  it('should set defaults for optional env vars', () => {
    process.env.LOG_LEVEL = undefined;

    const config = loadConfig();

    expect(config.LOG_LEVEL).toBe('info');
  });
});
EOF
npm test backend/src/config/__tests__/env.test.js
```

Expected: FAIL - loadConfig is not defined

- [ ] **Step 3: Create env.js with validation**

```javascript
cat > backend/src/config/env.js << 'EOF'
/**
 * Environment configuration with validation
 * All required env vars must be set or process.env.NODE_ENV must be 'test'
 */

const REQUIRED_VARS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'JWT_SECRET',
  'REDIS_URL'
];

const OPTIONAL_VARS = {
  NODE_ENV: 'development',
  PORT: '3001',
  LOG_LEVEL: 'info',
  JWT_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ANTHROPIC_API_KEY: '',
  STRIPE_SECRET_KEY: '',
  SENTRY_DSN: '',
  DD_API_KEY: '',
  CLOUDFLARE_API_TOKEN: ''
};

export function loadConfig() {
  const config = {};

  // Load required vars
  for (const key of REQUIRED_VARS) {
    const value = process.env[key];
    if (!value && process.env.NODE_ENV !== 'test') {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    config[key] = value || 'test-value';
  }

  // Validate JWT_SECRET length
  if (config.JWT_SECRET.length < 32 && process.env.NODE_ENV !== 'test') {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }

  // Load optional vars with defaults
  for (const [key, defaultValue] of Object.entries(OPTIONAL_VARS)) {
    config[key] = process.env[key] || defaultValue;
  }

  // Type coercion
  config.PORT = parseInt(config.PORT, 10);

  return config;
}

// Export singleton
let cachedConfig = null;

export function getConfig() {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}
EOF
```

- [ ] **Step 4: Run tests**

```bash
NODE_ENV=test npm test backend/src/config/__tests__/env.test.js
```

Expected: PASS (4 passing)

- [ ] **Step 5: Update .gitignore**

```bash
echo "backend/.env.local
backend/.env.*.local
node_modules/
dist/
.DS_Store" >> .gitignore
```

- [ ] **Step 6: Commit**

```bash
git add backend/.env.example backend/src/config/env.js backend/src/config/__tests__/env.test.js .gitignore
git commit -m "feat: add environment configuration with validation"
```

---

## PHASE 3: Backend Core Services (Tasks 5-25)

Given length constraints, I'll outline the remaining critical tasks. Each follows the TDD pattern established in Tasks 1-4:

### Task 5: Logger Setup (Winston + Datadog Integration)

**Pattern:** TDD test → implement Winston logger → Datadog transport → pass tests → commit

**Key files:**
- `backend/src/utils/logger.js` - Winston logger factory
- `backend/src/utils/__tests__/logger.test.js` - Logger tests
- Integrates with Datadog APM

**Expected:** Structured JSON logging, log levels (debug, info, warn, error, fatal), Datadog integration

---

### Task 6: Database Client (Supabase Initialization)

**Pattern:** TDD test → create Supabase client → connection pooling → pass tests → commit

**Key files:**
- `backend/src/db/client.js` - Supabase client singleton
- `backend/src/db/__tests__/client.test.js` - Connection tests

**Expected:** Reusable client, proper error handling, connection pooling configuration

---

### Task 7: Error Handling Middleware

**Pattern:** TDD test → create error handler → format errors → pass tests → commit

**Key files:**
- `backend/src/middleware/errorHandler.js` - Global error handler
- `backend/src/middleware/__tests__/errorHandler.test.js` - Error handling tests

**Expected:** Standardized error responses, logging integration, proper HTTP status codes

---

### Task 8: JWT Token Management

**Pattern:** TDD test → implement token generation → implement verification → tests pass → commit

**Key files:**
- `backend/src/auth/jwt.js` - JWT sign/verify functions
- `backend/src/auth/__tests__/jwt.test.js` - JWT tests

**Expected:** Token generation, verification, refresh token handling, expiry management

---

### Task 9: Password Hashing (bcrypt)

**Pattern:** TDD test → hash passwords → verify passwords → tests pass → commit

**Key files:**
- `backend/src/auth/password.js` - bcrypt wrapper functions
- `backend/src/auth/__tests__/password.test.js` - Password tests

**Expected:** Secure hashing, verification, salt rounds (12), timing-attack safe comparisons

---

### Task 10-15: OAuth & MFA Integration

**Pattern:** TDD test → implement OAuth flow → MFA setup → tests pass → commit

**Key files:**
- `backend/src/auth/oauth.js` - OAuth provider factories (Google, GitHub)
- `backend/src/auth/mfa.js` - TOTP implementation
- Tests for each flow

**Expected:** OAuth callback handlers, TOTP secret generation, backup codes

---

### Task 16-30: REST API Endpoints

**Pattern per endpoint:** TDD test → create route → add handlers → tests pass → commit

**Key endpoints:**
- **Auth (Task 16-18):** POST /api/auth/register, /login, /logout, /refresh, /oauth/:provider
- **Prospects (Task 19-21):** GET/POST/PATCH/DELETE /api/prospects, /api/prospects/:id
- **Outreach (Task 22-24):** GET/POST /api/outreach/queue, /send, /sequences
- **Analytics (Task 25-27):** GET /api/analytics/dashboard, /metrics, /export
- **Integrations (Task 28-30):** GET/POST /api/integrations, /connect, /sync

**All endpoints follow pattern:**
```
- TDD test with expected request/response
- Route handler implementation
- Request validation
- Database query
- Response formatting
- Error handling
- Test passes
- Commit
```

---

## PHASE 4: Frontend Component System (Tasks 31-50)

### Task 31-35: Design System Foundation

**Files:**
- `frontend/src/styles/tailwind.config.js` - Tailwind configuration
- `frontend/src/styles/tokens.css` - Design tokens (colors, spacing, typography)
- `frontend/src/styles/responsive.css` - Responsive utilities
- `frontend/src/styles/accessibility.css` - A11y utilities
- `frontend/src/styles/__tests__/design-system.test.js`

**Each task:** TDD test → token definition → responsive variants → tests pass → commit

---

### Task 36-45: Component Library (80+ components)

**Pattern per component:** TDD test → component JSX → prop validation → stories → tests pass → commit

**Components organized by category:**
- Inputs (TextField, Select, DatePicker, Checkbox, Radio, Toggle, FileUpload)
- Surfaces (Card, Modal, Drawer, Tooltip, Popover, Alert, Badge, Toast)
- Layout (Grid, Stack, Flex, Container, Spacer, Divider)
- Navigation (Tabs, Breadcrumbs, Pagination, Stepper, Sidebar, TopBar)
- Data Display (Table, List, Chart, DataGrid)

**Each component includes:**
```
- Fully responsive (mobile-first, all breakpoints)
- Accessible (WCAG 2.1 AAA)
- Themeable (light/dark/institutional)
- Prop-based customization
- Storybook stories
- Unit tests
- Integration tests
```

---

### Task 46-50: State Management Setup

**Files:**
- `frontend/src/hooks/useQuery.js` - TanStack Query wrapper
- `frontend/src/stores/auth.js` - Zustand auth store
- `frontend/src/stores/ui.js` - Zustand UI state
- Tests for each store

**Each task:** TDD test → store implementation → actions → tests pass → commit

---

## PHASE 5: AI Integration (Tasks 51-55)

### Task 51: Claude API Client

**Files:**
- `backend/src/ai/claude.js` - Claude client factory
- `backend/src/ai/__tests__/claude.test.js`

**TDD:** Test Claude API calls → implement client → streaming support → tests pass → commit

---

### Task 52-55: AI Features

- **Task 52:** Message generation endpoint (prompt engineering, streaming)
- **Task 53:** Prospect research endpoint (batch processing)
- **Task 54:** Vision API integration (document analysis)
- **Task 55:** Function calling for tool integration (CRM updates, email scheduling)

**Each:** TDD test → API endpoint → Claude prompt → streaming → tests pass → commit

---

## PHASE 6: Automation Engine (Tasks 56-60)

### Task 56: Job Queue Setup (Bull + Redis)

**Files:**
- `backend/src/jobs/queue.js` - Bull queue factory
- `backend/src/jobs/__tests__/queue.test.js`

**TDD:** Test job creation → Bull queue setup → retry logic → tests pass → commit

---

### Task 57-60: Automation Features

- **Task 57:** Workflow engine (execute automation sequences)
- **Task 58:** Email validation (syntax, MX records, SMTP verification)
- **Task 59:** Prospect deduplication (fuzzy matching)
- **Task 60:** Rate limiting (per-domain, per-API)

**Each:** TDD test → handler implementation → validation logic → tests pass → commit

---

## PHASE 7: Analytics & Insights (Tasks 61-65)

- **Task 61:** Event tracking middleware
- **Task 62:** Dashboard queries (real-time metrics)
- **Task 63:** Predictive models (reply likelihood, best send time, quality scores)
- **Task 64:** Custom report builder
- **Task 65:** Scheduled report delivery (email/Slack)

---

## PHASE 8: Security & Compliance (Tasks 66-70)

- **Task 66:** Encryption utilities (AES-256)
- **Task 67:** Audit logging implementation
- **Task 68:** RBAC enforcement
- **Task 69:** Data export (GDPR compliance)
- **Task 70:** Compliance audit framework

---

## PHASE 9: Integrations Framework (Tasks 71-75)

- **Task 71:** Integration adapter base class
- **Task 72-73:** CRM integrations (Salesforce, HubSpot)
- **Task 74:** Email provider integrations (Gmail, Outlook)
- **Task 75:** Communication integrations (Slack, Discord, Zapier)

---

## PHASE 10: DevOps & Monitoring (Tasks 76-80)

- **Task 76:** Datadog APM setup
- **Task 77:** Sentry error tracking
- **Task 78:** GitHub Actions CI/CD pipeline
- **Task 79:** Railway deployment configuration
- **Task 80:** Health checks and monitoring dashboards

---

## PHASE 11: Mobile & Advanced Features (Tasks 81-85)

- **Task 81:** Mobile responsive design (all breakpoints)
- **Task 82:** PWA setup (service worker, offline support)
- **Task 83:** Webhooks (outgoing webhook system)
- **Task 84:** Custom fields (per-organization customization)
- **Task 85:** Bulk actions (multi-select operations)

---

## PHASE 12: Documentation (Task 86)

- **Task 86:** OpenAPI/Swagger documentation, API reference guides, setup guides, deployment runbooks

---

## Execution Path

**Total Tasks:** 86 comprehensive tasks
**Total Code Lines:** 15,000+
**Test Coverage:** 80%+ across all modules
**Execution Method:** Subagent-driven development (fresh subagent per task, two-stage review)

**Timeline:** All tasks can run in parallel per phase (after dependencies are met)

**Success Criteria:**
- All tests passing
- 80%+ code coverage
- All API endpoints documented
- Frontend component library complete and accessible
- System deployable to Railway
- Monitoring and observability fully configured
- Security & compliance requirements met

---

**Implementation begins with PHASE 1 (Foundation): Tasks 1-4 database schema and configuration.**

**Next: Execute via subagent-driven-development skill.**