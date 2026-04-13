import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function exportData() {
  try {
    console.log('\n========== USERS TABLE ==========');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(100);
    
    if (usersError) {
      console.log('❌ Error:', usersError.message);
    } else {
      console.log(`✅ Found ${users.length} rows`);
      if (users.length > 0) {
        console.log(JSON.stringify(users, null, 2));
      } else {
        console.log('(table is empty)');
      }
    }

    console.log('\n========== AGENTS TABLE ==========');
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .limit(100);
    
    if (agentsError) {
      console.log('❌ Error:', agentsError.message);
    } else {
      console.log(`✅ Found ${agents.length} rows`);
      if (agents.length > 0) {
        console.log(JSON.stringify(agents, null, 2));
      } else {
        console.log('(table is empty)');
      }
    }

    console.log('\n========== API_LOGS TABLE ==========');
    const { data: logs, error: logsError } = await supabase
      .from('api_logs')
      .select('*')
      .limit(100);
    
    if (logsError) {
      console.log('❌ Error:', logsError.message);
    } else {
      console.log(`✅ Found ${logs.length} rows`);
      if (logs.length > 0) {
        console.log(JSON.stringify(logs, null, 2));
      } else {
        console.log('(table is empty)');
      }
    }

    console.log('\n========== DATA EXPORT COMPLETE ==========\n');
    process.exit(0);

  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

exportData();
