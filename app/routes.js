import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { useScroll } from 'react-router-scroll';
import {
  Route,
  Router,
  IndexRedirect,
  applyRouterMiddleware,
} from 'react-router';

import Course from 'components/Course';
import Content from 'components/Course/Content';
import {
  Complex as Editor,
} from 'components/Course/Content/Editor';
import View from 'components/Course/Content/View';

const routes = (
  <Route path="/" component={Course}>
    <Route
      component={Content}
      path=":sectionId-:subsectionId-:unitId"
    >
      <IndexRedirect to="editor" />
      <Route path="view" component={View} />
      <Route path="editor" component={Editor} />
    </Route>
    <Route path="*" component={Course} />
  </Route>
);

const router = (store, history) => {
  ReactDOM.render(
    <Provider store={store}>
      <Router
        history={history}
        key={Math.random()}
        render={applyRouterMiddleware(
          useScroll((prevRouterProps, routerProps) => {
            const { hash } = routerProps.location;
            if (hash) {
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              const block = document.querySelector(hash);
              if (block) {
                const dimentions = block.getBoundingClientRect();
                return [0, scrollTop + dimentions.top];
              }
              return false;
            }
            if (routerProps.routes.some((route) => route.ignoreScrollBehavior)) {
              return false;
            }
            if (routerProps.routes.some((route) => route.scrollToTop)) {
              return [0, 0];
            }
            return true;
          })
        )}
      >
        {routes}
      </Router>
    </Provider>,
    document.getElementById('app')
  );
};

export default router;
