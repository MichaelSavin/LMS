import React, {
  PropTypes,
  Component,
} from 'react';
import Immutable, { List } from 'immutable';
import { Entity } from 'draft-js';
import styles from './styles.css';

class Select extends Component {

  constructor(props) {
    super(props);
    const {
      answer,
      options,
    } = Entity
      .get(this.props.entityKey)
      .getData()
      .content;
    this.state = {
      answer,
      options: List(options),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const [
      currentOptions,
      nextOptions,
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
       .options
    );
    return this.state.answer !==
      nextState.answer
    ||
      !Immutable.is(
        this.state.options,
        nextState.options,
      )
    ||
      !Immutable.is(
        currentOptions,
        nextOptions
      );
  }

  editOptions() {
    const { entityKey } = this.props;
    const { content } = Entity
      .get(entityKey)
      .getData();
    const options = content.options.join(',');
    const newOptions = List((
      prompt('Редактирование вопроса', options) || options
    ).split(','));
    const newContent = {
      options: newOptions,
      answer: content.answer,
    };
    Entity.replaceData(entityKey, { content: newContent });
    this.setState({ options: newOptions });
  }

  chooseAnswer(optionIndex) {
    const newContent = {
      ...this.state,
      answer: optionIndex,
    };
    Entity.replaceData(
      this.props.entityKey, {
        content: newContent,
      }
    );
    this.setState({ answer: optionIndex });
  }

  render() {
    const {
      options,
      answer,
    } = this.state;
    return (
      <select
        onContextMenu={(event) => {
          event.preventDefault();
          return this.editOptions();
        }}
        onChange={event =>
          this.chooseAnswer(
            event.target.selectedIndex
          )
        }
        contentEditable="false"
        value={options.get(answer - 1)}
        className={styles.select}
      >
        <option />
        {options.map((text, index) =>
          <option key={index}>
            {text}
          </option>
        )}
      </select>
    );
  }
}

Select.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Select;
