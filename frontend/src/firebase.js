import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


    const firebaseConfig = {
        apiKey: "AIzaSyApu2NQAN7E8cQEKudDJxaX1anwAuWVns4",
        authDomain: "student-management-dbd27.firebaseapp.com",
        projectId: "student-management-dbd27",
        storageBucket: "student-management-dbd27.firebasestorage.app",
        messagingSenderId: "1038804157724",
        appId: "1:1038804157724:web:58e9289f3382faf7f5a6d9",
        measurementId: "G-5MVXH405SL"
      };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };