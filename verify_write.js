import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDYiuBDcUZGdvUEkIPaN8GJMhIxiLvfrrg",
    authDomain: "bppv-13cd9.firebaseapp.com",
    databaseURL: "https://bppv-13cd9-default-rtdb.firebaseio.com",
    projectId: "bppv-13cd9",
    storageBucket: "bppv-13cd9.firebasestorage.app",
    messagingSenderId: "938954716366",
    appId: "1:938954716366:web:d71bbe80e49d79140c8c9f",
    measurementId: "G-DPXCMNH3FZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Attempting to WRITE to Firestore...");

async function testWrite() {
    try {
        const docRef = await addDoc(collection(db, "tasks"), {
            title: "Test Write Task",
            completed: false,
            createdAt: Date.now()
        });
        console.log("------------------------------------------------");
        console.log("✅ SUCCESS: Wrote to Firestore!");
        console.log("Document written with ID: ", docRef.id);
        console.log("------------------------------------------------");
        process.exit(0);
    } catch (e) {
        console.error("------------------------------------------------");
        console.error("❌ FAILURE: Could not write to Firestore.");
        console.error("Error code:", e.code);
        console.error("Error message:", e.message);
        console.error("------------------------------------------------");
        console.log("\n⚠️  DIAGNOSIS: This is likely a PERMISSION issue.");
        console.log("Please check your Firestore Security Rules in the Firebase Console.");
        console.log("They should look like this for development:");
        console.log(`
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if true;
            }
          }
        }
        `);
        process.exit(1);
    }
}

testWrite();
