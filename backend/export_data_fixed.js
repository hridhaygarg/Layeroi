import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oryionopjhbxjmrucxby.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeWlvbm9wamhieGptcnVjeGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgxOTUyMCwiZXhwIjoyMDkxMzk1NTIwfQ.aSQMoXBc0hR81oRtXczJZSRq8A199OLFgvLSIgjGyTs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function exportTableData() {
  console.log('=== EXPORTING EXISTING DATA ===\n');

  const tables = ['users', 'agents', 'api_logs'];

  for (const table of tables) {
    console.log(`--- Table: ${table} ---`);
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*');

      if (error) {
        console.log(`Error: ${error.message}`);
        continue;
      }

      console.log(`Row count: ${data.length}`);
      if (data.length > 0) {
        console.log('\nFirst row schema:');
        const firstRow = data[0];
        Object.keys(firstRow).forEach(key => {
          const value = firstRow[key];
          const type = Array.isArray(value) ? 'array' : typeof value;
          console.log(`  ${key}: ${type}`);
        });

        console.log(`\nFull data (${data.length} rows):`);
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log('(empty table)');
      }
    } catch (err) {
      console.log(`Exception: ${err.message}`);
    }

    console.log('\n');
  }

  console.log('=== EXPORT COMPLETE ===');
}

exportTableData();
