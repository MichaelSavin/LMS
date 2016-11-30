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
  blockRenderer,
  entitiesDecorator,
} from '../Entities';
import Popup from './Popup';

class SimpleEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFocused: true,
      editorState: this.props.content ? EditorState.moveFocusToEnd(
        EditorState.createWithContent(
          convertFromRaw(this.props.content),
          entitiesDecorator,
        ),
      ) : EditorState.createEmpty(),
    };
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

  blockStyleFn = (block) => {
    const blockAlignment =
      block.getData()
      &&
      block.getData().get('text-align');
    return blockAlignment
      ? `${blockAlignment}-aligned-block`
      : '';
  }

  customStyleFn = (style) => {
    const [type, value] = (
      style.last() || ''
    ).split('-');
    switch (type) {
      case 'color':
        return {
          color: value,
        };
      case 'bgcolor':
        return {
          backgroundColor: value,
        };
      default:
        return style;
    }
  }

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
    return (
      <div>
        <Editor
          ref="editor"
          onBlur={this.setFocusStatus}
          onFocus={this.setFocusStatus}
          onChange={this.onChange}
          editorState={editorState}
          blockStyleFn={this.blockStyleFn}
          customStyleFn={this.customStyleFn}
          blockRenderMap={this.customBlockRenderMap}
          customStyleMap={customStyleMap}
          blockRendererFn={blockRenderer}
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
};

export default SimpleEditor;
