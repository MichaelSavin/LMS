import React, {
  PropTypes,
  Component,
} from 'react';
import {
  Form as AntForm,
  Icon as AntIcon,
  Tabs as AntTabs,
  Input as AntInput,
  Button as AntButton,
  Collapse as AntCollapse,
  Checkbox as AntCheckbox,
  Popconfirm as AntPopconfirm,
} from 'antd';
import {
  arrayMove,
  SortableHandle,
  SortableElement,
  SortableContainer,
} from 'react-sortable-hoc';
import {
  get,
  set,
  last,
  update,
  pullAt,
  compact,
  dropRight,
} from 'lodash/fp';
import flatten from 'object-end-keys';
import { createForm } from 'rc-form';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import styles from './styles.css';

class Editor extends Component {

  // componentWillMount() {
  //   const {
  //     content,
  //     form: { setFieldsValue },
  //   } = this.props;
  //   setFieldsValue({ content });
  // }

  // Предотвращение бесконечного ререндера
  // создаваемого методом syncWithEditor
  shouldComponentUpdate(nextProps) {
    return this.props.content === nextProps.content; // ||
      // this.props.isOpen !== nextProps.isOpen;
  }

  // Синхронизация данных, измененных внутри
  // формы, с данными основного компонента
  componentDidUpdate() {
    const {
      syncContent,
      form: { getFieldValue },
    } = this.props;
    syncContent({
      // Подмешивание измененных полей
      ...this.props.content,
      ...getFieldValue('form'),
      // Если поля, при первом рендере, нет в
      // getFieldDecorator, то оно заменяется
      // на undefined в getFieldValue('form')
    });
  }

  getFieldsErrors = () => {
    const {
      form: {
        getFieldError,
        // getFieldValue,
        getFieldsValue,
      },
    } = this.props;
    console.log(
      compact(
        flatten(
          getFieldsValue()
        )
      )
    );
    return (
      compact(
        flatten(
          getFieldsValue()
        ).map(
          (field) => getFieldError(field)
        )
      )
    );
  }

  getCustomErrors = () => [];

  getErrors = () => [
    ...this.getFieldsErrors(),
    ...this.getCustomErrors(),
  ]

  resetAndClose = () => {
    this.props.closeEditor();
  };

  validateAndSave = () => {
    const {
      form: {
        getFieldValue,
        validateFields,
      },
      saveContent,
    } = this.props;
    validateFields((error, values) => {
      if (!error) {
        saveContent(getFieldValue('content'));
      } else {
        console.log('Errors:', error, values);
      }
    });
  };

  addContent = (location, content) => () => {
    const {
      form: {
        getFieldValue,
        setFieldsValue,
      },
    } = this.props;
    setFieldsValue({
      content: update(
        location,
        (data) => data.concat([content]),
        getFieldValue('content'),
      ),
    });
  }

  // [WIP] - Не обновляется валидатор
  removeContent = (location) => (event) => {
    console.log('REMOVE');
    if (event) { event.stopPropagation(); }
    const {
      form: {
        getFieldValue,
        setFieldsValue,
      },
    } = this.props;
    // console.log(getFieldValue('form'));
    // console.log(update(
    //   dropRight(1, location),
    //   (data) => pullAt([last(location)], data),
    //   getFieldValue('form')
    // ));
    setFieldsValue({
      content: update(
        dropRight(1, location),
        (data) => pullAt([last(location)], data),
        getFieldValue('content')
      ),
    });
  }

  // [WIP] - Работает не так как нужно, не обновляется валидатор
  dragContent = (location) => ({ oldIndex, newIndex }) => {
    console.log('DRAG');
    const {
      form: {
        getFieldValue,
        setFieldsValue,
      },
    } = this.props;
    const content = getFieldValue('form');
    setFieldsValue({
      content: set(
        location,
        arrayMove(
          get(location, content),
          oldIndex,
          newIndex,
        ),
        content,
      ),
    });
  };

  render() {
    const {
      // isOpen,
      content,
      // storage,
      form: {
        getFieldValue,
        getFieldDecorator,
      },
    } = this.props;

    // Инициализация формы начальными значениями
    getFieldDecorator('content', { initialValue: content });

    return (
      <AntForm>
        <div
          className={classNames(
            styles.editor,
            // { [styles.hidden]: !isOpen }
          )}
        >
          <div className={styles.title}>
            <div className={styles.text}>
              Редактирование компонента
            </div>
            { /*
            <div className={styles.actions}>
              <AntButton
                icon="arrow-left"
                onClick={undoHistory}
              />
              <AntButton
                icon="arrow-right"
                onClick={redoHistory}
              />
            </div>
            */ }
          </div>
          <div className={styles.errors}>
            {/* <div className={styles.text}>
              Необходимо заполнить поля:
            </div>
            */ }
            {this.getErrors().map((error, index) =>
              <div
                key={index}
                className={styles.error}
              >
                {error}
              </div>
            )}
          </div>
          <AntTabs
            className={styles.variants}
            tabBarExtraContent={
              <AntButton
                size="small"
                type="primary"
                onClick={this.addContent(['variants'], {
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
                })}
              >
                Добавить вариант задания
              </AntButton>
            }
          >
            {getFieldValue('content').variants.map((
              variant, variantIndex
            ) =>
              <AntTabs.TabPane
                key={variantIndex}
                tab={
                  <div className={styles.variant}>
                    {`Вариант ${variantIndex + 1}`}
                    {variantIndex > 0 &&
                      <AntPopconfirm
                        title="Удалить вариант?"
                        onConfirm={this.removeContent([
                          'variants',
                          variantIndex,
                        ])}
                        okText="Да"
                        cancelText="Нет"
                      >
                        <AntIcon
                          type="close"
                          className={styles.remove}
                        />
                      </AntPopconfirm>
                    }
                  </div>
                }
              >
                <div
                  key={variantIndex}
                  className={styles.variant}
                >
                  <div className={styles.data}>
                    <div className={styles.question}>
                      {getFieldDecorator(`form.variants[${variantIndex}].question`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        initialValue: variant.question,
                        rules: [{
                          required: true,
                          message: `Вариант №${variantIndex + 1} - Вопрос к заданию`,
                        }],
                      })(
                        <AntInput
                          rows={4}
                          size="default"
                          type="textarea"
                        />
                      )}
                    </div>
                    <div className={styles.points}>
                      {getFieldDecorator(`form.variants[${variantIndex}].points`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        initialValue: variant.points,
                        rules: [{
                          required: true,
                          message: `Вариант №${variantIndex + 1} - Баллы за задание`,
                        }],
                      })(
                        <AntInput size="default" />
                      )}
                      Баллы
                    </div>
                    <div className={styles.attemps}>
                      {getFieldDecorator(`form.variants[${variantIndex}].attempts`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        initialValue: variant.attemps,
                        rules: [{
                          required: true,
                          message: `Вариант №${variantIndex + 1} - Количество попыток`,
                        }],
                      })(
                        <AntInput size="default" />
                      )}
                      Попытки
                    </div>
                  </div>
                  <AntCollapse
                    className={styles.sections}
                    defaultActiveKey="1"
                  >
                    <AntCollapse.Panel
                      key="1"
                      header={
                        <div className={styles.info}>
                          <div className={styles.text}>
                            Ответы
                          </div>
                          <div className={styles.notifier}>
                            {variant
                              .options
                              .some((option) => option.isCorrect === true)
                                ? <div className={styles.defined}>Заданы</div>
                                : <div className={styles.undefined}>Не заданы</div>
                            }
                          </div>
                        </div>
                      }
                    >
                      <div className={styles.options}>
                        <Sortable.List
                          onSortEnd={this.dragContent([
                            'variants',
                            variantIndex,
                            'options',
                          ])}
                          useDragHandle
                        >
                          {variant.options.map((
                            option, optionIndex
                          ) =>
                            <div
                              key={optionIndex}
                              className={styles.option}
                            >
                              <Sortable.Item index={optionIndex}>
                                <div className={styles.drag}>
                                  <Sortable.Handler />
                                </div>
                                <div className={styles.text}>
                                  {getFieldDecorator(`form.variants[${variantIndex}].options[${optionIndex}].text`, {
                                    validateTrigger: ['onChange', 'onBlur'],
                                    initialValue: option.text,
                                    rules: [{
                                      required: true,
                                      message: `Вариант №${variantIndex + 1} - Ответ №${optionIndex + 1}`,
                                    }],
                                  })(
                                    <AntInput
                                      size="default"
                                      // onChange={changeContent([
                                      //   'variants',
                                      //   variantIndex,
                                      //   'options',
                                      //   optionIndex,
                                      //   'text',
                                      // ])}
                                    />
                                  )}
                                </div>
                                <div className={styles.image}>
                                  {option.image
                                    /* eslint-disable */
                                    ? <div className={styles.preview}>
                                        <img
                                          src={storage[option.image.name]}
                                          role="presentation"
                                        />
                                        <AntIcon
                                          type="close"
                                          onClick={removeContent([
                                            'variants',
                                            variantIndex,
                                            'options',
                                            optionIndex,
                                            'image',
                                          ])}
                                          className={styles.remove}
                                        />
                                      </div>
                                    : <div className={styles.upload}>
                                        <Dropzone
                                          // onDrop={uploadImage([
                                          //   'variants',
                                          //   variantIndex,
                                          //   'options',
                                          //   optionIndex,
                                          // ])}
                                          multiple={false}
                                          className={styles.dropzone}
                                        />
                                        <AntIcon
                                          type="camera"
                                          className={styles.icon}
                                        />
                                      </div>
                                    /* eslint-enable */
                                  }
                                </div>
                                <div className={styles.checkbox}>
                                  <AntCheckbox
                                    checked={option.isCorrect}
                                    // onChange={changeContent([
                                    //   'variants',
                                    //   variantIndex,
                                    //   'options',
                                    //   optionIndex,
                                    //   'isCorrect',
                                    // ])}
                                  />
                                </div>
                                <div className={styles.remove}>
                                  <AntPopconfirm
                                    title="Удалить вариант ответа?"
                                    okText="Да"
                                    onConfirm={this.removeContent([
                                      'variants',
                                      variantIndex,
                                      'options',
                                      optionIndex,
                                    ])}
                                    cancelText="Нет"
                                  >
                                    <AntIcon
                                      type="close"
                                      className={styles.icon}
                                    />
                                  </AntPopconfirm>
                                </div>
                              </Sortable.Item>
                            </div>
                          )}
                          <AntButton
                            size="small"
                            type="primary"
                            onClick={this.addContent([
                              'variants',
                              variantIndex,
                              'options',
                            ], {
                              text: 'Новый вариант',
                              image: undefined,
                              isChecked: false,
                              isCorrect: false,
                            })}
                          >
                            Добавить вариант ответа
                          </AntButton>
                        </Sortable.List>
                      </div>
                    </AntCollapse.Panel>
                    {/* eslint-disable */}
                    {/* Необходимо задавать значения всех пустых массивов через getFieldDecorator */}
                    {getFieldDecorator(`form.variants[${variantIndex}].explanations`, { 
                      initialValue: [],
                      rules: [{
                        required: true,
                        message: `Вариант №${variantIndex + 1} - Необходимо добавить пояснения`,
                      }] 
                    })}
                    <AntCollapse.Panel
                      key="2"
                      header={
                        <div className={styles.info}>
                          <div className={styles.text}>
                            Пояснения
                          </div>
                          <div className={styles.notifier}>
                            {variant.explanations.length !== 0
                              ? <div className={styles.defined}>Заданы</div>
                              : <div className={styles.undefined}>Не заданы</div>
                            }
                          </div>
                        </div>
                      }
                    >
                      <div className={styles.explanations}>
                        {variant.explanations.map((
                          explanation, explanationIndex
                        ) =>
                          <div
                            key={explanationIndex}
                            className={styles.explanation}
                          >
                            <div className={styles.text}>
                              {getFieldDecorator(`form.variants[${variantIndex}].explanations[${explanationIndex}].text`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                initialValue: explanation.text,
                                rules: [{
                                  required: true,
                                  message: `Вариант №${variantIndex + 1} - Пояснение к правильному ответу №${explanationIndex + 1}`,
                                }],
                              })(
                                <AntInput
                                  size="default"
                                  // onChange={changeContent([
                                  //   'variants',
                                  //   variantIndex,
                                  //   'explanations',
                                  //   explanationIndex,
                                  //   'text',
                                  // ])}
                                />
                              )}
                            </div>
                            <div className={styles.remove}>
                              <AntPopconfirm
                                title="Удалить пояснение?"
                                okText="Да"
                                // onConfirm={removeContent([
                                //   'variants',
                                //   variantIndex,
                                //   'explanations',
                                //   explanationIndex,
                                // ])}
                                cancelText="Нет"
                              >
                                <AntIcon
                                  type="close"
                                  className={styles.icon}
                                />
                              </AntPopconfirm>
                            </div>
                          </div>
                        )}
                        <AntButton
                          size="small"
                          type="primary"
                          onClick={this.addContent([
                            'variants',
                            variantIndex,
                            'explanations',
                          ], {
                            text: 'Новое пояснение',
                          })}
                          className={styles.add}
                        >
                          Добавить пояснение к ответу
                        </AntButton>
                      </div>
                    </AntCollapse.Panel>
                    {/* Необходимо задавать значения всех пустых массивов через getFieldDecorator */}
                    {getFieldDecorator(`form.variants[${variantIndex}].hints`, { initialValue: [] })}
                    <AntCollapse.Panel
                      key="3"
                      header={
                        <div className={styles.info}>
                          <div className={styles.text}>
                            Подсказки
                          </div>
                          <div className={styles.notifier}>
                            {variant.hints.length !== 0
                              ? <div className={styles.defined}>Заданы</div>
                              : <div className={styles.undefined}>Не заданы</div>
                            }
                          </div>
                        </div>
                      }
                    >
                      <div className={styles.hints}>
                        {variant.hints.map((
                          hint, hintIndex
                        ) =>
                          <div
                            key={hintIndex}
                            className={styles.hint}
                          >
                            <div className={styles.text}>
                              {getFieldDecorator(`form.variants[${variantIndex}].hints[${hintIndex}].text`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                initialValue: hint.text,
                                rules: [{
                                  required: true,
                                  message: `Вариант №${variantIndex + 1} - Подсказка №${hintIndex + 1}`,
                                }],
                              })(
                                <AntInput
                                  size="default"
                                  // onChange={changeContent([
                                  //   'variants',
                                  //   variantIndex,
                                  //   'hints',
                                  //   hintIndex,
                                  //   'text',
                                  // ])}
                                />
                              )}
                            </div>
                            <div className={styles.remove}>
                              <AntPopconfirm
                                title="Удалить подсказку?"
                                okText="Да"
                                // onConfirm={removeContent([
                                //   'variants',
                                //   variantIndex,
                                //   'hints',
                                //   hintIndex,
                                // ])}
                                cancelText="Нет"
                              >
                                <AntIcon
                                  type="close"
                                  className={styles.icon}
                                />
                              </AntPopconfirm>
                            </div>
                          </div>
                        )}
                        <AntButton
                          size="small"
                          type="primary"
                          onClick={this.addContent([
                            'variants',
                            variantIndex,
                            'hints',
                          ], {
                            text: 'Новая подсказка',
                          })}
                          className={styles.add}
                        >
                          Добавить подсказку
                        </AntButton>
                      </div>
                    </AntCollapse.Panel>
                    {/* Необходимо задавать значения всех пустых массивов через getFieldDecorator */}
                    {getFieldDecorator(`form.variants[${variantIndex}].competences`, { initialValue: [] })}
                    <AntCollapse.Panel
                      key="4"
                      header={
                        <div className={styles.info}>
                          <div className={styles.text}>
                            Компетенции
                          </div>
                          <div className={styles.notifier}>
                            {variant.competences.length !== 0
                              ? <div className={styles.defined}>Заданы</div>
                              : <div className={styles.undefined}>Не заданы</div>
                            }
                          </div>
                        </div>
                      }
                    >
                      <div className={styles.competences}>
                        {variant.competences.map((
                          competence, competenceIndex
                        ) =>
                          <div
                            key={competenceIndex}
                            className={styles.competence}
                          >
                            <div className={styles.text}>
                              {getFieldDecorator(`form.variants[${variantIndex}].competences[${competenceIndex}].text`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                initialValue: competence.text,
                                rules: [{
                                  required: true,
                                  message: `Вариант №${variantIndex + 1} - Компетенция №${competenceIndex + 1}`,
                                }],
                              })(
                                <AntInput
                                  size="default"
                                  // onChange={changeContent([
                                  //   'variants',
                                  //   variantIndex,
                                  //   'competences',
                                  //   competenceIndex,
                                  //   'text',
                                  // ])}
                                />
                              )}
                            </div>
                            <div className={styles.remove}>
                              <AntPopconfirm
                                title="Удалить компетенцию?"
                                okText="Да"
                                // onConfirm={removeContent([
                                //   'variants',
                                //   variantIndex,
                                //   'competences',
                                //   competenceIndex,
                                // ])}
                                cancelText="Нет"
                              >
                                <AntIcon
                                  type="close"
                                  className={styles.icon}
                                />
                              </AntPopconfirm>
                            </div>
                          </div>
                        )}
                        <AntButton
                          size="small"
                          type="primary"
                          onClick={this.addContent([
                            'variants',
                            variantIndex,
                            'competences',
                          ], {
                            text: 'Новая компетенция',
                          })}
                          className={styles.add}
                        >
                          Добавить подсказку
                        </AntButton>
                      </div>
                    </AntCollapse.Panel>
                  </AntCollapse>
                </div>
              </AntTabs.TabPane>
            )}
          </AntTabs>
          <div className={styles.actions}>
            <AntButton
              type="primary"
              icon="check"
              onClick={this.validateAndSave}
              className={styles.save}
            >
              Сохранить
            </AntButton>
            <AntButton
              type="default"
              icon="rollback"
              onClick={this.resetAndClose}
              className={styles.cancel}
            >
              Отменить
            </AntButton>
          </div>
        </div>
      </AntForm>
    );
  }
}

const Sortable = {
  List: SortableContainer(
    (props) => <ul>{props.children}</ul>
  ),
  Item: SortableElement(
    (props) => <li>{props.children}</li>
  ),
  Handler: SortableHandle(() =>
    <AntIcon
      type="appstore-o"
      className={styles.drag}
    />
  ),
};

Editor.propTypes = {
  // isOpen: PropTypes.bool.isRequired,
  closeEditor: PropTypes.func.isRequired,
  saveContent: PropTypes.func.isRequired,
  syncContent: PropTypes.func.isRequired,
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
      }).isRequired,
    ).isRequired,
  }).isRequired,
  // storage: PropTypes.shape({
  //   images: PropTypes.objectOf(
  //     PropTypes.string.isRequired,
  //   ).isRequired,
  //   crops: PropTypes.objectOf(
  //     PropTypes.string.isRequired,
  //   ).isRequired,
  // }).isRequired,
  form: PropTypes.shape({
    resetFields: PropTypes.func.isRequired,
    getFieldError: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
  }),
};

export default createForm()(Editor);
