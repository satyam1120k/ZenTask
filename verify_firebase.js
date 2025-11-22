import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

console.log("Attempting to connect to Firestore...");

try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    console.log("------------------------------------------------");
    console.log("✅ SUCCESS: Connected to Firestore!");
    console.log(`Found ${querySnapshot.size} tasks in the database.`);
    console.log("------------------------------------------------");
    if (querySnapshot.size > 0) {
        console.log("Recent Tasks:");
        querySnapshot.forEach((doc) => {
            console.log(`- ${doc.data().title} (ID: ${doc.id})`);
        });
    } else {
        console.log("No tasks found yet (Database is empty but connected).");
    }
    process.exit(0);
} catch (error) {
    console.error("------------------------------------------------");
    console.error("❌ FAILURE: Could not connect to Firestore.");
    console.error("Error details:", error);
    console.error("------------------------------------------------");
    process.exit(1);
}
