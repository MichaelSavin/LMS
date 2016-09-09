import React from 'react';
import { Route } from 'react-router';

import Course from 'components/Course';
import Editor from 'components/Course/Editor';

const routes = (
  <Route path="/" component={Course}>
    <Route path="/:sectionId-:subsectionId-:unitId" component={Editor} />
  </Route>
);

export default routes;
