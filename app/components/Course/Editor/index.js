import React, { Component, PropTypes } from 'react';

import styles from './styles.css';

export class Editor extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      data,
      params: {
        sectionId,
        subsectionId,
        unitId,
      },
    } = this.props;
    return (
      <div className={styles.editor}>
        <div className={styles.title}>
          {data.sections[sectionId].subsections[subsectionId].units[unitId].name}
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  data: PropTypes.object, // http://stackoverflow.com/a/33427304
  params: PropTypes.shape({
    sectionId: PropTypes.string.isRequired,
    subsectionId: PropTypes.string.isRequired,
    unitId: PropTypes.string.isRequired,
  }).isRequired,
};

export default Editor;
