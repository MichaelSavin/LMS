import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import useScroll from 'react-router-scroll';
import {
  Route,
  Router,
  IndexRedirect,
  applyRouterMiddleware,
} from 'react-router';

import Course from 'components/Course';
import Editor from 'components/Course/Editor';
import Draft from 'components/Course/Editor/Draft';
import View from 'components/Course/Editor/View';

const routes = (
  <Route path="/" component={Course}>
    <Route
      component={Editor}
      path=":sectionId-:subsectionId-:unitId"
    >
      <IndexRedirect to="draft" />
      <Route path="view" component={View} />
      <Route path="draft" component={Draft} />
    </Route>
  </Route>
);

const router = (store, history) => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history} render={applyRouterMiddleware(useScroll())} key={Math.random()} >
        {routes}
      </Router>
    </Provider>,
    document.getElementById('app')
  );
};

export default router;
