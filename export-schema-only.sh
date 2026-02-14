#!/bin/bash

# ========================================
# Script: Export Database Schema Only
# (Tanpa data - hanya struktur tabel)
# ========================================

echo "📋 Exporting database schema (structure only)..."

# Configuration
LOCAL_DB="undangan_db"
LOCAL_USER="postgres"
LOCAL_HOST="localhost"
LOCAL_PORT="5432"
SCHEMA_FILE="schema_$(date +%Y%m%d_%H%M%S).sql"

# Export schema only (no data)
pg_dump -h $LOCAL_HOST -p $LOCAL_PORT -U $LOCAL_USER -d $LOCAL_DB \
  --schema-only \
  --no-owner \
  --no-privileges \
  -f $SCHEMA_FILE

if [ $? -eq 0 ]; then
    echo "✅ Schema export successful!"
    echo ""
    echo "📄 File: $SCHEMA_FILE"
    echo "📦 Size: $(du -h $SCHEMA_FILE | cut -f1)"
    echo ""
    echo "📋 Schema includes:"
    echo "   - Table structures (CREATE TABLE)"
    echo "   - Indexes (CREATE INDEX)"
    echo "   - Constraints (PRIMARY KEY, FOREIGN KEY)"
    echo "   - Sequences (for auto-increment)"
    echo ""
    echo "⚠️  NO DATA included - only structure"
else
    echo "❌ Export failed!"
    exit 1
fi

echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Import to Supabase:"
echo "   psql \"postgresql://postgres.zwiocvemyivfkomdqrwt:A+y5Xc%Ec3DiXHe@aws-1-ap-south-1.pooler.supabase.com:6543/postgres\" -f $SCHEMA_FILE"
echo ""
echo "2. Verify tables created:"
echo "   - Open Supabase Dashboard > Table Editor"
echo "   - Check all tables exist"
echo ""
echo "3. Update .env.local:"
echo "   cp .env.local .env.local.backup"
echo "   cp .env.supabase.example .env.local"
echo ""
echo "✨ Done!"
