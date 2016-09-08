import Immutable, { fromJS } from 'immutable';
import mock from './mock';

import {
  ADD_SECTION,
  RENAME_SECTION,
  REMOVE_SECTION,
  ADD_SUBSECTION,
  RENAME_SUBSECTION,
  REMOVE_SUBSECTION,
} from './constants';

const initialState = fromJS(mock);

function courseReducer(course = initialState, action) {
  switch (action.type) {

    case ADD_SECTION:
      return course.updateIn(
        ['sections'],
        Immutable.List.of(),
        list => list.push(action.section)
      );

    case RENAME_SECTION:
      return course.setIn([
        'sections',
        action.sectionId,
        'name',
      ],
        action.name
      );

    case REMOVE_SECTION:
      return course.deleteIn([
        'sections',
        action.sectionId,
      ]);

    case ADD_SUBSECTION:
      return course.updateIn([
        'sections',
        action.sectionId,
        'subsections',
      ],
        Immutable.List.of(),
        list => list.push(action.subsection)
      );

    case RENAME_SUBSECTION:
      return course.setIn([
        'sections',
        action.sectionId,
        'subsections',
        action.subsectionId,
        'name',
      ],
        action.name
      );

    case REMOVE_SUBSECTION:
      return course.deleteIn([
        'sections',
        action.sectionId,
        'subsections',
        action.subsectionId,
      ]);

    default:
      return course;
  }
}

export default courseReducer;
