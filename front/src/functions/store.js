console.log('#f store');
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducer from "#c/functions/reducer";
import logger from 'redux-logger';
import { persistReducer, persistStore } from "redux-persist";
// import storage from 'redux-persist/lib/storage';
// import { loadProductItems } from "#c/functions/index";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    }
  };
};
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();


// console.log('storage',storage);
const devMode = process.env.NODE_ENV === "development";

const persistConfig = {
  key: "nodeeweb",
  storage
};
export const storeProducts = (data) => ({
  type: "STORE_PRODUCTS",
  payload: data
});
export const storePosts = (data) => ({
  type: "STORE_POSTS",
  payload: data
});
export const storeProduct = (data) => ({
  type: "STORE_PRODUCT",
  payload: data
});
export const storeAttrValue = (data) => ({
  type: "STORE_ATTR_VALUE",
  payload: data
});


// console.log("thunk", thunk);

const pReducer = persistReducer(persistConfig, reducer);
const middleware = devMode
  ? applyMiddleware(thunk,logger)
  : applyMiddleware(thunk);

const store = createStore(pReducer, middleware);
const persistor = persistStore(store);

export { store, persistor };

export default store;
