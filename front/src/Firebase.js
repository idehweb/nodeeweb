import { initializeApp } from 'firebase/app';
import { subscribeTokenToTopic } from "#c/components/Utils";
import { getMessaging , getToken,onMessage} from "firebase/messaging";
// Replace this firebaseConfig object with the congurations for the project you created on your firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyALxN0MzAZjKtox_on54foHfOaJOkhwLhQ",
  authDomain: "arvandshop-10411.firebaseapp.com",
  projectId: "arvandshop-10411",
  storageBucket: "arvandshop-10411.appspot.com",
  messagingSenderId: "893130691839",
  appId: "1:893130691839:web:ae8a1209009a977ca428ca"
};
const firebaseUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;
const app = initializeApp(firebaseConfig);
const messaging = getMessaging();

export const requestForToken = async () => {
  return await getToken(messaging, { vapidKey: 'BFjOV8hMyyNh8enoDVKsaSh6m5H7hcmZYGQuXFWO39GLK6Dde3w6jGjeRC4C00OXBsubU_akuHkD4DKYU8ArtBc' })
    .then((currentToken) => {
      if (currentToken) {
        subscribeTokenToTopic(currentToken, "all");

        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
