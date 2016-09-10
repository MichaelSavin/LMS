import React from 'react';
import { Route } from 'react-router';

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
      <Route path="draft" component={Draft} />
      <Route path="view" component={View} />
    </Route>
  </Route>
);

export default routes;
