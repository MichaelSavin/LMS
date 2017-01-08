import React, { PropTypes } from 'react';
import { pull, concat, uniq } from 'lodash/fp';
import styles from './styles.css';

const Validator = ({
  rule,
  hint,
  value,
  message,
  children,
  onChange,
}) => {
  // * Локальная валидация *
  // Красная рамка вокруг инпута
  const error = !value || !rule(value);
  return (
    <div className={styles.validator}>
      {React.cloneElement(children, {
        value,
        // Передача функции валидации в changeContent
        onChange: onChange(
          (errors, value) => ({ // eslint-disable-line
            errors: !value || !rule(value)
              // * Глобальная валидация *
              // Общий блок со всеми сообщениями
              // валидаторов вверху компонента
              ? uniq(concat(message, errors))
              : pull(message, errors),
          })
        ),
        className: error ? 'error' : '',
      })}
      {error && hint &&
        <div className={styles.hint}>
          {hint}
        </div>
      }
    </div>
  );
};

Validator.propTypes = {
  rule: PropTypes.func,
  hint: PropTypes.string,
  value: PropTypes.string,
  message: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
};

Validator.defaultProps = {
  rule: (value) => true, // eslint-disable-line
};

export default Validator;
