import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import store from './store';
import App from './App';

import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
const root = createRoot(container);

const Store = store();

root.render(
  <Provider store={Store} >
    <Suspense fallback="Loading...">
      <App />
      <ToastContainer
        transition={Slide}
        hideProgressBar
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Suspense>
  </Provider>
);
