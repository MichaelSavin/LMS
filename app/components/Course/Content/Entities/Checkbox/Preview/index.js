import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Button as AntButton,
  Checkbox as AntCheckbox,
  } from 'antd';
import styles from './styles.css';

const Preview = ({
  content,
  storage,
  environment: {
    editor,
  },
}) =>
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
          {content.variants[editor.variant].points || '?'} балла
        </div>
      </div>
    </div>
    <div className={styles.question}>
      {content.variants[editor.variant].question || '?'}
    </div>
    <div className={styles.options}>
      {content.variants[editor.variant].options.map((option, index) =>
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
                checked={option.correct}
              />
            </div>
            <div className={styles.text}>
              {option.text || '?'}
            </div>
          </div>
        </div>
      )}
    </div>
    <div className={styles.attempts}>
      <AntButton type="primary">
        <div><b>Проверить ответ</b></div>
        <div>
          Попытка 1 из {
            content.variants[editor.variant].attempts || '?'
          }
        </div>
      </AntButton>
    </div>
  </div>;

Preview.propTypes = {
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
    editor: PropTypes.shape({
      open: PropTypes.bool.isRequired,
      variant: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Preview;
