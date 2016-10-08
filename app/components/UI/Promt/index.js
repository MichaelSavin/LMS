import React, { PropTypes } from 'react';
import {
  Input as AntInput,
  Modal as AntModal,
} from 'antd';

const Promt = ({
  type,
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
      type={type || 'text'}
      value={value}
      onChange={onChange}
      autosize
      // onPressEnter={onSave}
    />
  </AntModal>
);

Promt.propTypes = {
  type: React.PropTypes.oneOf(['text', 'textarea']),
  value: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Promt;
