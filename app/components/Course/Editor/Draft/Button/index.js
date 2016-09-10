import React, { PropTypes } from 'react';

import styles from './styles.css';

const Button = ({ name }) => (
  <div className={styles.button}>
    🔨 {name}
  </div>
);

Button.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Button;
