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
import { isEmpty } from 'lodash/fp';
import classNames from 'classnames';
import Uploader from 'components/UI/Uploader';
import styles from './styles.css';

const Editor = ({
  content,
  // storage,
  addContent,
  dragContent,
  closeEditor,
  uploadImage,
  saveContent,
  undoHistory,
  redoHistory,
  changeContent,
  removeContent,
}) => {
  const errors = validator(content);

  const validateAndSave = () => {
    if (isEmpty(errors)) {
      saveContent();
    }
  };

  const resetAndClose = () => {
    closeEditor();
  };

  return (
    <div
      className={classNames(styles.editor)}
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
        {Object.values(errors).map((error, index) =>
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
                isCorrect: false,
              }, {
                text: 'Вариант 2',
                image: undefined,
                isCorrect: false,
              }, {
                text: 'Вариант 3',
                image: undefined,
                isCorrect: false,
              }, {
                text: 'Вариант 4',
                image: undefined,
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
                  <AntInput
                    rows={4}
                    size="default"
                    type="textarea"
                    value={variant.question}
                    onChange={changeContent([
                      'variants',
                      variantIndex,
                      'question',
                    ])}
                    className={classNames(
                      { error: errors[`variants[${variantIndex}].question`] }
                    )}
                  />
                </div>
                <div className={styles.points}>
                  <AntInput
                    size="default"
                    value={variant.points}
                    onChange={changeContent([
                      'variants',
                      variantIndex,
                      'points',
                    ])}
                    className={classNames(
                      { error: errors[`variants[${variantIndex}].points`] }
                    )}
                  />
                  Баллы
                </div>
                <div className={styles.attempts}>
                  <AntInput
                    size="default"
                    value={variant.attempts}
                    onChange={changeContent([
                      'variants',
                      variantIndex,
                      'attempts',
                    ])}
                    className={classNames(
                      { error: errors[`variants[${variantIndex}].attempts`] }
                    )}
                  />
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
                        {errors[`variants[${variantIndex}].options.checked`]
                          ? <div className={styles.undefined}>Не заданы</div>
                          : <div className={styles.defined}>Заданы</div>
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
                              <AntInput
                                size="default"
                                value={option.text}
                                onChange={changeContent([
                                  'variants',
                                  variantIndex,
                                  'options',
                                  optionIndex,
                                  'text',
                                ])}
                                className={classNames(
                                  { error: errors[`variants[${variantIndex}].options[${optionIndex}].text`] }
                                )}
                              />
                            </div>
                            <div className={styles.image}>
                              <Uploader
                                size="small"
                                preload={option.image}
                                onChange={uploadImage([
                                  'variants',
                                  variantIndex,
                                  'options',
                                  optionIndex,
                                ])}
                              />
                            </div>
                            <div className={styles.checkbox}>
                              <AntCheckbox
                                checked={option.isCorrect}
                                onChange={changeContent([
                                  'variants',
                                  variantIndex,
                                  'options',
                                  optionIndex,
                                  'isCorrect',
                                ])}
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
                        {errors[`variants[${variantIndex}].explanations`]
                          ? <div className={styles.undefined}>Не заданы</div>
                          : <div className={styles.defined}>Заданы</div>
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
                          <AntInput
                            size="default"
                            value={explanation.text}
                            onChange={changeContent([
                              'variants',
                              variantIndex,
                              'explanations',
                              explanationIndex,
                              'text',
                            ])}
                            className={classNames(
                              { error: errors[`variants[${variantIndex}].explanations[${explanationIndex}].text`] }
                            )}
                          />
                        </div>
                        <div className={styles.remove}>
                          <AntPopconfirm
                            title="Удалить пояснение?"
                            okText="Да"
                            onConfirm={removeContent([
                              'variants',
                              variantIndex,
                              'explanations',
                              explanationIndex,
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
                        {errors[`variants[${variantIndex}].hints`]
                          ? <div className={styles.undefined}>Не заданы</div>
                          : <div className={styles.defined}>Заданы</div>
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
                          <AntInput
                            size="default"
                            value={hint.text}
                            onChange={changeContent([
                              'variants',
                              variantIndex,
                              'hints',
                              hintIndex,
                              'text',
                            ])}
                            className={classNames(
                              { error: errors[`variants[${variantIndex}].hints[${hintIndex}].text`] }
                            )}
                          />
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
                        {errors[`variants[${variantIndex}].competences`]
                          ? <div className={styles.undefined}>Не заданы</div>
                          : <div className={styles.defined}>Заданы</div>
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
                          <AntInput
                            size="default"
                            value={competence.text}
                            onChange={changeContent([
                              'variants',
                              variantIndex,
                              'competences',
                              competenceIndex,
                              'text',
                            ])}
                            className={classNames(
                              { error: errors[`variants[${variantIndex}].competences[${competenceIndex}].text`] }
                            )}
                          />
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
  addContent: PropTypes.func.isRequired,
  dragContent: PropTypes.func.isRequired,
  closeEditor: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  saveContent: PropTypes.func.isRequired,
  undoHistory: PropTypes.func.isRequired,
  redoHistory: PropTypes.func.isRequired,
  removeContent: PropTypes.func.isRequired,
  changeContent: PropTypes.func.isRequired,
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
};

const validator = (content) => {
  const errors = {};
  /* eslint-disable */
  content.variants.forEach((variant, variantIndex) => {
    if (!variant.question) { errors[`variants[${variantIndex}].question`] = `Необходимо указать вопрос в варианте №${variantIndex + 1}`; }
    if (!parseInt(variant.attempts, 10)) { errors[`variants[${variantIndex}].attempts`] = `Необходимо указать количество попыток в варианте №${variantIndex + 1}`; }
    if (!parseInt(variant.points, 10)) { errors[`variants[${variantIndex}].points`] = `Необходимо указать количество баллов в варианте №${variantIndex + 1}`; }
    if (!(variant.options.length > 0)) { errors[`variants[${variantIndex}].options`] = `Необходимо добавить варианты ответов в варианте №${variantIndex + 1}`; }
    variant.options.forEach((option, optionIndex) => { if (!option.text) { errors[`variants[${variantIndex}].options[${optionIndex}].text`] = `Необходимо указать текст ответа №${optionIndex + 1} в варианте №${variantIndex + 1}`; }});
    if (!variant.options.some((option) => option.isCorrect === true)) { errors[`variants[${variantIndex}].options.checked`] = `Необходимо выбрать правильные варианты ответов в варианте №${variantIndex + 1}`; }
    if (!(variant.hints.length > 0)) { errors[`variants[${variantIndex}].hints`] = `Необходимо добавить подсказки в варианте №${variantIndex + 1}`; }
    if (!(variant.competences.length > 0)) { errors[`variants[${variantIndex}].competences`] = `Необходимо добавить компетенции в варианте №${variantIndex + 1}`; }
    if (!(variant.explanations.length > 0)) { errors[`variants[${variantIndex}].explanations`] = `Необходимо добавить пояснения в варианте №${variantIndex + 1}`; }
    variant.hints.forEach((hint, hintIndex) => { if (!hint.text) { errors[`variants[${variantIndex}].hints[${hintIndex}].text`] = `Необходимо указать текст подсказки №${hintIndex + 1} в варианте №${variantIndex + 1}`; }});
    variant.competences.forEach((competence, competenceIndex) => { if (!competence.text) { errors[`variants[${variantIndex}].competences[${competenceIndex}].text`] = `Необходимо указать текст компетенции №${competenceIndex + 1} в варианте №${variantIndex + 1}`; }});
    variant.explanations.forEach((explanation, explanationIndex) => { if (!explanation.text) { errors[`variants[${variantIndex}].explanations[${explanationIndex}].text`] = `Необходимо указать текст пояснения №${explanationIndex + 1} в варианте №${variantIndex + 1}`; }});
  });
  /* eslint-enable */
  return errors;
};

export default Editor;
