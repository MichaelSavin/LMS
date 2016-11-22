import React, { PropTypes } from 'react';
import styles from './styles.css';

import List from './List';
import Style from './Style';
import Align from './Align';
// import Color from './Color';
import Header from './Header';

const Formats = (props) =>
  <span className={styles.formats}>
    {[Header,
      Style,
      Align,
      List,
      // Color,
    ].map((element, key) =>
      React.createElement(
        element, {
          key,
          ...props,
        },
        null
      )
    )}
  </span>;

Formats.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Formats;
