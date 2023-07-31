import {updateNotifToken} from '#c/functions/index';
export const subscribeTokenToTopic = (token, topic) => {
  fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "key=AAAAz_K81P8:APA91bGyInzAS1R0NRXJIlYKiI2sq4qv91hsGuc223J6g5SWpVPX2dU9Z0FYCls2B04L9o5DOZh-lzWHQRF7LCgvHUcntk3Zr8xDvfG8UqK0ZpScB43SVlVpQP7kJXcR0JzbHv1FKFax"
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
