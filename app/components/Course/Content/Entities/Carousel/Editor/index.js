import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Form as AntForm,
  Input as AntInput,
  Modal as AntModal,
  Switch as AntSwitch,
  Button as AntButton,
  Upload as AntUpload,
  Popconfirm as AntPopconfirm,
} from 'antd';
import {
  SortableHandle,
  SortableElement,
  SortableContainer,
} from 'react-sortable-hoc';
import Preview from '../Preview';
import styles from './styles.css';

const Editor = ({
  data,
  cache,
  isOpen,
  addSlide,
  dragSlide,
  closeModal,
  removeSlide,
  saveSettings,
  changeSlideText,
  changeSlideType,
  uploadSlideImage,
  removeSlideImage,
  form: {
    resetFields,
    validateFields,
    getFieldDecorator,
 },
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
    <div className={styles.carousel}>
      <AntModal
        onOk={validateAndSave}
        title={
          <div className={styles.title}>
            <div>Слайды</div>
            <AntButton
              icon="plus"
              size="small"
              type="default"
              onClick={addSlide}
            >
              Добавить слайд
            </AntButton>
          </div>
        }
        okText="Сохранить"
        visible={isOpen}
        onCancel={resetAndClose}
        cancelText="Отмена"
      >
        <div className={styles.editor}>
          <Sortable.List
            onSortEnd={dragSlide}
            useDragHandle
          >
            <div className={styles.slides}>
              {data.slides.map((
                slide,
                index
              ) =>
                <Sortable.Item
                  key={index}
                  index={index}
                >
                  <div className={styles.slide}>
                    <div className={styles.header}>
                      <Sortable.Handler />
                      <div className={styles.title}>
                        Слайд {index + 1}
                      </div>
                      <div className={styles.switch}>
                        <span>Картинка</span>
                        <AntSwitch
                          size="small"
                          checked={{
                            text: true,
                            image: false,
                          }[slide.type]}
                          onChange={changeSlideType(index)}
                        />
                        <span>Текст</span>
                      </div>
                      <AntPopconfirm
                        title="Удалить событие?"
                        okText="Да"
                        onConfirm={removeSlide(index)}
                        cancelText="Нет"
                      >
                        <AntIcon
                          type="close"
                          className={styles.remove}
                        />
                      </AntPopconfirm>
                    </div>
                    {slide.type === 'image'
                      ?
                        <div className={styles.image}>
                          <AntUpload.Dragger
                            accept="image/*"
                            onChange={uploadSlideImage(index)}
                            showUploadList={false}
                          >
                            {slide.image.source
                              ?
                                <div className={styles.preview}>
                                  <img
                                    src={cache[slide.image.source]}
                                    role="presentation"
                                  />
                                  <AntIcon
                                    type="close"
                                    onClick={removeSlideImage(index)}
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
                      : slide.type === 'text'
                        ?
                          <div className={styles.text}>
                            <AntForm.Item>
                              {getFieldDecorator(`text.${index}`, {
                                rules: [{
                                  required: true,
                                  message: 'Это поле не может быть пустым!',
                                }],
                                initialValue: slide.text,
                              })(
                                <AntInput
                                  size="default"
                                  type="textarea"
                                  rows={7}
                                  onChange={changeSlideText(index)}
                                />
                              )}
                            </AntForm.Item>
                          </div>
                        : undefined
                    }
                  </div>
                </Sortable.Item>
              )}
            </div>
          </Sortable.List>
        </div>
        <div className={styles.preview}>
          <div className={styles.title}>
            <p className={styles.line} />
            <span className={styles.text}>
              Предпросмотр
            </span>
          </div>
          <Preview
            data={data}
            cache={cache}
          />
        </div>
      </AntModal>
    </div>
  );
};

const Sortable = {
  List: SortableContainer(
    (props) => <ul>{props.children}</ul>
  ),
  Item: SortableElement(
    (props) => <li>{props.children}</li>
  ),
  Handler: SortableHandle(() =>
    <AntIcon
      type="appstore-o"
      className={styles.drag}
    />
  ),
};

Editor.propTypes = {
  form: PropTypes.shape({
    resetFields: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
  }).isRequired,
  cache: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  addSlide: PropTypes.func.isRequired,
  dragSlide: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  removeSlide: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  changeSlideText: PropTypes.func.isRequired,
  changeSlideType: PropTypes.func.isRequired,
  uploadSlideImage: PropTypes.func.isRequired,
  removeSlideImage: PropTypes.func.isRequired,
  data: PropTypes.shape({
    slides: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf([
          'text',
          'image',
        ]).isRequired,
        text: PropTypes.string,
        image: PropTypes.shape({
          source: PropTypes.string,
          text: PropTypes.string,
        }),
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

export default AntForm.create()(Editor);
