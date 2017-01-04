import React, { PropTypes } from 'react';
import styles from './styles.css';

const Validator = ({
  rule = () => true,
  hint,
  value,
  // message = 'Это поле не может быть пустым',
  children,
  onChange,
}) => {
  const error = !value || !rule;
  return (
    <div className={styles.validator}>
      {React.cloneElement(children, {
        value,
        onChange: onChange({
          rule,
          message: hint,
        }),
        className: error ? 'error' : '',
      })}
      { /* error &&
        <div className={styles.message}>
          {message}
        </div>
      */ }
    </div>
  );
};

Validator.propTypes = {
  rule: PropTypes.func,
  hint: PropTypes.string.isRequired,
  value: PropTypes.string,
  // message: PropTypes.string,
  children: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Validator;
