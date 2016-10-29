import React, { PropTypes } from 'react';
import styles from './styles.css';

const Widgets = ({
  editorState,
  insertEntity,
  changeEditorState,
}) =>
  <div className={styles.widgets}>
    {[{ name: 'Тег', type: 'TAG' },
      { name: 'Оценка', type: 'RATE' },
      { name: 'Дерево', type: 'TREE' },
      { name: 'Таблица', type: 'TABLE' },
      { name: 'Карточка', type: 'CARD' },
      { name: 'Карусель', type: 'CAROUSEL' },
      { name: 'Прогресс', type: 'PROGRESS' },
      { name: 'Развернуть', type: 'COLLAPSE' },
      { name: 'Шкала времени', type: 'TIMELINE' },
      { name: 'Обратите внимание', type: 'ALERT' },
    ].map(({
      name: entityName,
      type: entityType,
    },
      entityIndex,
    ) =>
      <span
        key={entityIndex}
        onClick={() => {
          insertEntity(
            entityType,
            editorState,
            changeEditorState,
          );
        }}
        className={styles.item}
      >
        {entityName}
      </span>
    )}
  </div>;

Widgets.propTypes = {
  editorState: PropTypes.object.isRequired,
  insertEntity: PropTypes.func.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Widgets;
