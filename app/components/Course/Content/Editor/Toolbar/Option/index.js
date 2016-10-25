import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.css';

const Option = ({
  value,
  active,
  onClick,
  children,
  disabled,
}) =>
  <div
    className={classNames(
      styles.option, {
        [styles.active]: active,
        [styles.disabled]: disabled,
      }
    )}
    onClick={() => onClick(value)}
  >
    {children}
  </div>;


Option.propTypes = {
  value: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.any.isRequired,
};

export default Option;
