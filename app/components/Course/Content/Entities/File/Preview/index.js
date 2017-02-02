import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Button as AntButton,
  Upload, Icon, // Modal,
  } from 'antd';
// import { isEmpty, sample } from 'lodash/fp';
import classNames from 'classnames';
import styles from './styles.css';

const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">Upload</div>
  </div>
);

const Preview = ({
  content,
  // storage,
  showHint,
  environment: {
    hints,
    status,
    attemp,
    editing,
    variant,
    fileList,
  },
  chooseAnswer,
  checkAnswers,
}) => {
  /* Количество баллов за задание, за вычетом использованных на подсказки */
  const current = content.variants[variant];
  const avaiblePoints = content.variants[variant].points - hints.length;
  /* Количество неиспользованных подсказок */
  const avaibleHints = content.variants[variant].hints.length - hints.length;
  const { qty } = current.option;

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
        <Upload
          listType="picture-card"
          fileList={fileList}
          // onPreview={this.handlePreview}
          onChange={chooseAnswer}
        >
          {fileList.length >= qty ? null : uploadButton}
        </Upload>
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
              success: 'Задание отправленно на проверку', //'Ответ верный',
            }[status]}
            </div>
            {/* (status === 'success' || status === 'fail') &&
              <div className={styles.points}>
                Получено баллов:
                <b>{{
                  fail: 0,
                  success: avaiblePoints,
                }[status]}</b>
              </div>*/
            }
          </div>
        </div>
      }
      {/* (status === 'fail' || status === 'success') &&
        <div className={styles.explanation}>
          <b>Пояснение: </b>
          {sample(content.variants[variant].explanations).text}
        </div>
      */}
      <div className={styles.check}>
        <AntButton
          type="primary"
          onClick={checkAnswers}
          disabled={
            editing ||
            !fileList.length || /* Ответы не выбраны */
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

export default Preview;
