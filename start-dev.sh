#!/bin/bash
echo "Stopping any existing Node processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
echo "Starting Next.js dev server..."
npm run dev
