import * as storage from 'redux-storage';
import createSagaMiddleware from 'redux-saga';
import { browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import debounce from 'redux-storage-decorator-debounce';
import merger from 'redux-storage-merger-immutablejs';
import createEngine from 'redux-storage-engine-localstorage';   // sync
// import createEngine from 'redux-storage-engine-localforage'; // async

import { selectLocationState } from './selectors';

const configureStore = (reducers, router) => {
  const reducer = storage.reducer(reducers, merger);
  const engine = debounce(createEngine('LMS'), 5000);
  const sagaMiddleware = createSagaMiddleware();
  const engineMiddleware = storage.createMiddleware(engine);
  const createStoreWithMiddleware = compose(
    applyMiddleware(engineMiddleware, routerMiddleware(browserHistory), sagaMiddleware),
      window.devToolsExtension 
        ? window.devToolsExtension({ actionsBlacklist: ['REDUX_STORAGE_LOAD', 'REDUX_STORAGE_SAVE'] })
        : f => f,
  )(createStore);
  const store = createStoreWithMiddleware(reducer);
  const load = storage.createLoader(engine);
  store.runSaga = sagaMiddleware.run; // eslint-disable-line fp/no-mutation
  load(store).then(() => {
    const history = syncHistoryWithStore(
      browserHistory, 
      store, 
      { selectLocationState: selectLocationState() }
    );
    router(store, history);
  });
};

export default configureStore;
