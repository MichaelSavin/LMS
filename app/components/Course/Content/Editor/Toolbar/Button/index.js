import React, { PropTypes } from 'react';

import styles from './styles.css';

const Button = ({
  active,
  label,
  style,
  onToggle,
}) => (
  <span
    className={styles[active ? 'active' : 'inactive']}
    onMouseDown={(event) => {
      event.preventDefault();
      onToggle(style);
    }}
  >
    {label}
  </span>
);

Button.propTypes = {
  style: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Button;
