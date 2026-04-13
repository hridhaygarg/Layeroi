import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  'https://oryionopjhbxjmrucxby.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeWlvbm9wamhieGptcnVjeGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgxOTUyMCwiZXhwIjoyMDkxMzk1NTIwfQ.aSQMoXBc0hR81oRtXczJZSRq8A199OLFgvLSIgjGyTs'
);

async function test() {
  console.log('Testing complete user creation flow...\n');
  
  const userId = crypto.randomUUID();
  const orgId = crypto.randomUUID();
  const orgSlug = 'test-corp-' + Date.now();
  const testEmail = 'test-' + Date.now() + '@example.com';
  
  // Step 1: Create user without org_id
  console.log('Step 1: Creating user...');
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([{
      id: userId,
      email: testEmail,
      name: 'Test User',
      company: 'Test Corp',
    }])
    .select();
  
  if (userError) {
    console.error('❌ User creation failed:', userError.message);
    return;
  }
  console.log('✓ User created:', userData?.[0]?.id);
  
  // Step 2: Create organisation
  console.log('\nStep 2: Creating organisation...');
  const { data: orgData, error: orgError } = await supabase
    .from('organisations')
    .insert([{
      id: orgId,
      name: 'Test Corp',
      slug: orgSlug,
      created_by: userId,
    }])
    .select();
  
  if (orgError) {
    console.error('❌ Organisation creation failed:', orgError.message);
    return;
  }
  console.log('✓ Organisation created:', orgData?.[0]?.id);
  
  // Step 3: Update user with org_id
  console.log('\nStep 3: Updating user with organisation...');
  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update({ org_id: orgId })
    .eq('id', userId)
    .select();
  
  if (updateError) {
    console.error('❌ User update failed:', updateError.message);
    return;
  }
  console.log('✓ User updated:', updatedUser?.[0]?.org_id);
  
  // Step 4: Verify data
  console.log('\nStep 4: Verifying final data...');
  const { count: userCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  
  const { count: orgCount } = await supabase
    .from('organisations')
    .select('*', { count: 'exact', head: true });
  
  console.log(`✓ Total users in database: ${userCount}`);
  console.log(`✓ Total organisations in database: ${orgCount}`);
  console.log('\n✅ USER CREATION TEST SUCCESSFUL');
}

test().catch(console.error);
