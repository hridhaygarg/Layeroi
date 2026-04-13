import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oryionopjhbxjmrucxby.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeWlvbm9wamhieGptcnVjeGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgxOTUyMCwiZXhwIjoyMDkxMzk1NTIwfQ.aSQMoXBc0hR81oRtXczJZSRq8A199OLFgvLSIgjGyTs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function queryTable(tableName) {
  console.log(`\n--- Table: ${tableName} ---`);
  try {
    // Try with limit
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1000);

    if (error) {
      console.log(`Error with select: ${error.message}`);

      // Try count only
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(0);

      if (!countError) {
        console.log(`Row count: ${count}`);
      } else {
        console.log(`Error with count: ${countError.message}`);
      }
      return;
    }

    console.log(`Row count: ${data.length}`);
    if (data.length > 0) {
      console.log('Columns found:', Object.keys(data[0]).sort());
      console.log('\nSample data (first row):');
      console.log(JSON.stringify(data[0], null, 2));

      if (data.length > 1) {
        console.log(`\n(${data.length - 1} more rows...)`);
      }
    } else {
      console.log('(empty table)');
    }
  } catch (err) {
    console.log(`Exception: ${err.message}`);
  }
}

async function main() {
  console.log('=== ATTEMPTING DATA EXPORT ===');
  console.log(`Supabase URL: ${SUPABASE_URL}`);

  // Test tables that appeared to exist
  const tables = ['api_calls', 'users', 'agents', 'api_logs'];

  for (const table of tables) {
    await queryTable(table);
  }

  console.log('\n=== EXPORT COMPLETE ===');
}

main();
