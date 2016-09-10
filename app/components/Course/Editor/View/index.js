import React, { Component } from 'react';

import styles from './styles.css';

class View extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.view}>
        Блок предосмотра
      </div>
    );
  }
}

View.propTypes = {};

export default View;
