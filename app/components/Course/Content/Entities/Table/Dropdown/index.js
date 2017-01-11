import React, {
  PropTypes,
} from 'react';
import {
  Menu as AntMenu,
  Icon as AntIcon,
  Dropdown as AntDropdown,
} from 'antd';
import styles from './styles.css';

const Dropdown = ({
  index,
  addRow,
  deleteRow,
  columnKey,
  addColumn,
  deleteColumn,
}) => (
  <div className={styles.dropdown}>
    <AntDropdown
      overlay={
        <AntMenu className={styles.menu}>
          <AntMenu.Item key="0">
            <a onClick={addColumn(columnKey + 1, index)}>
              Добавить колонку справа
            </a>
          </AntMenu.Item>
          <AntMenu.Item key="1">
            <a onClick={addColumn(columnKey, index)}>
              Добавить колонку слево
            </a>
          </AntMenu.Item>
          <AntMenu.Item key="2">
            <a onClick={deleteColumn(columnKey, index)}>
              Удалить колонку
            </a>
          </AntMenu.Item>
          <AntMenu.Divider />
          {
            index >= 0 &&
            <AntMenu.Item key="3">
              <a onClick={addRow(columnKey, index)}>
                Добавить ряд сверху
              </a>
            </AntMenu.Item>
          }
          <AntMenu.Item key="4">
            <a onClick={addRow(columnKey, index + 1)}>
              Добавить ряд снизу
            </a>
          </AntMenu.Item>
          {index >= 0 && <AntMenu.Item key="5">
            <a onClick={deleteRow(columnKey, index)}>
              Удалить ряд
            </a>
          </AntMenu.Item>}
        </AntMenu>
      }
    >
      <AntIcon type="down" className={styles.icon} />
    </AntDropdown>
  </div>
);

Dropdown.propTypes = {
  index: PropTypes.number.isRequired,
  addRow: PropTypes.func.isRequired,
  deleteRow: PropTypes.func.isRequired,
  columnKey: PropTypes.number.isRequired,
  addColumn: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
};

export default Dropdown;
