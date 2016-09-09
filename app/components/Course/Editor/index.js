import React, { Component, PropTypes } from 'react';

import Edit from 'components/UI/Icons/pencil';

import styles from './styles.css';

export class Editor extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      data,
      actions: {
        renameUnit,
      },
      params: {
        sectionId,
        subsectionId,
        unitId,
      },
    } = this.props;
    const name = data
      .sections[sectionId]
      .subsections[subsectionId]
      .units[unitId]
      .name;
    return (
      <div className={styles.editor}>
        <div className={styles.title}>
          <div className={styles.name}>
            {name}
            <Edit
              size={15}
              action={() =>
                renameUnit({
                  sectionId,
                  subsectionId,
                  unitId,
                  name: prompt('Название блока', name) || 'Блок',
                })
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  data: PropTypes.object,    // http://stackoverflow.com/a/33427304
  actions: PropTypes.shape({ // http://stackoverflow.com/a/33427304
    renameUnit: PropTypes.func.isRequired,
  }),
  params: PropTypes.shape({
    sectionId: PropTypes.string.isRequired,
    subsectionId: PropTypes.string.isRequired,
    unitId: PropTypes.string.isRequired,
  }).isRequired,
};

export default Editor;
