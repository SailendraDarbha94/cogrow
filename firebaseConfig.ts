import { initializeApp } from "firebase/app";
// import * as firebase from "firebase";
// Optionally import the services that you want to use
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import { getDatabase, ref } from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCxuuhuQuRMXaNm-VuOCXDkpd7uEiiEKJ4",
    authDomain: "cogrow-598b3.firebaseapp.com",
    projectId: "cogrow-598b3",
    storageBucket: "cogrow-598b3.firebasestorage.app",
    messagingSenderId: "478157222081",
    databaseURL: "https://cogrow-598b3-default-rtdb.asia-southeast1.firebasedatabase.app/",
    appId: "1:478157222081:web:84ee8c55820149285e6440",
    measurementId: "G-HMQQ9K6FXR"
  };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

export const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// export { firebase };
// const database = getDatabase(app)
// export const db = getDatabase(app)
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
// export const storage = getStorage(app)