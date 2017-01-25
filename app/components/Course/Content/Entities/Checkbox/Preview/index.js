import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Button as AntButton,
  Checkbox as AntCheckbox,
  } from 'antd';
import classNames from 'classnames';
import { isEmpty } from 'lodash/fp';
import styles from './styles.css';

const Preview = ({
  content,
  storage,
  showHint,
  environment: {
    hints,
    status,
    attemp,
    editing,
    answers,
    variant,
  },
  chooseAnswer,
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
        {content.variants[variant].options.map((option, index) =>
          <div
            key={index}
            className={styles.option}
          >
            {option.image &&
              <div className={styles.image}>
                <img
                  src={storage.crops[option.image.source]
                    || storage.images[option.image.source]
                  }
                  alt={option.image.text}
                  role="presentation"
                  width={250}
                />
              </div>
            }
            <div className={styles.answer}>
              <div className={styles.checkbox}>
                <AntCheckbox
                  key={index}
                  checked={/*
                    В режиме редактирования показывает
                    правильные ответы, в режиме выполнения
                    задания - выбранные ответы */
                    editing
                      ? option.correct
                      : answers.includes(index)
                  }
                  onChange={chooseAnswer(index)}
                />
              </div>
              <div className={styles.text}>
                {option.text || '?'}
              </div>
              {editing && option.correct &&
                <div className={styles.hint}>
                  правильный ответ
                </div>
              }
            </div>
          </div>
        )}
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
              success: 'check-circle',
              error: 'exclamation-circle',
              fail: 'close-circle',
            }[status]}
            className={styles.icon}
          />
          <div className={styles.text}>{{
            success: 'Ответ верный',
            error: 'Ответ неверный, попробуйте еще раз',
            fail: 'Задание не выпонено',
          }[status]}
          </div>
          {(status === 'success' || status === 'fail') &&
            <div className={styles.points}>
              Получено баллов:
              <b>{{
                success: avaiblePoints,
                fail: 0,
              }[status]}</b>
            </div>
          }
        </div>
      }

      <div className={styles.check}>
        <AntButton
          type="primary"
          onClick={checkAnswers}
          disabled={
            isEmpty(answers) || /* Ответы не выбраны */
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
  chooseAnswer: PropTypes.func.isRequired,
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
  storage: PropTypes.shape({
    images: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
    crops: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
  }).isRequired,
  environment: PropTypes.shape({
    hints: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
      }),
    ).isRequired,
    status: PropTypes.oneOf([
      null,
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

export default Preview;
