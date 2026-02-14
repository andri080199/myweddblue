#!/bin/bash

# ========================================
# Script: Import Schema to Supabase
# ========================================

# Supabase connection (dari .env.supabase.example)
SUPABASE_URL="postgresql://postgres.zwiocvemyivfkomdqrwt:A+y5Xc%Ec3DiXHe@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

# Find latest schema file
SCHEMA_FILE=$(ls -t schema_*.sql 2>/dev/null | head -1)

if [ -z "$SCHEMA_FILE" ]; then
    echo "❌ No schema file found!"
    echo ""
    echo "Run export first:"
    echo "  ./export-schema-only.sh"
    exit 1
fi

echo "🚀 Importing schema to Supabase..."
echo ""
echo "📄 File: $SCHEMA_FILE"
echo "🌐 Target: Supabase (aws-1-ap-south-1)"
echo ""

# Import to Supabase
psql "$SUPABASE_URL" -f "$SCHEMA_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Import successful!"
    echo ""
    echo "🔍 Verify in Supabase Dashboard:"
    echo "   https://supabase.com/dashboard/project/zwiocvemyivfkomdqrwt/editor"
    echo ""
    echo "📋 Next: Update your .env.local"
    echo "   cp .env.supabase.example .env.local"
    echo ""
else
    echo ""
    echo "❌ Import failed!"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check if Supabase project is active"
    echo "2. Verify connection string in .env.supabase.example"
    echo "3. Check if you have internet connection"
    exit 1
fi
