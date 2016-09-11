import React, { PropTypes } from 'react';

import Icon from 'components/UI/Icon';

import styles from './styles.css';

const Button = ({ action, name, icon }) => (
  <div
    onClick={action}
    className={styles.button}
  >
    <Icon
      size={17.5}
      type={icon}
    />
    {name}
  </div>
);

Button.propTypes = {
  action: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Button;
