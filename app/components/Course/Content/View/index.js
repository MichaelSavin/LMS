import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Editor,
  EditorState,
  convertFromRaw,
} from 'draft-js';
import {
  Radio as AntRadio,
  AntIcon } from 'antd';
import styles from './styles.css';
import {
  blockRenderer,
  entitiesDecorator,
} from '../Entities';

class View extends Component { // HMR

  constructor(props) {
    super(props);
    this.state = {
      viewport: 'desktop',
    };
  }

  changeViewport = (event) => {
    this.setState({
      viewport: event.target.value,
    });
  }

  render() {
    return (
      <div className={styles.view}>
        <div className={styles.select}>
          <AntRadio.Group
            defaultValue="desktop"
            onChange={this.changeViewport}
          >
            {['desktop',
            'tablet',
            'mobile'].map(type =>
              <AntRadio.Button value={type}>
                <AntIcon viewport={type} />
              </AntRadio.Button>
          )}
          </AntRadio.Group>
        </div>
        <div className={styles[this.state.viewport]}>
          <Editor
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
};

export default View;
