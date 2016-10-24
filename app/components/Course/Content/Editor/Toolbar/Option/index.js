import React, {
  Component,
  PropTypes,
} from 'react';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class Option extends Component {

  render() {
    const {
      value,
      active,
      onClick,
      children,
    } = this.props;
    return (
      <div
        className={`${styles.option} ${active ? styles.active : ''}`}
        onClick={() => onClick(value)}
      >
        {children}
      </div>
    );
  }
}

Option.propTypes = {
  value: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
};

export default Option;
