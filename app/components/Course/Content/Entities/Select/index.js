import React, {
  PropTypes,
  Component,
} from 'react';
import { Entity } from 'draft-js';

// import styles from './styles.css';

class Select extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: Entity
        .get(this.props.entityKey)
        .getData()
        .content,
    };
  }

  // onClick() {
  //   const { content } = Entity
  //     .get(this.props.entityKey)
  //     .getData();
  //   this.setState = ({
  //     content: prompt('Редактирование', content) || content,
  //   });
  // }

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

  render() {
    console.log(this.state.content);
    return (
      <span
        // onClick={() => this.onClick()}
        contentEditable="false"
        style={{
          cursor: 'pointer',
          height: '40px',
          border: '1px solid #CCC',
          margin: '0 5px',
          borderRadius: '3px',
          backgroundColor: '#EEE',
          WebkitUserSelect: 'none',
        }}
      >
        <select>
          <option />
          {this.state.content.split(',').map((text, index) =>
            <option key={index}>{text}</option>
          )}
        </select>
      </span>
    );
  }
}

Select.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Select;
