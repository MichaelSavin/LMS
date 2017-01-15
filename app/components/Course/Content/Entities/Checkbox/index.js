import React, { PureComponent, PropTypes } from 'react';
import {
  // get,
  set,
  // last, update, pullAt, dropRight
} from 'lodash/fp';
import { Button as AntButton } from 'antd';
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
      content: {
        editor: content,
        component: content,
      },
      isEditing: false,
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

  // uploadImage = (location) => (files) => {
  //   const image = {
  //     data: files[0].slice(0),
  //     name: [
  //       files[0].lastModified,
  //       files[0].size,
  //       files[0].name,
  //     ].join(''),
  //   };
  //   const reader = new FileReader();
  //   reader.readAsDataURL(image.data);
  //   // eslint-disable-next-line
  //   reader.onloadend = () => {
  //     this.storage.images[
  //       image.name
  //     ] = reader.result;
  //     this.setState({
  //       content: set([
  //         'editor',
  //         ...location,
  //         'image',
  //         'name',
  //       ],
  //         image.name,
  //         this.state.content
  //       ),
  //     }, this.addStateToHistory);
  //   };
  // }

  // addStateToHistory = () => {
  //   /* eslint-disable */
  //   this.history.present = this.state;
  //   this.history.past.push(this.state);
  //   /* eslint-enable */
  // }

  // undoHistory = () => {
  //   if (this.history.past.length > 0) {
  //     /* eslint-disable */
  //     this.history.future.push(this.history.present);
  //     this.history.present = this.history.past.pop();
  //     /* eslint-enable */
  //     this.setState(this.history.present);
  //   }
  // }

  // redoHistory = () => {
  //   if (this.history.future.length > 0) {
  //     /* eslint-disable */
  //     this.history.past.push(this.history.present);
  //     this.history.present = this.history.future.pop();
  //     /* eslint-enable */
  //     this.setState(this.history.present);
  //   }
  // }

  // Синхронизания данных формы из формы
  // в Editor с предпросмотром в Preview
  syncContent = (content) => {
    this.setState({
      content: set(
        ['editor'],
        content,
        this.state.content
      ),
    });
  }

  openEditor = () => {
    const { content } = this.state;
    this.setState({
      content: set(
        ['editor'],
        content.component,
        content
      ),
      isEditing: true,
    }, this.context.toggleReadOnly);
  }

  closeEditor = () => {
    const { content } = this.state;
    this.setState({
      content: set(
        ['editor'],
        content.component,
        content
      ),
      isEditing: false,
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
      content: set(
        ['component'],
        content.editor,
        content
      ),
      isEditing: false,
    }, this.context.toggleReadOnly);
  }

  render() {
    const {
      content: {
        editor,
        component,
      },
      isEditing,
    } = this.state;
    return (
      <div
        className={classNames(
          styles.checkbox,
          { [styles.editing]: isEditing },
        )}
      >
        <Preview
          content={isEditing ? editor : component}
          storage={this.storage}
        />
        {isEditing &&
          <Editor
            isOpen={isEditing}
            content={editor}
            // storage={this.storage}
            closeEditor={this.closeEditor}
            // uploadImage={this.uploadImage}
            saveContent={this.saveContent}
            syncContent={this.syncContent}
          />
        }
        {isEditing
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
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        points: PropTypes.number,
        attempts: PropTypes.number,
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
    variants: [{
      points: undefined,
      attempts: undefined,
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
