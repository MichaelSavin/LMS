import React, { PropTypes } from 'react';
import {
  Input as AntInput,
  Modal as AntModal,
} from 'antd';

const Promt = ({
  value,
  onSave,
  visible,
  onChange,
  onCancel,
}) => (
  <AntModal
    onOk={onSave}
    title="Редактирование"
    okText="Сохранить"
    visible={visible}
    onCancel={onCancel}
    cancelText="Отмена"
  >
    <AntInput
      type="text"
      value={value}
      onChange={onChange}
      onPressEnter={onSave}
    />
  </AntModal>
);

Promt.propTypes = {
  value: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Promt;
