import * as firebase from 'firebase';
require('@firebase/firestore');

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBIJMF2gvi1m1g58GXOcVRONwntNK0zavI",
    authDomain: "virtual-library-7a737.firebaseapp.com",
    databaseURL: "https://virtual-library-7a737.firebaseio.com",
    projectId: "virtual-library-7a737",
    storageBucket: "virtual-library-7a737.appspot.com",
    messagingSenderId: "1021883880932",
    appId: "1:1021883880932:web:c1fedad63a210aef0ce3f1"
  };
  // Initialize Firebase
  if(!firebase.apps.length)
  {
    firebase.initializeApp(firebaseConfig);
  }

export default firebase.firestore();