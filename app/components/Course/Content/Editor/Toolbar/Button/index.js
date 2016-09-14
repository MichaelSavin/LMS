import React, { PropTypes, Component } from 'react';

import styles from './styles.css';

class Button extends Component {

  onToggle = (event) => {
    const {
      style,
      onToggle,
    } = this.props;
    event.preventDefault();
    onToggle(style);
  };

  render() {
    const {
      active,
      label,
    } = this.props;
    return (
      <span
        className={styles[active ? 'active' : 'inactive']}
        onMouseDown={this.onToggle}
      >
        {label}
      </span>
    );
  }
}

Button.propTypes = {
  style: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Button;
