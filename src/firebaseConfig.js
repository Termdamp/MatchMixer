import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database"; 
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBLuHaXMWxBCFvLp9qAhfE18Fs8FqZ1lEU",
  authDomain: "matchmixer-7.firebaseapp.com",
  databaseURL: "https://matchmixer-7-default-rtdb.firebaseio.com",
  projectId: "matchmixer-7",
  storageBucket: "matchmixer-7.firebasestorage.app",
  messagingSenderId: "32682446178",
  appId: "1:32682446178:web:dd0d042d1be318a0c7303b",
  measurementId: "G-YJ2SRCKHD5"
};

// 1. Singleton App Check (Prevents app crash on reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getDatabase(app);

// 2. Singleton Auth Check (The Fix for your Error)
let auth;
try {
  // Try to initialize with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  // If it fails (because it's already running), just grab the existing instance
  auth = getAuth(app);
}

export { auth };