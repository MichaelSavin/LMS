import React, { PropTypes } from 'react';

import styles from './styles.css';

const Unit = ({ name, info }) => (
  <div className={styles.unit}>
    <div className={styles.name}>{name}</div>
    <div className={styles.info}>{info}</div>
  </div>
);

Unit.propTypes = {
  name: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
};

export default Unit;
