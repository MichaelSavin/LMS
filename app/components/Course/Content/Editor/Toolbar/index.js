import React, { PropTypes } from 'react';
import { Tabs as AntTabs } from 'antd';
import styles from './styles.css';

import Formats from './Formats';
import Widgets from './Widgets';
import Media from './Media';
// import Tasks from './Tasks';

import { insertEntity } from '../../Entities';

const Toolbar = props =>
  <div className={styles.toolbar}>
    <AntTabs
      defaultActiveKey="0"
      onChange={() => {}}
    >
      {[{
        name: 'Форматирование',
        props,
        component: Formats,
      }, {
        name: 'Медиа',
        props: {
          ...props,
          insertEntity,
        },
        component: Media,
      }, {
        name: 'Виджеты',
        props: {
          ...props,
          insertEntity,
        },
        component: Widgets,
      }].map(({
        name,
        props: childProps,
        component,
      },
        key,
      ) =>
        <AntTabs.TabPane
          key={key}
          tab={name}
          className={styles.pane}
        >
          {React.createElement(
            component,
            childProps,
            null
          )}
        </AntTabs.TabPane>
      )}
    </AntTabs>
  </div>;

Toolbar.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Toolbar;
