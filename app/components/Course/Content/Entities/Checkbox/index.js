import React, { PureComponent, PropTypes } from 'react';
import { get, set, last, update, pullAt, dropRight, random } from 'lodash/fp';
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
    const {
      content,
      environment,
    } = props;
    this.state = {
      content: {
        editor: content,
        component: content,
      },
      /* Показ случайного варианта задания при загрузке*/
      environment: set(
        ['editor', 'variant'],
        `${random(0, content.variants.length - 1)}`,
        environment
      ),
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

  // componentWillMount() {
  // }

  componentDidMount() {
    // Загрузка изображений в компонент
    this.state
      .content
      .editor
      .variants
      .forEach((variant) => {
        variant.options.forEach(
          async (option) => {
            if (option.image) {
              const data = await localForage
                .getItem(option.image.source);
              this.storage.images[
                option.image.source
              ] = data;
              if (option.image.crop) {
                const canvas = document.createElement('canvas');
                /* eslint-disable fp/no-mutation */
                const pixelCrop = option.image.crop.pixels;
                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;
                const context = canvas.getContext('2d');
                const imageObj = new Image();
                context.clearRect(0, 0, canvas.width, canvas.height);
                imageObj.src = this.storage.images[option.image.source];
                imageObj.onload = () => {
                /* eslint-enable fp/no-mutation */
                  context.drawImage(
                    imageObj,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0, 0,
                    pixelCrop.width,
                    pixelCrop.height,
                  );
                  const binary = canvas.toDataURL('image/jpeg', 1);
                  this.storage.crops[option.image.source] = binary;
                  this.forceUpdate();
                };
              } else {
                this.forceUpdate();
              }
            }
          });
      });
  }

  uploadImage = (location) => (data, image, crop) => {
    this.storage.images = {
      ...this.storage.images,
      ...image,
    };
    this.storage.crops = {
      ...this.storage.crops,
      ...crop,
    };
    this.setState({
      content: set([
        'editor',
        ...location,
        'image',
      ],
        data,
        this.state.content
      ),
    }, this.addStateToHistory);
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
    const {
      content,
      environment,
    } = this.state;
    if (event) { event.stopPropagation(); }
    const newContent = update(
      ['editor', ...dropRight(1, location)],
      (data) => pullAt([last(location)], data),
      content
    );
    this.setState({
      content: newContent,
      /* Переключение на предыдущий таб при удалении варианта */
      environment: set(
        ['editor', 'variant'],
        `${newContent.editor.variants[environment.editor.variant]
          ? environment.editor.variant
          : newContent.editor.variants.length - 1
        }`,
        environment
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

  changeContent = (location) => (event) => {
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
    }, this.addStateToHistory);
  }

  changeEnvironment = (location) => (value) => {
    this.setState({
      environment: set(
        [...location],
        value,
        this.state.environment
      ),
    });
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
    const {
      content,
      environment,
    } = this.state;
    this.setState({
      content: set(
        ['editor'],
        content.component,
        content
      ),
      environment: set(
        ['editor', 'open'],
        true,
        environment
      ),
    }, this.context.toggleReadOnly);
  }

  closeEditor = () => {
    this.setState({
      environment: set(
        ['editor'], {
          open: false,
          variant: '0',
        },
        this.state.environment
      ),
    }, this.context.toggleReadOnly);
  }

  saveContent = () => {
    const {
      content,
      environment,
    } = this.state;
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
      environment: set(
        ['editor'], {
          open: false,
          variant: '0',
        },
        environment
      ),
    }, this.context.toggleReadOnly);
  }

  render() {
    const {
      content,
      environment,
    } = this.state;
    return (
      <div
        className={classNames(
          styles.checkbox,
          { [styles.editing]: environment.editor.open },
        )}
      >
        <Preview
          content={
            environment.editor.open
              ? content.editor
              : content.component
          }
          storage={this.storage}
          environment={environment}
        />
        {environment.editor.open &&
          <Editor
            storage={this.storage}
            content={content.editor}
            addContent={this.addContent}
            environment={environment}
            dragContent={this.dragContent}
            closeEditor={this.closeEditor}
            uploadImage={this.uploadImage}
            saveContent={this.saveContent}
            undoHistory={this.undoHistory}
            redoHistory={this.redoHistory}
            removeContent={this.removeContent}
            changeContent={this.changeContent}
            changeEnvironment={this.changeEnvironment}
          />
        }
        {/* Нужно сделать проверку на наличие ошибок в валидаторе перед сохранением */}
        {!environment.editor.open &&
          /* eslint-disable */
          // ? <div className={styles.actions}>
          //     <AntButton
          //       type="primary"
          //       icon="check"
          //       onClick={this.saveContent}
          //       className={styles.save}
          //     >
          //       Сохранить
          //     </AntButton>
          //     <AntButton
          //       type="default"
          //       icon="rollback"
          //       onClick={this.closeEditor}
          //       className={styles.cancel}
          //     >
          //       Отменить
          //     </AntButton>
          //   </div>
          <div className={styles.actions}>
            <AntButton
              type="primary"
              icon="edit"
              onClick={this.openEditor}
              className={styles.edit}
            >
              Редактировать
            </AntButton>
          </div>
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
        points: PropTypes.string,
        attempts: PropTypes.string,
        question: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string.isRequired,
            image: PropTypes.shape({
              text: PropTypes.string.isRequired,
              crop: PropTypes.object,
              source: PropTypes.string.isRequired,
            }),
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
  environment: PropTypes.shape({
    editor: PropTypes.shape({
      open: PropTypes.bool.isRequired,
      variant: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

Checkbox.defaultProps = {
  /* Контент компонента */
  content: {
    variants: [{
      points: '1',
      attempts: '1',
      question: 'Вопрос',
      options: [{
        text: 'Вариант 1',
        image: undefined,
        correct: true,
      }, {
        text: 'Вариант 2',
        image: undefined,
        correct: false,
      }, {
        text: 'Вариант 3',
        image: undefined,
        correct: false,
      }, {
        text: 'Вариант 4',
        image: undefined,
        correct: false,
      }],
      hints: [{ 
        text: 'Новая подсказка' 
      }],
      competences: [{ 
        text: 'Новая компетенция' 
      }],
      explanations: [{ 
        text: 'Новое объяснение' 
      }],
    }],
  },
  /* Cостояние компонента */
  environment: {
    editor: {
      open: false,  // Окно редактора закрыто
      variant: '0', // Выбран первый вариант
    },
  },
};

Checkbox.contextTypes = {
  toggleReadOnly: PropTypes.func.isRequired,
};

export default Checkbox;
