import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer from './rootReducer';
// friends: [],
// theme:'dark'
export default function configureStore(initialState = {}) {
  const logger = createLogger({
    collapsed: true,
    predicate: () => process.env.NODE_ENV === `development`, // eslint-disable-line no-unused-vars
  });

  const middleware = applyMiddleware(thunkMiddleware, logger);

  const store = middleware(createStore)(rootReducer, initialState);
  // store.replaceReducer(nextRootReducer);

  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('./reducers/reducers', () => {
  //     const nextRootReducer = require('../reducers/reducers').default;
  //     store.replaceReducer(nextRootReducer);
  //   });
  // }

  return store;
}
