import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'db.oryionopjhbxjmrucxby.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '#Dl3ccx6500',
  ssl: { rejectUnauthorized: false }
});

const migrations = [
  {
    name: 'Migration 1: Create organisations table',
    sql: `CREATE TABLE IF NOT EXISTS organisations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_by UUID NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  },
  {
    name: 'Migration 2: Create organisation_members table',
    sql: `CREATE TABLE IF NOT EXISTS organisation_members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
      user_id UUID NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(organisation_id, user_id)
    );`
  },
  {
    name: 'Migration 3: Create organisation_invitations table',
    sql: `CREATE TABLE IF NOT EXISTS organisation_invitations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  },
  {
    name: 'Migration 4: Add columns to agents table',
    sql: `ALTER TABLE agents
      ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'openai';`
  },
  {
    name: 'Migration 5: Add columns to api_logs table',
    sql: `ALTER TABLE api_logs
      ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'openai';`
  },
  {
    name: 'Migration 6: Create audit_logs table',
    sql: `CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
      user_id UUID NOT NULL,
      action TEXT NOT NULL,
      resource_type TEXT NOT NULL,
      resource_id TEXT NOT NULL,
      changes JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS audit_logs_org_idx ON audit_logs(organisation_id);
    CREATE INDEX IF NOT EXISTS audit_logs_user_idx ON audit_logs(user_id);`
  },
  {
    name: 'Migration 7: Create ai_insights table',
    sql: `CREATE TABLE IF NOT EXISTS ai_insights (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
      insight_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      metric_name TEXT,
      current_value FLOAT,
      previous_value FLOAT,
      change_percent FLOAT,
      severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
      recommendation TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS ai_insights_org_idx ON ai_insights(organisation_id);`
  },
  {
    name: 'Migration 8: Create roi_benchmarks table',
    sql: `CREATE TABLE IF NOT EXISTS roi_benchmarks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
      month DATE NOT NULL,
      model_name TEXT NOT NULL,
      input_tokens BIGINT DEFAULT 0,
      output_tokens BIGINT DEFAULT 0,
      total_cost FLOAT DEFAULT 0,
      roi_score FLOAT,
      efficiency_rating TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(organisation_id, month, model_name)
    );
    CREATE INDEX IF NOT EXISTS roi_benchmarks_org_idx ON roi_benchmarks(organisation_id);`
  },
  {
    name: 'Migration 9: Create webhooks table',
    sql: `CREATE TABLE IF NOT EXISTS webhooks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      url TEXT NOT NULL,
      active BOOLEAN DEFAULT true,
      secret TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS webhooks_org_idx ON webhooks(organisation_id);`
  },
  {
    name: 'Migration 10: Create spend_forecasts table',
    sql: `CREATE TABLE IF NOT EXISTS spend_forecasts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
      forecast_month DATE NOT NULL,
      predicted_cost FLOAT NOT NULL,
      confidence_level FLOAT,
      based_on_days INT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(organisation_id, forecast_month)
    );
    CREATE INDEX IF NOT EXISTS spend_forecasts_org_idx ON spend_forecasts(organisation_id);`
  }
];

async function runMigrations() {
  try {
    await client.connect();
    console.log('✓ Connected to PostgreSQL\n');

    for (const migration of migrations) {
      console.log(`Running: ${migration.name}`);
      try {
        await client.query(migration.sql);
        console.log(`✓ Success\n`);
      } catch (err) {
        console.log(`✗ Error: ${err.message}\n`);
      }
    }

    console.log('=== VERIFYING TABLES ===\n');
    const tables = ['organisations', 'organisation_members', 'organisation_invitations', 'audit_logs', 'ai_insights', 'roi_benchmarks', 'webhooks', 'spend_forecasts'];

    for (const table of tables) {
      const result = await client.query(`
        SELECT column_name, data_type FROM information_schema.columns
        WHERE table_name = '${table}' AND table_schema = 'public'
        ORDER BY ordinal_position
      `);
      console.log(`Table: ${table}`);
      console.log(`  Columns: ${result.rows.map(r => `${r.column_name} (${r.data_type})`).join(', ')}`);
      console.log();
    }

  } catch (err) {
    console.error('Fatal error:', err.message);
  } finally {
    await client.end();
    console.log('✓ Connection closed');
  }
}

runMigrations();
