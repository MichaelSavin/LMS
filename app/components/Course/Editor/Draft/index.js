import React, { Component, PropTypes } from 'react';

import Button from 'components/UI/Button';

import styles from './styles.css';

class Draft extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      actions: {
        editUnit,
      },
      unit: {
        sectionId,
        subsectionId,
        unitId,
      },
      content,
    } = this.props;
    return (
      <div className={styles.draft}>
        <textarea
          className={styles.text}
          onChange={(event) => {
            editUnit({
              sectionId,
              subsectionId,
              unitId,
              content: event.target.value,
            });
          }}
          value={content}
        >
        </textarea>
        <div className={styles.buttons}>
          <Button
            action={() => alert('Тест')}
            name="Тест"
            icon="quiz"
          />
          <Button
            action={() => alert('Картинка')}
            name="Картинка"
            icon="image"
          />
          <Button
            action={() => alert('Видео')}
            name="Видео"
            icon="video"
          />
        </div>
      </div>
    );
  }
}

Draft.propTypes = { // http://stackoverflow.com/a/33427304
  actions: PropTypes.object,
  unit: PropTypes.shape({
    sectionId: PropTypes.string.isRequired,
    subsectionId: PropTypes.string.isRequired,
    unitId: PropTypes.string.isRequired,
  }),
  content: PropTypes.string,
};

export default Draft;
