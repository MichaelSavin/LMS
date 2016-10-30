// Состояние редактора не изменяется при выборе ответов - facebook/draft-js#185
// Нужно кликнуть по редактору

import React, { Component, PropTypes } from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import AntPromt from 'components/UI/Promt';
import { isEqual, uniq } from 'lodash';
import { Entity } from 'draft-js';
import styles from './styles.css';

class Checkbox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props.content,
      promt: {
        open: false,
        value: null,
      },
    };
  }

  shouldComponentUpdate(
    nextProps,
    nextState
  ) {
    return !isEqual(
      this.state,
      nextState
    );
  }

  editOptions = (event) => {
    event.preventDefault();
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .options
          .join(';'),
      },
    });
  }

  modifyOptions = () => {
    const options = uniq(
      this
      .state
      .promt
      .value
      .split(';')
    );
    const answers = this
      .state
      .answers
      .slice(0, options.length);
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          options,
          answers,
        },
      }
    );
    this.setState({
      options,
      answers,
      promt: {
        open: false,
      },
    });
  }

  toggleAnswer = (answers) => {
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          answers,
          options: this
            .state
            .options,
        },
      },
    );
    this.setState({
      answers,
    });
  }

  render() {
    const {
      promt,
      options,
      answers = [],
    } = this.state;
    return (
      <div
        className={styles.checkbox}
        onContextMenu={this.editOptions}
      >
        <AntCheckbox.Group
          options={options}
          defaultValue={answers}
          onChange={this.toggleAnswer}
        />

        <AntPromt
          value={promt.value}
          onSave={this.modifyOptions}
          visible={promt.open}
          onChange={(event) => {
            this.setState({
              promt: {
                ...promt,
                value: event
                  .target
                  .value,
              },
            });
          }}
          onCancel={() => {
            this.setState({
              promt: {
                ...promt,
                open: false,
              },
            });
          }}
        />
      </div>
    );
  }
}

Checkbox.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    answers: PropTypes.array.isRequired,
    options: PropTypes.array.isRequired,
  }).isRequired,
};

Checkbox.defaultProps = {
  content: {
    answers: [],
    options: [
      'Вариант 1',
      'Вариант 2',
      'Вариант 3',
      'Вариант 4',
    ],
  },
};

export default Checkbox;