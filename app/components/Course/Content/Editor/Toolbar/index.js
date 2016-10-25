import React, { PropTypes } from 'react';

import List from './List';
import Style from './Style';
import Align from './Align';
import Header from './Header';
import History from './History';

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
    <List
      editorState={editorState}
      changeEditorState={changeEditorState}
    />
    <History
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
