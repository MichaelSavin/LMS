import React, {
  PropTypes,
} from 'react';
import {
  Button as AntButton,
  Select as AntSelect,
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
    <div className={styles.options}>
      <div className={styles.item}>
        <p>Стиль таблицы:</p>
        <AntSelect defaultValue="big" style={{ minWidth: '300px' }}>
          <Option value="compact">Компактная горизонтальные разделители</Option>
          <Option value="big">Крупная все разделители</Option>
          <Option value="small">Маленькая, черезполосица без разделителей</Option>
        </AntSelect>
      </div>
      <div className={styles.item}>
        <p>Стиль заголовков:</p>
        <AntSelect defaultValue="textBold" style={{ minWidth: '300px' }}>
          <Option value="textBold">Тектст жирный</Option>
          <Option value="textNormal">Текст нормальный</Option>
        </AntSelect>
      </div>
    </div>
    <AntCheckbox onChange={onChange('hideHeader')} checked={tableStyles.hideHeader}>
      Скрыть заголовки
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
