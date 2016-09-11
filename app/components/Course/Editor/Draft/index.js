import React, { Component } from 'react';

import Button from './Button';

import styles from './styles.css';

class Draft extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.draft}>
        <textarea
          className={styles.text}
          defaultValue="Задание..."
        >
        </textarea>
        <div className={styles.buttons}>
          <Button name="Картинка" />
          <Button name="Видео" />
          <Button name="Тест" />
        </div>
      </div>
    );
  }
}

Draft.propTypes = {};

export default Draft;
