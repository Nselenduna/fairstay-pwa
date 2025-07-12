#!/bin/bash

# Install Firebase SDK
echo "Installing Firebase SDK..."
npm install firebase

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  cp scripts/env.local.example .env.local
  echo ".env.local file created successfully!"
  echo ""
  echo "⚠️  SECURITY WARNING ⚠️"
  echo "You need to replace the placeholder values in .env.local with your actual Firebase credentials."
  echo "Never commit your .env.local file to version control."
  echo ""
else
  echo ".env.local file already exists. Skipping creation."
fi

# Generate PWA icons
echo "Generating PWA icons..."
npm run generate-icons

echo "Firebase SDK installation complete!"
echo "You can now run 'npm run dev' to start the development server." 