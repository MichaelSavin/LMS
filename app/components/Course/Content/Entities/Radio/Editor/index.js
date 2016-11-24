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

class Editor extends Component {
  render() {
    <AntModal
      title={
        <div>
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
      onCancel={resetAndClose}
      cancelText="Отмена"
    >
    </AntModal>
  }
}

export default AntForm.create({})(Editor);
