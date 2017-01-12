import React, {
  Component,
  PropTypes,
} from 'react';
import {
  getSelectionInlineStyle,
} from 'draftjs-utils';
import {
  Modifier,
  RichUtils,
  EditorState,
} from 'draft-js';
import Icon from 'components/UI/Icon';
import styles from './styles.css';
import Option from '../Option';
import LinkOption from '../LinkOption';

class Style extends Component {

  constructor(props) {
    super(props);
    this.state = {
      styles: {},
      isLink: false,
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
      props.editorState !==
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

  toggleLink = (style) => {
    const {
      editorState,
      changeEditorState,
    } = this.props;
    const newState = RichUtils
      .toggleInlineStyle(
        editorState,
        style
      );
    changeEditorState(
      style === 'SUBSCRIPT' || style === 'SUPERSCRIPT'
        ? EditorState.push(
            newState,
            Modifier.removeInlineStyle(
              newState.getCurrentContent(),
              newState.getSelection(),
              style === 'SUBSCRIPT'
                ? 'SUPERSCRIPT'
                : 'SUBSCRIPT',
            ),
            'change-inline-style'
          )
        : newState
    );
  };

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
    changeEditorState(
      style === 'SUBSCRIPT' || style === 'SUPERSCRIPT'
        ? EditorState.push(
            newState,
            Modifier.removeInlineStyle(
              newState.getCurrentContent(),
              newState.getSelection(),
              style === 'SUBSCRIPT'
                ? 'SUPERSCRIPT'
                : 'SUBSCRIPT',
            ),
            'change-inline-style'
          )
        : newState
    );
  };

  render() {
    const {
      styles: textStyles,
    } = this.state;
    const {
      inPopup,
    } = this.props;
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
        }, {
          value: 'SUPERSCRIPT',
          icon: 'superscript',
        }, {
          value: 'SUBSCRIPT',
          icon: 'subscript',
        }].map(({
          value,
          icon,
        }, index) =>
          <Option
            key={index}
            value={value}
            active={textStyles[value]}
            onClick={this.toggleStyle}
            inPopup={inPopup}
          >
            <span className={styles.icon}>
              <Icon type={icon} size={16} />
            </span>
          </Option>
        )
      }
        <LinkOption {...this.props} />
      </div>
    );
  }
}

Style.propTypes = {
  inPopup: PropTypes.bool,
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Style;
