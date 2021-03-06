import React, {
  PropTypes,
  PureComponent,
} from 'react';
import {
  get,
  set,
  last,
  pull,
  concat,
  sample,
  update,
  random,
  pullAt,
  isEqual,
  dropRight,
  difference,
} from 'lodash/fp';
import Sortable from 'sortablejs';
import { arrayMove } from 'react-sortable-hoc';
import { Button as AntButton } from 'antd';
import localForage from 'localforage';
import classNames from 'classnames';
import { Entity } from 'draft-js';
import Preview from './Preview';
import Editor from './Editor';
import styles from './styles.css';

class Sorter extends PureComponent {

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
        ['variant'],
        `${random(0, content.variants.length - 1)}`,
        environment
      ),
      isLocked: true,
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

  makeSortable = (element) => {
    if (element) {
      const that = this;
      const name = element.getAttribute('data-type');
      this[name] = element;
      Sortable.create(element, { // https://github.com/RubaXa/Sortable#options
        group: {
          name,
          pull: ['pull', 'put'],
          put: ['pull', 'put'],
        },
        animation: 350,
        handle: '.sortable-handle',
        chosenClass: styles.chosen,
        ghostClass: styles.ghost,
        // onEnd: (event) => {
        //   console.log(event);
        // },
        // onAdd(e) {
        //   console.log(e);
        // },
        onRemove(event) {
          if (get('from.childElementCount', event) === 0) {
            that.setState({
              isLocked: false,
            });
          }
        },
      });
    }
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
        ['variant'],
        `${newContent.editor.variants[environment.variant]
          ? environment.variant
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
        ['editing'],
        true,
        environment
      ),
    }, this.context.toggleReadOnly);
  }

  closeEditor = () => {
    this.setState({
      environment: set(
        ['editing'],
        false,
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
        ['editing'],
        false,
        environment
      ),
    }, this.context.toggleReadOnly);
  }

  showHint = (variant) => () => {
    const { environment } = this.state;
    this.setState({
      environment: set(
        ['hints'],
        environment.hints
          .concat([
            sample(
              difference(
                this.state
                  .content
                  .component
                  .variants[variant]
                  .hints,
                environment.hints,
              ),
            ),
          ]),
        environment
      ),
    });
  }

  changeVariant = (variant) => {
    this.setState({
      environment: set(
        ['variant'],
        variant,
        this.state.environment
      ),
    });
  }

  chooseAnswer = (index) => (answer) => {
    const {
      environment: {
        answers,
      },
    } = this.state;
    this.setState({
      environment: set(
        ['answers'],
        answer.target.checked
          ? concat(answers, index)
          : pull(index, answers),
        this.state.environment
      ),
    });
  }

  checkAnswers = () => {
    const sortedIdList = [...this.put.children].map((obj) => obj.getAttribute('data-id'));
    const {
      content: {
        component: {
          variants,
        },
      },
      environment: {
        attemp,
        variant,
      },
    } = this.state;
    this.setState({
      environment: {
        ...set(
          ['status'],
          /* Сравнение выбранных ответов с правильными */
          isEqual(
            sortedIdList,
            variants[variant].options
              .map((option) => option.id
              ),
          )
            ? 'success'
            /* Попытки закончились? */
            : variants[variant].attempts - attemp === 0
              ? 'fail'
              : 'error',
          this.state.environment
        ),
        attemp: attemp + 1,
      },
    });
  }

  render() {
    const {
      content,
      environment,
      isLocked,
    } = this.state;
    return (
      <div
        className={classNames(
          styles.checkbox,
          { [styles.editing]: environment.editing },
        )}
      >
        <Preview
          content={
            environment.editing
              ? content.editor
              : content.component
          }
          storage={this.storage}
          showHint={this.showHint}
          {...{ environment, isLocked }}
          chooseAnswer={this.chooseAnswer}
          checkAnswers={this.checkAnswers}
          makeSortable={this.makeSortable}
        />
        {environment.editing &&
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
            changeVariant={this.changeVariant}
          />
        }
        {/* Нужно сделать проверку на наличие ошибок в валидаторе перед сохранением */}
        {(!environment.editing && !this.context.isPlayer) &&
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

Sorter.propTypes = {
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
    /* TODO Тут лучше хранить индексы подсказок из варианта, чем сами подсказки */
    hints: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
      }),
    ).isRequired,
    status: PropTypes.oneOf([
      null,
      'fail',
      'error',
      'success',
    ]).isRequired,
    attemp: PropTypes.number.isRequired,
    answers: PropTypes.arrayOf(
      PropTypes.number,
    ).isRequired,
    variant: PropTypes.string.isRequired,
    editing: PropTypes.bool.isRequired,
  }).isRequired,
};

Sorter.defaultProps = {
  /* Контент компонента */
  content: {
    variants: [{
      points: '1',
      attempts: '1',
      question: 'Вопрос',
      options: [{
        text: 'Вариант 1',
        image: undefined,
        id: `${random(0, 999)}`,
      }, {
        text: 'Вариант 2',
        image: undefined,
        id: `${random(0, 999)}`,
      }, {
        text: 'Вариант 3',
        image: undefined,
        id: `${random(0, 999)}`,
      }, {
        text: 'Вариант 4',
        image: undefined,
        id: `${random(0, 999)}`,
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
    hints: [],      // Показанные подсказки
    attemp: 1,      // Попытки ответить на вопрос
    status: null,   // Статус задания (с ошибками, без ошибок)
    answers: [],    // Выбранные ответы
    variant: '0',   // Первый вариант задания, меняется на случайный в конструкторе
    editing: false, // Окно редактора закрыто
  },
};

Sorter.contextTypes = {
  toggleReadOnly: PropTypes.func.isRequired,
  isPlayer: PropTypes.bool,  
};

export default Sorter;
