import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Form as AntForm,
  Modal as AntModal,
  Input as AntInput,
  Checkbox as AntCheckbox,
  Button as AntButton,
  Popconfirm as AntPopconfirm,
  Row, Col,
} from 'antd';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;
import {
  SortableHandle,
  SortableElement,
  SortableContainer,
} from 'react-sortable-hoc';
import Dropzone from 'react-dropzone';

import styles from './styles.css';

const Editor = ({
  data,
  isOpen,
  addStep,
  images,
  closeModal,
  uploadImage,
  isRight,
  saveSettings,
  changeText,
  removeStep,
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
    closeModal();
  };
  return (
    <div className={styles.editor}>
      <Collapse>
        <Panel header="Варианты ответа" key="1">
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
                      </Col>
                      <Col span={2} offset={1} className={styles.center}>
                        <Dropzone
                          multiple={false}
                          className={styles.upload}
                          onDrop={uploadImage(index)}
                        >
                          {answer.image
                            ?
                              <img
                                src={images[answer.image]}
                                role="presentation"
                                height={70}
                                width={70}
                              />
                            :
                                <div className={styles.icon}>
                                  <AntIcon
                                    size={20}
                                    type="photo"
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
        </Panel>
      </Collapse>
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
  isOpen: PropTypes.bool.isRequired,
  addStep: PropTypes.func.isRequired,
  dragStep: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
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
