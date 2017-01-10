import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Tabs as AntTabs,
  Input as AntInput,
  Button as AntButton,
  Collapse as AntCollapse,
  Checkbox as AntCheckbox,
  Popconfirm as AntPopconfirm,
} from 'antd';
import {
  SortableHandle,
  SortableElement,
  SortableContainer,
} from 'react-sortable-hoc';
import { get, compact } from 'lodash';
import flatten from 'object-end-keys';
import { createForm } from 'rc-form';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import styles from './styles.css';

const Editor = ({
  isOpen,
  content,
  storage,
  addContent,
  dragContent,
  closeEditor,
  uploadImage,
  saveContent,
  undoHistory,
  redoHistory,
  // changeContent,
  removeContent,
  form: {
    // resetFields,
    getFieldError,
    getFieldProps,
    // getFieldsProps,
    // getFieldsValue,
    validateFields,
    // getFieldsError,
    // setFieldsValue,
    getFieldDecorator,
  },
}) => {
  const validateAndSave = () => {
    validateFields((error, values) => {
      if (!error) {
        saveContent(); // передача в данных из формы
      } else {
        console.log('error', error, values);
      }
    });
  };

  const resetAndClose = () => {
    closeEditor();
  };

  const fieldsErrors = compact(
    flatten(content).map(
      (field) => getFieldError(field)
    )
  );

  return (
    <div
      className={classNames(
        styles.editor,
        { [styles.hidden]: !isOpen }
      )}
    >
      <div className={styles.title}>
        <div className={styles.text}>
          Редактирование компонента
        </div>
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
      </div>
      <div className={styles.errors}>
        {/* <div className={styles.text}>
          Необходимо заполнить поля:
        </div>
        */ }
        {fieldsErrors.map((error, index) =>
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
            onClick={addContent(['variants'], {
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
        {content.variants.map((
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
                    onConfirm={removeContent([
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
                  {/*
                  {getFieldDecorator(`variants[${variantIndex}].question`, {
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
                      // onChange={changeContent([
                      //   'variants',
                      //   variantIndex,
                      //   'question',
                      // ])}
                    />
                  )}
                  */}
                  <AntInput
                    rows={4}
                    size="default"
                    type="textarea"
                    {...getFieldProps(`variants[${variantIndex}].question`, {
                      initialValue: variant.question,
                      rules: [{
                        required: true,
                        message: `Вариант №${variantIndex + 1} - Вопрос к заданию`,
                      }],
                    })}
                  />
                </div>
                <div className={styles.points}>
                  {getFieldDecorator(`variants[${variantIndex}].points`, {
                    initialValue: variant.points,
                    rules: [{
                      required: true,
                      message: `Вариант №${variantIndex + 1} - Баллы за задание`,
                    }],
                  })(
                    <AntInput
                      size="default"
                      // onChange={changeContent([
                      //   'variants',
                      //   variantIndex,
                      //   'points',
                      // ])}
                    />
                  )}
                  Баллы
                </div>
                <div className={styles.attemps}>
                  {getFieldDecorator(`variants[${variantIndex}].attemps`, {
                    initialValue: variant.attemps,
                    rules: [{
                      required: true,
                      message: `Вариант №${variantIndex + 1} - Количество попыток`,
                    }],
                  })(
                    <AntInput
                      size="default"
                      // onChange={changeContent([
                      //   'variants',
                      //   variantIndex,
                      //   'attemps',
                      // ])}
                    />
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
                      onSortEnd={dragContent([
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
                              {getFieldDecorator(`variants[${variantIndex}].options[${optionIndex}].text`, {
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
                                      onDrop={uploadImage([
                                        'variants',
                                        variantIndex,
                                        'options',
                                        optionIndex,
                                      ])}
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
                                onConfirm={removeContent([
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
                        onClick={addContent([
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
                          {getFieldDecorator(`variants[${variantIndex}].explanations[${explanationIndex}].text`, {
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
                      onClick={addContent([
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
                          {getFieldDecorator(`variants[${variantIndex}].hints[${hintIndex}].text`, {
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
                            onConfirm={removeContent([
                              'variants',
                              variantIndex,
                              'hints',
                              hintIndex,
                            ])}
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
                      onClick={addContent([
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

                          {getFieldDecorator(`variants[${variantIndex}].competences[${competenceIndex}].text`, {
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
                            onConfirm={removeContent([
                              'variants',
                              variantIndex,
                              'competences',
                              competenceIndex,
                            ])}
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
                      onClick={addContent([
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
          onClick={validateAndSave}
          className={styles.save}
        >
          Сохранить
        </AntButton>
        <AntButton
          type="default"
          icon="rollback"
          onClick={resetAndClose}
          className={styles.cancel}
        >
          Отменить
        </AntButton>
      </div>
    </div>
  );
};

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
  isOpen: PropTypes.bool.isRequired,
  addContent: PropTypes.func.isRequired,
  dragContent: PropTypes.func.isRequired,
  closeEditor: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  saveContent: PropTypes.func.isRequired,
  undoHistory: PropTypes.func.isRequired,
  redoHistory: PropTypes.func.isRequired,
  removeContent: PropTypes.func.isRequired,
  // changeContent: PropTypes.func.isRequired,
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
  storage: PropTypes.shape({
    images: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
    crops: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
  }).isRequired,
  form: PropTypes.shape({
    resetFields: PropTypes.func.isRequired,
    getFieldError: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
  }),
};

export default createForm({
  // Замена локальных методов onChange
  onFieldsChange(props, fields) {
    Object.values(fields).forEach(
      ({ name, value }) => {
        props.changeContent(name, value);
      }
    );
  },
  // Синхронизация данных в HOC формы
  // с данными из state компонента
  // Когда в форму приходят новые данные - отключается валидатор
  mapPropsToFields({ content }) {
    return flatten(content).reduce(
      (fields, name) => ({
        ...fields,
        [name]: {
          value: get(
            content,
            name
          ),
        },
      }), {});
  },
})(Editor);
