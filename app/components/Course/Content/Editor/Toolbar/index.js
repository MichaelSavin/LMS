import React, { PropTypes } from 'react';
import { Tabs as AntTabs } from 'antd';
import styles from './styles.css';

import Formats from './Formats';
import Widgets from './Widgets';
import Media from './Media';
import Tasks from './Tasks';

import { insertEntity } from '../../Entities';

const Toolbar = props =>
  <div className={styles.toolbar}>
    <AntTabs
      defaultActiveKey="1"
      onChange={() => {}}
    >
      <AntTabs.TabPane
        key="1"
        tab="Форматирование"
        className={styles.pane}
      >
        <Formats
          {...props}
        />
      </AntTabs.TabPane>

      <AntTabs.TabPane
        key="2"
        tab="Медиа"
        className={styles.pane}
      >
        <Media
          {...props}
          insertEntity={insertEntity}
        />
      </AntTabs.TabPane>

      <AntTabs.TabPane
        key="3"
        tab="Виджеты"
        className={styles.pane}
      >
        <Widgets
          {...props}
          insertEntity={insertEntity}
        />
      </AntTabs.TabPane>

      <AntTabs.TabPane
        key="4"
        tab="Задания"
        className={styles.pane}
      >
        <Tasks
          {...props}
          insertEntity={insertEntity}
        />
      </AntTabs.TabPane>

    </AntTabs>
  </div>;

Toolbar.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Toolbar;
