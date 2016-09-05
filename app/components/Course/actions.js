import {
  ADD_SECTION,
  REMOVE_SECTION,
  ADD_SUBSECTION,
  REMOVE_SUBSECTION,
} from './constants';

export const addSection = ({ section }) => ({
  type: ADD_SECTION,
  section,
});

export const removeSection = ({ sectionId }) => ({
  type: REMOVE_SECTION,
  sectionId,
});

export const addSubSection = ({ subSection }) => ({
  type: ADD_SUBSECTION,
  subSection,
});

export const removeSubSection = ({ sectionId, subSectionId }) => ({
  type: REMOVE_SUBSECTION,
  sectionId,
  subSectionId,
});
