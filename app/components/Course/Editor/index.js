import React, { Component, PropTypes } from 'react';

import { Link } from 'react-router';

import Icon from 'components/UI/Icon';

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
      actions,
      children,
    } = this.props;
    const route = `${sectionId}-${subsectionId}-${unitId}`;
    const unit = data
      .sections[sectionId]
      .subsections[subsectionId]
      .units[unitId];
    return (
      <div className={styles.editor}>
        <div className={styles.title}>
          <div className={styles.name}>
            {unit.name}
            <Icon
              size={15}
              type="edit"
              action={() =>
                renameUnit({
                  sectionId,
                  subsectionId,
                  unitId,
                  name: prompt('Название блока', unit.name) || 'Блок',
                })
              }
            />
          </div>
          <div className={styles.selectors}>
            <Link
              to={`/${route}/draft`}
              className={styles.selector}
              activeStyle={{ textDecoration: 'underline' }}
            >
              Редактор
            </Link>
            <Link
              to={`/${route}/view`}
              className={styles.selector}
              activeStyle={{ textDecoration: 'underline' }}
            >
              Просмотр
            </Link>
          </div>
        </div>
        {React.cloneElement(children, {
          unit: {
            sectionId,
            subsectionId,
            unitId,
          },
          content: unit.content,
          actions,
        })}
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
  children: PropTypes.element,
};

export default Editor;
