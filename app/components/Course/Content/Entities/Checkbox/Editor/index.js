import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Form as AntForm,
  Tabs as AntTabs,
  Input as AntInput,
  Button as AntButton,
  Collapse as AntCollapse,
  Checkbox as AntCheckbox,
  Popconfirm as AntPopconfirm,
} from 'antd';
import {
  SortableHandle,
  SortableElement,
  SortableContainer,
} from 'react-sortable-hoc';
import ImmutablePropTypes from
  'react-immutable-proptypes';
import Dropzone from 'react-dropzone';
import styles from './styles.css';

const Editor = ({
  content,
  storage,
  addOption,
  dragOption,
  closeEditor,
  saveContent,
  removeOption,
  changeContent,
  uploadOptionImage,
  removeOptionImage,
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
    <div className={styles.editor}>
      <div className={styles.title}>
        Редактирование компонента
      </div>
      <AntTabs
        className={styles.tabs}
      >
        <AntTabs.TabPane
          key="1"
          tab="Задание"
        >
          <AntForm.Item>
            {getFieldDecorator('question', {
              rules: [{
                required: true,
                message: 'Это поле не может быть пустым!',
              }],
              initialValue: content.get('question'),
            })(
              <AntInput
                rows={4}
                size="default"
                type="textarea"
                onChange={changeContent(['question'])}
                className={styles.question}
              />
            )}
          </AntForm.Item>
          <AntCollapse
            bordered={false}
            className={styles.collapse}
            defaultActiveKey="1"
          >
            <AntCollapse.Panel
              key="1"
              header={content
                .get('options')
                .filter((option) =>
                  option.get('correct') === true
                ).isEmpty()
                  ? 'Варианты ответов не заданы'
                  : 'Заданы'
              }
            >
              <div className={styles.options}>
                <Sortable.List
                  onSortEnd={dragOption}
                  useDragHandle
                >
                  {content.get('options').map((option, index) =>
                    <div
                      key={index}
                      className={styles.option}
                    >
                      <Sortable.Item index={index}>
                        <div className={styles.drag}>
                          <Sortable.Handler />
                        </div>
                        <div className={styles.text}>
                          <AntForm.Item>
                            {getFieldDecorator(`option.${index}.text`, {
                              rules: [{
                                required: true,
                                message: 'Укажите текст варианта ответа!',
                              }],
                              initialValue: option.get('text'),
                            })(
                              <AntInput
                                size="default"
                                onChange={changeContent([
                                  'options',
                                  index,
                                  'text',
                                ])}
                              />
                            )}
                          </AntForm.Item>
                        </div>
                        <div className={styles.image}>
                          {option.get('image')
                            /* eslint-disable */
                            ? <div className={styles.preview}>
                                <img
                                  src={storage[
                                    option.getIn([
                                      'image',
                                      'name',
                                    ])
                                  ]}
                                  role="presentation"
                                />
                                <AntIcon
                                  type="close"
                                  onClick={removeOptionImage(index)}
                                  className={styles.remove}
                                />
                              </div>
                            : <div className={styles.upload}>
                                <Dropzone
                                  onDrop={uploadOptionImage(index)}
                                  multiple={false}
                                  className={styles.dropzone}
                                />
                                <AntIcon
                                  className={styles.icon}
                                  type="camera"
                                />
                              </div>
                            /* eslint-enable */
                          }
                        </div>
                        <div className={styles.checkbox}>
                          <AntCheckbox
                            key={index}
                            checked={option.get('correct')}
                            onChange={changeContent([
                              'options',
                              index,
                              'correct',
                            ])}
                          />
                        </div>
                        <div className={styles.remove}>
                          <AntPopconfirm
                            title="Удалить событие?"
                            okText="Да"
                            onConfirm={removeOption(index)}
                            cancelText="Нет"
                          >
                            <AntIcon
                              type="close"
                              className={styles.icon}
                            />
                          </AntPopconfirm>
                        </div>
                      </Sortable.Item>
                    </div>
                  )}
                  <AntButton
                    type="primary"
                    onClick={addOption}
                  >
                    + Добавить вариант
                  </AntButton>
                </Sortable.List>
              </div>
            </AntCollapse.Panel>
          </AntCollapse>
        </AntTabs.TabPane>
        <AntTabs.TabPane key="2" tab="Баллы">
          Содержание
        </AntTabs.TabPane>
      </AntTabs>
      <div className={styles.actions}>
        <AntButton
          type="primary"
          icon="check"
          onClick={validateAndSave}
          className={styles.save}
        >
          Сохранить
        </AntButton>
        <AntButton
          type="default"
          icon="rollback"
          onClick={resetAndClose}
          className={styles.cancel}
        >
          Отменить
        </AntButton>
      </div>
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
  addOption: PropTypes.func.isRequired,
  dragOption: PropTypes.func.isRequired,
  closeEditor: PropTypes.func.isRequired,
  saveContent: PropTypes.func.isRequired,
  removeOption: PropTypes.func.isRequired,
  changeContent: PropTypes.func.isRequired,
  removeOptionImage: PropTypes.func.isRequired,
  uploadOptionImage: PropTypes.func.isRequired,
  content: ImmutablePropTypes.mapContains({
    question: PropTypes.string.isRequired,
    options: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        text: PropTypes.string,
        image: ImmutablePropTypes.mapContains({
          name: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
          crop: ImmutablePropTypes.mapContains({
            size: PropTypes.object.isRequired,
            name: PropTypes.string.isRequired,
          }),
        }),
        checked: PropTypes.bool.isRequired,
        correct: PropTypes.bool.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  storage: PropTypes.shape({
    images: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
    crops: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
  }).isRequired,
};

export default AntForm.create()(Editor);
