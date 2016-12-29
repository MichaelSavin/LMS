import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Editor as Draft,
  Modifier,
  RichUtils,
  EditorState,
  convertToRaw,
  convertFromRaw,
  SelectionState,
  AtomicBlockUtils,
} from 'draft-js';
import {
  customStyleMap,
} from 'draftjs-utils';
import {
  blockRenderer,
  entitiesDecorator,
  addEOLtoInlineEntity,
} from '../Entities';
// import Popup from './Popup';
import styles from './styles.css';
import Toolbar from './Toolbar';

class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFocused: true,
      isReadOnly: false,
      editorState: EditorState.moveFocusToEnd(
        EditorState.createWithContent(
          convertFromRaw(this.props.content),
          entitiesDecorator,
        ),
      ),
    };
  }

  getChildContext() {
    return {
      removeBlock: this.removeBlock,
      duplicateBlock: this.duplicateBlock,
      toggleReadOnly: this.toggleReadOnly,
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

    const newEditorState =
      ['undo', 'redo'].includes(
        editorState.getLastChangeType())
        ? editorState
        : editorState.getCurrentContent()
          .blockMap.reduce(
            addEOLtoInlineEntity,
            editorState
          );

    this.setState({
      editorState: EditorState.set(
        newEditorState, {
          decorator: entitiesDecorator,
        }
      ),
    }); // , () => { setTimeout(() => this.focusEditor(), 0); });
  }

  setFocusStatus = (e) => this.setState({
    isFocused: e.type === 'focus',
  })

  toggleReadOnly = () => {
    const { editorState, isReadOnly } = this.state;
    // Для сохранения изменений добавил установку фокуса
    // TODO чтобы работало надо что-то поменять в редакторе.
    this.setState({
      editorState: isReadOnly
        ? EditorState.moveFocusToEnd(editorState)
        : editorState,
      isReadOnly: !isReadOnly,
    });
  }

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

  removeBlock = (blockKey) => {
    const { editorState } = this.state;
    const content = this.state.editorState.getCurrentContent();
    const block = content.getBlockForKey(blockKey);
    const targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: block.getLength(),
    });
    const withoutBlock = Modifier.removeRange(content, targetRange, 'backward');
    const resetBlock = Modifier.setBlockType(
      withoutBlock,
      withoutBlock.getSelectionAfter(),
      'unstyled'
    );
    const newState = EditorState.push(editorState, resetBlock, 'remove-range');
    this.onChange(
      EditorState.forceSelection(newState, resetBlock.getSelectionAfter())
    );
  }

  duplicateBlock = (entityKey) => {
    this.onChange(AtomicBlockUtils
      .insertAtomicBlock(
        this.state.editorState,
        entityKey,
        ' '
    ));
  }

  render() {
    const {
      isReadOnly,
      editorState,
    } = this.state;
    return (
      <div className={styles.editor}>
        <Toolbar
          editorState={editorState}
          changeEditorState={this.onChange}
        />
        <div
          id="viewport"
          className={styles.draft}
        >
          <Draft
            ref="editor"
            onBlur={this.setFocusStatus}
            onFocus={this.setFocusStatus}
            onChange={this.onChange}
            readOnly={isReadOnly}
            editorState={editorState}
            blockStyleFn={this.blockStyleFn}
            customStyleFn={this.customStyleFn}
            blockRenderMap={this.customBlockRenderMap}
            customStyleMap={customStyleMap}
            blockRendererFn={blockRenderer}
            handleKeyCommand={this.handleKeyCommand}
            // ref={this.setReference}
            // spellCheck
          />
          { /*
            <Popup
              isFocused={isFocused}
              editorRef={this.refs.editor}
              editorState={editorState}
              changeEditorState={this.onChange}
            />
          */ }
        </div>
      </div>
    );
  }
}

Editor.childContextTypes = {
  toggleReadOnly: PropTypes.func.isRequired,
  removeBlock: PropTypes.func.isRequired,
  duplicateBlock: PropTypes.func.isRequired,
};

Editor.propTypes = {
  actions: PropTypes.object, // http://stackoverflow.com/a/33427304
  unit: PropTypes.shape({
    sectionId: PropTypes.string.isRequired,
    subsectionId: PropTypes.string.isRequired,
    unitId: PropTypes.string.isRequired,
  }),
  content: PropTypes.object,
};

export default Editor;
