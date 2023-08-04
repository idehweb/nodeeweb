// // import * as firebase from "firebase/app";
// // import "firebase/analytics";
// // import "firebase/messaging";
// import { initializeApp } from 'firebase/app';
// import { subscribeTokenToTopic } from "./Utils";
// import { getMessaging,getToken } from "firebase/messaging";
//
// const firebaseUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;
//
// export const initFirebase = () => {
//
// // Your web app's Firebase configuration
//   const firebaseConfig = {
//     apiKey: "AIzaSyALxN0MzAZjKtox_on54foHfOaJOkhwLhQ",
//     authDomain: "arvandshop-10411.firebaseapp.com",
//     projectId: "arvandshop-10411",
//     storageBucket: "arvandshop-10411.appspot.com",
//     messagingSenderId: "893130691839",
//     appId: "1:893130691839:web:ae8a1209009a977ca428ca"
//   };
//
//   // Project Settings => Add Firebase to your web app
//   // firebase.initializeApp(firebaseConfig);
//   const app = initializeApp(firebaseConfig);
//   // const messaging = getMessaging(app);
//   // if ("serviceWorker" in navigator) {
//   //   navigator.serviceWorker
//   //     .register(firebaseUrl, {
//   //       scope: `${process.env.PUBLIC_URL}/firebase-cloud-messaging-push-scope`,
//   //       updateViaCache: "none"
//   //     })
//   //     .then(registration => {
//   //       // firebase.analytics();
//   //
//   //       const msg = messaging;
//   //
//   //       msg.useServiceWorker(registration);
//   //
//   //       msg.onMessage(payload => {
//   //         const { body, icon, title, click_action } = payload.notification;
//   //         let action = click_action || null;
//   //         const options = {
//   //           body,
//   //           icon,
//   //           actions: [
//   //             {
//   //               action,
//   //               title
//   //             }
//   //           ]
//   //         };
//   //         registration.showNotification(title, options);
//   //       });
//   //     })
//   //     .catch(er => console.log("error => ", er));
//   //
//   //   window.onload = () => askPermission(messaging);
//   // }
// };
// //
// // export const askPermission = async (msg) => {
// //   try {
// //     // const msg = messaging;
// //     await msg.requestPermission();
// //     const token = await msg.getToken();
// //     subscribeTokenToTopic(token, "all");
// //   } catch (error) {
// //     console.error(error);
// //   }
// // };
// //
// // export const requestForToken = () => {
// //   return getToken(messaging, { vapidKey: REPLACE_WITH_YOUR_VAPID_KEY })
// //     .then((currentToken) => {
// //       if (currentToken) {
// //         console.log('current token for client: ', currentToken);
// //         // Perform any other neccessary action with the token
// //       } else {
// //         // Show permission request UI
// //         console.log('No registration token available. Request permission to generate one.');
// //       }
// //     })
// //     .catch((err) => {
// //       console.log('An error occurred while retrieving token. ', err);
// //     });
// // };
