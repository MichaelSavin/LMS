import React, { PropTypes } from 'react';

import styles from './styles.css';

const Editor = ({
  params: {
    sectionId,
    subsectionId,
    unitId,
  },
}) => (
  <div className={styles.exercise}>
    {sectionId} : {subsectionId} : {unitId}
  </div>
);

Editor.propTypes = {
  params: PropTypes.shape({
    sectionId: PropTypes.number.isRequired,
    subsectionId: PropTypes.number.isRequired,
    unitId: PropTypes.number.isRequired,
  }).isRequired,
};

export default Editor;
