import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.css';

const Option = ({
  value,
  active,
  inPopup,
  onClick,
  children,
  disabled,
}) =>
  <div
    className={classNames(
      inPopup
        ? styles.popupOption
        : styles.option, {
          [inPopup
            ? styles.popupActive
            : styles.active
          ]: active,
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
  inPopup: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.any.isRequired,
};

export default Option;
