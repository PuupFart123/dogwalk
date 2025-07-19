#!/bin/bash

# DogWalk.com Production Startup Script

echo "🚀 Starting DogWalk.com..."

# Set production environment
export NODE_ENV=production
export PORT=${PORT:-3001}

# Create necessary directories
mkdir -p uploads
mkdir -p logs

# Check if database exists, create if not
if [ ! -f "dogwalk.db" ]; then
    echo "📊 Initializing database..."
fi

# Build React app if build directory doesn't exist
if [ ! -d "build" ]; then
    echo "🔨 Building React application..."
    npm run build
fi

# Start the server
echo "🌐 Starting server on port $PORT..."
echo "📁 Uploads directory: $(pwd)/uploads"
echo "🗄️  Database: $(pwd)/dogwalk.db"
echo "🔗 API available at: http://localhost:$PORT/api"

node server.js 