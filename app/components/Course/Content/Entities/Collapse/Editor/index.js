import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Form as AntForm,
  Input as AntInput,
  Modal as AntModal,
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
  addRow,
  dragRow,
  removeRow,
  changeText,
  closeModal,
  changeTitle,
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
    <div className={styles.editor}>
      <AntModal
        onOk={validateAndSave}
        title={
          <div className={styles.header}>
            <span>Развернуть</span>
            <AntButton
              icon="plus"
              size="small"
              type="default"
              onClick={addRow}
            >
              Добавить блок
            </AntButton>
          </div>
        }
        okText="Сохранить"
        visible={isOpen}
        onCancel={resetAndClose}
        cancelText="Отмена"
      >
        <Sortable.List
          onSortEnd={dragRow}
          useDragHandle
        >
          <div className={styles.rows}>
            {data.rows.map((
              row,
              rowIndex
            ) =>
              <Sortable.Item
                key={rowIndex}
                index={rowIndex}
              >
                <div className={styles.row}>
                  <Sortable.Handler />
                  <div className={styles.content}>
                    <div className={styles.title}>
                      <AntForm.Item>
                        {getFieldDecorator(`title.${rowIndex}`, {
                          rules: [{
                            required: true,
                            message: 'Это поле не может быть пустым!',
                          }],
                          initialValue: row.title,
                        })(
                          <AntInput
                            size="default"
                            onChange={changeTitle(rowIndex)}
                          />
                        )}
                      </AntForm.Item>
                    </div>
                    <div className={styles.text}>
                      <AntForm.Item>
                        {getFieldDecorator(`text.${rowIndex}`, {
                          rules: [{
                            required: true,
                            message: 'Это поле не может быть пустым!',
                          }],
                          initialValue: row.text,
                        })(
                          <AntInput
                            rows={4}
                            size="default"
                            type="textarea"
                            onChange={changeText(rowIndex)}
                          />
                        )}
                      </AntForm.Item>
                    </div>
                  </div>
                  <AntPopconfirm
                    title="Удалить блок?"
                    okText="Да"
                    onConfirm={removeRow(rowIndex)}
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
              <div className={styles.title}>
                <p className={styles.line} />
                <span
                  className={styles.text}
                >
                  Предосмотр
                </span>
              </div>
              <div className={styles.component}>
                <Preview data={data} />
              </div>
            </div>
          </div>
        </Sortable.List>
      </AntModal>
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
  isOpen: PropTypes.bool.isRequired,
  addRow: PropTypes.func.isRequired,
  dragRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  changeText: PropTypes.func.isRequired,
  changeTitle: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  data: PropTypes.shape({
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

export default AntForm.create()(Editor);
