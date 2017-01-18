import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Form as AntForm,
  Input as AntInput,
  Modal as AntModal,
  Radio as AntRadio,
  Upload as AntUpload,
} from 'antd';
import Crop from 'react-image-crop/dist/ReactCrop';
import 'react-image-crop/dist/ReactCrop.css';
import Preview from '../Preview';
import styles from './styles.css';

const Editor = ({
  content: {
    image,
  },
  isOpen,
  content,
  storage,
  createCrop,
  closeEditor,
  uploadImage,
  removeImage,
  saveContent,
  changeContent,
  form: {
    resetFields,
    validateFields,
    getFieldDecorator,
 },
}) => {
  const validateAndSave = () => {
    validateFields((err) => {
      if (!err) { saveContent(); }
    });
  };
  const resetAndClose = () => {
    resetFields();
    closeEditor();
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
            {image && storage.image[image.source]
              ?
                <div>
                  <div className={styles.preview}>
                    <Crop
                      src={storage.image[image.source]}
                      crop={image.crop}
                      onComplete={createCrop}
                      onAspectRatioChange={createCrop}
                    />
                    <AntIcon
                      type="close"
                      onClick={removeImage}
                      className={styles.remove}
                    />
                  </div>
                  {image.crop &&
                    <div className={styles.aspects}>
                      Соотношение сторон:
                      <AntRadio.Group
                        value={image.crop.aspect}
                        onChange={changeContent([
                          'image',
                          'crop',
                          'aspect',
                        ])}
                      >
                        {[{ name: '16:9', value: 16 / 9 },
                          { name: '4:3', value: 4 / 3 },
                          { name: '1:1', value: 1 },
                          { name: '3:4', value: 3 / 4 },
                          { name: '9:16', value: 9 / 16 },
                          { name: 'Нет', value: false },
                        ].map(({ name, value }) =>
                          <AntRadio.Button
                            key={name}
                            value={value}
                          >
                            {name}
                          </AntRadio.Button>
                        )}
                      </AntRadio.Group>
                    </div>
                  }
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
          {image &&
            <div className={styles.alt}>
              <AntForm.Item>
                {getFieldDecorator('image.text', {
                  rules: [{
                    required: true,
                    message: 'Это поле не может быть пустым!',
                  }],
                  initialValue: image.text,
                })(
                  <AntInput
                    size="default"
                    onChange={changeContent(['image', 'text'])}
                    placeholder="Альтернативный текст для изображения"
                  />
                )}
              </AntForm.Item>
            </div>
          }
        </div>
        {image &&
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
                size="auto"
                content={content}
                storage={storage}
                placement="editor"
              />
            </div>
          </div>
        }
      </div>
    </AntModal>
  );
};

Editor.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  createCrop: PropTypes.func.isRequired,
  closeEditor: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  removeImage: PropTypes.func.isRequired,
  saveContent: PropTypes.func.isRequired,
  changeContent: PropTypes.func.isRequired,
  content: PropTypes.shape({
    image: PropTypes.shape({
      source: PropTypes.string.isRequired,
      text: PropTypes.string,
      crop: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        pixels: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
          width: PropTypes.number.isRequired,
          height: PropTypes.number.isRequired,
        }).isRequired,
        aspect: PropTypes.oneOf([
          false,
          16 / 9,
          4 / 3,
          1,
          3 / 4,
          9 / 16,
        ]),
      }),
    }),
  }).isRequired,
  form: PropTypes.shape({
    resetFields: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
  }).isRequired,
  storage: PropTypes.shape({
    image: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
    crop: PropTypes.shape({
      editor: PropTypes.objectOf(
        PropTypes.string.isRequired,
      ).isRequired,
      component: PropTypes.objectOf(
        PropTypes.string.isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default AntForm.create()(Editor);
