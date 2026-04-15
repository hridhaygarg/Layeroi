#!/bin/bash
# Non-interactive database setup (for CI/automation)
# Usage: PGPASSWORD="your_password" bash backend/setup-database-ci.sh

if [ -z "$PGPASSWORD" ]; then
  echo "❌ Error: PGPASSWORD environment variable not set"
  echo "Usage: PGPASSWORD=\"your_password\" bash backend/setup-database-ci.sh"
  echo ""
  echo "Get your password from:"
  echo "https://app.supabase.com/project/oryionopjhbxjmrucxby/settings/database"
  exit 1
fi

echo "🚀 Layer ROI - Database Setup"
echo "════════════════════════════════════════"
echo ""
echo "⏳ Executing migration..."
echo ""

node backend/src/db/migrate.js
