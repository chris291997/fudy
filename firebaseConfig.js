var firebase = require('firebase');


  var firebaseConfig = {
    apiKey: "AIzaSyDkYwIVL7_GKaaYQXJlpNIsajihlheZ0Vg",
    authDomain: "fuds-bicol.firebaseapp.com",
    databaseURL: "https://fuds-bicol-default-rtdb.firebaseio.com",
    projectId: "fuds-bicol",
    storageBucket: "fuds-bicol.appspot.com",
    messagingSenderId: "263716480950",
    appId: "1:263716480950:web:ea5ea9ce22f826e0154317",
    measurementId: "G-C1Q0B1DDS7"
  };

firebase.initializeApp(firebaseConfig)
let database = firebase.database()

export default database;

