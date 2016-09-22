import React, { Component, PropTypes } from 'react';

import {
  // Editor,
  EditorState,
  convertFromRaw,
  CompositeDecorator,
} from 'draft-js';
import createImagePlugin, {
  // imageStyles,
  // imageCreator,
} from 'draft-js-image-plugin';
import Editor from 'draft-js-plugins-editor';
import createVideoPlugin from 'draft-js-video-plugin';
import createEntityPropsPlugin from 'draft-js-entity-props-plugin';
import Link, { findLinkEntities } from '../Editor/Entities/Link';
import styles from './styles.css';

const imageTheme = {
  imageLoader: 'imageLoader',
  imageWrapper: 'imageWrapper',
  image: 'image',
};

const plugins = [
  createImagePlugin({
    theme: imageTheme,
    type: 'atomic',
  }),
  createVideoPlugin(),
  createEntityPropsPlugin(),
];

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
            plugins={plugins}
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
