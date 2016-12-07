import React, {
  Component,
  PropTypes,
} from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';
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
      isOpen,
      error,
      cancelTeX,
      saveTeX,
      changeTeX,
      data: { tex },
    } = this.props;
    return isOpen ? (
      <div
        className={styles.tooltip}
      >
        <div className="ant-tooltip-content">
          <div className={styles.arrow} />
          <div className={styles.innerField}>
            <input
              className={classNames(
                styles.tex,
                { [styles.error]: error.message }
              )}
              autoFocus
              onChange={changeTeX}
              defaultValue={tex}
            />
            &nbsp;&nbsp;
            <Icon
              onClick={cancelTeX}
              className={classNames(
                styles.button,
                styles.cancel,
              )}
              type="close"
            />
            &nbsp;
            {!error.message && <Icon
              onClick={saveTeX}
              className={classNames(
                styles.button,
                styles.confirm,
              )}
              type="check"
            />}
          </div>
        </div>
      </div>
    ) : null;
  }
}

Popup.propTypes = {
  isOpen: PropTypes.bool,
  error: PropTypes.object.isRequired,
  cancelTeX: PropTypes.func.isRequired,
  saveTeX: PropTypes.func.isRequired,
  changeTeX: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tex: PropTypes.string.isRequired,
  }).isRequired,
};

export default Popup;
