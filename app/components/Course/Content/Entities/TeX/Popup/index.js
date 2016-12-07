import React, {
  Component,
  PropTypes,
} from 'react';
import { Icon } from 'antd';
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
      popupError,
      onCancel,
      onSave,
      changeTeX,
      data: { tex },
    } = this.props;
    return popup ? (
      <div
        className={styles.tooltip}
      >
        <div className="ant-tooltip-content">
          <div className={styles.arrow} />
          <div className={styles.tooltipInner}>
            <input
              className={popupError.message && styles.error}
              autoFocus
              placeholder="asdf"
              onChange={changeTeX}
              defaultValue={tex}
            />
            &nbsp;&nbsp;
            <Icon onClick={onCancel} className={styles.cancelBtn} type="close" />
            &nbsp;
            {!popupError.message && <Icon onClick={onSave} className={styles.confirmBtn} type="check" />}
          </div>
        </div>
      </div>
    ) : null;
  }
}

Popup.propTypes = {
  popup: PropTypes.bool,
  popupError: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  changeTeX: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tex: PropTypes.string.isRequired,
  }).isRequired,
};

export default Popup;
