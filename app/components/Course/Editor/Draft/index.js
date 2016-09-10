import React, { Component } from 'react';

import Button from './Button';

import styles from './styles.css';

class Draft extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.draft}>
        <textarea className={styles.text}>
          Задание...
        </textarea>
        <div className={styles.buttons}>
          <Button name="Картинка" icon="" />
          <Button name="Видео" icon="" />
          <Button name="Тест" icon="" />
        </div>
      </div>
    );
  }
}

Draft.propTypes = {};

export default Draft;
