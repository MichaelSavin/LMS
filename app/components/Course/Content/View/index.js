import React, {
  Component,
  PropTypes,
} from 'react';
import {
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
import styles from './styles.css';

import TeX from '../Entities/TeX';
import Link from '../Entities/Link';
import Input from '../Entities/Input';
import Select from '../Entities/Select';
import { findEntities } from '../Entities';

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

const decorator = new CompositeDecorator([{
  strategy: findEntities('LINK'),
  component: Link,
}, {
  strategy: findEntities('TEX'),
  component: TeX,
}, {
  strategy: findEntities('INPUT'),
  component: Input,
}, {
  strategy: findEntities('SELECT'),
  component: Select,
}]);

class View extends Component { // HMR
  render() {
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
