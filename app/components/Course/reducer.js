import { fromJS, Immutable } from 'immutable';
import mock from './mock';

import {
  ADD_SECTION,
  REMOVE_SECTION,
  ADD_SUBSECTION,
  REMOVE_SUBSECTION,
} from './constants';

const initialState = fromJS(mock);

function courseReducer(course = initialState, action) {
  switch (action.type) {
    case ADD_SECTION:
      return course.updateIn(
        ['sections'],
        Immutable.list(),
        list => list.push(action.section)
      );
    case REMOVE_SECTION:
      return course.deleteIn(
        ['sections', action.sectionId]
      );
    case ADD_SUBSECTION:
      return course.updateIn(
        ['sections', action.sectionId, 'subsections'],
        Immutable.list(),
        list => list.push(action.subSection)
      );
    case REMOVE_SUBSECTION:
      return course.deleteIn(
        ['sections', action.sectionId, 'subsections', action.subSectionId]
      );
    default:
      return course;
  }
}

export default courseReducer;
