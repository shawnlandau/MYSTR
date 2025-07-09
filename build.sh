#!/bin/bash

# Build script for Netlify deployment
echo "Starting build process..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building application..."
npm run build

echo "Build completed successfully!" 