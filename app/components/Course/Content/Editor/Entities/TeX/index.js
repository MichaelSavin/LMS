import React, {
  PropTypes,
  Component,
} from 'react';
import {
  Entity,
  Modifier,
  EditorState,
} from 'draft-js';
import katex from 'katex';
import styles from '../../../../../../../node_modules/katex/dist/katex.min.css'; // eslint-disable-line no-unused-vars

class TeX extends Component {

  componentDidMount() {
    console.log('mount KaTeX');
    katex.render(
      Entity
        .get(this.props.entityKey)
        .getData()
        .content,
    this.refs.math);
  }

  shouldComponentUpdate(nextProps) {
    const [
      currentContent,
      nextContent,
    ] = [
      this.props,
      nextProps,
    ].map(props =>
      props.entityKey
    ).map(entity =>
      Entity
       .get(this.props.entityKey)
       .getData(entity)
       .content
    );
    return currentContent !== nextContent;
  }

  onClick() {
    console.log('update KaTeX');
    const { content } = Entity.get(this.props.entityKey).getData();
    katex.render(
      prompt('Редактирование формулы', content) || content,
      this.refs.math,
    );
  }

  render() {
    console.log('render KaTeX');
    return (
      <span
        ref="math"
        onClick={() => this.onClick()}
        // contentEditable="false"
        style={{
          borderBottom: '1px solid magenta',
          padding: '2.5px 5px',
          cursor: 'pointer',
        }}
      />
    );
  }
}

const findTeXEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'TEX'
      );
    },
    callback
  );
};

const insertTeX = (editorState, changeState) => {
  const entity = Entity.create(
    'TEX',
    'IMMUTABLE',
    { content: 'a^n+b^n = c^n' }
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

TeX.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export { TeX as default, findTeXEntities, insertTeX };
