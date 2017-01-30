import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Button as AntButton,
  Input as AntInput,
  } from 'antd';
import { sample } from 'lodash/fp';
import classNames from 'classnames';
import styles from './styles.css';

const Preview = ({
  content,
  // storage,
  showHint,
  environment: {
    hints,
    status,
    attemp,
    editing,
    answer,
    variant,
  },
  changeAnswer,
  checkAnswers,
}) => {
  /* Количество баллов за задание, за вычетом использованных на подсказки */
  const avaiblePoints = content.variants[variant].points - hints.length;
  /* Количество неиспользованных подсказок */
  const avaibleHints = content.variants[variant].hints.length - hints.length;

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
      { status !== 'fail' &&
        status !== 'success' &&
        avaibleHints > 0 &&
        avaiblePoints > 1 &&
          <div
            onClick={showHint(variant)}
            className={styles.showHint}
          >
            <div className={styles.text}>
              Показать подсказку
            </div>
            <div className={styles.count}>
              Доступно подсказок: <b>{avaibleHints}</b>
            </div>
            <div className={styles.info}>
              за использование снимается 1 балл
            </div>
          </div>
      }
      <div className={styles.question}>
        {content.variants[variant].question || '?'}
      </div>
      {hints.map((hint, index) =>
        <div
          key={index}
          className={styles.hint}
        >
          {hint.text}
        </div>
      )}
      <div className={styles.options}>
        <div
          className={styles.option}
        >
          <div className={styles.answer}>
            <div className={styles.text}>
              <AntInput
                onChange={changeAnswer}
                size="default"
                className={styles.text}
              />
            </div>
          </div>
        </div>

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
      <div className={styles.check}>
        <AntButton
          type="primary"
          onClick={checkAnswers}
          disabled={
            editing ||
            !answer.length || /* Ответы не выбраны */
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
      </div>
    </div>
  );
};

Preview.propTypes = {
  showHint: PropTypes.func.isRequired,
  changeAnswer: PropTypes.func.isRequired,
  checkAnswers: PropTypes.func.isRequired,
  content: PropTypes.shape({
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        points: PropTypes.string,
        attempts: PropTypes.string,
        question: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string.isRequired,
          }).isRequired,
        ).isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  /* storage: PropTypes.shape({
    images: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
    crops: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
  }).isRequired,*/
  environment: PropTypes.shape({
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
    answer: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired,
    editing: PropTypes.bool.isRequired,
  }).isRequired,
};

export default Preview;
