import {
  Entity,
  Modifier,
  EditorState,
  CompositeDecorator,
} from 'draft-js';

import TeX from './TeX';
import Link from './Link';
import Input from './Input';
import Select from './Select';

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

export {
  entitiesDecorator,
  insertInlineEntity,
};
