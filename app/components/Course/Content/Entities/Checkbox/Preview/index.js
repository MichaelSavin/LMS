import React, {
  PropTypes,
} from 'react';
import {
  Button as AntButton,
  Checkbox as AntCheckbox,
  } from 'antd';
import styles from './styles.css';

const Preview = ({
  content,
  storage,
}) =>
  <div className={styles.preview}>
    <div className={styles.question}>
      {/* Показывает первый вариант задания */}
      {content.variants[0].question}
    </div>
    <div className={styles.options}>
      {/* Показывает первый вариант задания */}
      {content.variants[0].options
        .map((
          option,
          index
      ) =>
        <div
          key={index}
          className={styles.option}
        >
          {option.image &&
            <div className={styles.image}>
              <img
                src={storage.images[option.image.name]}
                role="presentation"
                width={250}
              />
            </div>
          }
          <div className={styles.checkbox}>
            <AntCheckbox
              key={index}
              checked={option.isCorrect}
              className={styles.answer}
            />
          </div>
          <div className={styles.text}>
            {option.text}
          </div>
        </div>
      )}
    </div>
    <div className={styles.attemps}>
      <AntButton type="dashed">
        <div>Количество попыток</div>
        <div>Попытка 1 из 3</div>
      </AntButton>
    </div>
  </div>;

Preview.propTypes = {
  content: PropTypes.shape({
    points: PropTypes.object.isRequired,
    variants: PropTypes.arrayOf(
      PropTypes.shape({
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
};

export default Preview;
