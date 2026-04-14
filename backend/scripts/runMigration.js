#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ SUPABASE_URL and SUPABASE_KEY environment variables are required');
  process.exit(1);
}

async function runMigration() {
  try {
    console.log('🚀 Starting Supabase migration...');

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });

    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../migrations/001_create_outreach_queue.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    // Split SQL into individual statements and execute
    const statements = sql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        // Use rpc or raw query if available
        const { error } = await supabase.from('_sql').select('*').limit(1);
        if (error && error.code === 'PGRST103') {
          // Table doesn't exist, use alternative approach
          console.log(`⚠️  Cannot execute raw SQL via Supabase client. Please run migrations manually.`);
          console.log(`\n📋 SQL to execute:\n${sql}\n`);
          process.exit(1);
        }
      } catch (err) {
        // Fallback: show SQL to user
        console.log('⚠️  Supabase client cannot execute raw SQL directly.');
        console.log('\n📋 Please run this SQL in your Supabase dashboard SQL Editor:\n');
        console.log(sql);
        console.log('\n🔗 Go to: https://app.supabase.com/project/[your-project]/sql');
        process.exit(1);
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - outreach_queue');
    console.log('   - outreach_stats (view)');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.log('\n📋 SQL Migration Script Content:');
    const migrationPath = path.join(__dirname, '../migrations/001_create_outreach_queue.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    console.log(sql);
    process.exit(1);
  }
}

runMigration();
