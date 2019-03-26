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
var user_fcm_token = null;

messaging.requestPermission()
    .then(function () {
        console.log("Have permission")
        return messaging.getToken().then(function (token) {
            user_fcm_token = token;
        }).catch(function (err) {
            console.log(err)
        })
    })

    .catch(function (err) {
        console.log(err)
        console.log("Error")
    })

messaging.onMessage(function (data) {
    console.log(data)
})