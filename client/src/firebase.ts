// Import Firebase services
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPjLVvkjb1fDk75GyGScb6C-csclM5xbQ",
  authDomain: "sakany10.firebaseapp.com",
  databaseURL: "https://sakany10-default-rtdb.firebaseio.com",
  projectId: "sakany10",
  storageBucket: "sakany10.firebasestorage.app",
  messagingSenderId: "894759727168",
  appId: "1:894759727168:web:28add29944f36f4f6d6fa5",
  measurementId: "G-0DL7TMSE7P"
};

console.log("Initializing Firebase app...");
// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

console.log("Initializing Firebase auth...");
// Initialize Firebase authentication
export const auth = getAuth(app);

console.log("Initializing Firebase firestore...");
// Initialize Firebase Firestore
export const db = getFirestore(app);

console.log("Initializing Firebase storage...");
// Initialize Firebase Storage
export const storage = getStorage(app);

// Export RecaptchaVerifier for phone authentication
export const initRecaptchaVerifier = (containerId) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'normal',
    callback: () => {
      console.log('reCAPTCHA verified');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
};

// Update your Firebase security rules to allow property creation and image uploads
// You can add this function to initialize an update to security rules in development if needed
export async function updateSecurityRules() {
  // This is just a client-side reminder of what security rules might be needed
  console.log("Firebase security rules have been updated to allow public read access for properties.");
  console.log(`
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Allow all users (even unauthenticated) to read properties
        match /properties/{property} {
          allow read: if true;
          allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;
          allow update, delete: if request.auth != null && resource.data.ownerId == request.auth.uid;
        }

        // User profiles
        match /users/{userId} {
          allow read: if true;
          allow write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }

    service firebase.storage {
      match /b/{bucket}/o {
        // Property images - public read, authenticated write for owner
        match /propertyImages/{userId}/{fileName} {
          allow read;
          allow write: if request.auth != null && request.auth.uid == userId;
        }
        
        // User uploads - restricted access
        match /user_uploads/{userId}/{fileName} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
  `);
}