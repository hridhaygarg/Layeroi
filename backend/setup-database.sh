#!/bin/bash

# Layeroi Database Setup Script
# Executes Supabase migration with password prompt

set -e

echo ""
echo "🚀 Layeroi - Supabase Database Setup"
echo "════════════════════════════════════════"
echo ""

# Check if migration file exists
MIGRATION_FILE="backend/migrations/001_create_outreach_queue.sql"
if [ ! -f "$MIGRATION_FILE" ]; then
  echo "❌ Migration file not found: $MIGRATION_FILE"
  exit 1
fi

echo "📋 This will create the outreach_queue table for prospect automation"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not installed"
  exit 1
fi

# Check if Supabase CLI is available
if ! npm list supabase > /dev/null 2>&1; then
  echo "📦 Installing Supabase CLI..."
  npm install supabase --save-dev
fi

echo "🔑 Getting Supabase database password..."
echo ""
echo "📍 To get your password:"
echo "   1. Go to: https://app.supabase.com/project/oryionopjhbxjmrucxby/settings/database"
echo "   2. Find the 'Password' field under Database section"
echo "   3. Copy it below"
echo ""

read -sp "🔐 Enter your Supabase database password: " DB_PASSWORD
echo ""
echo ""

if [ -z "$DB_PASSWORD" ]; then
  echo "❌ Password cannot be empty"
  exit 1
fi

echo "⏳ Executing migration..."
echo ""

# Export password for migration script
export PGPASSWORD="$DB_PASSWORD"

# Run migration
if node backend/src/db/migrate.js; then
  echo ""
  echo "════════════════════════════════════════"
  echo "✅ DATABASE SETUP COMPLETE"
  echo "════════════════════════════════════════"
  echo ""
  echo "✨ Outreach automation is now ready!"
  echo "   - Prospect queue: outreach_queue table"
  echo "   - Analytics: outreach_stats view"
  echo "   - Automation: Cron jobs enabled"
  echo ""
  echo "📅 Next automated run: Next Monday 6:00 AM IST"
  echo ""
else
  echo ""
  echo "❌ Migration failed"
  echo "Try alternative methods in DATABASE_SETUP.md"
  exit 1
fi
