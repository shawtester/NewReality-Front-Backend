import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
   apiKey: "AIzaSyC08jacV4Bq44-Hp7fKVeWRWaFwd1kGtQs",
  authDomain: "new-reality-84a92.firebaseapp.com",
  projectId: "new-reality-84a92",
  storageBucket: "new-reality-84a92.firebasestorage.app",
  messagingSenderId: "41196594086",
  appId: "1:41196594086:web:31a2b1c8ce45d88cc66567",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const analytics = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
