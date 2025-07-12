# Firebase Setup for FairStay

This document provides instructions on how to set up Firebase for the FairStay project.

## Firebase Configuration

The project uses environment variables for Firebase configuration. These are stored in the `.env.local` file. You will need to add your own Firebase credentials to this file. Here's an example structure:

```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_RECAPTCHA_SITE_KEY
```

> **IMPORTANT SECURITY NOTE**: Never commit your actual Firebase credentials to version control. The `.env.local` file is included in `.gitignore` to prevent accidental exposure of sensitive information.

## Setting Up Environment Variables

You can create the `.env.local` file automatically by running:

```bash
./scripts/install-firebase.sh
```

Or manually by copying the template:

```bash
cp scripts/env.local.example .env.local
```

## Firebase SDK Setup

The project uses the modular JavaScript SDK for Firebase. To install Firebase, run:

```bash
npm install firebase
```

## Firebase Services Used

The project uses the following Firebase services:

- **Authentication**: For user authentication
- **Firestore**: For storing listing data and user information
- **Storage**: For storing listing images

## Firebase Security Rules

Make sure to set up appropriate security rules for Firestore and Storage to secure your data.

### Firestore Security Rules Example

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read all listings
    match /listings/{listingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }
    
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read and write their own transactions
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Security Rules Example

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read all listing images
    match /listings/{userId}/{allImages=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "fairstay-pwa"
3. Enable Authentication with Email/Password provider
4. Create a Firestore database
5. Set up Storage for images
6. Configure security rules for both Firestore and Storage

## Firebase Initialization in the App

The Firebase services are initialized in `src/lib/firebase.ts` using environment variables:

```typescript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
```

This initialization is then imported and used throughout the application. 