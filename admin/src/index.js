import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';

import store from './store';
import App from './App';

const Store = store();

createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <App />
  </Provider>
);
