import React, {
  PropTypes,
} from 'react';
import { Menu, Dropdown as AntDropdown, Icon } from 'antd';

import styles from './styles.css';

const RenderMenu = ({
  columnKey,
  editTable,
  index,
}) => (
  <Menu className={styles.menu}>
    <Menu.Item key="0">
      <a onClick={editTable('addColumn', columnKey + 1, index)}>
        Добавить колонку справа
      </a>
    </Menu.Item>
    <Menu.Item key="1">
      <a onClick={editTable('addColumn', columnKey, index)}>
        Добавить колонку слево
      </a>
    </Menu.Item>
    <Menu.Item key="2">
      <a onClick={editTable('delColumn', columnKey, index)}>
        Удалить колонку
      </a>
    </Menu.Item>
    <Menu.Divider />
    {index >= 0 && <Menu.Item key="3">
      <a onClick={editTable('addRow', columnKey, index)}>
        Добавить ряд сверху
      </a>
    </Menu.Item>}
    <Menu.Item key="4">
      <a onClick={editTable('addRow', columnKey, index + 1)}>
        Добавить ряд снизу
      </a>
    </Menu.Item>
    {index >= 0 && <Menu.Item key="5">
      <a onClick={editTable('delRow', columnKey, index)}>
        Удалить ряд
      </a>
    </Menu.Item>}
  </Menu>
);

const Dropdown = (props) => (
  <div className={styles.dropdown}>
    <AntDropdown overlay={RenderMenu(props)}>
      <Icon type="down" className={styles.icon} />
    </AntDropdown>
  </div>
);

RenderMenu.propTypes = {
  columnKey: PropTypes.number.isRequired,
  editTable: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default Dropdown;
