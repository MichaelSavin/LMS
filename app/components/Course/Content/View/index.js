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
  Icon as AntIcon,
} from 'antd';
import classNames from 'classnames';
import {
  blockRenderer,
  entitiesDecorator,
} from '../Entities';
import styles from './styles.css';

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
    const { viewport } = this.state;
    const { content } = this.props;
    return (
      <div className={styles.view}>
        <div className={styles.selectors}>
          <AntRadio.Group
            defaultValue="desktop"
            onChange={this.changeViewport}
          >
            {[{ device: 'desktop', name: 'Десктоп' },
              { device: 'tablet', name: 'Планшет' },
              { device: 'mobile', name: 'Смартфон' },
            ].map(({ device, name }) =>
              <AntRadio.Button
                key={device}
                value={device}
              >
                <AntIcon
                  type={device}
                  className={styles.icon}
                />
                {name}
              </AntRadio.Button>
          )}
          </AntRadio.Group>
        </div>
        <div
          className={classNames(
            styles.viewport,
            styles[viewport]
          )}
        >
          <Editor
            blockRendererFn={blockRenderer}
            editorState={EditorState
              .createWithContent(
                convertFromRaw(
                  content
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
