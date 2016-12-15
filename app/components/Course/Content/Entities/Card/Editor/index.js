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
import classNames from 'classnames';
import Preview from '../Preview';
import styles from './styles.css';

const Editor = ({
  data: {
    text,
    title,
    image,
  },
  isOpen,
  storage,
  changeText,
  closeModal,
  uploadImage,
  removeImage,
  changeTitle,
  saveSettings,
  form: {
    resetFields,
    validateFields,
    getFieldDecorator,
 },
 data,
}) => {
  const checkUploads = (_, __, callback) => {
    if (image) {
      callback();
    } else {
      callback('Необходимо загрузить изображение!');
    }
  };
  const validateAndSave = () => {
    resetFields();
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
          <div
            className={classNames(
              styles.uploader,
              { [styles.success]: image }
            )}
          >
            <AntForm.Item>
              {getFieldDecorator('image', {
                rules: [{ validator: checkUploads }],
                validateTrigger: 'onError',
              })(
                <AntUpload
                  type="drag"
                  accept="image/*"
                  onChange={uploadImage}
                  showUploadList={false}
                >
                  {image
                    ?
                      <div className={styles.preview}>
                        <img
                          src={storage[image]}
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
                </AntUpload>
              )}
            </AntForm.Item>
          </div>
          <div className={styles.title}>
            <AntInput
              size="default"
              value={title}
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
                initialValue: text,
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
              placement="modal"
              dimensions={{ fullscreen: true }}
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
