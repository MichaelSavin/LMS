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
import ImmutablePropTypes from
  'react-immutable-proptypes';
import Validator from 'components/UI/Validator';
import Dropzone from 'react-dropzone';
import styles from './styles.css';

const Editor = ({
  errors,
  content,
  storage,
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
  const hasErrors = !errors.isEmpty();
  const validateAndSave = () => {
    if (!hasErrors) { saveContent(); }
  };
  const resetAndClose = () => {
    closeEditor();
  };
  return (
    <div className={styles.editor}>
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
      {hasErrors &&
        <div className={styles.errors}>
          <div className={styles.text}>
            Необходимо заполнить поля:
          </div>
          {errors.map((error, index) =>
            <div
              key={index}
              className={styles.error}
            >
              {error}
            </div>
          )}
        </div>
      }
      <AntTabs
        className={styles.variants}
        tabBarExtraContent={
          <AntButton
            size="small"
            type="primary"
            onClick={addContent([
              'variants',
            ], {
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
            })}
          >
            Добавить вариант задания
          </AntButton>
        }
      >
        {content.get('variants').map((
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
              <Validator
                rule={(value) => value.trim().length > 3}
                value={variant.get('question')}
                message={`Вариант №${variantIndex + 1} - Вопрос к заданию`}
                onChange={changeContent([
                  'variants',
                  variantIndex,
                  'question',
                ])}
              >
                <AntInput
                  rows={4}
                  size="default"
                  type="textarea"
                  className={styles.question}
                />
              </Validator>
              <AntCollapse
                className={styles.data}
                defaultActiveKey="1"
              >
                <AntCollapse.Panel
                  key="1"
                  header={variant
                    .get('options')
                    .filter((option) =>
                      option.get('correct') === true
                    ).isEmpty()
                      ? 'Варианты ответов не заданы'
                      : 'Заданы'
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
                      {variant.get('options').map((
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
                              <Validator
                                value={option.get('text')}
                                message={`Вариант №${variantIndex + 1} - Ответ №${optionIndex + 1}`}
                                onChange={changeContent([
                                  'variants',
                                  variantIndex,
                                  'options',
                                  optionIndex,
                                  'text',
                                ])}
                              >
                                <AntInput size="default" />
                              </Validator>
                            </div>
                            <div className={styles.image}>
                              {option.get('image')
                                /* eslint-disable */
                                ? <div className={styles.preview}>
                                    <img
                                      src={storage[
                                        option.getIn([
                                          'image',
                                          'name',
                                        ])
                                      ]}
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
                                      className={styles.icon}
                                      type="camera"
                                    />
                                  </div>
                                /* eslint-enable */
                              }
                            </div>
                            <div className={styles.checkbox}>
                              <AntCheckbox
                                checked={option.get('correct')}
                                onChange={changeContent([
                                  'variants',
                                  variantIndex,
                                  'options',
                                  optionIndex,
                                  'correct',
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
                        type="primary"
                        onClick={addContent([
                          'variants',
                          variantIndex,
                          'options',
                        ], {
                          text: 'Новый вариант',
                          image: undefined,
                          checked: false,
                          correct: false,
                        })}
                      >
                        Добавить вариант ответа
                      </AntButton>
                    </Sortable.List>
                  </div>
                </AntCollapse.Panel>
                <AntCollapse.Panel
                  key="2"
                  header="Пояснения к правильному ответу"
                >
                  <div className={styles.explanations}>
                    {variant.get('explanations').map((
                      explanation, explanationIndex
                    ) =>
                      <div
                        key={explanationIndex}
                        className={styles.explanation}
                      >
                        {explanation.get('text')}
                      </div>
                    )}
                  </div>
                  <AntButton
                    type="primary"
                    onClick={addContent([
                      'variants',
                      variantIndex,
                      'explanations',
                    ], {
                      text: 'Новое объяснение',
                    })}
                  >
                    Добавить пояснение к ответу
                  </AntButton>
                </AntCollapse.Panel>
                <AntCollapse.Panel
                  key="3"
                  header="Подсказки"
                >
                  <div className={styles.hints}>
                    {variant.get('hints').map((
                      hint, hintIndex
                    ) =>
                      <div
                        key={hintIndex}
                        className={styles.hint}
                      >
                        {hint.get('text')}
                      </div>
                    )}
                  </div>
                  <AntButton
                    type="primary"
                    onClick={addContent([
                      'variants',
                      variantIndex,
                      'hints',
                    ], {
                      text: 'Новая подсказка',
                    })}
                  >
                    Добавить подсказку
                  </AntButton>
                </AntCollapse.Panel>
                <AntCollapse.Panel
                  key="4"
                  header="Компетенции"
                >
                  <div className={styles.competences}>
                    {variant.get('competences').map((
                      competence, competenceIndex
                    ) =>
                      <div
                        key={competenceIndex}
                        className={styles.competence}
                      >
                        {competence.get('text')}
                      </div>
                    )}
                  </div>
                  <AntButton
                    type="primary"
                    onClick={addContent([
                      'variants',
                      variantIndex,
                      'competences',
                    ], {
                      text: 'Новая компетенция',
                    })}
                  >
                    Добавить компетенцию
                  </AntButton>
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
  content: ImmutablePropTypes.mapContains({
    points: ImmutablePropTypes.map.isRequired,
    variants: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        question: PropTypes.string.isRequired,
        options: ImmutablePropTypes.listOf(
          ImmutablePropTypes.mapContains({
            text: PropTypes.string.isRequired,
            image: ImmutablePropTypes.mapContains({
              name: PropTypes.string.isRequired,
              text: PropTypes.string.isRequired,
              crop: ImmutablePropTypes.mapContains({
                size: PropTypes.object.isRequired,
                name: PropTypes.string.isRequired,
              }),
            }),
            checked: PropTypes.bool.isRequired,
            correct: PropTypes.bool.isRequired,
          }).isRequired,
        ).isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  errors: ImmutablePropTypes.setOf(
    PropTypes.string.isRequired
  ),
  storage: PropTypes.shape({
    images: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
    crops: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
  }).isRequired,
};

export default Editor;
