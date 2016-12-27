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
  tableStyles,
}) => (
  <div className={styles.editor}>
    <span className={styles.editorname}>Редактирование</span>
    <div className={styles.options}>
      <div className={styles.item}>
        <dvi><p>Стиль таблицы:</p></dvi>
        <AntSelect
          style={{ width: '100%' }}
          defaultValue="table__big"
          value={classNames({ ...tableStyles.tableOptions })}
          onChange={onChange('tableOptions')}
        >
          <AntSelect.Option value="table__compact">Компактная горизонтальные разделители</AntSelect.Option>
          <AntSelect.Option value="table__big">Крупная все разделители</AntSelect.Option>
          <AntSelect.Option value="table__small">Маленькая, черезполосица без разделителей</AntSelect.Option>
        </AntSelect>
      </div>
      <div className={styles.item}>
        <dvi><p>Стиль заголовков:</p></dvi>
        <div>
          <AntSelect
            defaultValue="table-head__bold"
            onChange={onChange('headOptions')}
            value={classNames({ ...tableStyles.headOptions })}
            style={{ width: '100%' }}
          >
            <AntSelect.Option value="table-head__bold">Тектст жирный</AntSelect.Option>
            <AntSelect.Option value="table-head__normal">Текст нормальный</AntSelect.Option>
          </AntSelect>
        </div>
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
