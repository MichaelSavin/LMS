// Состояние редактора не изменяется при выборе ответов - facebook/draft-js#185
// Нужно кликнуть по редактору

import React, { Component, PropTypes } from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import AntPromt from 'components/UI/Promt';
import { isEqual, uniq } from 'lodash';
import { Entity } from 'draft-js';
import Editor from './Editor';
import Preview from './Preview';
import styles from './styles.css';

class Checkbox extends Component {

  constructor(props) {
    super(props);
    const { content } = props;
    this.state = {
      modal: false,
      temp: content,
      content,
    };
    this.images = {};
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


  openModal = () => {
    this.setState({
      modal: true,
      temp: this
        .state
        .content,
    });
  }

  closeModal = () => {
    this.setState({
      modal: false,
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
      content,
      modal,
      temp,
    } = this.state;
    return (
      <div
        className={styles.checkbox}
        onDoubleClick={this.openModal}
      >
        <Preview
          data={content}
        />
        <Editor
          data={temp}
          isOpen={modal}
          closeModal={this.closeModal}
          saveSettings={this.saveSettings}
        />
      </div>
    );
  }
}

Checkbox.defaultProps = {
  content: {
    question: 'Где могут жить утки?',
    answers: [
      { value: 'Здесь', checked: false, image: null },
      { value: 'Тут', checked: true, image: null },
      { value: 'Вот же', checked: true, image: null },
      { value: 'Ага, вот отличное место', checked: true, image: null },
    ],
  },
};

export default Checkbox;
