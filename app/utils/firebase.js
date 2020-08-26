import app from "firebase/app";
import "firebase/auth"
import "firebase/storage"
import "firebase/firebase-firestore"
import * as facebook from 'expo-facebook';

const firebaseConfig = {
    apiKey: "AIzaSyBs_ArQDEDdKjdhRwk9X0qA04DKrphCPio",
    authDomain: "tenedores-app-322c7.firebaseapp.com",
    databaseURL: "https://tenedores-app-322c7.firebaseio.com",
    projectId: "tenedores-app-322c7",
    storageBucket: "tenedores-app-322c7.appspot.com",
    messagingSenderId: "657518132485",
    appId: "1:657518132485:web:bb8d4b3e2dd594d2a0cb6c"
};

class FirebaseHelper {
    constructor() {
        const fb = app.initializeApp(firebaseConfig);
        facebook.initializeAsync('1300748476983773');
        this.auth = fb.auth();
        this.authClasses = app.auth;
        this.db = fb.firestore();
        this.storage = fb.storage();
    }

    login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    loginWithCredentials(credentials) {
        return this.auth.signInWithCredential(credentials);
    }

    logout() {
        return this.auth.signOut();
    }

    register(email, password) {
        return this.auth.createUserWithEmailAndPassword(email, password);
    }

    getFacebookCredentials(token) {
        return this.authClasses.FacebookAuthProvider.credential(token);
    }

    getUserInfo() {
        return this.auth.currentUser;
    }

    putUserAvatar(userId, blob) {
        const ref = this.storage.ref().child(`avatar/${userId}`);
        return ref.put(blob);
    }

    async uploadPhotoURL(userId) {
        try {
            const response = await this.storage.ref(`avatar/${userId}`).getDownloadURL();
            const data = { photoURL: response };
            await this.getUserInfo().updateProfile(data);
        } catch (error) {
            return error;
        }
    }

    reAuthenticate(password) {
        const user = this.getUserInfo();
        const credentials = this.authClasses.EmailAuthProvider.credential(user.email, password);
        return user.reauthenticateWithCredential(credentials);
    }
}

export default new FirebaseHelper()