import React, {
  // PropTypes,
} from 'react';
import { Menu, Dropdown as AntDropdown, Icon } from 'antd';

import styles from './styles.css';

const menu = (
  <Menu className={styles.menu}>
    <Menu.Item key="0">
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">Добавить колонку справа</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">Добавить ряд снизу</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">Удалить ряд</Menu.Item>
  </Menu>
);

const Dropdown = () => (
  <div className={styles.dropdown}>
    <AntDropdown overlay={menu}>
      <Icon type="down" className={styles.icon} />
    </AntDropdown>
  </div>
);

export default Dropdown;
