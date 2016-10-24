import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Editor,
  EditorState,
  convertFromRaw,
} from 'draft-js';
import { Radio as AntRadio, Icon } from 'antd';
// import createImagePlugin, {
  // imageStyles,
  // imageCreator,
// } from 'draft-js-image-plugin';
// import Editor from 'draft-js-plugins-editor';
// import createVideoPlugin from 'draft-js-video-plugin';
// import createEntityPropsPlugin from 'draft-js-entity-props-plugin';
import styles from './styles.css';


import {
  blockRenderer,
  entitiesDecorator,
} from '../Entities';

// const imageTheme = {
//   imageLoader: 'imageLoader',
//   imageWrapper: 'imageWrapper',
//   image: 'image',
// };

// const plugins = [
//   createImagePlugin({
//     theme: imageTheme,
//     type: 'atomic',
//   }),
//   createVideoPlugin(),
//   createEntityPropsPlugin(),
// ];

class View extends Component { // HMR

  constructor(props) {
    super(props);
    this.state = {
      type: 'desktop',
    };
  }

  handleChange = (event) => {
    this.setState({
      type: event.target.value,
    });
  }

  render() {
    const {
      type,
    } = this.state;
    return (
      <div className={styles.view}>
        <div className={styles.select}>
          <AntRadio.Group
            defaultValue="desktop"
            onChange={this.handleChange}
          >
            <AntRadio.Button value="desktop">
              <Icon type="desktop" />
            </AntRadio.Button>
            <AntRadio.Button value="tablet">
              <Icon type="tablet" />
            </AntRadio.Button>
            <AntRadio.Button value="mobile">
              <Icon type="mobile" />
            </AntRadio.Button>
          </AntRadio.Group>
        </div>
        <div className={styles[type]}>
          <Editor
            // plugins={plugins}
            blockRendererFn={blockRenderer}
            editorState={EditorState
              .createWithContent(
                convertFromRaw(
                  this.props.content
                ),
                entitiesDecorator,
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
  type: PropTypes.string,
};

export default View;
