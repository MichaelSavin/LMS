import React, { Component, PropTypes } from 'react';

import Button from 'components/UI/Button';

import styles from './styles.css';

class Draft extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.draft}>
        <textarea
          className={styles.text}
          onChange={() => {}}
          value={this.props.data}
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

Draft.propTypes = {
  data: PropTypes.string, // http://stackoverflow.com/a/33427304
};

export default Draft;
