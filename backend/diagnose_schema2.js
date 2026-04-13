import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oryionopjhbxjmrucxby.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeWlvbm9wamhieGptcnVjeGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgxOTUyMCwiZXhwIjoyMDkxMzk1NTIwfQ.aSQMoXBc0hR81oRtXczJZSRq8A199OLFgvLSIgjGyTs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testTable(tableName) {
  try {
    const { data, error, status } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      if (error.code === 'PGRST205') {
        return null; // Table doesn't exist
      }
      return { exists: false, error: error.message };
    }

    return { exists: true, status };
  } catch (err) {
    return { exists: false, error: err.message };
  }
}

async function diagnoseSchema() {
  const tableCandidates = [
    'users',
    'agents',
    'api_logs',
    'api_calls',
    'organisations',
    'organization',
    'customers',
    'accounts',
    'webhooks',
    'logs',
    'requests',
    'calls',
    'insights',
    'forecasts'
  ];

  console.log('Testing table candidates...\n');

  const results = [];
  for (const table of tableCandidates) {
    const result = await testTable(table);
    if (result?.exists) {
      results.push({ table, status: 'EXISTS' });
      console.log(`✓ ${table} - EXISTS`);
    }
  }

  if (results.length === 0) {
    console.log('No tables found. Database may be empty.');
    return;
  }

  console.log(`\n--- Found ${results.length} table(s) ---`);
  for (const { table } of results) {
    // Get schema info for existing table
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (!error) {
      console.log(`\nTable: ${table}`);
      console.log(`  Row count: checking...`);

      // Get count
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      console.log(`  Row count: ${count}`);
    }
  }
}

diagnoseSchema();
