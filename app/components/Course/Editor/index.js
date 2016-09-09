import React, { PropTypes } from 'react';

import styles from './styles.css';

const Editor = ({
  params: {
    sectionId,
    subsectionId,
    unitId,
  },
}) => (
  <div className={styles.editor}>
    {sectionId} : {subsectionId} : {unitId}
  </div>
);

Editor.propTypes = {
  params: PropTypes.shape({
    sectionId: PropTypes.string.isRequired,
    subsectionId: PropTypes.string.isRequired,
    unitId: PropTypes.string.isRequired,
  }).isRequired,
};

export default Editor;
