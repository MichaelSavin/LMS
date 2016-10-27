// Состояние редактора не изменяется при выборе ответа - facebook/draft-js#185
// Нужно кликнуть по редактору

import React, { Component, PropTypes } from 'react';
import AntPromt from 'components/UI/Promt';
import { Radio as AntRadio } from 'antd';
import { isEqual, uniq } from 'lodash';
import { Entity } from 'draft-js';
import styles from './styles.css';

class Radio extends Component {

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

  chooseAnswer = (event) => {
    const {
      value: answer,
    } = event.target;
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          options: this
            .state
            .options,
          answer,
        },
      },
    );
    this.setState({ answer });
  }

  modifyOptions = () => {
    const options = uniq(
      this.state
      .promt.value
      .split(';'));
    const answer =
      this.state.answer > options.length - 1
        ? undefined
        : this.state.answer;
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          answer,
          options,
        },
      }
    );
    this.setState({
      answer,
      options,
      promt: {
        open: false,
      },
    });
  }

  render() {
    const {
      promt,
      answer,
      options,
    } = this.state;
    return (
      <div
        className={styles.radio}
        onContextMenu={this.editOptions}
      >
        <AntRadio.Group
          onChange={this.chooseAnswer}
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

Radio.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    answer: PropTypes.number,
    options: PropTypes.array.isRequired,
  }).isRequired,
};

export default Radio;
