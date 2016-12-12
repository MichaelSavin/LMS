
// Состояние редактора не изменяется при выборе ответов - facebook/draft-js#185
// Нужно кликнуть по редактору

import React, { Component, PropTypes } from 'react';
import {
  set,
  update,
  remove,
  isEqual,
} from 'lodash/fp';
import {
  arrayMove,
} from 'react-sortable-hoc';
import {
  Button as AntButton,
} from 'antd';
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
      temp: content,
      drag: null,
      isEditing: false,
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

  removeImage = (index) => (event) => {
    event.stopPropagation();
    this.setState({
      temp: set([
        'answers',
        index,
        'image',
      ],
        undefined,
        this.state.temp,
      ),
    });
  }

  changeText = (index) => (event) => {
    this.setState({
      temp: set([
        'answers',
        index,
        'value',
      ],
        event.target.value,
        this.state.temp,
      ),
    });
  }

  changeQuestion = (e) => {
    this.setState({
      temp: {
        ...this.state.temp,
        question: e.target.value,
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

  openModal = () => {
    this.setState({
      temp: this
        .state
        .content,
    });
  }

  saveSettings = () => {
    const content =
      this.state.temp;
    this.setState({
      isEditing: false,
      content,
    });
    Entity.replaceData(
      this.props.entityKey, {
        content,
      }
    );
    this.context.toggleReadOnly();
    console.log(content);
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

  addStep = () => {
    this.setState({
      temp: update(
        'answers',
        (answers) => answers.concat([{
          value: 'Новое событие',
        }]),
        this.state.temp,
      ),
    });
  }

  removeStep = (index) => () => {
    console.log('remove');
    this.setState({
      temp: update(
        'answers',
        (answers) => remove(
          (answer) => answers.indexOf(
            answer
          ) === index,
          answers,
        ),
        this.state.temp,
      ),
    });
  }

  dragStep = ({ oldIndex, newIndex }) => {
    this.setState({
      temp: {
        answers: arrayMove(
          this.state.temp.answers,
          oldIndex,
          newIndex,
        ),
      },
    });
  };

  toggleEditor = () => {
    this.setState({
      temp: this.state.content,
      isEditing: !this.state.isEditing,
    });
    this.context.toggleReadOnly();
  }

  render() {
    const {
      temp,
      content,
      isEditing,
    } = this.state;
    console.log(this.state);
    return (
      <div
        className={styles.checkbox}
      >
        <div className={styles.actions}>
          <Preview
            data={isEditing
              ? temp
              : content
            }
            images={this.images}
            toggleChecked={this.toggleChecked}
          />
        </div>
        {isEditing &&
          <Editor
            ref={this.saveFormRef}
            data={temp}
            addStep={this.addStep}
            removeStep={this.removeStep}
            dragStep={this.dragStep}
            saveSettings={this.saveSettings}
            changeText={this.changeText}
            changeQuestion={this.changeQuestion}
            uploadImage={this.uploadImage}
            removeImage={this.removeImage}
            images={this.images}
            isRight={this.isRight}
          />
        }
        {isEditing ?
          <AntButton
            type="primary"
            icon="check-circle"
            className={styles.edit}
          /> :
            <AntButton
              type="primary"
              icon="edit"
              className={styles.edit}
              onClick={this.toggleEditor}
            />
        }
      </div>
    );
  }
}

Checkbox.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        image: PropTypes.string,
        checked: PropTypes.bool,
        isRight: PropTypes.bool,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

Checkbox.defaultProps = {
  content: {
    question: 'Где могут жить утки?',
    answers: [
      { value: 'Здесь', alt: 'Альтернативный текст', checked: false, image: null, isRight: false },
      { value: 'Тут', alt: 'Альтернативный текст', checked: false, image: null, isRight: false },
      { value: 'Вот же', alt: 'Альтернативный текст', checked: false, image: null, isRight: false },
      { value: 'Ага, вот отличное место', alt: 'Альтернативный текст', checked: false, image: null, isRight: false },
    ],
  },
};

Checkbox.contextTypes = {
  toggleReadOnly: PropTypes.func.isRequired,
};

export default Checkbox;
