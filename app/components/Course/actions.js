import {
  ADD_SECTION,
  RENAME_SECTION,
  REMOVE_SECTION,
  ADD_SUBSECTION,
  RENAME_SUBSECTION,
  REMOVE_SUBSECTION,
} from './constants';

export const addSection = ({ section }) => ({
  type: ADD_SECTION,
  section,
});

export const renameSection = ({ sectionId, name }) => ({
  type: RENAME_SECTION,
  sectionId,
  name,
});

export const removeSection = ({ sectionId }) => ({
  type: REMOVE_SECTION,
  sectionId,
});

export const addSubsection = ({ subsection }) => ({
  type: ADD_SUBSECTION,
  subsection,
});

export const renameSubsection = ({ sectionId, subsectionId, name }) => ({
  type: RENAME_SUBSECTION,
  sectionId,
  subsectionId,
  name,
});

export const removeSubsection = ({ sectionId, subsectionId }) => ({
  type: REMOVE_SUBSECTION,
  sectionId,
  subsectionId,
});
