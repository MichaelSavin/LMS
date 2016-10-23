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

// import Toolbar from './Toolbar';

import Widgets from './Widgets';
import Alignment from './Toolbar/Format/Alignment';

import styles from './styles.css';
import {
  blockRenderer,
  entitiesDecorator,
  addEOLtoInlineEntity,
} from '../Entities';

class Draft extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.moveFocusToEnd(
        EditorState.createWithContent(
          convertFromRaw(this.props.content),
          entitiesDecorator,
        ),
      ),
    };
  }

  onChange = (editorState) => {
    const {
      actions: {
        editUnit,
      },
      unit: {
        sectionId,
        subsectionId,
        unitId,
      },
    } = this.props;

    // if (
      // editorState.getCurrentContent() !==
      // this.state.editorState.getCurrentContent()
    // ) {
    editUnit({
      sectionId,
      subsectionId,
      unitId,
      content: convertToRaw(
        editorState.getCurrentContent()
      ),
    });
    // }

    if (
      editorState.getLastChangeType() === 'undo'
      ||
      editorState.getLastChangeType() === 'redo'
    ) {
      this.setState({
        editorState: EditorState.set(
          editorState, {
            decorator: entitiesDecorator,
          }
        ),
      });
    } else {
      const currentContent = editorState.getCurrentContent();
      const blocks = currentContent.blockMap;
      const newEditorState = blocks.reduce(
        addEOLtoInlineEntity,
        editorState
      );
      this.setState({
        editorState: EditorState.set(
          newEditorState, {
            decorator: entitiesDecorator,
          }
        ),
      });
    }
    this.focusEditor();
  }

  setReference = (ref) => {
    this.editor = ref;
  };

  focusEditor = () => {
    setTimeout(() => {
      this.editor.focus();
    });
  };

  blockStyleFn = (block) => {
    const blockAlignment =
      block.getData()
      &&
      block.getData().get('text-align');
    return blockAlignment
      ? `${blockAlignment}-aligned-block`
      : '';
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

  render() {
    const { editorState } = this.state;
    return (
      <div className={styles.editor}>
        <div className={styles.toolbar}>
          <Alignment
            editorState={editorState}
            changeEditorState={this.onChange}
          />
        </div>
        <div
          className={styles.draft}
          onClick={this.focusEditor}
        >
          <Editor
            handleKeyCommand={this.handleKeyCommand}
            blockRendererFn={blockRenderer}
            blockRenderMap={this.customBlockRenderMap}
            blockStyleFn={this.blockStyleFn}
            editorState={editorState}
            spellCheck
            onChange={this.onChange}
            ref={this.setReference}
          />
        </div>
        <Widgets
          editorState={editorState}
          changeEditorState={this.onChange}
        />
      </div>
    );
  }
}

Draft.propTypes = {
  actions: PropTypes.object, // http://stackoverflow.com/a/33427304
  unit: PropTypes.shape({
    sectionId: PropTypes.string.isRequired,
    subsectionId: PropTypes.string.isRequired,
    unitId: PropTypes.string.isRequired,
  }),
  content: PropTypes.object,
};

export default Draft;
