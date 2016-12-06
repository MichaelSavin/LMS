import React, {
  Component,
  PropTypes,
} from 'react';
import styles from './styles.css';

class Popup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  render() {
    const {
      popup,
      onBlur,
      changeTeX,
      data: { tex },
    } = this.props;
    return popup ? (
      <div
        className={styles.tooltip}
      >
        <div className="ant-tooltip-content">
          <div className={styles.arrow} />
          <div className="ant-tooltip-inner">
            <input
              autoFocus
              placeholder="asdf"
              onChange={changeTeX}
              onBlur={onBlur}
              defaultValue={tex}
            />
          </div>
        </div>
      </div>
    ) : null;
  }
}

Popup.propTypes = {
  popup: PropTypes.bool,
  onBlur: PropTypes.func.isRequired,
  changeTeX: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tex: PropTypes.string.isRequired,
  }).isRequired,
};

export default Popup;
