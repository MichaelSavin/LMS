import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Form as AntForm,
  Input as AntInput,
  Modal as AntModal,
  Upload as AntUpload,
} from 'antd';
import Preview from '../Preview';
import styles from './styles.css';

const Editor = ({
  data,
  isOpen,
  changeText,
  closeModal,
  uploadImage,
  changeTitle,
  saveSettings,
  form: {
    resetFields,
    validateFields,
    getFieldDecorator,
 },
 storage,
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
  return (
    <div className={styles.editor}>
      <AntModal
        onOk={validateAndSave}
        title={
          <div className={styles.header}>
            <span>Карточка</span>
          </div>
        }
        okText="Сохранить"
        visible={isOpen}
        onCancel={resetAndClose}
        cancelText="Отмена"
      >
        <div className={styles.content}>
          <div className={styles.image}>
            <AntUpload.Dragger
              accept="image/*"
              onChange={uploadImage}
              showUploadList={false}
            >
              <div className={styles.icon}>
                <AntIcon type="inbox" />
              </div>
              <div className={styles.hint}>
                Нажмите или перетащите файлы для загрузки
              </div>
            </AntUpload.Dragger>
          </div>
          <div className={styles.title}>
            <AntInput
              size="default"
              value={data.title}
              onChange={changeTitle}
            />
          </div>
          <div className={styles.text}>
            <AntForm.Item>
              {getFieldDecorator('text', {
                rules: [{
                  required: true,
                  message: 'Это поле не может быть пустым!',
                }],
                initialValue: data.text,
              })(
                <AntInput
                  rows={4}
                  type="textarea"
                  onChange={changeText}
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
            <Preview
              data={data}
              storage={storage}
            />
          </div>
        </div>
      </AntModal>
    </div>
  );
};

Editor.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  changeText: PropTypes.func.isRequired,
  changeTitle: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  data: PropTypes.shape({
    text: PropTypes.string.isRequired,
    image: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  form: PropTypes.shape({
    resetFields: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
  }).isRequired,
  storage: PropTypes.object.isRequired,
};

export default AntForm.create()(Editor);
