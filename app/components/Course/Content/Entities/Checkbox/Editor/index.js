import React, {
  Component,
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

import styles from './styles.css';

const Editor = ({
  data,
  isOpen,
  closeModal,
}) => {
  const resetAndClose = () => {
    closeModal();
  };
  return (
    <AntModal
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
        {data.answers.map((answer, index) =>
          <Sortable.Item
            key={index}
            index={index}
          >
            <AntInput
              size="default" value={answer.value}
            />
          </Sortable.Item>
        )}
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
