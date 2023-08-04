import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer, Slide } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '#c/functions/store';
import App from '#c/App';
import '#c/i18n';
import {fetchTheme} from '#c/functions';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import '#c/assets/styles/shards-dashboards.1.1.0.min.css';
import '#c/assets/styles/global.css';
import '#c/assets/styles/ltr.css';
import '#c/assets/styles/rtl.css';
import '@splidejs/react-splide/css/skyblue';
store.dispatch(fetchTheme());
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
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
  </PersistGate>
</Provider>);

