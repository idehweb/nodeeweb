import { googleHandler } from '@/functions/auth';
import { getGoogleClientId } from './utils';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { toast } from 'react-toastify';

export default function Google({ setLoading, onSuccess }) {
  const handle = (d) => {
    if (!d.credential) return;
    setLoading(true);
    googleHandler
      .detect({ credential: d.credential })
      .then((r) => onSuccess(r))
      .catch((er) => toast.error(er))
      .finally(() => setLoading(false));
  };

  return (
    <GoogleOAuthProvider clientId={getGoogleClientId()}>
      <GoogleLogin
        // type="icon"
        text="continue_with"
        size="large"
        shape="rectangular"
        auto_select={false}
        onSuccess={handle}
        onError={() => {
          let msg = 'ooh. Something went wrong with google sso!!';
          console.error(msg);
          toast.error(msg);
        }}
      />
    </GoogleOAuthProvider>
  );
}
