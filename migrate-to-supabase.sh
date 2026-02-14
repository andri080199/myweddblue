#!/bin/bash

# ========================================
# Script: Migrate PostgreSQL to Supabase
# ========================================

echo "🚀 Starting database migration to Supabase..."

# Configuration
LOCAL_DB="undangan_db"
LOCAL_USER="postgres"
LOCAL_HOST="localhost"
LOCAL_PORT="5432"
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"

# Step 1: Export dari database lokal
echo ""
echo "📦 Step 1: Exporting local database..."
echo "Database: $LOCAL_DB"
echo "Output: $BACKUP_FILE"
echo ""

pg_dump -h $LOCAL_HOST -p $LOCAL_PORT -U $LOCAL_USER -d $LOCAL_DB -F p -f $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Export successful!"
    echo "File created: $BACKUP_FILE"
    echo "File size: $(du -h $BACKUP_FILE | cut -f1)"
else
    echo "❌ Export failed!"
    exit 1
fi

# Step 2: Import ke Supabase
echo ""
echo "📥 Step 2: Import to Supabase"
echo ""
echo "⚠️  MANUAL ACTION REQUIRED:"
echo ""
echo "1. Buka Supabase Dashboard:"
echo "   https://supabase.com/dashboard"
echo ""
echo "2. Pilih project Anda > Settings > Database"
echo ""
echo "3. Copy 'Connection string' (Transaction mode)"
echo ""
echo "4. Run command berikut (ganti SUPABASE_URL):"
echo ""
echo "   psql \"postgresql://postgres.[PROJECT]:[PASSWORD]@...supabase.com:6543/postgres\" -f $BACKUP_FILE"
echo ""
echo "5. Setelah import berhasil, update .env.local:"
echo "   DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@...supabase.com:6543/postgres"
echo ""
echo "6. Test connection:"
echo "   npm run dev"
echo ""

# Step 3: Cleanup (optional)
echo "💾 Backup file saved at: $(pwd)/$BACKUP_FILE"
echo ""
echo "To cleanup backup file later:"
echo "  rm $BACKUP_FILE"
echo ""
echo "✨ Migration script completed!"
