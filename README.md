# FairStay - Transparent Accommodation Listing Platform

FairStay is a Progressive Web App (PWA) designed to eliminate intermediary exploitation in rental markets in developing countries. It enables property owners to list accommodations directly, allowing renters to browse listings transparently.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Firebase and generate PWA icons:
   ```bash
   chmod +x scripts/install-firebase.sh
   ./scripts/install-firebase.sh
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **User Authentication**: Email + password registration and login with Firebase Auth
- **Listing Upload**: Upload properties with images, description, and automatic geolocation
- **Listing Presentation**: Card-style layout with image carousel and detailed view
- **Trial Mode**: Free access for 7 days after signup with blurred images for unpaid users
- **Paid Access**: Integration with Eco-cash for payment verification
- **Admin Tools**: Dashboard for verifying payments and managing listings
- **PWA Support**: Works offline and can be installed on mobile devices

## Tech Stack

- **Frontend**: React, Next.js (App Router)
- **Styling**: Tailwind CSS
- **Auth & Storage**: Firebase Auth, Firestore, Storage
- **Map & Geo**: Google Maps API
- **Payment**: Eco-cash (via manual Tx/Agent API)
- **Deployment**: Vercel
- **PWA**: next-pwa, manifest.json

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # User dashboard
│   ├── listing/      # Listing detail pages
│   └── upload/       # Listing upload page
├── components/       # Reusable React components
├── lib/              # Utility functions and hooks
│   ├── auth.tsx      # Authentication utilities
│   ├── db.ts         # Database utilities
│   ├── firebase.ts   # Firebase configuration
│   ├── geo.ts        # Geolocation utilities
│   └── payments.ts   # Payment processing utilities
└── public/           # Static assets and PWA manifest
```

## Firebase Configuration

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

## Installation Guide

For detailed installation instructions, see [INSTALLATION.md](./INSTALLATION.md).

## License

This project is licensed under the MIT License. 