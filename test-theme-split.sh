#!/bin/bash

# Test Script untuk Custom Theme Split Migration
# Run setelah server restart: bash test-theme-split.sh

BASE_URL="http://localhost:3001"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Testing Custom Theme Split Backend"
echo "======================================"
echo ""

# Test 1: Check migration status
echo "📋 Test 1: Checking migration status..."
RESPONSE=$(curl -s "${BASE_URL}/api/setup-database/split-themes")
echo "$RESPONSE" | jq .

if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Migration status check successful${NC}"
else
  echo -e "${RED}❌ Migration status check failed${NC}"
fi
echo ""

# Test 2: Run migration (if not migrated)
IS_MIGRATED=$(echo "$RESPONSE" | jq -r '.migrationStatus.isMigrated')
if [ "$IS_MIGRATED" == "false" ]; then
  echo "📋 Test 2: Running migration..."
  MIGRATION_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/setup-database/split-themes")
  echo "$MIGRATION_RESPONSE" | jq .

  if echo "$MIGRATION_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Migration completed successfully${NC}"
    echo "Stats:"
    echo "$MIGRATION_RESPONSE" | jq '.stats'
  else
    echo -e "${RED}❌ Migration failed${NC}"
    exit 1
  fi
else
  echo -e "${YELLOW}ℹ️  Migration already completed, skipping...${NC}"
fi
echo ""

# Test 3: Create custom color theme
echo "📋 Test 3: Creating custom color theme..."
COLOR_THEME_DATA='{
  "themeId": "test-ocean",
  "themeName": "Ocean Blue Test",
  "description": "Test ocean blue color theme",
  "colors": {
    "primary": "#0ea5e9",
    "primarylight": "#38bdf8",
    "darkprimary": "#0284c7",
    "textprimary": "#1e3a8a",
    "gold": "#fbbf24",
    "lightblue": "#dbeafe",
    "secondary": "#06b6d4",
    "accent": "#0284c7"
  }
}'

COLOR_CREATE_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$COLOR_THEME_DATA" \
  "${BASE_URL}/api/custom-color-themes")

echo "$COLOR_CREATE_RESPONSE" | jq .

if echo "$COLOR_CREATE_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Color theme created successfully${NC}"
else
  ERROR_MSG=$(echo "$COLOR_CREATE_RESPONSE" | jq -r '.message')
  if [[ "$ERROR_MSG" == *"already exists"* ]]; then
    echo -e "${YELLOW}ℹ️  Color theme already exists, skipping...${NC}"
  else
    echo -e "${RED}❌ Failed to create color theme${NC}"
  fi
fi
echo ""

# Test 4: Get all custom color themes
echo "📋 Test 4: Fetching all custom color themes..."
COLOR_LIST_RESPONSE=$(curl -s "${BASE_URL}/api/custom-color-themes")
echo "$COLOR_LIST_RESPONSE" | jq '.themes | length' | xargs echo "Found color themes:"
echo "$COLOR_LIST_RESPONSE" | jq '.themes | .[] | {themeId, themeName}'

if echo "$COLOR_LIST_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Successfully fetched color themes${NC}"
else
  echo -e "${RED}❌ Failed to fetch color themes${NC}"
fi
echo ""

# Test 5: Create custom background theme
echo "📋 Test 5: Creating custom background theme..."
BG_THEME_DATA='{
  "themeId": "test-nature",
  "themeName": "Nature Backgrounds Test",
  "description": "Test nature background theme",
  "backgrounds": {
    "fullscreen": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzRmNDZlNSIvPjwvc3ZnPg==",
    "welcome": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzEwYjk4MSIvPjwvc3ZnPg=="
  }
}'

BG_CREATE_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$BG_THEME_DATA" \
  "${BASE_URL}/api/custom-background-themes")

echo "$BG_CREATE_RESPONSE" | jq .

if echo "$BG_CREATE_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Background theme created successfully${NC}"
else
  ERROR_MSG=$(echo "$BG_CREATE_RESPONSE" | jq -r '.message')
  if [[ "$ERROR_MSG" == *"already exists"* ]]; then
    echo -e "${YELLOW}ℹ️  Background theme already exists, skipping...${NC}"
  else
    echo -e "${RED}❌ Failed to create background theme${NC}"
  fi
fi
echo ""

# Test 6: Get all custom background themes (without backgrounds data)
echo "📋 Test 6: Fetching all custom background themes (lightweight)..."
BG_LIST_RESPONSE=$(curl -s "${BASE_URL}/api/custom-background-themes")
echo "$BG_LIST_RESPONSE" | jq '.themes | length' | xargs echo "Found background themes:"
echo "$BG_LIST_RESPONSE" | jq '.themes | .[] | {themeId, themeName, hasBackgrounds: (.backgrounds != null)}'

if echo "$BG_LIST_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Successfully fetched background themes${NC}"
else
  echo -e "${RED}❌ Failed to fetch background themes${NC}"
fi
echo ""

# Test 7: Get specific background theme with backgrounds
echo "📋 Test 7: Fetching specific background theme (with backgrounds)..."
SPECIFIC_BG=$(curl -s "${BASE_URL}/api/custom-background-themes?themeId=test-nature")
echo "$SPECIFIC_BG" | jq '.theme | {themeId, themeName, backgroundCount: (.backgrounds | keys | length)}'

if echo "$SPECIFIC_BG" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Successfully fetched specific background theme${NC}"
else
  echo -e "${RED}❌ Failed to fetch specific background theme${NC}"
fi
echo ""

# Summary
echo "======================================"
echo "🎯 Test Summary"
echo "======================================"
echo -e "${GREEN}✅ All core API endpoints tested${NC}"
echo ""
echo "Next steps:"
echo "1. Check database dengan: psql -d your_db -c 'SELECT * FROM custom_color_themes;'"
echo "2. Test theme composition di frontend"
echo "3. Build admin UI untuk create color/background themes"
echo ""
