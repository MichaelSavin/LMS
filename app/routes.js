import React from 'react';
import { Route, IndexRedirect } from 'react-router';

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

export default routes;
