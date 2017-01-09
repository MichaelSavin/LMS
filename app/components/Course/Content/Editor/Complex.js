import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Editor as Draft,
  Entity,
  Modifier,
  RichUtils,
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
  SelectionState,
  AtomicBlockUtils,
} from 'draft-js';
import {
  customStyleMap,
} from 'draftjs-utils';
import {
  findIndex,
  unnest,
} from 'lodash/fp';
import Sortable from 'sortablejs';
import {
  blockRenderer,
  entitiesDecorator,
  addEOLtoInlineEntity,
} from '../Entities';
// import Popup from './Popup';
import styles from './styles.css';
import Toolbar from './Toolbar';

let tempChunk = []; // eslint-disable-line fp/no-let
const splitByChunks = (chunkedBlocks, block, key, array) => {
  const type = /unordered-list-item|ordered-list-item/.test(block.getType()) && block.getType();
  if (!key) { // Если это первый элемент в массиве
    tempChunk = [block]; // eslint-disable-line fp/no-mutation
    return chunkedBlocks;
  } else if (key === array.length - 1) { // Если это последний элемент в массиве
    // Если тип подходящий и прошлый тип был такой-же
    // объединяем временные блоки и этот блок в чанк
    if (type && type === tempChunk[0].getType()) {
      return [
        ...chunkedBlocks,
        [
          ...tempChunk,
          block,
        ],
      ];
    }
    return [
      ...chunkedBlocks,
      tempChunk,
      block,
    ];
  // Если тип подходящий и прошлый тип был такой-же
  } else if (type && type === tempChunk[0].getType()) {
    tempChunk = [ // eslint-disable-line fp/no-mutation
      ...tempChunk,
      block,
    ];
    return chunkedBlocks;
  }
  // Если тип прошлого блока отличается от нового
  const newChunkedBlocks = [
    ...chunkedBlocks,
    tempChunk,
  ];
  tempChunk = [block]; // eslint-disable-line fp/no-mutation
  return newChunkedBlocks;
};

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
      moveBlock: this.moveBlock,
      removeBlock: this.removeBlock,
      toggleReadOnly: this.toggleReadOnly,
      duplicateBlock: this.duplicateBlock,
    };
  }

  componentDidMount() {
    this.makeSortable();
  }

  componentDidUpdate(prevProps, prevState) {
    const oldBlocks = prevState.editorState.getCurrentContent().getBlocksAsArray().length;
    const blocks = this.state.editorState.getCurrentContent().getBlocksAsArray().length;
    if (oldBlocks !== blocks) this.makeSortable();
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
      unitId,
      sectionId,
      subsectionId,
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

  makeSortable = () => {
    const el = document.querySelector('.public-DraftEditor-content > div');
    Sortable.create(el, {
      animation: 350,
      handle: '.dragger__handle',
      chosenClass: styles.chosen,
      ghostClass: styles.ghost,
      onEnd: (event) => {
        const { oldIndex, newIndex } = event;
        const { editorState } = this.state;
        const blocksArray = editorState.getCurrentContent().getBlocksAsArray();
        // Т.к каждый элемент списка ul>li или ol>li для draft отдельный блок,
        // приходиться делить список блоков на чанки для правильной сортировки
        // пример [h1, table, li, li, li, h1] => [h1, table, [li, li, li], h1]
        const chunkedBlocks = blocksArray.reduce(splitByChunks, []);
        const block = chunkedBlocks[oldIndex];
        const shortArray = [
          ...chunkedBlocks.slice(0, oldIndex),
          ...chunkedBlocks.slice(oldIndex + 1),
        ];
        const newBlocksArray = [
          ...shortArray.slice(0, newIndex),
          block,
          ...shortArray.slice(newIndex),
        ];
        const newEditorState = EditorState.push(
          this.state.editorState,
          ContentState.createFromBlockArray(unnest(newBlocksArray)),
          ' '
        );
        this.onChange(newEditorState);
      },
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

  toggleReadOnly = () => {
    const { editorState, isReadOnly } = this.state;
    // Для сохранения изменений добавил установку фокуса
    // чтобы работало надо что-то поменять в редакторе.
    // TODO нужно найти способо сохранять автоматически
    this.setState({
      editorState: isReadOnly
        ? EditorState.moveFocusToEnd(editorState)
        : editorState,
      isReadOnly: !isReadOnly,
    });
  }

  // Глобальные методы передаваемые через context
  moveBlock = (blockKey, waySign) => {
    const { editorState } = this.state;
    const blocksArray = editorState.getCurrentContent().getBlocksAsArray();
    const blockIndex = findIndex((block) => block.getKey() === blockKey, blocksArray);
    const block = blocksArray[blockIndex];
    const shortArray = [
      ...blocksArray.slice(0, blockIndex),
      ...blocksArray.slice(blockIndex + 1),
    ];
    const newBlocksArray = [
      ...shortArray.slice(0, blockIndex + waySign),
      block,
      ...shortArray.slice(blockIndex + waySign),
    ];
    const newEditorState = EditorState.push(
      this.state.editorState,
      ContentState.createFromBlockArray(newBlocksArray),
      ' '
    );
    this.onChange(newEditorState);
  }

  removeBlock = (blockKey) => {
    const { editorState } = this.state;
    const content = this.state.editorState.getCurrentContent();
    const block = content.getBlockForKey(blockKey);
    const targetRange = new SelectionState({
      focusKey: blockKey,
      anchorKey: blockKey,
      focusOffset: block.getLength(),
      anchorOffset: 0,
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
        Entity.add(
          Entity.get(entityKey)
        ),
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
  moveBlock: PropTypes.func.isRequired,
  removeBlock: PropTypes.func.isRequired,
  toggleReadOnly: PropTypes.func.isRequired,
  duplicateBlock: PropTypes.func.isRequired,
};

Editor.propTypes = {
  unit: PropTypes.shape({
    sectionId: PropTypes.string.isRequired,
    subsectionId: PropTypes.string.isRequired,
    unitId: PropTypes.string.isRequired,
  }),
  actions: PropTypes.object, // http://stackoverflow.com/a/33427304
  content: PropTypes.object,
};

export default Editor;
