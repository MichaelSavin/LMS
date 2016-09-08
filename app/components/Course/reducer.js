import Immutable, { fromJS } from 'immutable';
import mock from './mock';

import {
  ADD_UNIT,
  RENAME_UNIT,
  REMOVE_UNIT,
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
        list => list.push(fromJS(action.section))
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
        list => list.push(fromJS(action.subsection))
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

    case ADD_UNIT:
      return course.updateIn([
        'sections',
        action.sectionId,
        'subsections',
        action.subsectionId,
        'units',
      ],
        Immutable.List.of(),
        list => list.push(fromJS(action.unit))
      );

    case RENAME_UNIT:
      return course.setIn([
        'sections',
        action.sectionId,
        'subsections',
        action.subsectionId,
        'units',
        action.unitId,
        'name',
      ],
        action.name
      );

    case REMOVE_UNIT:
      return course.deleteIn([
        'sections',
        action.sectionId,
        'subsections',
        action.subsectionId,
        'units',
        action.unitId,
      ]);

    default:
      return course;
  }
}

export default courseReducer;
