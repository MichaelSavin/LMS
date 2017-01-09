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
  changeStyle,
  ...props
}) => (
  <div className={styles.editor}>
    <span className={styles.name}>Редактирование</span>
    <div className={styles.options}>
      <div className={styles.item}>
        <div><p>Стиль таблицы:</p></div>
        <AntSelect
          style={{ width: '100%' }}
          defaultValue="big"
          value={props.styles.body}
          onChange={changeStyle('body')}
        >
          <AntSelect.Option value="compact">
            Компактная горизонтальные разделители
          </AntSelect.Option>
          <AntSelect.Option value="big">
            Крупная все разделители
          </AntSelect.Option>
          <AntSelect.Option value="small">
            Маленькая, черезполосица без разделителей
          </AntSelect.Option>
        </AntSelect>
      </div>
      <div className={styles.item}>
        <div><p>Стиль заголовков:</p></div>
        <div>
          <AntSelect
            defaultValue="bold"
            onChange={changeStyle('head')}
            value={props.styles.head}
            style={{ width: '100%' }}
          >
            <AntSelect.Option value="bold">
              Тектст жирный
            </AntSelect.Option>
            <AntSelect.Option value="normal">
              Текст нормальный
            </AntSelect.Option>
          </AntSelect>
        </div>
      </div>
    </div>
    <div>
      <AntCheckbox
        onChange={changeStyle('isHeaderHide')}
        checked={props.styles.isHeaderHide}
      >
        Скрыть заголовки
      </AntCheckbox>
    </div>
    <div>
      <AntCheckbox
        onChange={changeStyle('equalColumnsWidth')}
        checked={props.styles.equalColumnsWidth}
      >
        Колонки равной ширины
      </AntCheckbox>
    </div>
    <div className={styles.confirms}>
      <AntButton type="primary" onClick={saveSettings}>
        Применить
      </AntButton>
      <AntButton type="ghost" onClick={closeEditor}>
        Отменить
      </AntButton>
    </div>
  </div>
);

Editor.propTypes = {
  closeEditor: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  changeStyle: PropTypes.func.isRequired,
  styles: PropTypes.shape({
    head: PropTypes.oneOf([
      'bold',
      'normal',
    ]).isRequired,
    body: PropTypes.oneOf([
      'big',
      'small',
      'compact',
    ]).isRequired,
    isHeaderHide: PropTypes.bool,
    equalColumnsWidth: PropTypes.bool,
  }).isRequired,
};

export default Editor;
