// Состояние редактора не изменяется при выборе ответа - facebook/draft-js#185
// Нужно кликнуть по редактору

import React, {
  Component,
  PropTypes,
} from 'react';
import { isEqual } from 'lodash';
import { Entity } from 'draft-js';
import styles from './styles.css';

class Radio extends Component {

  constructor(props) {
    super(props);
    this.state = props.content;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState);
  }

  chooseAnswer(optionIndex) {
    const { entityKey } = this.props;
    Entity.replaceData(
      entityKey, {
        content: {
          ...this.state,
          answer: optionIndex,
        },
      },
    );
    this.setState({
      answer: optionIndex,
    });
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

  render() {
    const {
      answer,
      options,
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
              answer === index
              ? 'selected'
              : 'unselected'
            ]}
          >
            <input
              type="radio"
              name={entityKey}
              className={styles.radio}
              onChange={() =>
                this.chooseAnswer(index)
              }
              checked={answer === index}
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

Radio.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    answer: PropTypes.number,
    options: PropTypes.array.isRequired,
  }).isRequired,
};

export default Radio;
