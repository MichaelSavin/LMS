import React, { PropTypes } from 'react';

import Style from './Style';
import Align from './Align';
import Header from './Header';

import styles from './styles.css';

const Toolbar = ({
  editorState,
  changeEditorState,
}) => (
  <div className={styles.toolbar}>
    <Header
      editorState={editorState}
      changeEditorState={changeEditorState}
    />
    <Style
      editorState={editorState}
      changeEditorState={changeEditorState}
    />
    <Align
      editorState={editorState}
      changeEditorState={changeEditorState}
    />
  </div>
);

Toolbar.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Toolbar;
