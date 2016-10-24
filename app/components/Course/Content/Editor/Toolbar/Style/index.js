import React, {
  Component,
  PropTypes,
} from 'react';
import {
  getSelectionInlineStyle,
} from 'draftjs-utils';
import { RichUtils } from 'draft-js';
import styles from './styles.css';
import Option from '../Option';

class Style extends Component {

  constructor(props) {
    super(props);
    this.state = {
      styles: {},
    };
  }

  componentWillMount() {
    const {
      editorState,
    } = this.props;
    if (editorState) {
      this.setState({
        styles:
          getSelectionInlineStyle(
            editorState
          ),
      });
    }
  }

  componentWillReceiveProps(props) {
    if (
      props.editorState
      !==
      this.props.editorState
    ) {
      this.setState({
        styles:
          getSelectionInlineStyle(
            props.editorState
          ),
      });
    }
  }

  toggleStyle = (style) => {
    const {
      editorState,
      changeEditorState,
    } = this.props;
    const newState = RichUtils
      .toggleInlineStyle(
        editorState,
        style
      );
    if (newState) {
      changeEditorState(newState);
    }
  };

  render() {
    return (
      <div className={styles.text}>
        {[{
          value: 'BOLD',
          icon: 'bold',
        }, {
          value: 'ITALIC',
          icon: 'italic',
        }, {
          value: 'UNDERLINE',
          icon: 'underline',
        }, {
          value: 'STRIKETHROUGH',
          icon: 'strikethrough',
        }, {
          value: 'CODE',
          icon: 'monospace',
        }].map(({
          value,
          icon,
        }, index) =>
          <Option
            key={index}
            value={value}
            active={this.state.styles[value]}
            onClick={this.toggleStyle}
            className={styles.option}
          >
            <img
              src={require( // eslint-disable-line
                `components/UI/SVG/${icon}.svg`
              )}
              role="presentation"
              className={styles.icon}
            />
          </Option>
        )
      }
      </div>
    );
  }
}

Style.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Style;
