import { createSelector } from 'reselect';

const selectCourse = () => (state) => state.get('course');

const courseSelector = () => createSelector(
  selectCourse(),
  (course) => ({ course: course.toJS() })
);

export default courseSelector;
