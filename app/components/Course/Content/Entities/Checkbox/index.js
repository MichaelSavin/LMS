// Состояние редактора не изменяется при выборе ответов - facebook/draft-js#185
// Нужно кликнуть по редактору

import React, {
  Component,
  PropTypes,
} from 'react';
import { isEqual } from 'lodash';
import { Entity } from 'draft-js';
import styles from './styles.css';

class Checkbox extends Component {

  constructor(props) {
    super(props);
    this.state = props.content;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState);
  }

  editOptions() {
    const { entityKey } = this.props;
    const options = this.state.options.join(',');
    const newOptions = (
      prompt('Редактирование вопроса', options)
     || options
    ).split(',');
    Entity.replaceData(entityKey, {
      content: {
        ...this.state,
        options: newOptions,
      },
    });
    this.setState({
      options: newOptions,
    });
  }

  toggleAnswer(optionIndex, entityKey, checked) {
    const { answers = [] } = this.state;
    const newAnswers = checked
      ? [...answers, optionIndex]
      : answers.filter(answer => answer !== optionIndex);
    Entity.replaceData(
      entityKey, {
        content: {
          ...this.state,
          answers: newAnswers,
        },
      },
    );
    this.setState({
      answers: newAnswers,
    });
  }


  render() {
    const {
      options,
      answers = [],
    } = this.state;
    const {
      entityKey,
    } = this.props;
    return (
      <div
        className={styles.container}
        onContextMenu={(event) => {
          event.preventDefault();
          return this.editOptions();
        }}
      >
        {options.map((option, index) =>
          <p
            key={index}
            className={styles[
              answers.includes(index)
              ? 'selected'
              : 'unselected'
            ]}
          >
            <input
              type="checkbox"
              name={entityKey}
              className={styles.checkbox}
              onChange={(event) => {
                this.toggleAnswer(
                  index,
                  entityKey,
                  event.target.checked,
                );
              }}
              checked={answers.includes(index)}
            />
            <span
              className={styles.value}
            >
              {option}
            </span>
          </p>
        )}
      </div>
    );
  }
}

Checkbox.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    answers: PropTypes.array,
    options: PropTypes.array.isRequired,
  }).isRequired,
};

export default Checkbox;
