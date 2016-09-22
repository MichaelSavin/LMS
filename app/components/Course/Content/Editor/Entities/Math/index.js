/* eslint-disable */
import React, { PropTypes } from 'react';
import {
  Entity,
  Modifier,
  EditorState,
  SelectionState,
  AtomicBlockUtils,
} from 'draft-js';
import katex from 'katex';
import styles from './styles.css';

class Output extends React.Component {
  constructor(props) {
    super(props);
    this._timer = null;
  }

  update() {
    if (this._timer) {
      clearTimeout(this._timer);
    }

    this._timer = setTimeout(() => {
      katex.render(
        this.props.content,
        this.refs.container,
        {displayMode: true},
      );
    }, 0);
  }

  componentDidMount() {
    this._update();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.content !== this.props.content) {
      this._update();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
    this._timer = null;
  }

  render() {
    return <div ref="container" onClick={this.props.onClick} />;
  }
}

class Tex extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editMode: false };

    this.onClick = () => {
      if (this.state.editMode) {
        return;
      }

      this.setState({
        editMode: true,
        texValue: this.getValue(),
      }, () => {
        this.startEdit();
      });
    };

    this.onValueChange = (evt) => {
      let value = evt.target.value;
      let invalid = false;
      try {
        katex.__parse(value);
      } catch (e) {
        invalid = true;
      } finally {
        this.setState({
          invalidTeX: invalid,
          texValue: value,
        });
      }
    };

    this.save = () => {
      const entityKey = this.props.block.getEntityAt(0);
      Entity.mergeData(entityKey, {content: this.state.texValue});
      this.setState({
        invalidTeX: false,
        editMode: false,
        texValue: null,
      }, this._finishEdit);
    };

    this.remove = () => {
      this.props.blockProps.onRemove(this.props.block.getKey());
    };
    this.startEdit = () => {
      this.props.blockProps.onStartEdit(this.props.block.getKey());
    };
    this.finishEdit = () => {
      this.props.blockProps.onFinishEdit(this.props.block.getKey());
    };
  }

  getValue() {
    return Entity
      .get(this.props.block.getEntityAt(0))
      .getData().content;
  }

  render() {
    // var texContent = null;

    const texContent = this.state.editMode
      ? this.state.invalidTeX
        ? ''
        : this.state.texValue
      : this.getValue();

    // if (this.state.editMode) {
    //   if (this.state.invalidTeX) {
    //     texContent = '';
    //   } else {
    //     texContent = this.state.texValue;
    //   }
    // } else {
    //   texContent = this._getValue();
    // }

    const className = this.state.editMode
      ? 'TeXEditor-tex'
      : 'TeXEditor-tex TeXEditor-activeTeX';

    // var className = 'TeXEditor-tex';
    // if (this.state.editMode) {
    //   className += ' TeXEditor-activeTeX';
    // }

    // var editPanel = null;

    const buttonClass = this.state.editMode
      ? this.state.invalidTeX
        ? 'TeXEditor-saveButton TeXEditor-invalidButton'
        : 'TeXEditor-saveButton'
      : '';

    // if (this.state.editMode) {
    //   var buttonClass = 'TeXEditor-saveButton';
    //   if (this.state.invalidTeX) {
    //     buttonClass += ' TeXEditor-invalidButton';
    //   }

    const editPanel = (
      <div className="TeXEditor-panel">
        <textarea
          className="TeXEditor-texValue"
          onChange={this.onValueChange}
          ref="textarea"
          value={this.state.texValue}
        />
        <div className="TeXEditor-buttons">
          <button
            className={buttonClass}
            disabled={this.state.invalidTeX}
            onClick={this.save}
          >
            {this.state.invalidTeX ? 'Invalid TeX' : 'Done'}
          </button>
          <button className="TeXEditor-removeButton" onClick={this.remove}>
            Remove
          </button>
        </div>
      </div>
    );

    return (
      <div className={className}>
        <Output content={texContent} onClick={this.onClick} />
        {editPanel}
      </div>
    );
  }
}

const insertTeX = (editorState) => {
  const entityKey = Entity.create(
    'TOKEN',
    'IMMUTABLE',
    { content: 'Формула' },
  );
  return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
};

const removeTeX = (editorState, blockKey) => {
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(blockKey);

  const targetRange = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: block.getLength(),
  });

  const withoutTeX = Modifier.removeRange(content, targetRange, 'backward');
  const resetBlock = Modifier.setBlockType(
    withoutTeX,
    withoutTeX.getSelectionAfter(),
    'unstyled',
  );

  const newState = EditorState.push(editorState, resetBlock, 'remove-range');
  return EditorState.forceSelection(newState, resetBlock.getSelectionAfter());
};

Tex.propTypes = {};

export { Tex as default, insertTeX, removeTeX };
