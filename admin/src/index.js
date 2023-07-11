// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client'
//import './assets/index.css';
// import { createStore, combineReducers } from 'redux';
import store from './store';
import { Provider } from 'react-redux';
import App from './App';

createRoot(document.getElementById('root')).render(<Provider store={store()}><App /></Provider>)
