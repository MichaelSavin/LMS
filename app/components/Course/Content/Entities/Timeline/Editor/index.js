import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Form as AntForm,
  Input as AntInput,
  Modal as AntModal,
  Select as AntSelect,
  Button as AntButton,
  Popconfirm as AntPopconfirm,
} from 'antd';
import {
  SortableHandle,
  SortableElement,
  SortableContainer,
} from 'react-sortable-hoc';
import Icon from 'components/UI/Icon';
import Dropzone from 'react-dropzone';
import Preview from '../Preview';
import styles from './styles.css';

const Editor = ({
  data,
  images,
  isOpen,
  addStep,
  dragStep,
  closeModal,
  removeStep,
  changeText,
  uploadImage,
  changeColor,
  saveSettings,
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
    <AntModal
      onOk={validateAndSave}
      title={
        <div className={styles.title}>
          <span>Шкала времени</span>
          <AntButton
            icon="plus"
            size="small"
            type="default"
            onClick={addStep}
          >
            Добавить новое событие
          </AntButton>
        </div>
      }
      okText="Сохранить"
      visible={isOpen}
      onCancel={resetAndClose}
      cancelText="Отмена"
    >
      <Sortable.List
        onSortEnd={dragStep}
        useDragHandle
      >
        <div className={styles.steps}>
          {data.steps.map((
            step,
            stepIndex
          ) =>
            <Sortable.Item
              key={stepIndex}
              index={stepIndex}
            >
              <div className={styles.step}>
                <Sortable.Handler />
                <AntSelect
                  value={step.color}
                  className={styles.color}
                  onChange={changeColor(stepIndex)}
                >
                  {['blue',
                    'red',
                    'green',
                    ].map((color, optionIndex) =>
                      <AntSelect.Option
                        key={optionIndex}
                        value={color}
                      >
                        <div
                          className={styles[color]}
                        />
                      </AntSelect.Option>
                  )}
                </AntSelect>
                <div className={styles.text}>
                  <AntForm.Item>
                    {getFieldDecorator(`text.${stepIndex}`, {
                      rules: [{
                        required: true,
                        message: 'Это поле не может быть пустым!',
                      }],
                      initialValue: step.text,
                    })(
                      <AntInput
                        size="default"
                        onChange={changeText(stepIndex)}
                      />
                    )}
                  </AntForm.Item>
                </div>
                <div className={styles.image}>
                  <Dropzone
                    multiple={false}
                    onDrop={uploadImage(stepIndex)}
                    className={styles.upload}
                  >
                    {step.image
                      ?
                        <img
                          src={images[step.image]}
                          role="presentation"
                          height={25}
                          width={25}
                        />
                      :
                        <div className={styles.icon}>
                          <Icon
                            size={20}
                            type="photo"
                          />
                        </div>
                    }
                  </Dropzone>
                </div>
                <AntPopconfirm
                  title="Удалить событие?"
                  okText="Да"
                  onConfirm={removeStep(stepIndex)}
                  cancelText="Нет"
                >
                  <AntIcon
                    type="close"
                    className={styles.remove}
                  />
                </AntPopconfirm>
              </div>
            </Sortable.Item>
          )}
          <div className={styles.preview}>
            <span className={styles.title}>
              Предосмотр
            </span>
            <Preview
              data={data}
              images={images}
            />
          </div>
        </div>
      </Sortable.List>
    </AntModal>
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
  images: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  addStep: PropTypes.func.isRequired,
  dragStep: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  removeStep: PropTypes.func.isRequired,
  changeText: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  changeColor: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  data: PropTypes.shape({
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        image: PropTypes.string,
        color: PropTypes.oneOf([
          'blue',
          'red',
          'green',
        ]).isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

export default AntForm.create()(Editor);
