import React, { Component, PropTypes } from 'react';

import { Editor, EditorState, convertFromRaw } from 'draft-js';

import styles from './styles.css';

class View extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.view}>
        <div className={styles.draft}>
          <Editor
            editorState={EditorState.createWithContent(
              convertFromRaw(this.props.content)
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
