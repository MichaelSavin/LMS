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
      <a>
        Добавить колонку справа
      </a>
    </Menu.Item>
    <Menu.Item key="1">
      <a onClick={editTable('addRowUp', columnKey, index)}>
        Добавить ряд сверху
      </a>
    </Menu.Item>
    <Menu.Item key="2">
      <a onClick={editTable('addRowDown', columnKey, index)}>
        Добавить ряд снизу
      </a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3"><a>Удалить ряд</a></Menu.Item>
    <Menu.Item key="4"><a>Удалить строку</a></Menu.Item>
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
