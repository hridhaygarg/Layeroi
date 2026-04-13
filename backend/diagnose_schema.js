import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oryionopjhbxjmrucxby.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeWlvbm9wamhieGptcnVjeGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgxOTUyMCwiZXhwIjoyMDkxMzk1NTIwfQ.aSQMoXBc0hR81oRtXczJZSRq8A199OLFgvLSIgjGyTs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function diagnoseSchema() {
  console.log('Querying information_schema for all tables...\n');

  try {
    // Query information_schema to list all tables
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_schema, table_name, table_type')
      .eq('table_schema', 'public')
      .order('table_name');

    if (error) {
      console.log('Error querying information_schema.tables:', error);
      console.log('\nAttempting alternative diagnostic...\n');

      // Try querying pg_tables directly
      const { data: pgData, error: pgError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');

      if (pgError) {
        console.log('Error querying pg_tables:', pgError);
        return;
      }

      console.log('Tables found via pg_tables:');
      pgData.forEach(row => console.log(`  - ${row.tablename}`));
      return;
    }

    if (!data || data.length === 0) {
      console.log('No public tables found in schema.\n');
      return;
    }

    console.log('Tables found in public schema:');
    data.forEach(row => {
      console.log(`  - ${row.table_name} (${row.table_type})`);
    });

    console.log('\n--- Full Results ---');
    console.log(JSON.stringify(data, null, 2));

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

diagnoseSchema();
