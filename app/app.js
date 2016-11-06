import 'babel-polyfill';
import 'sanitize.css/sanitize.css';
import reducers from './reducers';
import router from './routes';
import store from './store';

store(reducers, router);

if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
