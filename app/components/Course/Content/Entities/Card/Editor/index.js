import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Form as AntForm,
  Input as AntInput,
  Modal as AntModal,
  Upload as AntUpload,
  Radio,
} from 'antd';
import ReactCrop from 'react-image-crop/dist/ReactCrop';
import 'react-image-crop/dist/ReactCrop.css';
import Preview from '../Preview';
import styles from './styles.css';

const Editor = ({
  data: {
    text,
    title,
    image,
    crop,
    aspect,
  },
  changeData,
  closeModal,
  isOpen,
  onCropComplete,
  removeImage,
  saveSettings,
  storage,
  uploadImage,
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
            {storage[image]
              ?
                <div>
                  <div className={styles.preview}>
                    <ReactCrop
                      src={storage[image]}
                      onComplete={onCropComplete}
                      onAspectRatioChange={onCropComplete}
                      crop={{
                        ...crop,
                        aspect,
                      }}
                    />
                    <AntIcon
                      type="close"
                      onClick={removeImage}
                      className={styles.remove}
                    />
                  </div>
                  <div className={styles.aspects}>
                    Соотношение сторон:&nbsp;&nbsp;
                    <Radio.Group
                      value={aspect}
                      onChange={changeData('aspect')}
                    >
                      <Radio.Button value={16 / 9}>
                        16:9
                      </Radio.Button>
                      <Radio.Button value={4 / 3}>
                        4:3
                      </Radio.Button>
                      <Radio.Button value={1}>
                        1:1
                      </Radio.Button>
                      <Radio.Button value={3 / 4}>
                        3:4
                      </Radio.Button>
                      <Radio.Button value={9 / 16}>
                        9:16
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              :
                <AntUpload
                  type="drag"
                  accept="image/*"
                  onChange={uploadImage}
                  showUploadList={false}
                >
                  <div className={styles.upload}>
                    <div className={styles.icon}>
                      <AntIcon type="inbox" />
                    </div>
                    <div className={styles.hint}>
                      Нажмите или перетащите файлы для загрузки
                    </div>
                  </div>
                </AntUpload>
              }
          </div>
          <div className={styles.title}>
            <AntInput
              size="default"
              value={title}
              onChange={changeData('title')}
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
                  onChange={changeData('text')}
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
  changeData: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onCropComplete: PropTypes.func.isRequired,
  removeImage: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  data: PropTypes.shape({
    text: PropTypes.string.isRequired,
    image: PropTypes.string,
    title: PropTypes.string,
    crop: PropTypes.object,
    aspect: PropTypes.number,
  }).isRequired,
  form: PropTypes.shape({
    resetFields: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
  }).isRequired,
  storage: PropTypes.object.isRequired,
};

export default AntForm.create()(Editor);
