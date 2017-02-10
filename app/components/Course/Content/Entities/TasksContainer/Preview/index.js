import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Collapse,
} from 'antd';
import {
  Editor as Draft,
  EditorState,
} from 'draft-js';
import { sample } from 'lodash/fp';
import classNames from 'classnames';
import { blockRenderer } from '../../../Entities';
import styles from './styles.css';

const Preview = (props) => {
  // console.log(props);
  const {
    content,
    // storage,
    // showHint,
    environment: {
      hints,
      status,
      // attemp,
      // editing,
      variant,
      activePanel,
    },
    changePanel,
  } = props;

  /* Количество баллов за задание, за вычетом использованных на подсказки */
  const avaiblePoints = content.variants[variant].points - hints.length;
  /* Количество неиспользованных подсказок */
  //  const avaibleHints = 2; // content.variants[variant].hints.length - hints.length;

  return (
    <div className={styles.preview}>
      <div className={styles.flag}>
        <div className={styles.icon}>
          <AntIcon type="tag" />
        </div>
        <div className={styles.content}>
          <div className={styles.text}>
            Контрольный вопрос
          </div>
          <div className={styles.points}>
            Баллы: <b>{avaiblePoints || '?'}</b>
          </div>
        </div>
      </div>
      <div className={styles.question}>
        {content.variants[variant].question || '?'}
      </div>
      <div className={styles.options}>
        <Collapse
          accordion
          activeKey={activePanel}
          onChange={changePanel}
        >
          {content.variants[variant].options.map((option, index) => (
            <Collapse.Panel
              key={index}
              header={option.taskTitle}
            >
              <Draft
                readOnly
                blockRendererFn={blockRenderer}
                editorState={option.editorState}
                // onChange={onChange}
                // className={className}
                // isReadOnly={isReadOnly}
              />
            </Collapse.Panel>)
          )}
        </Collapse>
      </div>
      {status &&
        <div
          className={classNames(
            styles.message,
            styles[status],
          )}
        >
          <AntIcon
            type={{
              fail: 'close-circle',
              error: 'exclamation-circle',
              success: 'check-circle',
            }[status]}
            className={styles.icon}
          />
          <div className={styles.content}>
            <div className={styles.text}>{{
              fail: 'Задание не выпонено',
              error: 'Ответ неверный, попробуйте еще раз',
              success: 'Ответ верный',
            }[status]}
            </div>
            {(status === 'success' || status === 'fail') &&
              <div className={styles.points}>
                Получено баллов:
                <b>{{
                  fail: 0,
                  success: avaiblePoints,
                }[status]}</b>
              </div>
            }
          </div>
        </div>
      }
      {(status === 'fail' || status === 'success') &&
        <div className={styles.explanation}>
          <b>Пояснение: </b>
          {sample(content.variants[variant].explanations).text}
        </div>
      }
      {/* <div className={styles.check}>
        <AntButton
          type="primary"
          onClick={checkAnswers}
          disabled={
            editing ||
            isEmpty(answers) || // Ответы не выбраны
            status === 'fail' ||
            status === 'success'
          }
        >
          <div><b>Проверить ответ</b></div>
          <div>
            {status === 'fail' || status === 'success'
              ? 'Попыток больше нет'
              : `Попытка ${attemp} из ${content.variants[variant].attempts || '?'}`
            }
          </div>
        </AntButton>
      </div>*/}
    </div>
  );
};

Preview.propTypes = {
  // showHint: PropTypes.func.isRequired,
  changePanel: PropTypes.func.isRequired,
  // checkAnswers: PropTypes.func.isRequired,
  content: PropTypes.shape({
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            editorState: PropTypes.instanceOf(EditorState).isRequired,
            text: PropTypes.string.isRequired,
            image: PropTypes.shape({
              text: PropTypes.string.isRequired,
              crop: PropTypes.object,
              source: PropTypes.string.isRequired,
            }),
            correct: PropTypes.bool.isRequired,
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
  environment: PropTypes.shape({
    hints: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
      }),
    ).isRequired,
    /* status: PropTypes.oneOf([
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
    readyPanel: PropTypes.number.isRequired,
    activePanel: PropTypes.string.isRequired,
  }).isRequired,
};

export default Preview;
