import firebase from 'firebase/app';

let myConfirmFunction = null;
let appVerifier = null;
export function phoneSignIn(phoneNumber) {
  if (!appVerifier)
    appVerifier = new firebase.auth.RecaptchaVerifier('firebase-sign-in', {
      size: 'invisible',
    });

  return firebase
    .auth()
    .signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      myConfirmFunction = confirmationResult;
      localStorage.sessionInfo = confirmationResult.verificationId || '';
    });
}

export function verifyCode(code) {
  /** @type {firebase.auth.ConfirmationResult} */

  if (!myConfirmFunction)
    return Promise.reject('cannot verify your phone number');

  return myConfirmFunction.confirm(code).then((res) => {
    // User signed in successfully.
    // const user = res.user;
    // console.log('confirm', res);
    return res;
    // ...
  });
}
