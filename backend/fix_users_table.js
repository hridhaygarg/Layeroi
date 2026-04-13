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

async function fix() {
  try {
    await client.connect();
    
    console.log('Dropping foreign key constraint on org_id...');
    await client.query(`
      ALTER TABLE users 
      DROP CONSTRAINT IF EXISTS users_org_id_fkey
    `);
    console.log('✓ Constraint dropped');
    
    console.log('\nAdding foreign key constraint with ON DELETE SET NULL...');
    await client.query(`
      ALTER TABLE users 
      ADD CONSTRAINT users_org_id_fkey 
      FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE SET NULL
    `);
    console.log('✓ Constraint added');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

fix();
