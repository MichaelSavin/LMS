import React, {
  PropTypes,
  Component,
} from 'react';
import {
  Icon as AntIcon,
  Button as AntButton,
  // Checkbox as AntCheckbox,
  Row,
  Col,
  } from 'antd';
import { isEqual, sample, shuffle } from 'lodash/fp';
import classNames from 'classnames';
import styles from './styles.css';

class Preview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      options: shuffle(
        props.content.variants[
          props.environment.variant
        ].options
      ),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.content.variants, nextProps.content.variants)) {
      this.setState({
        options: shuffle(
          nextProps.content.variants[
            nextProps.environment.variant
          ].options
        ),
      });
    }
  }

  render() {
    const {
      content,
      storage,
      showHint,
      isLocked,
      makeSortable,
      environment: {
        hints,
        status,
        attemp,
        editing,
        // answers,
        variant,
      },
      // chooseAnswer,
      checkAnswers,
    } = this.props;

    /* Количество баллов за задание, за вычетом использованных на подсказки */
    const current = content.variants[variant];
    const { options } = this.state;
    const avaiblePoints = current.points - hints.length;
    /* Количество неиспользованных подсказок */
    const avaibleHints = current.hints.length - hints.length;

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
        {status !== 'fail' &&
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
          {current.question || '?'}
        </div>
        {hints.map((hint, index) =>
          <div
            key={index}
            className={styles.hint}
          >
            {hint.text}
          </div>
        )}
        <Row className={styles.answers}>
          <Col span={12} className={styles.col}>
            <div className={styles.options}>
              <div className={styles.putField} ref={makeSortable} data-type="put" />
            </div>
          </Col>
          <Col span={12} className={styles.col}>
            <div className={styles.putField}>
              <div className={styles.options}>
                {current.options.map((option, index) =>

                  <div
                    key={index}
                    className={styles.option}
                    data-id={option.id}
                  >
                    {option.answerImage &&
                      <div className={styles.image}>
                        <img
                          src={storage.crops[option.answerImage.source]
                            || storage.images[option.answerImage.source]
                          }
                          alt={option.answerImage.text}
                          role="presentation"
                          width={250}
                        />
                      </div>
                    }
                    <div className={styles.answer}>
                      <div>
                        <AntIcon
                          key={index}
                        />
                      </div>
                      <div className={styles.text}>
                        {option.answerText || '?'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12} className={styles.col}>
            <div className={styles.options} ref={makeSortable} data-type="pull">
              {options.map((option, index) =>
                <div
                  key={index}
                  className={styles.option}
                  data-id={option.id}
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
                    <div className={`sortable-handle ${styles.drager}`}>
                      <AntIcon
                        type="appstore-o"
                        key={index}
                      />
                    </div>
                    <div className={styles.text}>
                      {option.text || '?'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
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
            {sample(current.explanations).text}
          </div>
        }
        <div className={styles.check}>
          <AntButton
            type="primary"
            onClick={checkAnswers}
            disabled={
              editing ||
              isLocked || /* Ответы не выбраны */
              status === 'fail' ||
              status === 'success'
            }
          >
            <div><b>Проверить ответ</b></div>
            <div>
              {status === 'fail' || status === 'success'
                ? 'Попыток больше нет'
                : `Попытка ${attemp} из ${current.attempts || '?'}`
              }
            </div>
          </AntButton>
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  // chooseAnswer: PropTypes.func.isRequired,
  showHint: PropTypes.func.isRequired,
  makeSortable: PropTypes.func.isRequired,
  checkAnswers: PropTypes.func.isRequired,
  isLocked: PropTypes.bool.isRequired,
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
            id: PropTypes.string.isRequired,
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
