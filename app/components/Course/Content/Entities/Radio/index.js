import React, { Component, PropTypes } from 'react';
import styles from './styles.css';

class Radio extends Component {
  render() {
    const { options } = this.props;
    return (
      <div className={styles.container}>
        {options.map((option, index) =>
          <p className={styles.input}>
            <input
              type="radio"
              key={index}
              name="radio"
              className={styles.radio}
            />
            <span
              className={styles.value}
            >
              {option}
            </span>
          </p>
        )}
      </div>
    );
  }
}

Radio.propTypes = {
  options: PropTypes.array.isRequired,
};

export default Radio;
