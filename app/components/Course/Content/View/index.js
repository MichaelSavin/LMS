import React, { Component, PropTypes } from 'react';

import { 
  Editor,
  EditorState,
  convertFromRaw,
  CompositeDecorator,
} from 'draft-js';
import Link, { findLinkEntities } from '../Editor/Entities/Link';

import styles from './styles.css';

class View extends Component { // HMR
  render() {
    const decorator = new CompositeDecorator([{ // eslint-disable-line better/no-new
      strategy: findLinkEntities,
      component: Link,
    }]);
    return (
      <div className={styles.view}>
        <div className={styles.draft}>
          <Editor
            editorState={EditorState
              .createWithContent(
                convertFromRaw(
                  this.props.content
                ),
                decorator,
              )}
            readOnly
          />
        </div>
      </div>
    );
  }
}

View.propTypes = {
  content: PropTypes.object, // http://stackoverflow.com/a/33427304
};

export default View;
