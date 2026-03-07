// Firebase Configuration (Compat / CDN Version)
// This file assumes the Firebase SDK scripts (app, auth, firestore, storage) are loaded in the HTML before this script.

const firebaseConfig = {
    apiKey: "AIzaSyDmeaTX_3fbjeR4JGQutPMlXZSOgGseKTo",
    authDomain: "bookbase-64dd0.firebaseapp.com",
    projectId: "bookbase-64dd0",
    storageBucket: "bookbase-64dd0.firebasestorage.app",
    messagingSenderId: "171656525292",
    appId: "1:171656525292:web:1c2e20df4b3d91e3d57cc9"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage ? firebase.storage() : null; // Handle if storage script not loaded

// Expose functions globally for other scripts to use
window.BookApp = {
    // Ensure firebase is exposed for features like RecaptchaVerifier that need the namespace
    firebase: (typeof firebase !== 'undefined') ? firebase : null,
    auth: auth,
    db: db,
    storage: storage,

    // Auth Helpers
    login: async (email, password) => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    },

    signUp: async (email, password, name) => {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Update profile with display name
            await user.updateProfile({
                displayName: name
            });

            // Create user profile
            await db.collection('users').doc(user.uid).set({
                uid: user.uid,
                name: name,
                email: email,
                createdAt: new Date(),
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2B4C7E&color=fff`,
                bio: '',
                readingGoal: 50,
                followers: [],
                following: []
            });

            return user;
        } catch (error) {
            console.error("Signup failed:", error);
            throw error;
        }
    },

    signInWithGoogle: async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);
            const user = result.user;

            // Create or update user document in Firestore
            await db.collection('users').doc(user.uid).set({
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                createdAt: new Date(),
                avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=2B4C7E&color=fff`,
                bio: '',
                readingGoal: 50
            }, { merge: true });

            return user;
        } catch (error) {
            console.error("Google sign-in error:", error);
            throw error;
        }
    },

    signInWithPhoneNumber: async (phoneNumber, appVerifier) => {
        try {
            const confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, appVerifier);
            return confirmationResult;
        } catch (error) {
            console.error("Phone sign-in error:", error);
            throw error;
        }
    },

    uploadFile: async (file, path) => {
        try {
            if (!storage) throw new Error("Firebase Storage not initialized");
            const storageRef = storage.ref();
            const fileRef = storageRef.child(path);
            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            return downloadURL;
        } catch (error) {
            console.error("File upload error:", error);
            throw error;
        }
    },

    logout: async () => {
        try {
            console.log("Signing out...");
            await auth.signOut();

            // Clear local storage
            localStorage.clear(); // Clear all app data

            console.log("Signed out. Redirecting...");
            // Force reload to ensure state is fresh
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = 'index.html';
        }
    },

    // Data Helpers
    getUserBooks: async (userId) => {
        try {
            const snapshot = await db.collection('books').where('userId', '==', userId).get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting books:", error);
            return [];
        }
    },

    addBook: async (bookData) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not logged in");

            const bookRef = await db.collection('books').add({
                userId: user.uid,
                ...bookData,
                createdAt: new Date()
            });
            return bookRef.id;
        } catch (error) {
            console.error("Error adding book:", error);
            throw error;
        }
    }
};
