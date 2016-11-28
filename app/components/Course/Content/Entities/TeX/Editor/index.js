import React, {
  PropTypes,
} from 'react';
import {
  Form as AntForm,
  Input as AntInput,
  Modal as AntModal,
  Button as AntButton,
} from 'antd';
import katex from 'katex';
import Preview from '../Preview';
import styles from './styles.css';

const Editor = ({
  data: { tex },
  isOpen,
  changeTeX,
  closeModal,
  saveSettings,
  form: {
    resetFields,
    validateFields,
    getFieldDecorator,
 },
 data,
}) => {
  const validateAndSave = () => {
    validateFields((err) => {
      if (!err) { saveSettings(); }
    });
  };
  const resetAndClose = () => {
    resetFields();
    closeModal();
  };
  const checkValidity = (_, value, callback) => {
    try {
      katex.__parse(value); // eslint-disable-line
      callback();
    } catch (error) {
      callback('Неверный формат KaTeX. Исправьте формулу или отмените изменения');
    }
  };

  return (
    <AntModal
      onOk={validateAndSave}
      title={
        <div className={styles.header}>
          <span>Формула (KaTeX)</span>
          <AntButton
            size="small"
            type="default"
          >
            Смотреть докуметацию
          </AntButton>
        </div>
      }
      okText="Сохранить"
      visible={isOpen}
      onCancel={resetAndClose}
      cancelText="Отмена"
    >
      <div className={styles.editor}>
        <div className={styles.tex}>
          <AntForm.Item>
            {getFieldDecorator('text', {
              rules: [{
                required: true,
                message: 'Это поле не может быть пустым!',
              }, {
                validator: checkValidity,
              }],
              initialValue: tex,
            })(
              <AntInput
                rows={3}
                type="textarea"
                onChange={changeTeX}
              />
            )}
          </AntForm.Item>
        </div>
      </div>
      <div className={styles.preview}>
        <div className={styles.title}>
          <p className={styles.line} />
          <span
            className={styles.text}
          >
            Предпросмотр
          </span>
        </div>
        <div className={styles.component}>
          <Preview data={data} />
        </div>
      </div>
    </AntModal>
  );
};

Editor.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  changeTeX: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tex: PropTypes.string.isRequired,
  }).isRequired,
  form: PropTypes.shape({
    resetFields: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
  }).isRequired,
};

export default AntForm.create()(Editor);
