import React, {
  PropTypes,
} from 'react';
import {
  Button as AntButton,
  Select as AntSelect,
  Checkbox as AntCheckbox,
} from 'antd';
import classNames from 'classnames';


import styles from './styles.css';

const Editor = ({
  saveSettings,
  closeEditor,
  onChange,
  style,
}) => (
  <div className={styles.editor}>
    <span className={styles.editorname}>Редактирование</span>
    <div className={styles.options}>
      <div className={styles.item}>
        <div><p>Стиль таблицы:</p></div>
        <AntSelect
          style={{ width: '100%' }}
          defaultValue="big"
          value={classNames({ ...style.table })}
          onChange={onChange('table')}
        >
          <AntSelect.Option value="compact">Компактная горизонтальные разделители</AntSelect.Option>
          <AntSelect.Option value="big">Крупная все разделители</AntSelect.Option>
          <AntSelect.Option value="small">Маленькая, черезполосица без разделителей</AntSelect.Option>
        </AntSelect>
      </div>
      <div className={styles.item}>
        <div><p>Стиль заголовков:</p></div>
        <div>
          <AntSelect
            defaultValue="bold"
            onChange={onChange('head')}
            value={classNames({ ...style.head })}
            style={{ width: '100%' }}
          >
            <AntSelect.Option value="bold">Тектст жирный</AntSelect.Option>
            <AntSelect.Option value="normal">Текст нормальный</AntSelect.Option>
          </AntSelect>
        </div>
      </div>
    </div>
    <AntCheckbox onChange={onChange('hideHeader')} checked={style.hideHeader}>
      Скрыть заголовки
    </AntCheckbox><br />
    <AntCheckbox onChange={onChange('equalColumnsWidth')} checked={style.equalColumnsWidth}>
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
  style: PropTypes.object.isRequired,
};

export default Editor;
