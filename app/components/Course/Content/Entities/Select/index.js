import React, {
  PropTypes,
  Component,
} from 'react';
import Immutable, { fromJS } from 'immutable';
import { Entity } from 'draft-js';
import styles from './styles.css';

class Select extends Component {

  constructor(props) {
    super(props);
    this.state = Entity
      .get(this.props.entityKey)
      .getData()
      .content;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const [
      currentPropsContent,
      nextPropsContent,
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
    return !Immutable.is(
      fromJS(this.state),
      fromJS(nextState),
      )
    ||
      !Immutable.is(
        fromJS(currentPropsContent),
        fromJS(nextPropsContent)
      );
  }

  editOptions() {
    const { entityKey } = this.props;
    const { content } = Entity
      .get(entityKey)
      .getData();
    const options = content.options.join(',');
    const newOptions = (
      prompt('Редактирование вопроса', options) || options
    );
    const newContent = {
      options: newOptions.split(','),
      answer: content.answer,
    };
    Entity.replaceData(entityKey, { content: newContent });
    this.setState(newContent);
  }

  chooseAnswer(optionIndex) {
    const newContent = {
      options: this.state.options,
      answer: optionIndex,
    };
    Entity.replaceData(
      this.props.entityKey, {
        content: newContent,
      }
    );
    this.setState(newContent);
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
        value={options[answer - 1]}
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
