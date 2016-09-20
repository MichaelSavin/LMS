import React, { PropTypes } from 'react';

import styles from './styles.css';

const Button = ({
  label,
  style,
  onClick,
  isActive,
}) => (
  <span
    className={styles[isActive ? 'active' : 'inactive']}
    onMouseDown={(event) => {
      event.preventDefault();
      onClick(style);
    }}
  >
    {label}
  </span>
);

Button.propTypes = {
  style: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default Button;
