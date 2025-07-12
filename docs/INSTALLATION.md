# FairStay Installation Guide

This guide will help you set up the FairStay project on your local machine.

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/fairstay-pwa.git
cd fairstay-pwa
```

## Step 2: Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
# or
yarn
```

## Step 3: Set Up Firebase and PWA

The project uses Firebase for authentication, database, and storage. You can use the provided script to install Firebase, create the `.env.local` file, and generate PWA icons:

```bash
# Make the script executable
chmod +x scripts/install-firebase.sh

# Run the script
./scripts/install-firebase.sh
```

This script will:
1. Install Firebase SDK
2. Create a `.env.local` file from the template if it doesn't exist
3. Generate PWA icons using the script

Alternatively, you can manually set up the environment by:

1. Copying `scripts/env.local.example` to `.env.local` in the root directory
2. Editing `.env.local` to add your actual Firebase credentials
3. Running `npm run generate-icons` to create the PWA icons

> **IMPORTANT SECURITY NOTE**: Never commit your `.env.local` file to version control as it contains sensitive API keys. The file is already included in `.gitignore` to prevent accidental exposure.

## Step 4: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Step 5: Build for Production

When you're ready to deploy the application, you can build it for production:

```bash
npm run build
# or
yarn build
```

To test the production build locally:

```bash
npm run start
# or
yarn start
```

## Project Structure

The project uses Next.js App Router for routing:

```
src/
├── app/              # Next.js App Router pages
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # User dashboard
│   ├── listing/      # Listing detail pages
│   └── upload/       # Listing upload page
├── components/       # Reusable React components
├── lib/              # Utility functions and hooks
└── scripts/          # Utility scripts
```

## Troubleshooting

### Firebase Connection Issues

If you're having trouble connecting to Firebase, make sure:

1. Your `.env.local` file is correctly set up
2. You have installed the Firebase SDK (`npm install firebase`)
3. Your internet connection is working

### PWA Not Working

If the PWA functionality is not working, check that:

1. You have the `next-pwa` package installed
2. The `manifest.json` file is correctly set up in the public directory
3. You're testing in a production build (`npm run build && npm run start`)
4. The PWA icons have been generated in the public/icons directory

### TypeScript Errors

If you encounter TypeScript errors, try running:

```bash
npm install --save-dev @types/react @types/react-dom @types/node
```

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PWA Documentation](https://web.dev/progressive-web-apps/) 