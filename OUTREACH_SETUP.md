# Outreach Engine Setup Guide

## Overview
This document explains how to set up and test the automated prospect outreach system for Layer ROI.

## Phase 3: Automated Outreach Engine ✅ Complete

### What's Included

#### Backend Components
1. **Outreach Engine** (`src/automations/outreachEngine.js`)
   - Apollo API prospect research integration
   - Claude AI personalized message generation
   - Resend email delivery
   - ICP scoring and prospect matching
   - Follow-up reminder automation
   - Email open/click tracking preparation

2. **API Routes** (`src/api/routes/outreach.js`)
   - `GET /api/outreach` - List prospects with filtering
   - `GET /api/outreach/stats` - Campaign analytics
   - `PATCH /api/outreach/:id` - Update prospect status
   - `POST /api/outreach/run` - Manual workflow trigger
   - `POST /api/outreach/follow-ups` - Queue follow-up reminders

3. **Cron Automation** (`src/automations/cron.js`)
   - **Monday 12:30am UTC (6:00 AM IST)**: Build outreach queue
   - **Monday 1:00am UTC (6:30 AM IST)**: Generate personalized messages
   - **Monday 2:00am UTC (7:30 AM IST)**: Send outreach emails
   - **Thursday 12:30am UTC (6:00 AM IST)**: Queue follow-up reminders

#### Frontend Components
1. **Outreach Dashboard** (`src/screens/Outreach.jsx`)
   - Campaign statistics (prospects, emails sent, replies, open rate)
   - Filter tabs by status (All, Pending, Queued, Sent, Replied)
   - Prospect table with inline status management
   - Manual trigger buttons for workflow and follow-ups
   - Sample message preview

2. **Navigation Integration**
   - Added to App.jsx dashboard screens
   - Added to Sidebar with Target icon
   - Mobile bottom navigation with 🎯 emoji

### Setup Instructions

#### Step 1: Create Supabase Table

Run this SQL in your **Supabase Dashboard** → **SQL Editor**:

```sql
-- Create outreach_queue table for prospect research and message generation automation
CREATE TABLE IF NOT EXISTS outreach_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Prospect Information
  prospect_name TEXT NOT NULL,
  prospect_title TEXT,
  prospect_email TEXT NOT NULL UNIQUE,
  company_name TEXT,
  company_size TEXT,
  company_industry TEXT,
  company_website TEXT,

  -- Research Data
  research_data JSONB, -- Stores company info, tech stack, recent news, etc.
  icp_score DECIMAL(3,2), -- 0-1.0 score for Ideal Customer Profile match
  fit_reason TEXT, -- Why this prospect matches our ICP

  -- Message Generation
  personalized_message TEXT,
  message_generated_at TIMESTAMP WITH TIME ZONE,
  message_version INTEGER DEFAULT 1,

  -- Status Tracking
  status TEXT DEFAULT 'pending', -- pending, queued, sent, replied, unsubscribed, failed
  status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Email Tracking
  email_sent_at TIMESTAMP WITH TIME ZONE,
  email_opened_at TIMESTAMP WITH TIME ZONE,
  email_clicked_at TIMESTAMP WITH TIME ZONE,

  -- Follow-up Tracking
  follow_up_queued_at TIMESTAMP WITH TIME ZONE,
  follow_up_sent_at TIMESTAMP WITH TIME ZONE,
  follow_up_message TEXT,

  -- Engagement Metrics
  response_received_at TIMESTAMP WITH TIME ZONE,
  engagement_notes TEXT,

  -- Metadata
  source TEXT DEFAULT 'apollo', -- apollo, manual, import, etc.
  queue_week TEXT NOT NULL, -- Format: YYYY-WXX (e.g., 2024-W16)
  attempt_count INTEGER DEFAULT 0,
  last_error TEXT,

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_outreach_status ON outreach_queue(status);
CREATE INDEX idx_outreach_queue_week ON outreach_queue(queue_week);
CREATE INDEX idx_outreach_email ON outreach_queue(prospect_email);
CREATE INDEX idx_outreach_created ON outreach_queue(created_at DESC);
CREATE INDEX idx_outreach_sent ON outreach_queue(email_sent_at DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_outreach_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_outreach_updated_at
  BEFORE UPDATE ON outreach_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_outreach_updated_at();

-- Create view for weekly stats
CREATE OR REPLACE VIEW outreach_stats AS
SELECT
  queue_week,
  COUNT(*) as total_prospects,
  COUNT(CASE WHEN status = 'queued' THEN 1 END) as queued_count,
  COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_count,
  COUNT(CASE WHEN email_opened_at IS NOT NULL THEN 1 END) as opened_count,
  COUNT(CASE WHEN response_received_at IS NOT NULL THEN 1 END) as replied_count,
  ROUND(COUNT(CASE WHEN email_opened_at IS NOT NULL THEN 1 END)::DECIMAL /
        COUNT(CASE WHEN status = 'sent' THEN 1 END) * 100, 2) as open_rate,
  ROUND(COUNT(CASE WHEN response_received_at IS NOT NULL THEN 1 END)::DECIMAL /
        COUNT(CASE WHEN status = 'sent' THEN 1 END) * 100, 2) as reply_rate
FROM outreach_queue
WHERE status IN ('sent', 'replied')
GROUP BY queue_week
ORDER BY queue_week DESC;
```

#### Step 2: Configure Environment Variables

Add to your `.env.railway` or `.env`:

```bash
# Existing variables (already configured)
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGc...

# New variables for Outreach Engine
APOLLO_API_KEY=your-apollo-io-key
RESEND_API_KEY=re_your-resend-key
COMPANY_EMAIL=hello@layeroi.com
```

**Getting API Keys:**
- **Apollo.io**: Sign up at https://www.apollo.io/ → Account → API Keys
- **Resend**: Sign up at https://resend.com/ → API Keys

#### Step 3: Verify Backend Build

```bash
cd backend
npm run build  # Should complete with zero errors
```

#### Step 4: Verify Frontend Build

```bash
cd frontend
npm run build  # Should complete with zero errors
```

### Testing the System

#### Manual Test 1: List Prospects

```bash
curl http://localhost:3000/api/outreach
```

Expected response:
```json
{
  "success": true,
  "data": [],
  "total": 0,
  "limit": 50,
  "offset": 0
}
```

#### Manual Test 2: Run Workflow

```bash
curl -X POST http://localhost:3000/api/outreach/run
```

Expected response:
```json
{
  "success": true,
  "results": {
    "queueBuilt": 2,
    "messagesGenerated": 2,
    "emailsSent": 2
  },
  "message": "Outreach workflow completed successfully"
}
```

#### Manual Test 3: Check Stats

```bash
curl http://localhost:3000/api/outreach/stats
```

#### Frontend Test: Navigate to Outreach

1. Go to http://localhost:3000/dashboard
2. Click the "🎯 Outreach" button in sidebar (or bottom nav on mobile)
3. See the dashboard with statistics and prospect table
4. Click "▶️ Run Workflow" button
5. Verify email sent to hello@layeroi.com

### Automation Schedule

The system automatically runs on:

| Day | Time | Task | IST |
|-----|------|------|-----|
| Monday | 12:30 UTC | Build queue | 6:00 AM |
| Monday | 1:00 UTC | Generate messages | 6:30 AM |
| Monday | 2:00 UTC | Send emails | 7:30 AM |
| Thursday | 12:30 UTC | Queue follow-ups | 6:00 AM |

To override the schedule, manually trigger:
- `POST /api/outreach/run` - Run full workflow
- `POST /api/outreach/follow-ups` - Queue follow-up emails

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Layer ROI Outreach Engine                 │
└─────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │ Apollo API   │ │ Claude AI    │ │ Resend Email │
            │ (Research)   │ │ (Messages)   │ │ (Delivery)   │
            └──────────────┘ └──────────────┘ └──────────────┘
                    │           │           │
                    └───────────┼───────────┘
                                ▼
                        ┌──────────────────┐
                        │ Supabase         │
                        │ outreach_queue   │
                        └──────────────────┘
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │ Web Dashboard│ │ Cron Jobs    │ │ Manual API   │
            │ (Outreach.jsx)│ │ (Scheduler)  │ │ Endpoints    │
            └──────────────┘ └──────────────┘ └──────────────┘
```

### Key Features

✅ **Prospect Research**: Apollo API searches for relevant prospects based on ICP
✅ **Smart Matching**: ICP scoring algorithm ranks prospects by fit
✅ **Message Generation**: Claude AI creates personalized, contextual messages
✅ **Email Delivery**: Resend sends professional HTML emails
✅ **Automation**: Cron-based scheduling runs on predictable schedule
✅ **Analytics**: Dashboard shows conversion metrics (open rate, reply rate)
✅ **Manual Control**: REST API allows manual triggers and status updates
✅ **Fallback System**: Hardcoded fallback prospects if API fails
✅ **Deduplication**: Prevents duplicate outreach to same prospect
✅ **Follow-ups**: Automatic follow-up reminders for unopened emails

### Troubleshooting

**Issue: "No prospects found"**
- Check Apollo API key in environment
- Verify API key has quota remaining
- Fallback prospects should be added automatically

**Issue: "Emails not sending"**
- Verify RESEND_API_KEY is set
- Check email from address is verified in Resend dashboard
- Check spam folder for test emails

**Issue: "Message generation timeout"**
- Verify ANTHROPIC_API_KEY is valid
- Check network connectivity
- Claude API rate limits (upgrade if needed)

**Issue: "Cron jobs not running"**
- Check server logs for errors
- Verify NODE_ENV is not 'production' if running locally
- Check system clock is correct

### Next Steps

1. ✅ Setup Supabase table (this guide)
2. ✅ Configure environment variables
3. ✅ Test with manual API trigger
4. ✅ Verify emails arrive at hello@layeroi.com
5. Go live: Deploy to production (Railway)
6. Monitor: Track open/click rates in Outreach dashboard
7. Optimize: Adjust ICP scores based on reply rates

### Files Modified/Created

**Backend:**
- `src/automations/outreachEngine.js` - Core engine (500+ lines)
- `src/automations/cron.js` - Cron schedules
- `src/api/routes/outreach.js` - API endpoints
- `migrations/001_create_outreach_queue.sql` - Database schema
- `src/api/routes/index.js` - Route exports
- `src/server.js` - Route registration

**Frontend:**
- `src/screens/Outreach.jsx` - Dashboard UI
- `src/App.jsx` - Navigation integration
- `src/layouts/Sidebar.jsx` - Sidebar button

**Total Lines of Code: ~1500**

---

**Status: ✅ Phase 3 Complete**
Ready for production deployment and email campaign launch.
