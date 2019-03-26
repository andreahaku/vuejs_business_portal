importScripts("https://www.gstatic.com/firebasejs/4.12.1/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/4.12.1/firebase-messaging.js")

var config = {
    apiKey: "AAAA3FOOr0Q:APA91bEIqsJ6t6sxNnX_vf1Cm_9yfsirAyRNebSBdf-Cw_9JlanMZbTRp3ikwE44h9v3OzgNpiYjuORcjUUgkkPn85aEQREUOTCR-8Q3pM1weD0EZfegfMR6HrXk0sU-ZAeuZfiNmSay",
    authDomain: "employeeportaljs.firebaseapp.com",
    databaseURL: "https://employeeportaljs.firebaseio.com",
    projectId: "employeeportaljs",
    storageBucket: "employeeportaljs.appspot.com",
    messagingSenderId: "946294665028"
};
firebase.initializeApp(config);

const messaging = firebase.messaging()