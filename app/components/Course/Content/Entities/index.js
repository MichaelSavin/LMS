import React from 'react';
import {
  Entity,
  Modifier,
  EditorState,
  SelectionState,
  AtomicBlockUtils,
  CompositeDecorator,
} from 'draft-js';

import Tag from './Inline/Tag';
import TeX from './Inline/TeX';
import Link from './Inline/Link';
import Hint from './Block/Hint';
import Rate from './Inline/Rate';
import Alert from './Inline/Alert';
import Input from './Inline/Input';
import Radio from './Block/Radio';
import Slider from './Block/Slider';
import Select from './Inline/Select';
import Switch from './Inline/Switch';
import Upload from './Block/Upload';
import Progress from './Block/Progress';
import Carousel from './Block/Carousel';
import Timeline from './Block/Timeline';
import Checkbox from './Block/Checkbox';
import Textarea from './Block/Textarea';

const findEntities = type => (
  contentBlock,
  callback
) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === type
      );
    },
    callback
  );
};

const entitiesDecorator = new CompositeDecorator([{
  strategy: findEntities('LINK'),
  component: Link,
}, {
  strategy: findEntities('TEX'),
  component: TeX,
}, {
  strategy: findEntities('TAG'),
  component: Tag,
}, {
  strategy: findEntities('RATE'),
  component: Rate,
}, {
  strategy: findEntities('INPUT'),
  component: Input,
}, {
  strategy: findEntities('SWITCH'),
  component: Switch,
}, {
  strategy: findEntities('SELECT'),
  component: Select,
}]);

const blockRenderer = block =>
  block.getType() === 'atomic'
    ? { component: Block, editable: false }
    : undefined;

const Block = ({ block }) => { // eslint-disable-line react/prop-types
  const entityKey = block.getEntityAt(0);
  const entity = Entity.get(entityKey);
  const { content } = entity.getData();
  switch (entity.getType()) {
    case 'TEXTAREA':
      return (
        <Textarea
          content={content}
          entityKey={entityKey}
        />
      );
    case 'RADIO':
      return (
        <Radio
          content={content}
          entityKey={entityKey}
        />
      );
    case 'SLIDER':
      return (
        <Slider
          content={content}
          entityKey={entityKey}
        />
      );
    case 'CHECKBOX':
      return (
        <Checkbox
          content={content}
          entityKey={entityKey}
        />
      );
    case 'HINT':
      return (
        <Hint
          content={content}
          entityKey={entityKey}
        />
      );
    case 'ALERT':
      return (
        <Alert
          content={content}
          entityKey={entityKey}
        />
      );
    case 'TIMELINE':
      return (
        <Timeline
          content={content}
          entityKey={entityKey}
        />
      );
    case 'CAROUSEL':
      return (
        <Carousel
          content={content}
          entityKey={entityKey}
        />
      );
    case 'PROGRESS':
      return (
        <Progress
          content={content}
          entityKey={entityKey}
        />
      );
    case 'UPLOAD':
      return (
        <Upload
          content={content}
          entityKey={entityKey}
        />
      );
    default:
      return undefined;
  }
};

const addEOLtoInlineEntity = (editorState, block) => { // REFACTORING
  const blockKey = block.key;
  const characterList = block.characterList;
  if (!characterList.isEmpty() && characterList.last().getEntity()) {
    if (editorState.getLastChangeType() === 'backspace-character') {
      const selection = new SelectionState({
        anchorKey: blockKey,
        anchorOffset: block.getLength() - 1,
        focusKey: blockKey,
        focusOffset: block.getLength(),
        hasFocus: true,
      });
      const modifiedContent = Modifier.removeRange(
        editorState.getCurrentContent(),
        selection,
        'backward'
      );
      return EditorState.push(
        editorState,
        modifiedContent,
        editorState.getLastChangeType()
      );
    } else { // eslint-disable-line no-else-return
      const selection = new SelectionState({
        anchorKey: blockKey,
        anchorOffset: block.getLength(),
        focusKey: blockKey,
        focusOffset: block.getLength(),
        hasFocus: true,
      });
      const zwwsp = String.fromCharCode(8203);
      const modifiedContent = Modifier.insertText(
        editorState.getCurrentContent(),
        selection,
        zwwsp
      );
      return EditorState.push(
        editorState,
        modifiedContent,
        editorState.getLastChangeType()
      );
    }
  } else { // eslint-disable-line no-else-return
    return editorState;
  }
};

const insertBlockEntity = (
  type,
  content,
  editorState,
  changeEditorState
) => {
  changeEditorState(
    AtomicBlockUtils
      .insertAtomicBlock(
        editorState,
        Entity.create(
          type,
          'IMMUTABLE',
          { content },
        ),
      ' '
    )
  );
};

const insertInlineEntity = (
  type,
  content,
  editorState,
  changeEditorState,
) => {
  changeEditorState(
    EditorState.push(
      editorState,
      Modifier.insertText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        ' ',
        null,
        Entity.create(
          type,
          'IMMUTABLE',
          { content }
        ),
      ),
      'insert-text'
    )
  );
};

const insertEntity = (
  editorState,
  changeEditorState
) => ({
  view: entityView,
  type: entityType,
  content: entityContent,
}) => {
  const args = [
    entityType,
    entityContent,
    editorState,
    changeEditorState,
  ];
  switch (entityView) {
    case 'BLOCK':
      return insertBlockEntity(...args);
    case 'INLINE':
      return insertInlineEntity(...args);
    default:
      return null;
  }
};

export {
  insertEntity,
  blockRenderer,
  entitiesDecorator,
  addEOLtoInlineEntity,
};
