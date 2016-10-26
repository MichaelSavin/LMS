import React, { PropTypes } from 'react';

import List from './List';
import Style from './Style';
import Align from './Align';
import Color from './Color';
import Header from './Header';
import History from './History';

import styles from './styles.css';

const Toolbar = ({
  editorState,
  changeEditorState,
}) => (
  <div className={styles.toolbar}>
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
  </div>
);

Toolbar.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Toolbar;
