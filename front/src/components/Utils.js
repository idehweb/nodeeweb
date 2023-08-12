import {updateNotifToken} from '#c/functions/index';
export const subscribeTokenToTopic = (token, topic) => {
  fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "key="
    }
  })
    .then(res => {
      const { status, text } = res;
      if(status==200){
        updateNotifToken(token);
      }
      if (status < 200 || status >= 400)
        console.error(`Error subscribing to topic: ${status} - ${text}`);
    })
    .catch(err => console.error(err));
};
