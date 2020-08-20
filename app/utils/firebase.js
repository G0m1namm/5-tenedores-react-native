import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBs_ArQDEDdKjdhRwk9X0qA04DKrphCPio",
    authDomain: "tenedores-app-322c7.firebaseapp.com",
    databaseURL: "https://tenedores-app-322c7.firebaseio.com",
    projectId: "tenedores-app-322c7",
    storageBucket: "tenedores-app-322c7.appspot.com",
    messagingSenderId: "657518132485",
    appId: "1:657518132485:web:bb8d4b3e2dd594d2a0cb6c"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig); 