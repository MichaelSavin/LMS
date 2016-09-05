import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';

const sagaMiddleware = createSagaMiddleware();
const devtools = window.devToolsExtension || (() => noop => noop);

const configureStore = (initialState = {}, history) => {
  const store = createStore(
    reducers,
    fromJS(initialState),
    compose(
      devtools(),
      applyMiddleware(
        routerMiddleware(history),
        sagaMiddleware,
      ),
    ),
  );

  store.runSaga = sagaMiddleware.run;

  if (module.hot) {
    System.import('./reducers').then((reducerModule) => {
      store.replaceReducer(reducerModule.default);
    });
  }

  return store;
};

export default configureStore;

