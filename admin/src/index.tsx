import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import store from './store';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

const Store = store();

root.render(
  <Provider store={Store}>
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  </Provider>
);
