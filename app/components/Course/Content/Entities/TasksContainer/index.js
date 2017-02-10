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
import {
  ContentState,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import { arrayMove } from 'react-sortable-hoc';
import { Button as AntButton } from 'antd';
import localForage from 'localforage';
import classNames from 'classnames';
import Preview from './Preview';
import Editor from './Editor';
import { entitiesDecorator } from '../../Entities';
import styles from './styles.css';
import DefaultVariant from './defaults';

const convertRawToEditorState = (content) => {
  const newContent = {
    ...content,
    variants: content.variants.map((variant) => ({
      ...variant,
      options: variant.options.map((option) => ({
        ...option,
        editorState: option.editorState instanceof EditorState ?
          option.editorState :
          EditorState.createWithContent(
            convertFromRaw(option.editorState),
            entitiesDecorator
          ),
      })),
    })),
  };
  return newContent;
};

const convertDraftEditorStateToRaw = (content) => {
  const newContent = {
    ...content,
    variants: content.variants.map((variant) => ({
      ...variant,
      options: variant.options.map((option) => ({
        ...option,
        editorState: convertToRaw(option.editorState.getCurrentContent()),
      })),
    })),
  };
  return newContent;
};

class TasksContainer extends PureComponent {

  constructor(props) {
    super(props);
    const {
      content,
      environment,
    } = props;
    this.state = {
      content: {
        editor: convertRawToEditorState(this.props.content),
        component: convertRawToEditorState(this.props.content),
      },
      /* Показ случайного варианта задания при загрузке*/
      environment: {
        ...environment,
        /* Показ случайного варианта задания при загрузке*/
        variant: `${random(0, content.variants.length - 1)}`,
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

  getChildContext() {
    return {
      answerTasksContainer: this.answerTasksContainer,
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

  answerTasksContainer = (status) => {
    const {
      environment: {
        readyPanel,
        variant,
      },
      content: {
        component,
      },
    } = this.state;
    if (status === 'success') {
      this.setState({
        environment: {
          ...this.state.environment,
          readyPanel: readyPanel + 1,
          activePanel: `${readyPanel + 2}`,
          status: readyPanel + 2 >= component.variants[variant].options.length ? 'success' : null,
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

  changeDraftContent = (location) => (editorState) => {
    this.setState({
      content: set([
        'editor',
        ...location,
      ],
        editorState,
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
    }, () => this.context.toggleReadOnly(true));
  }

  closeEditor = () => {
    this.setState({
      environment: set(
        ['editing'],
        false,
        this.state.environment
      ),
    }, () => this.context.toggleReadOnly(false));
  }

  saveContent = () => {
    const {
      content,
      environment,
    } = this.state;
    this.props.contentState.replaceEntityData(
      this.props.entityKey, {
        content: convertDraftEditorStateToRaw(content.editor),
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
    }, () => this.context.toggleReadOnly(false));
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

  changePanel = (panelKey) => {
    console.log(panelKey);
    const { readyPanel, activePanel } = this.state.environment;
    this.setState({
      environment: {
        ...this.state.environment,
        activePanel: !panelKey || activePanel === panelKey ?
          '' :
          +panelKey <= readyPanel ?
            panelKey :
            `${readyPanel + 1}`,
      },
    });
  }

  checkAnswers = () => {
    const {
      content: {
        component: {
          variants,
        },
      },
      environment: {
        attemp,
        answers,
        variant,
      },
    } = this.state;
    this.setState({
      environment: {
        ...set(
          ['status'],
          /* Сравнение выбранных ответов с правильными */
          isEqual(
            answers,
            variants[variant].options
              .map((option, index) =>
                option.correct
                  ? index
                  : null
              ).filter((index) =>
                index !== null
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
          environment={environment}
          chooseAnswer={this.chooseAnswer}
          checkAnswers={this.checkAnswers}
          changePanel={this.changePanel}
        />
        {environment.editing &&
          <Editor
            addContent={this.addContent}
            changeContent={this.changeContent}
            changeDraftContent={this.changeDraftContent}
            changeVariant={this.changeVariant}
            closeEditor={this.closeEditor}
            content={content.editor}
            dragContent={this.dragContent}
            environment={environment}
            redoHistory={this.redoHistory}
            removeContent={this.removeContent}
            saveContent={this.saveContent}
            storage={this.storage}
            undoHistory={this.undoHistory}
            uploadImage={this.uploadImage}
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

TasksContainer.propTypes = {
  contentState: PropTypes.instanceOf(ContentState).isRequired,
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        points: PropTypes.string,
        attempts: PropTypes.string,
        question: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            editorState: PropTypes.oneOfType([
              PropTypes.instanceOf(EditorState),
              /* https://facebook.github.io/draft-js/docs/api-reference-data-conversion.html#converttoraw */
              PropTypes.shape({
                blocks: PropTypes.arrayOf(PropTypes.object.isRequired),
                entityMap: PropTypes.object.isRequired,
              }).isRequired,
            ]).isRequired,
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
    /* TODO Тут лучше хранить индексы подсказок из варианта, чем сами подсказки */
    hints: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
      }),
    ).isRequired,
    /*status: PropTypes.oneOf([
      null,
      'fail',
      'error',
      'success',
    ]).isRequired,*/
    attemp: PropTypes.number.isRequired,
    answers: PropTypes.arrayOf(
      PropTypes.number,
    ).isRequired,
    variant: PropTypes.string.isRequired,
    editing: PropTypes.bool.isRequired,
  }).isRequired,
};

const emptyEditorStateRaw = convertToRaw(
  EditorState.createEmpty()
    .getCurrentContent()
);

TasksContainer.defaultProps = {
  /* Контент компонента */
  content: {
    variants: [new DefaultVariant('raw')],
  },
  /* Cостояние компонента */
  environment: {
    hints: [],      // Показанные подсказки
    attemp: 1,      // Попытки ответить на вопрос
    status: null,   // Статус задания (с ошибками, без ошибок)
    answers: [],    // Выбранные ответы
    variant: '0',   // Первый вариант задания, меняется на случайный в конструкторе
    editing: false, // Окно редактора закрыто
    readyPanel: -1, // Номер разрешенного вопроса
    activePanel: '', // Выбранный вопрос
  },
};

TasksContainer.contextTypes = {
  toggleReadOnly: PropTypes.func.isRequired,
  isPlayer: PropTypes.bool,
};

TasksContainer.childContextTypes = {
  answerTasksContainer: PropTypes.func.isRequired,
};

export default TasksContainer;
