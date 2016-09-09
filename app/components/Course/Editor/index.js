import React, { PropTypes } from 'react';

import styles from './styles.css';

const Editor = ({
  data,
  params: {
    sectionId,
    subsectionId,
    unitId,
  },
}) => (
  <div className={styles.editor}>
    {data.sections[sectionId].subsections[subsectionId].units[unitId].name}
  </div>
);

Editor.propTypes = {
  data: PropTypes.object, // http://stackoverflow.com/a/33427304
  params: PropTypes.shape({
    sectionId: PropTypes.string.isRequired,
    subsectionId: PropTypes.string.isRequired,
    unitId: PropTypes.string.isRequired,
  }).isRequired,
};

export default Editor;
