import React, { PropTypes } from 'react';
import { Tabs as AntTabs } from 'antd';

import List from './List';
import Style from './Style';
import Align from './Align';
import Color from './Color';
import Header from './Header';
import History from './History';

import { insertEntity } from '../../Entities';

import styles from './styles.css';

const widgets = [{
  name: 'Тег',
  type: 'TAG',
}, {
  name: 'Оценка',
  type: 'RATE',
}, {
  name: 'Дерево',
  type: 'TREE',
}, {
  name: 'Таблица',
  type: 'TABLE',
}, {
  name: 'Карточка',
  type: 'CARD',
}, {
  name: 'Карусель',
  type: 'CAROUSEL',
}, {
  name: 'Прогресс',
  type: 'PROGRESS',
}, {
  name: 'Развернуть',
  type: 'COLLAPSE',
}, {
  name: 'Шкала времени',
  type: 'TIMELINE',
}, {
  name: 'Обратите внимание',
  type: 'ALERT',
}];

const Toolbar = ({
  editorState,
  changeEditorState,
}) => (
  <div className={styles.toolbar}>
    <AntTabs
      defaultActiveKey="1"
      onChange={() => {}}
    >
      <AntTabs.TabPane
        className={styles.pane}
        tab="Форматирование"
        key="1"
      >
        {[Header,
          Style,
          Align,
          List,
          Color,
          History,
        ].map((element, key) =>
          React.createElement(
            element, {
              key,
              editorState,
              changeEditorState,
            },
            null
          )
        )}
      </AntTabs.TabPane>
      { /* <AntTabs.TabPane
        key="2"
        tab="Медиа"
      >
        ...
      </AntTabs.TabPane>
      */ }
      <AntTabs.TabPane
        key="3"
        tab="Виджеты"
      >
        {widgets.map(({
          name,
          type: entityType,
        }, index) =>
          <span
            key={index}
            onClick={() => {
              insertEntity(
                entityType,
                editorState,
                changeEditorState,
              );
            }}
            className={styles.item}
          >
            {name}
          </span>
        )}
      </AntTabs.TabPane>
      { /*
      <AntTabs.TabPane tab="Задания" key="4">
        ...
      </AntTabs.TabPane>
      */ }
    </AntTabs>
  </div>
);

Toolbar.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Toolbar;
