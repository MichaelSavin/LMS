import React from 'react';
import {
  Entity,
  Modifier,
  EditorState,
  SelectionState,
  AtomicBlockUtils,
  CompositeDecorator,
} from 'draft-js';

import Tag from './Tag';
import TeX from './TeX';
import Link from './Link';
import Tree from './Tree';
import Crop from './Crop';
import Card from './Card';
import Hint from './Hint';
import Rate from './Rate';
import Alert from './Alert';
import Input from './Input';
import Radio from './Radio';
import Table from './Table';
import Video from './Video';
import Image from './Image';
import Slider from './Slider';
import Select from './Select';
import Switch from './Switch';
import Upload from './Upload';
import Collapse from './Collapse';
import Transfer from './Transfer';
import Progress from './Progress';
import Carousel from './Carousel';
import Timeline from './Timeline';
import Checkbox from './Checkbox';
import Textarea from './Textarea';
import Sample from './Sample';

const components = { // можно использовать require()
  TAG: Tag,
  TEX: TeX,
  LINK: Link,
  TREE: Tree,
  CARD: Card,
  CROP: Crop,
  HINT: Hint,
  RATE: Rate,
  ALERT: Alert,
  INPUT: Input,
  RADIO: Radio,
  TABLE: Table,
  VIDEO: Video,
  IMAGE: Image,
  SLIDER: Slider,
  UPLOAD: Upload,
  SELECT: Select,
  SWITCH: Switch,
  COLLAPSE: Collapse,
  TRANSFER: Transfer,
  PROGRESS: Progress,
  CAROUSEL: Carousel,
  TIMELINE: Timeline,
  CHECKBOX: Checkbox,
  TEXTAREA: Textarea,
  SAMPLE: Sample,
};

const views = {
  TREE: 'BLOCK',
  CARD: 'BLOCK',
  CROP: 'BLOCK',
  HINT: 'BLOCK',
  ALERT: 'BLOCK',
  RADIO: 'BLOCK',
  TABLE: 'BLOCK',
  VIDEO: 'BLOCK',
  IMAGE: 'BLOCK',
  SLIDER: 'BLOCK',
  UPLOAD: 'BLOCK',
  COLLAPSE: 'BLOCK',
  TRANSFER: 'BLOCK',
  PROGRESS: 'BLOCK',
  CAROUSEL: 'BLOCK',
  TIMELINE: 'BLOCK',
  CHECKBOX: 'BLOCK',
  TEXTAREA: 'BLOCK',
  LINK: 'INLINE',
  TEX: 'INLINE',
  TAG: 'INLINE',
  RATE: 'INLINE',
  INPUT: 'INLINE',
  SWITCH: 'INLINE',
  SELECT: 'INLINE',
  SAMPLE: 'BLOCK',
};

const findEntities = (type) => (
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

const entitiesDecorator = new CompositeDecorator(
  Object.keys(views)
    .filter((type) => views[type] === 'INLINE')
    .map((type) => ({
      strategy: findEntities(type),
      component: components[type],
    }))
);

const blockRenderer = (block) =>
  block.getType() === 'atomic'
    ? { component: Block, editable: false }
    : undefined;

const Block = ({ block }) => { // eslint-disable-line react/prop-types
  const entityKey = block.getEntityAt(0);
  const entity = Entity.get(entityKey);
  return React.createElement(
    components[
      entity.getType()
    ], {
      ...entity.getData(),
      entityKey,
    },
    null
  );
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
  entityType,
  editorState,
  changeEditorState,
  location = undefined,
) => {
  changeEditorState(
    AtomicBlockUtils
      .insertAtomicBlock(
        editorState,
        Entity.create(
          entityType,
          'IMMUTABLE',
          { location },
        ),
      ' '
    ),
  );
};

const insertInlineEntity = (
  entityType,
  editorState,
  changeEditorState,
  location = undefined,
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
          entityType,
          'IMMUTABLE',
          { location }
        ),
      ),
      ' '
    ),
  );
};

const insertEntity = (
  entityType,
  editorState,
  changeEditorState,
  location = undefined,
) => {
  const args = [
    entityType,
    editorState,
    changeEditorState,
    location,
  ];
  switch (views[entityType]) {
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
