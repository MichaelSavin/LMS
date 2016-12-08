import React, { PropTypes } from 'react';
import { Tag as AntTag } from 'antd';
import {
  Editor,
  EditorState,
  convertFromRaw,
} from 'draft-js';
import {
  customStyleMap,
} from 'draftjs-utils';
import {
  entitiesDecorator,
} from '../../../Entities';
import styles from './styles.css';

const Preview = ({ data, openModal }) => (
  <div className={styles.preview}>
    <div
      className={styles.area}
      onDoubleClick={openModal}
    />
    {data.tags.map(({
      color,
      content,
    }, index) =>
      <AntTag
        key={index}
        color={{
          blue: '#2db7f5',
          green: '#87d068',
          red: '#f50',
        }[color]}
        contentEditable={false}
      >
        <Editor
          readOnly
          customStyleMap={customStyleMap}
          editorState={content
            ? EditorState.createWithContent(
                convertFromRaw(content),
                entitiesDecorator
              )
            : EditorState.createEmpty()
          }
        />
      </AntTag>
    )}
  </div>
);


Preview.propTypes = {
  data: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.object.isRequired,
        color: PropTypes.oneOf([
          'blue',
          'green',
          'red',
        ]).isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  openModal: PropTypes.func,
};

export default Preview;
