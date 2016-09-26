import {
  Entity,
  Modifier,
  EditorState,
} from 'draft-js';

const findEntities = type => (contentBlock, callback) => {
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

const insertEntity = (
  type,
  content,
  editorState,
  changeState,
) => {
  const entity = Entity.create(
    type,
    'IMMUTABLE',
    { content }
  );
  const element = Modifier.insertText(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    '*',
    null,
    entity
  );
  changeState(
    EditorState.push( // eslint-disable-line fp/no-mutating-methods
      editorState,
      element,
      'insert-text'
    )
  );
};

export { findEntities, insertEntity };
