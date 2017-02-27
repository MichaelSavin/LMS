import React, {
  PropTypes,
} from 'react';
import {
  Input,
} from 'antd';
import styles from './styles.css';

const Edit = ({
  data,
  inputChange,
}) => (
  <div className={styles.editor}>
    <span className={styles.name}>Редактирование</span>
    <div className={styles.input}>
      <Input
        placeholder="Ссылка на видео"
        value={data.url}
        onChange={inputChange('url')}
      />
    </div>
    <div className={styles.input}>
      <Input
        placeholder="Заголовок видео"
        value={data.title}
        onChange={inputChange('title')}
      />
    </div>
    <div className={styles.input}>
      <Input
        placeholder="Размер видео"
        value={data.size}
        onChange={inputChange('size')}
      />
    </div>
    <div className={styles.input}>
      <Input
        type="textarea" autosize={{ minRows: 2 }} placeholder="Описание видео"
        value={data.text}
        onChange={inputChange('text')}
      />
    </div>
  </div>
);

Edit.propTypes = {
  data: PropTypes.object.isRequired,
  inputChange: PropTypes.func.isRequired,
  /*shape({
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
  }).isRequired,*/
};

export default Edit;
