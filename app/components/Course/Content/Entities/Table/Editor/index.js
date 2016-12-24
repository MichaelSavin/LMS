import React, {
  PropTypes,
} from 'react';
import {
  Button as AntButton,
  Checkbox as AntCheckbox,
} from 'antd';

import styles from './styles.css';

const Editor = ({
  saveSettings,
  closeEditor,
  onChange,
  tableStyles,
}) => (
  <div className={styles.editor}>
    <span className={styles.editorname}>Редактирование</span>
    <AntCheckbox onChange={onChange('hideHeader')} checked={tableStyles.hideHeader}>
      Скрыть заголовки
    </AntCheckbox><br />
    <AntCheckbox onChange={onChange('fullWidth')} checked={tableStyles.fullWidth}>
      Таблица во всю ширину
    </AntCheckbox><br />
    <AntCheckbox onChange={onChange('equalColumnsWidth')} checked={tableStyles.equalColumnsWidth}>
      Колонки равной ширины
    </AntCheckbox>
    <div className={styles.buttonwrapper}>
      <AntButton type="primary" onClick={saveSettings}>Применить</AntButton>
      <AntButton type="ghost" onClick={closeEditor}>Отменить</AntButton>
    </div>
  </div>
);

Editor.propTypes = {
  saveSettings: PropTypes.func.isRequired,
  closeEditor: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  tableStyles: PropTypes.object.isRequired,
};

export default Editor;
