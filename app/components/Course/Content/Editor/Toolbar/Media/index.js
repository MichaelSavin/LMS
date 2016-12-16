import React, { PropTypes } from 'react';
import styles from './styles.css';

const Media = ({
  editorState,
  insertEntity,
  changeEditorState,
}) =>
  <div className={styles.media}>
    {[{ name: 'Файл', type: 'UPLOAD' },
      { name: 'Видео', type: 'VIDEO' },
      { name: 'Изображение', type: 'IMAGE' },
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


Media.propTypes = {
  editorState: PropTypes.object.isRequired,
  insertEntity: PropTypes.func.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Media;
