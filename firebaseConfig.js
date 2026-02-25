import { initializeApp } from "firebase/app";
// import * as firebase from "firebase";
// Optionally import the services that you want to use
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage";

// Initialize Firebase for Project SCR
// const firebaseConfig = {
//   apiKey: "AIzaSyAs-8OrQiySWTVRcY3K_AHXR6akiUn53M8",
//   authDomain: "project-scr.firebaseapp.com",
//   databaseURL:
//     "https://project-scr-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "project-scr",
//   storageBucket: "project-scr.appspot.com",
//   messagingSenderId: "1054253007431",
//   appId: "1:1054253007431:web:5c08268c5d6d18078aa762",
// };

// Initialize Firebase for CARS projects

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// export { firebase };
// const database = getDatabase(app)
export const db = getDatabase(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const storage = getStorage(app)