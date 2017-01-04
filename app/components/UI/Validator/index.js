import React, { PropTypes } from 'react';
import styles from './styles.css';

const Validator = ({
  rule,
  hint,
  value,
  message,
  children,
  onChange,
}) => {
  const error = !value || !rule(value);
  return (
    <div className={styles.validator}>
      {React.cloneElement(children, {
        value,
        // Передача функции валидации в changeContent
        onChange: onChange(
          (errors, value) => ({ // eslint-disable-line
            errors: !value || !rule(value)
              ? errors.add(hint)
              : errors.delete(hint),
          })
        ),
        className: error ? 'error' : '',
      })}
      { error && message &&
        <div className={styles.message}>
          {message}
        </div>
      }
    </div>
  );
};

Validator.propTypes = {
  rule: PropTypes.func,
  hint: PropTypes.string.isRequired,
  value: PropTypes.string,
  message: PropTypes.string,
  children: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
};

Validator.defaultProps = {
  rule: (value) => true, // eslint-disable-line
};

export default Validator;
