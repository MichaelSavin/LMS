import 'babel-polyfill';
import 'sanitize.css/sanitize.css';
import { install as offline } from 'offline-plugin/runtime';
import reducers from './reducers';
import router from './routes';
import store from './store';

store(reducers, router);
offline();
