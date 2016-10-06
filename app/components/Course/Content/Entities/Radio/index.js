// Состояние редактора не изменяется при выборе ответа - facebook/draft-js#185
// Нужно кликнуть по редактору

import React, {
  Component,
  PropTypes,
} from 'react';
import { isEqual } from 'lodash';
import { Entity } from 'draft-js';
import { Radio as AntRadio } from 'antd';
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
    Entity.replaceData(
      this.props.entityKey, {
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
    return (
      <div
        className={styles.radio}
        onContextMenu={(event) => {
          event.preventDefault();
          return this.editOptions();
        }}
      >
        <AntRadio.Group
          onChange={event =>
            this.chooseAnswer(
              event.target.value
            )
          }
          value={answer}
        >
          {options.map((option, index) =>
            <AntRadio
              key={index}
              value={index}
            >
              {option}
            </AntRadio>
          )}
        </AntRadio.Group>
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
