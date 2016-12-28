import React, {
  PropTypes,
} from 'react';
import { Menu, Dropdown as AntDropdown, Icon } from 'antd';
import styles from './styles.css';

const Dropdown = ({
  index,
  addRow,
  delRow,
  columnKey,
  addColumn,
  delColumn,
}) => (
  <div className={styles.dropdown}>
    <AntDropdown
      overlay={
        <Menu className={styles.menu}>
          <Menu.Item key="0">
            <a onClick={() => addColumn(columnKey + 1, index)}>
              Добавить колонку справа
            </a>
          </Menu.Item>
          <Menu.Item key="1">
            <a onClick={() => addColumn(columnKey, index)}>
              Добавить колонку слево
            </a>
          </Menu.Item>
          <Menu.Item key="2">
            <a onClick={() => delColumn(columnKey, index)}>
              Удалить колонку
            </a>
          </Menu.Item>
          <Menu.Divider />
          {index >= 0 && <Menu.Item key="3">
            <a onClick={() => addRow(columnKey, index)}>
              Добавить ряд сверху
            </a>
          </Menu.Item>}
          <Menu.Item key="4">
            <a onClick={() => addRow(columnKey, index + 1)}>
              Добавить ряд снизу
            </a>
          </Menu.Item>
          {index >= 0 && <Menu.Item key="5">
            <a onClick={() => delRow(columnKey, index)}>
              Удалить ряд
            </a>
          </Menu.Item>}
        </Menu>
      }
    >
      <Icon type="down" className={styles.icon} />
    </AntDropdown>
  </div>
);

Dropdown.propTypes = {
  addRow: PropTypes.func.isRequired,
  delRow: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  addColumn: PropTypes.func.isRequired,
  delColumn: PropTypes.func.isRequired,
  columnKey: PropTypes.number.isRequired,
};

export default Dropdown;
