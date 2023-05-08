importScripts('sw-env.js');

/*
Give the service worker access to Firebase Messaging.
Note that you can only use Firebase Messaging here, other Firebase libraries are not available in the service worker.
*/
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js');

/*
Initialize the Firebase app in the service worker by passing in the messagingSenderId.
* New configuration for app@pulseservice.com
*/
const config = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
};

firebase.initializeApp(config);

/*
 * Retrieve an instance of Firebase Messaging so that it can handle background messages.
 */
const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(function (payload) {
//     console.log('[service-worker.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'payload.notification.title';
//     const notificationOptions = {
//         badge: payload.notification.badge,
//         body: payload.notification.body,
//         icon: payload.notification.icon,
//         image: payload.notification.image,
//         data: payload.notification.data,
//         click_action: payload.notification.click_action,
//         timestamp: payload.notification.timestamp,
//         tag: payload.notification.tag,
//         renotify: payload.notification.renotify,
//         silent: payload.notification.silent,
//         requireInteraction: payload.notification.requireInteraction,
//         actions: payload.notification.actions,
//     };

//     return await self.registration.showNotification(notificationTitle, notificationOptions);
// });

// messaging.onBackgroundMessage(function (payload) {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'payload.notification.title';
//     const notificationOptions = {
//         badge: payload.notification.badge,
//         body: payload.notification.body,
//         icon: payload.notification.icon,
//         image: payload.notification.image,
//         data: payload.notification.data,
//         click_action: payload.notification.click_action,
//         timestamp: payload.notification.timestamp,
//         tag: payload.notification.tag,
//         renotify: payload.notification.renotify,
//         silent: payload.notification.silent,
//         requireInteraction: payload.notification.requireInteraction,
//         actions: payload.notification.actions,
//     };

//     return await self.registration.showNotification(notificationTitle, notificationOptions);
// });
