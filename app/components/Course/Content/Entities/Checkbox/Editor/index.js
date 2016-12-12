import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Form as AntForm,
  Input as AntInput,
  Checkbox as AntCheckbox,
  Button as AntButton,
  Popconfirm as AntPopconfirm,
  Collapse as AntCollapse,
  Row, Col,
  Tabs as AntTabs,
} from 'antd';
import {
  SortableHandle,
  SortableElement,
  SortableContainer,
} from 'react-sortable-hoc';
import Dropzone from 'react-dropzone';

import styles from './styles.css';

const Editor = ({
  data,
  addStep,
  images,
  uploadImage,
  isRight,
  saveSettings,
  changeText,
  changeQuestion,
  removeStep,
  removeImage,
  dragStep,
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
  };
  return (
    <div className={styles.editor}>
      <span className={styles.editorname}>Редактирование</span>
      <AntTabs tabBarExtraContent={<AntButton onClick={addStep}>+ Добавить вариант</AntButton>}>
        <AntTabs.TabPane tab="Задание" key="1">
          <div className={styles.question}>
            <AntForm.Item>
              {getFieldDecorator('question', {
                rules: [{
                  required: true,
                  message: 'Это поле не может быть пустым!',
                }],
                initialValue: data.question,
              })(
                <AntInput
                  size="default"
                  className={styles.input}
                  onChange={changeQuestion}
                />
              )}
            </AntForm.Item>
          </div>
          <AntCollapse>
            <AntCollapse.Panel header="Варианты ответа" key="1">
              <Sortable.List
                onSortEnd={dragStep}
                useDragHandle
              >
                <div>
                  {data.answers.map((answer, index) =>
                    <Row key={index}>
                      <Sortable.Item
                        index={index}
                      >
                        <div className={styles.answer}>
                          <Col span={1} className={styles.center}>
                            <Sortable.Handler />
                          </Col>
                          <Col span={18}>
                            <AntForm.Item>
                              {getFieldDecorator(`text.${index}`, {
                                rules: [{
                                  required: true,
                                  message: 'Это поле не может быть пустым!',
                                }],
                                initialValue: answer.value,
                              })(
                                <AntInput
                                  size="default"
                                  onChange={changeText(index)}
                                />
                              )}
                            </AntForm.Item>
                            <div className={styles.divinput}>
                              <span>{answer.alt}</span>
                            </div>
                          </Col>
                          <Col span={2} offset={1} className={styles.center}>
                            <Dropzone
                              multiple={false}
                              className={styles.upload}
                              onDrop={uploadImage(index)}
                            >
                              {answer.image
                                ?
                                  <div>
                                    <AntIcon
                                      type="close"
                                      onClick={removeImage(index)}
                                      className={styles.removeimage}
                                    />
                                    <img
                                      src={images[answer.image]}
                                      role="presentation"
                                      height={70}
                                      width={70}
                                    />
                                  </div>
                                :
                                  <div className={styles.icon}>
                                    <AntIcon
                                      className={styles.bigsize}
                                      type="camera"
                                    />
                                  </div>
                              }
                            </Dropzone>
                          </Col>
                          <Col span={1} className={styles.center}>
                            <AntCheckbox
                              key={index}
                              checked={answer.isRight}
                              onChange={isRight(index)}
                            />
                          </Col>
                          <Col span={1} className={styles.center}>
                            <AntPopconfirm
                              title="Удалить событие?"
                              okText="Да"
                              onConfirm={removeStep(index)}
                              cancelText="Нет"
                            >
                              <AntIcon
                                type="close"
                                className={styles.remove}
                              />
                            </AntPopconfirm>
                          </Col>
                        </div>
                      </Sortable.Item>
                    </Row>
                  )}
                </div>
              </Sortable.List>
            </AntCollapse.Panel>
          </AntCollapse>
        </AntTabs.TabPane>
        <AntTabs.TabPane tab="Баллы" key="2">Content of tab 2</AntTabs.TabPane>
      </AntTabs>
      <div className={styles.buttonwrapper}>
        <AntButton type="primary" onClick={validateAndSave}>Применить</AntButton>
        <AntButton type="ghost">Отменить</AntButton>
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
  images: PropTypes.object.isRequired,
  addStep: PropTypes.func.isRequired,
  dragStep: PropTypes.func.isRequired,
  removeStep: PropTypes.func.isRequired,
  changeText: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  isRight: PropTypes.func.isRequired,
  data: PropTypes.shape({
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        image: PropTypes.string,
        checked: PropTypes.bool,
      }).isRequired,
    ),
  }).isRequired,
};

export default AntForm.create()(Editor);
