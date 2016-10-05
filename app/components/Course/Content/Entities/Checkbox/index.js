// Состояние редактора не изменяется при выборе ответов - facebook/draft-js#185
// Нужно кликнуть по редактору

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Checkbox as AntCheckbox,
} from 'antd';
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

  toggleAnswer(newAnswers) {
    Entity.replaceData(
      this.props.entityKey, {
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
    return (
      <div
        className={styles.checkbox}
        onContextMenu={(event) => {
          event.preventDefault();
          return this.editOptions();
        }}
      >
        <AntCheckbox.Group
          options={options}
          defaultValue={answers}
          onChange={newAnswers =>
            this.toggleAnswer(newAnswers)
          }
        />
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
