
// Состояние редактора не изменяется при выборе ответов - facebook/draft-js#185
// Нужно кликнуть по редактору

import React, { Component, PropTypes } from 'react';
import {
  set,
  update,
  remove,
  isEqual,
} from 'lodash/fp';
import { Checkbox as AntCheckbox } from 'antd';
import AntPromt from 'components/UI/Promt';
import { Entity } from 'draft-js';
import localForage from 'localforage';
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

  componentDidMount() {
    this.receiveImages(this.state);
  }

  shouldComponentUpdate(
    nextProps,
    nextState
  ) {
    if (!isEqual(
    ...[this.state, nextState]
      .map((state) => state
        .temp
        .answers
        .map((answer) =>
          answer.image
        )
      )
    )) {
      this.receiveImages(this.state);
      return false;
    }
    return !isEqual(
      this.state,
      nextState
    );
  }

  receiveImages = (state) => {
    state.temp.answers.forEach(({
      image,
    }) => {
      if (image) {
        localForage
          .getItem(image)
          .then((value) => {
            this.images[image] = value;
            this.forceUpdate();
          });
      }
    });
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

  toggleChecked = (index) => (e) => {
    this.setState({
      content: set([
        'answers',
        index,
        'checked',
      ],
        e.target.checked,
        this.state.content,
      ),
    });
  }

  isRight = (index) => (e) => {
    this.setState({
      temp: set([
        'answers',
        index,
        'isRight',
      ],
        e.target.checked,
        this.state.temp,
      ),
    });
  }

  saveSettings = () => {
    const content =
      this.state.temp;
    this.setState({
      modal: false,
      content,
    });
    Entity.replaceData(
      this.props.entityKey, {
        content,
      }
    );
  }

  uploadImage = (index) => (files) => {
    const file = files[0].slice(0);
    const name = [
      files[0].lastModified,
      files[0].size,
      files[0].name,
    ].join('');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => { // eslint-disable-line
      localForage.setItem(
        name,
        reader.result,
      ).then(() => {
        this.setState({
          temp: set([
            'answers',
            index,
            'image',
          ],
            name,
            this.state.temp,
          ),
        });
        this.images[name] = reader.result;
        this.forceUpdate();
      });
    };
  }
  render() {
    console.log(this.state);
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
          images={this.images}
          toggleChecked={this.toggleChecked}
        />
        <Editor
          data={temp}
          isOpen={modal}
          closeModal={this.closeModal}
          saveSettings={this.saveSettings}
          uploadImage={this.uploadImage}
          images={this.images}
          isRight={this.isRight}
        />
      </div>
    );
  }
}

Checkbox.defaultProps = {
  content: {
    question: 'Где могут жить утки?',
    answers: [
      { value: 'Здесь', checked: false, image: null, isRight: false },
      { value: 'Тут', checked: false, image: null, isRight: false },
      { value: 'Вот же', checked: false, image: null, isRight: false },
      { value: 'Ага, вот отличное место', checked: false, image: null, isRight: false },
    ],
  },
};

export default Checkbox;
