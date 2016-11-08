import {
  ADD_UNIT,
  EDIT_UNIT,
  RENAME_UNIT,
  REMOVE_UNIT,
  ADD_SECTION,
  RENAME_SECTION,
  REMOVE_SECTION,
  ADD_SUBSECTION,
  RENAME_SUBSECTION,
  REMOVE_SUBSECTION,
  IMPORT_COURSE,
} from './constants';

export const addSection = ({
  section,
}) => ({
  type: ADD_SECTION,
  section,
});

export const renameSection = ({
  sectionId,
  name,
}) => ({
  type: RENAME_SECTION,
  sectionId,
  name,
});

export const removeSection = ({
  sectionId,
 }) => ({
   type: REMOVE_SECTION,
   sectionId,
 });

export const addSubsection = ({
  sectionId,
  subsection,
}) => ({
  type: ADD_SUBSECTION,
  sectionId,
  subsection,
});

export const renameSubsection = ({
  sectionId,
  subsectionId,
  name,
}) => ({
  type: RENAME_SUBSECTION,
  sectionId,
  subsectionId,
  name,
});

export const removeSubsection = ({
  sectionId,
  subsectionId,
}) => ({
  type: REMOVE_SUBSECTION,
  sectionId,
  subsectionId,
});

export const addUnit = ({
  sectionId,
  subsectionId,
  unit,
}) => ({
  type: ADD_UNIT,
  sectionId,
  subsectionId,
  unit,
});

export const editUnit = ({
  sectionId,
  subsectionId,
  unitId,
  content,
}) => ({
  type: EDIT_UNIT,
  sectionId,
  subsectionId,
  unitId,
  content,
});

export const renameUnit = ({
  sectionId,
  subsectionId,
  unitId,
  name,
}) => ({
  type: RENAME_UNIT,
  sectionId,
  subsectionId,
  unitId,
  name,
});

export const removeUnit = ({
  sectionId,
  subsectionId,
  unitId,
}) => ({
  type: REMOVE_UNIT,
  sectionId,
  subsectionId,
  unitId,
});

export const importCourse = ({
  course,
}) => ({
  type: IMPORT_COURSE,
  course,
});
