import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';

import * as storage from 'redux-storage';
import merger from 'redux-storage-merger-immutablejs';
import createEngine from 'redux-storage-engine-localstorage';

const sagaMiddleware = createSagaMiddleware();

const configureStore = (initialState = {}, history) => {
  const reducer = storage.reducer(reducers, merger);
  const engine = createEngine('key');
  const engineMiddleware = storage.createMiddleware(engine);
  const createStoreWithMiddleware = compose(
    applyMiddleware(engineMiddleware, routerMiddleware(history), sagaMiddleware),
    window.devToolsExtension && window.devToolsExtension({
      // actionsBlacklist: ['REDUX_STORAGE_LOAD', 'REDUX_STORAGE_SAVE'],
    }),
  )(createStore);
  const store = createStoreWithMiddleware(reducer);
  const load = storage.createLoader(engine);
  store.runSaga = sagaMiddleware.run;
  load(store);
  return store;
};

export default configureStore;
