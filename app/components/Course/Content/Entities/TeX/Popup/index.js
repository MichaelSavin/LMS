import React, {
  PropTypes,
} from 'react';
import { Icon } from 'antd';
import katex from 'katex';
import classNames from 'classnames';
import styles from './styles.css';

const Popup = ({
  saveData,
  changeData,
  closeEditor,
  data: { tex },
}) => {
  const isTexValid = (value) => {
    try {
      katex.__parse(value); // eslint-disable-line
      return value !== '';
    } catch (error) {
      return false;
    }
  };
  return (
    <div className={styles.tooltip}>
      <div className="ant-tooltip-content">
        <div className={styles.arrow} />
        <div className={styles.input}>
          <input
            value={tex}
            onBlur={() => setTimeout(closeEditor, 100)}
            onChange={changeData('tex')}
            autoFocus
            className={classNames(
              styles.tex,
              { [styles.error]: !isTexValid(tex) }
            )}
          />
          {isTexValid(tex) &&
            <Icon
              type="check"
              onClick={saveData}
              className={styles.save}
            />
          }
          <Icon
            type="close"
            onClick={closeEditor}
            className={styles.close}
          />
        </div>
      </div>
    </div>
  );
};

Popup.propTypes = {
  saveData: PropTypes.func.isRequired,
  changeData: PropTypes.func.isRequired,
  closeEditor: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tex: PropTypes.string.isRequired,
  }).isRequired,
};

export default Popup;
