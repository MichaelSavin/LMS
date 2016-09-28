import {
  Entity,
  Modifier,
  EditorState,
  // SelectionState,
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

const insertInlineEntity = (type, content, editorState, changeState) => {
  changeState(
    EditorState.push( // eslint-disable-line fp/no-mutating-methods
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

export { findEntities, insertInlineEntity };
