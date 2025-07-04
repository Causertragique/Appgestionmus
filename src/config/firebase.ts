import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Authentication (pour Google uniquement)
export const auth = getAuth(app);

// Firebase App Check (optionnel - décommentez si nécessaire)
// if (typeof window !== 'undefined') {
//   // Mode debug pour le développement
//   (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
//   
//   // initializeAppCheck(app, {
//   //   provider: new ReCaptchaV3Provider('your-recaptcha-site-key'),
//   //   isTokenAutoRefreshEnabled: true
//   // });
// }

export default app; 