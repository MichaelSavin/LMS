import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Editor,
  RichUtils,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import {
  customStyleMap,
} from 'draftjs-utils';
import {
  entitiesDecorator,
} from '../Entities';
import Popup from './Popup';

class SimpleEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFocused: true,
      editorState: props.content ? EditorState
        .createWithContent(
          convertFromRaw(props.content),
          entitiesDecorator,
        ) : EditorState.createEmpty(),
    };
  }

  componentDidMount() {
    this.props.onChange(convertToRaw(
      this.state.editorState.getCurrentContent()
    ));
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
    this.props.onChange(convertToRaw(
      editorState.getCurrentContent()
    ));
  }

  setFocusStatus = (e) => this.setState({
    isFocused: e.type === 'focus',
  })

  handleKeyCommand = (command) => {
    const { editorState } = this.state;
    const newState = RichUtils
      .handleKeyCommand(
        editorState,
        command
      );
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  focusEditor = () => this.refs.editor.focus();

  render() {
    const {
      isFocused,
      editorState,
    } = this.state;
    const { className } = this.props;
    return (
      <div className={className}>
        <Editor
          ref="editor"
          onBlur={this.setFocusStatus}
          onFocus={this.setFocusStatus}
          onChange={this.onChange}
          editorState={editorState}
          blockRenderMap={this.customBlockRenderMap}
          customStyleMap={customStyleMap}
          handleKeyCommand={this.handleKeyCommand}
        />
        <Popup
          isFocused={isFocused}
          editorRef={this.refs.editor}
          editorState={editorState}
          changeEditorState={this.onChange}
        />
      </div>
    );
  }
}

SimpleEditor.propTypes = {
  content: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default SimpleEditor;
