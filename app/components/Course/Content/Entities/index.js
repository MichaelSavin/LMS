import React from 'react';
import {
  Entity,
  Modifier,
  EditorState,
  AtomicBlockUtils,
  CompositeDecorator,
} from 'draft-js';

import TeX from './TeX';
import Link from './Link';
import Input from './Input';
import Radio from './Radio';
import Select from './Select';

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
        '*',
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

const entitiesDecorator = new CompositeDecorator([{
  strategy: findEntities('LINK'),
  component: Link,
}, {
  strategy: findEntities('TEX'),
  component: TeX,
}, {
  strategy: findEntities('INPUT'),
  component: Input,
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
    case 'RADIO':
      return (
        <Radio
          content={content}
          entityKey={entityKey}
        />
      );
    // case 'CHECKBOX':
    //   return <Checkbox options={content.options} />;
    default:
      return undefined;
  }
};

const insertBlockEntity = (
  type,
  content,
  editorState,
  changeEditorState
) => {
  changeEditorState(
    AtomicBlockUtils.insertAtomicBlock(
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

export {
  blockRenderer,
  entitiesDecorator,
  insertBlockEntity,
  insertInlineEntity,
};
