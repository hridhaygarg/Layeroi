import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  'https://oryionopjhbxjmrucxby.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeWlvbm9wamhieGptcnVjeGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgxOTUyMCwiZXhwIjoyMDkxMzk1NTIwfQ.aSQMoXBc0hR81oRtXczJZSRq8A199OLFgvLSIgjGyTs'
);

async function test() {
  console.log('Testing user creation...\n');
  
  // Test 1: Create organisation
  console.log('Step 1: Creating organisation...');
  const orgSlug = 'test-corp-' + Date.now();
  const orgId = crypto.randomUUID();
  
  const { data: orgData, error: orgError } = await supabase
    .from('organisations')
    .insert([{
      id: orgId,
      name: 'Test Corp',
      slug: orgSlug,
      created_by: null,
    }])
    .select();
  
  if (orgError) {
    console.error('❌ Organisation creation failed:', orgError.message);
    console.log('Error details:', orgError);
    return;
  }
  console.log('✓ Organisation created:', orgData?.[0]?.id);
  
  // Test 2: Create user
  console.log('\nStep 2: Creating user...');
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([{
      email: 'test-' + Date.now() + '@example.com',
      name: 'Test User',
      company: 'Test Corp',
      org_id: orgId,
    }])
    .select();
  
  if (userError) {
    console.error('❌ User creation failed:', userError.message);
    console.log('Error details:', userError);
    return;
  }
  console.log('✓ User created:', userData?.[0]?.id);
  
  // Test 3: Verify counts
  console.log('\nStep 3: Verifying data persistence...');
  const { count: userCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  
  const { count: orgCount } = await supabase
    .from('organisations')
    .select('*', { count: 'exact', head: true });
  
  console.log(`✓ Users in database: ${userCount}`);
  console.log(`✓ Organisations in database: ${orgCount}`);
}

test().catch(console.error);
