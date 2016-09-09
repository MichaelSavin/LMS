import 'babel-polyfill';
import React from 'react';
import routes from './routes';
import ReactDOM from 'react-dom';
import configureStore from './store';
import { Provider } from 'react-redux';
import useScroll from 'react-router-scroll';
import { selectLocationState } from './selectors';
import { syncHistoryWithStore } from 'react-router-redux';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import 'sanitize.css/sanitize.css';

const initialState = {};
const store = configureStore(initialState, browserHistory);

// Поддержка ImmutableJS в react-router-redux
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: selectLocationState(),
});

// const router = Router.create({ routes });

// if (module.hot) {
//   module.hot.accept('./routes', function() {
//     const newRoutes = require('./routes').default;
//     router.replaceRoutes(newRoutes);
//   });
// }

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} render={applyRouterMiddleware(useScroll())} key={Math.random()} >
      {routes}
    </Router>
  </Provider>,
  document.getElementById('app')
);

import { install } from 'offline-plugin/runtime';
install();
