import React, {
  PropTypes,
  Component,
} from 'react';
import { Entity } from 'draft-js';
import katex from 'katex';
import styles from '../../../../../../node_modules/katex/dist/katex.min.css'; // eslint-disable-line no-unused-vars

class TeX extends Component {

  componentDidMount() {
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
    const { content } = Entity.get(this.props.entityKey).getData();
    katex.render(
      prompt('Редактирование формулы', content) || content,
      this.refs.math,
    );
  }

  render() {
    return (
      <span
        ref="math"
        onDoubleClick={() => this.onClick()}
        contentEditable="false"
        style={{
          // borderBottom: '1px solid magenta',
          WebkitUserSelect: 'none',
          padding: '2.5px 5px',
          cursor: 'pointer',
        }}
      />
    );
  }
}

TeX.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default TeX;
