import React, {
  Component,
} from 'react';
import {
  Icon as AntIcon,
  Form as AntForm,
  Input as AntInput,
  Modal as AntModal,
  Select as AntSelect,
  Checkbox as AntCheckbox,
  Button as AntButton,
  Popconfirm as AntPopconfirm,
  Row, Col,
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
  isOpen,
  closeModal,
  images,
  uploadImage,
  isRight,
  saveSettings,
}) => {
  const resetAndClose = () => {
    closeModal();
  };
  return (
    <AntModal
      onOk={saveSettings}
      title={
        <div className={styles.title}>
          <span>Шкала времени</span>
          <AntButton
            icon="plus"
            size="small"
            type="default"
          >
            Добавить новое событие
          </AntButton>
        </div>
      }
      okText="Сохранить"
      visible={isOpen}
      cancelText="Отмена"
      onCancel={resetAndClose}
    >
      <Sortable.List
        useDragHandle
      >
        <div>
          {data.answers.map((answer, index) =>
            <Row>
              <Sortable.Item
                key={index}
                index={index}
              >
                <div className={styles.answer}>
                  <Col span={1}>
                    <Sortable.Handler />
                  </Col>
                  <Col span={18}>
                    <AntInput
                      size="default" value={answer.value}
                    />
                  </Col>
                  <Col span={2} offset={1}>
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
                            height={25}
                            width={25}
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
                  <Col span={1}>
                    <AntCheckbox
                      key={index}
                      checked={answer.isRight}
                      onChange={isRight(index)}
                    />
                  </Col>
                  <Col span={1}>
                    <AntPopconfirm
                      title="Удалить событие?"
                      okText="Да"
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

export default Editor;
