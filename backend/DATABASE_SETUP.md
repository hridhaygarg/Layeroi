# Database Migration Setup - Layeroi

## Overview

The Layeroi outreach automation system requires a PostgreSQL table `outreach_queue` to store prospect data, generated messages, and engagement metrics.

**Status:** Migration SQL ready ✅ | Infrastructure in place ✅ | Execution required ⏳

---

## What Gets Created

### Table: `outreach_queue` (20 columns)
- **Prospect Info**: name, title, email, company, industry, website
- **Research Data**: JSONB research data, ICP score (0-1.0), fit reason
- **Message Generation**: personalized_message, generated_at, version
- **Status**: pending/queued/sent/replied/unsubscribed/failed
- **Email Metrics**: sent_at, opened_at, clicked_at
- **Follow-ups**: queued_at, sent_at, message
- **Engagement**: response_at, notes
- **Metadata**: source, queue_week, attempt_count, last_error
- **Audit**: created_at, updated_at (auto)

### Indexes (5)
- `idx_outreach_status` - Filter by status
- `idx_outreach_queue_week` - Weekly queue management
- `idx_outreach_email` - Email uniqueness/lookups
- `idx_outreach_created` - Timeline queries
- `idx_outreach_sent` - Email tracking

### Trigger
- Auto-update `updated_at` timestamp on every row change

### View: `outreach_stats`
- Weekly campaign analytics (prospects, sent, opened, replied, rates)

---

## Execution Methods

### Method 1: Automatic on Railway (RECOMMENDED)
**Status:** ✅ Ready to deploy

When deployed to Railway with proper environment variables:
```
SUPABASE_URL=https://oryionopjhbxjmrucxby.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://user:password@host:5432/db  (injected by Railway)
```

The server automatically executes the migration on startup via `src/db/initDb.js`.

**Deployment Steps:**
1. Push to GitHub - Railway auto-deploys
2. Server starts → calls `initializeDatabase()`
3. Detects `DATABASE_URL` → executes migration
4. Outreach automation ready ✅

### Method 2: Local Execution (Manual)
**Status:** ✅ Script ready - Requires password

For local development or manual execution:

```bash
# Step 1: Get your Supabase database password
# Go to: https://app.supabase.com/project/oryionopjhbxjmrucxby/settings/database
# Copy the password field

# Step 2: Set environment variable
export PGPASSWORD="your_password_here"

# Step 3: Run migration
cd backend
node src/db/migrate.js

# Expected output:
# 🚀 Layeroi Database Migration Runner
# ✅ Connected
# ✅ Migration executed successfully
# ✅ outreach_queue table verified
# ✅ MIGRATION COMPLETE - DATABASE READY
```

### Method 3: Supabase Dashboard (Manual SQL)
**Status:** ✅ SQL ready - Copy/paste in dashboard

For direct execution in Supabase UI:

1. **Open Editor:**
   ```
   https://app.supabase.com/project/oryionopjhbxjmrucxby/sql/new
   ```

2. **Copy SQL:**
   From `backend/migrations/001_create_outreach_queue.sql`

3. **Paste & Execute:**
   - Paste entire SQL into editor
   - Click "Run" button
   - Wait for success message

4. **Verify:**
   Go to Database → Tables → confirm `outreach_queue` appears

### Method 4: Supabase CLI
**Status:** ✅ CLI installed

```bash
# Using Supabase CLI with connection string
npx supabase db query -f backend/migrations/001_create_outreach_queue.sql \
  --db-url "postgresql://postgres:password@oryionopjhbxjmrucxby.supabase.co:5432/postgres"
```

---

## Getting Your Supabase Password

1. **Go to Dashboard:**
   ```
   https://app.supabase.com/project/oryionopjhbxjmrucxby/settings/database
   ```

2. **Find Database Password:**
   Under "Database" section → "Password" field
   (May need to reset if you don't have it)

3. **Reset if Needed:**
   Click "Reset database password" button
   (You'll receive the new password)

---

## Verification

After running the migration, verify table creation:

```bash
# Using Supabase dashboard:
# 1. Go to Database → Tables
# 2. Should see: outreach_queue
# 3. Click to view columns (20 total)

# Using CLI:
node backend/src/db/migrate.js --verify
```

---

## Environment Variables Reference

| Variable | Purpose | Source | When Used |
|----------|---------|--------|-----------|
| `SUPABASE_URL` | API endpoint | Your Supabase project | Always |
| `SUPABASE_KEY` | API authentication | Your Supabase project | Always |
| `DATABASE_URL` | Direct DB connection | Railway (auto-injected) | On Railway only |
| `PGPASSWORD` | PostgreSQL password | Supabase dashboard | Local execution |
| `NODE_ENV` | Environment mode | Set to "production" | Production |

---

## Troubleshooting

### "Could not find the function public.exec_sql"
**Cause:** Tried using non-existent Supabase API function
**Solution:** Use Method 2 (migrate.js) or Method 3 (Dashboard)

### "dial tcp: i/o timeout"
**Cause:** Network cannot reach Supabase PostgreSQL server
**Solution:**
- Ensure you're not behind restrictive firewall
- Use Railway deployment (has full network access)
- Try Supabase dashboard (web-based, no direct connection needed)

### "failed to connect: password authentication failed"
**Cause:** Wrong or missing PostgreSQL password
**Solution:**
- Copy password from Supabase dashboard again
- Reset password if unsure
- Set `export PGPASSWORD="new_password"`

### "outreach_queue table not found"
**Cause:** Migration didn't execute
**Solution:**
- Try different execution method
- Check Supabase dashboard to verify table exists
- Review migration file for SQL errors

---

## Quick Status Check

```bash
# Server startup - should see:
# 🔄 Initializing database schema...
# ✅ Database ready

# If schema missing:
# ⚠️  Schema missing - execute: node src/db/migrate.js

# To manually verify table exists:
curl -H "Authorization: Bearer $SUPABASE_KEY" \
  "$SUPABASE_URL/rest/v1/outreach_queue?limit=1"
```

---

## Timeline to Production

1. **Development:** Use Method 3 (Dashboard) for one-time setup
2. **Staging:** Use Method 2 (migrate.js) with test database
3. **Production:** Automatic via Method 1 on Railway deployment

---

## Files Involved

- `backend/migrations/001_create_outreach_queue.sql` - Migration SQL (91 lines)
- `backend/src/db/initDb.js` - Automatic initialization on server startup
- `backend/src/db/migrate.js` - Standalone migration runner script
- `backend/src/server.js` - Calls `initializeDatabase()` on startup
- `package.json` - includes `supabase` CLI dependency

---

## Support

For issues:
1. Check Supabase dashboard: https://app.supabase.com/project/oryionopjhbxjmrucxby/
2. Review migration SQL: `backend/migrations/001_create_outreach_queue.sql`
3. Run with debug: `node src/db/migrate.js --debug`
4. Check server logs on Railway dashboard

---

**Status:** Database infrastructure complete. Awaiting migration execution.
