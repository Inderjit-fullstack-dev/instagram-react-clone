import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBaDDB_0uHq0AYWwTNMr8BC6gMrE0YCXbw",
  authDomain: "instagram-clone-react-65c48.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-65c48.firebaseio.com",
  projectId: "instagram-clone-react-65c48",
  storageBucket: "instagram-clone-react-65c48.appspot.com",
  messagingSenderId: "556851575568",
  appId: "1:556851575568:web:86432b586d3940324e8395",
  measurementId: "G-8FFKGC2X6T",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

const storage = firebase.storage();

export { db, auth, storage };
