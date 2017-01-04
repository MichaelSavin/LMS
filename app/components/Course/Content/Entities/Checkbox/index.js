import React, { Component, PropTypes } from 'react';
import Immutable, { fromJS, Set } from 'immutable';
import { Button as AntButton } from 'antd';
import { arrayMove } from 'react-sortable-hoc';
import localForage from 'localforage';
import classNames from 'classnames';
import { Entity } from 'draft-js';
import Preview from './Preview';
import Editor from './Editor';
import styles from './styles.css';

class Checkbox extends Component {

  constructor(props) {
    super(props);
    const { content } = props;
    this.state = {
      drag: null,
      errors: Set(),
      editing: false,
      content: fromJS({
        editor: content,
        component: content,
      }),
    };
    this.storage = {
      crops: {},
      images: {},
    };
    this.history = {
      past: [],
      future: [],
      present: undefined,
    };
  }

  componentDidMount() {
    this.state.content.getIn([
      'editor',
      'variants',
    ]).forEach((variant) => {
      variant.get('options')
        .forEach(({ image }) => {
          if (image) {
            localForage
              .getItem(image.get('name'))
              .then((data) => {
                this.storage.images[
                  image.get('name')
                ] = data;
                this.forceUpdate();
              });
          }
        });
    });
  }

  shouldComponentUpdate(
    nextProps,
    nextState
  ) {
    return !Immutable.is(
      this.state.content,
      nextState.content
    ) || (
      this.state.editing !==
      nextState.editing
    ) || !Immutable.is(
      this.state.errors,
      nextState.errors
    );
  }

  uploadImage = (location) => (files) => {
    const image = {
      data: files[0].slice(0),
      name: [
        files[0].lastModified,
        files[0].size,
        files[0].name,
      ].join(''),
    };
    const reader = new FileReader();
    reader.readAsDataURL(image.data);
    // eslint-disable-next-line
    reader.onloadend = () => {
      this.storage.images[
        image.name
      ] = reader.result;
      this.setState(
        ({ content }) => ({
          content: content.setIn([
            'editor',
            ...location,
            'image',
            'name',
          ],
            image.name,
          ),
        }), this.addStateToHistory
      );
    };
  }

  addContent = (location, content) => () => {
    this.setState({
      content: this.state.content.updateIn([
        'editor',
        ...location,
      ],
        Immutable.List.of(),
        // eslint-disable-next-line
        (data) => data.push(fromJS(content)),
      ),
    }, this.addStateToHistory);
  }

  removeContent = (location) => (event) => {
    if (event) { event.stopPropagation(); }
    this.setState(
      ({ content }) => ({
        content: content.removeIn([
          'editor',
          ...location,
        ]),
      }), this.addStateToHistory
    );
  }

  dragContent = (location) => ({ oldIndex, newIndex }) => {
    this.setState(
      ({ content }) => ({
        content: content.setIn([
          'editor',
          ...location,
        ],
          fromJS(
            arrayMove(
              content.getIn([
                'editor',
                ...location,
              ]).toJS(),
              oldIndex,
              newIndex,
            )
          ),
        ),
      }), this.addStateToHistory
    );
  };

  changeContent = (location) => (validator) => (event) => {
    const value = event.type
      ? event.target.value    // для инпутов
      : event.target.checked; // для чекбоксов
    this.setState({
      content: this.state.content.setIn([
        'editor',
        ...location,
      ],
        value
      ),
      // Подмешивание сообщений валидатора
      // в состояние компонента, правила
      // валидации передаются через props
      // компонента Validator
      ...validator(this.state.errors, value),
    }, this.addStateToHistory);
  }

  addStateToHistory = () => {
    /* eslint-disable */
    this.history.present =
      this.state.content.get('editor');
    this.history.past.push(
      this.state.content.get('editor'),
    );
    /* eslint-enable */
  }

  undoHistory = () => {
    if (this.history.past.length > 0) {
      /* eslint-disable */
      this.history.future.push(this.history.present);
      this.history.present = this.history.past.pop();
      /* eslint-enable */
      this.setState({
        content: this.state.content.set(
          'editor',
          this.history.present,
        ),
      });
    }
  }

  redoHistory = () => {
    if (this.history.future.length > 0) {
      /* eslint-disable */
      this.history.past.push(this.history.present);
      this.history.present = this.history.future.pop();
      /* eslint-enable */
      this.setState({
        content: this.state.content.set(
          'editor',
          this.history.present,
        ),
      });
    }
  }

  openEditor = () => {
    this.setState(({
      content,
    }) => ({
      content: content.set(
        'editor',
        content.get('component'),
      ),
      editing: true,
    }), this.context.toggleReadOnly);
  }

  closeEditor = () => {
    this.setState({
      editing: false,
      errors: this.state.errors.clear(),
    }, this.context.toggleReadOnly);
  }

  saveContent = () => {
    const { content } = this.state;
    Entity.replaceData(
      this.props.entityKey, {
        content: content.get('editor').toJS(),
      }
    );
    this.setState({
      editing: false,
      content: content.set(
        'component',
        content.get('editor'),
      ),
      errors: this.state.errors.clear(),
    }, this.context.toggleReadOnly);
  }

  render() {
    const {
      content: {
        editor,
        component,
      },
      errors,
      editing,
    } = this.state;
    return (
      <div
        className={classNames(
          styles.checkbox,
          { [styles.editing]: editing },
        )}
      >
        <div className={styles.preview}>
          <Preview
            content={editing ? editor : component}
            storage={this.storage}
            changeContent={this.changeContent}
          />
        </div>
        {editing &&
          <div className={styles.editor}>
            <Editor
              errors={errors}
              content={editor}
              storage={this.storage}
              addContent={this.addContent}
              dragContent={this.dragContent}
              closeEditor={this.closeEditor}
              uploadImage={this.uploadImage}
              saveContent={this.saveContent}
              undoHistory={this.undoHistory}
              redoHistory={this.redoHistory}
              removeContent={this.removeContent}
              changeContent={this.changeContent}
            />
          </div>
        }
        {editing
          /* eslint-disable */
          ? <div className={styles.actions}>
              <AntButton
                type="primary"
                icon="check"
                onClick={this.saveContent}
                className={styles.save}
              >
                Сохранить
              </AntButton>
              <AntButton
                type="default"
                icon="rollback"
                onClick={this.closeEditor}
                className={styles.cancel}
              >
                Отменить
              </AntButton>
            </div>
          : <div className={styles.actions}>
              <AntButton
                type="primary"
                icon="edit"
                onClick={this.openEditor}
                className={styles.edit}
              >
                Редактировать
              </AntButton>
            </div>
          /* eslint-enable */
        }
      </div>
    );
  }
}

Checkbox.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    points: PropTypes.object.isRequired,
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string.isRequired,
            image: PropTypes.shape({
              name: PropTypes.string.isRequired,
              text: PropTypes.string.isRequired,
              crop: PropTypes.shape({
                size: PropTypes.object.isRequired,
                name: PropTypes.string.isRequired,
              }),
            }),
            checked: PropTypes.bool.isRequired,
            correct: PropTypes.bool.isRequired,
          }).isRequired,
        ).isRequired,
        hints: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string.isRequired,
          })
        ).isRequired,
        competences: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string.isRequired,
          })
        ).isRequired,
        explanations: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string.isRequired,
          })
        ).isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

Checkbox.defaultProps = {
  content: {
    points: {},
    variants: [{
      question: 'Вопрос',
      options: [{
        text: 'Вариант 1',
        image: undefined,
        checked: false,
        correct: false,
      }, {
        text: 'Вариант 2',
        image: undefined,
        checked: false,
        correct: false,
      }, {
        text: 'Вариант 3',
        image: undefined,
        checked: false,
        correct: false,
      }, {
        text: 'Вариант 4',
        image: undefined,
        checked: false,
        correct: false,
      }],
      hints: [],
      competences: [],
      explanations: [],
    }],
  },
};

Checkbox.contextTypes = {
  toggleReadOnly: PropTypes.func.isRequired,
};

export default Checkbox;
