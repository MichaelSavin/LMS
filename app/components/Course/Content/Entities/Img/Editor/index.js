import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Form as AntForm,
  Modal as AntModal,
  Upload as AntUpload,
} from 'antd';
import ReactCrop from 'react-image-crop/dist/ReactCrop';
import 'react-image-crop/dist/ReactCrop.css';

import Preview from '../Preview';
import styles from './styles.css';

const Editor = ({
  data: {
    name,
    image,
  },
  isOpen,
  storage,
  closeModal,
  uploadImage,
  removeImage,
  saveSettings,
  onCropComplete,
  form: {
    resetFields,
    validateFields,
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
  return (
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
      <div className={styles.editor}>
        <div className={styles.content}>
          <div className={styles.uploader}>
            <AntUpload.Dragger
              accept="image/*"
              onChange={uploadImage}
              showUploadList={false}
            >
              {image
                ?
                  <div className={styles.preview}>
                    <img
                      src={image}
                      role="presentation"
                      className={styles.image}
                    />
                    <AntIcon
                      type="close"
                      onClick={removeImage}
                      className={styles.remove}
                    />
                  </div>
                :
                  <div className={styles.upload}>
                    <div className={styles.icon}>
                      <AntIcon type="inbox" />
                    </div>
                    <div className={styles.hint}>
                      Нажмите или перетащите файлы для загрузки
                    </div>
                  </div>
              }
            </AntUpload.Dragger>
          </div>
          <ReactCrop
            src={storage[name] || image}
            onComplete={onCropComplete}
          />
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
      </div>
    </AntModal>
  );
};

Editor.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onCropComplete: PropTypes.func.isRequired,
  changeText: PropTypes.func.isRequired,
  changeTitle: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  removeImage: PropTypes.func.isRequired,
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
