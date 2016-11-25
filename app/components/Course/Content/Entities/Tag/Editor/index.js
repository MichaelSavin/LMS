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
import Preview from '../Preview';
import styles from './styles.css';

const Editor = ({
  data,
  isOpen,
  addTag,
  dragTag,
  removeTag,
  closeModal,
  saveSettings,
  changeTagText,
  changeTagColor,
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
    <span className={styles.tags}>
      <AntModal
        onOk={validateAndSave}
        title={
          <div className={styles.header}>
            <span>Тэги</span>
            <AntButton
              icon="plus"
              size="small"
              type="default"
              onClick={addTag}
            >
              Добавить тэг
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
            onSortEnd={dragTag}
            useDragHandle
          >
            {data.tags.map((
              tag,
              tagIndex
            ) =>
              <Sortable.Item
                key={tagIndex}
                index={tagIndex}
              >
                <div className={styles.tag}>
                  <Sortable.Handler />
                  <AntSelect
                    value={tag.color}
                    onChange={changeTagColor(tagIndex)}
                    className={styles.color}
                  >
                    {['blue',
                      'red',
                      'green',
                    ].map((color, colorIndex) =>
                      <AntSelect.Option
                        key={colorIndex}
                        value={color}
                      >
                        <div className={styles[color]} />
                      </AntSelect.Option>
                    )}
                  </AntSelect>
                  <div className={styles.text}>
                    <AntForm.Item>
                      {getFieldDecorator(`text.${tagIndex}`, {
                        rules: [{
                          required: true,
                          message: 'Это поле не может быть пустым!',
                        }],
                        initialValue: tag.text,
                      })(
                        <AntInput
                          size="default"
                          onChange={changeTagText(tagIndex)}
                        />
                      )}
                    </AntForm.Item>
                  </div>
                  <AntPopconfirm
                    title="Удалить событие?"
                    okText="Да"
                    onConfirm={removeTag(tagIndex)}
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
          </Sortable.List>
        </div>
        <div className={styles.preview}>
          <div className={styles.title}>
            <p className={styles.line} />
            <span className={styles.text}>
              Предпросмотр
            </span>
          </div>
          <Preview data={data} />
        </div>
      </AntModal>
    </span>
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
  isOpen: PropTypes.bool.isRequired,
  addTag: PropTypes.func.isRequired,
  dragTag: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  changeTagText: PropTypes.func.isRequired,
  changeTagColor: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
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
