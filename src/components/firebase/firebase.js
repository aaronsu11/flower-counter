import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';

// Initialize Firebase
// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBE-xgkJMD5o1hgU_C_dx82lfMFW7HKQe0",
    authDomain: "affable-tangent-247104.firebaseapp.com",
    databaseURL: "https://affable-tangent-247104.firebaseio.com",
    projectId: "affable-tangent-247104",
    storageBucket: "affable-tangent-247104.appspot.com",
    messagingSenderId: "44158393615",
    appId: "1:44158393615:web:4328365a2657e8f6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


const storage = firebase.storage();
const auth = firebase.auth();

export {
    storage, auth, firebase as default
}
