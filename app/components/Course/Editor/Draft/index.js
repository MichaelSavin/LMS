import React, { Component } from 'react';

import styles from './styles.css';

class Draft extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.draft}>
        Блок редактора
      </div>
    );
  }
}

Draft.propTypes = {};

export default Draft;
