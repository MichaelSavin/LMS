import React, { PureComponent, PropTypes } from 'react';
import { get, set, update, unset } from 'lodash/fp';
import { Button as AntButton } from 'antd';
import { arrayMove } from 'react-sortable-hoc';
import localForage from 'localforage';
import classNames from 'classnames';
import { Entity } from 'draft-js';
import Preview from './Preview';
import Editor from './Editor';
import styles from './styles.css';

class Checkbox extends PureComponent {

  constructor(props) {
    super(props);
    const { content } = props;
    this.state = {
      drag: null,
      errors: [],
      editing: false,
      content: {
        editor: content,
        component: content,
      },
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
    this.state
      .content
      .editor
      .variants
      .forEach((variant) => {
        variant.options.forEach(
          async (option) => {
            if (option.image) {
              const data = await localForage
                .getItem(option.image.name);
              this.storage.images[
                option.image.name
              ] = data;
              this.forceUpdate();
            }
          });
      });
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
      this.setState({
        content: set([
          'editor',
          ...location,
          'image',
          'name',
        ],
          image.name,
          this.state.content
        ),
      }, this.addStateToHistory);
    };
  }

  addContent = (location, content) => () => {
    this.setState({
      content: update(
        ['editor', ...location],
        (data) => data.concat([content]),
        this.state.content,
      ),
    });
  }

  removeContent = (location) => (event) => {
    if (event) { event.stopPropagation(); }
    this.setState({
      content: unset(
        ['editor', ...location],
        this.state.content
      ),
    }, this.addStateToHistory);
  }

  dragContent = (location) => ({ oldIndex, newIndex }) => {
    const { content } = this.state;
    this.setState({
      content: set(
        ['editor', ...location],
        arrayMove(
          get(['editor', ...location], content),
          oldIndex,
          newIndex,
        ),
        content
      ),
    }, this.addStateToHistory);
  };

  changeContent = (location) => (validator) => (event) => {
    const value = event.type
      ? event.target.value    // для инпутов
      : event.target.checked; // для чекбоксов
    this.setState({
      content: set([
        'editor',
        ...location,
      ],
        value,
        this.state.content
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
    this.history.present = this.state;
    this.history.past.push(this.state);
    /* eslint-enable */
  }

  undoHistory = () => {
    if (this.history.past.length > 0) {
      /* eslint-disable */
      this.history.future.push(this.history.present);
      this.history.present = this.history.past.pop();
      /* eslint-enable */
      this.setState(this.history.present);
    }
  }

  redoHistory = () => {
    if (this.history.future.length > 0) {
      /* eslint-disable */
      this.history.past.push(this.history.present);
      this.history.present = this.history.future.pop();
      /* eslint-enable */
      this.setState(this.history.present);
    }
  }

  openEditor = () => {
    const { content } = this.state;
    this.setState({
      content: set(
        ['editor'],
        content.component,
        content
      ),
      editing: true,
    }, this.context.toggleReadOnly);
  }

  closeEditor = () => {
    this.setState({
      editing: false,
      errors: [],
    }, this.context.toggleReadOnly);
  }

  saveContent = () => {
    const { content } = this.state;
    Entity.replaceData(
      this.props.entityKey, {
        content: content.editor,
      }
    );
    this.setState({
      editing: false,
      content: set(
        ['component'],
        content.editor,
        content
      ),
      errors: [],
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
        <Preview
          content={editing ? editor : component}
          storage={this.storage}
          changeContent={this.changeContent}
        />
        <Editor
          isOpen={editing}
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
            isChecked: PropTypes.bool.isRequired,
            isCorrect: PropTypes.bool.isRequired,
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
        isChecked: false,
        isCorrect: false,
      }, {
        text: 'Вариант 2',
        image: undefined,
        isChecked: false,
        isCorrect: false,
      }, {
        text: 'Вариант 3',
        image: undefined,
        isChecked: false,
        isCorrect: false,
      }, {
        text: 'Вариант 4',
        image: undefined,
        isChecked: false,
        isCorrect: false,
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
