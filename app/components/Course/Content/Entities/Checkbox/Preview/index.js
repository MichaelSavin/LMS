import React, {
  PropTypes,
} from 'react';
import {
  // Button as AntButton,
  Checkbox as AntCheckbox,
  } from 'antd';
import ImmutablePropTypes from
  'react-immutable-proptypes';
import styles from './styles.css';

const Preview = ({
  content,
  storage,
  changeContent,
}) =>
  <div className={styles.preview}>
    <div className={styles.question}>
      {content.get('question')}
    </div>
    <div className={styles.options}>
      {content.get('options').map((
         option,
         index
      ) =>
        <div
          key={index}
          className={styles.option}
        >
          {option.get('image') &&
            <div className={styles.image}>
              <img
                src={storage.images[
                  option.getIn([
                    'image',
                    'name',
                  ])
                ]}
                role="presentation"
                width={250}
              />
            </div>
          }
          <div className={styles.checkbox}>
            <AntCheckbox
              key={index}
              checked={option.get('checked')}
              onChange={changeContent([
                'options',
                index,
                'checked',
              ])}
              className={styles.answer}
            />
          </div>
          <div className={styles.text}>
            {option.get('text')}
          </div>
        </div>
      )}
    </div>
    { /* <div className={styles.attemps}>
      <AntButton type="primary">
        <div>Количество попыток</div>
        <div>Попытка 1 из 3</div>
      </AntButton>
    </div> */ }
  </div>;

Preview.propTypes = {
  content: ImmutablePropTypes.mapContains({
    question: PropTypes.string.isRequired,
    options: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        text: PropTypes.string,
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
  storage: PropTypes.shape({
    images: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
    crops: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
  }).isRequired,
  changeContent: PropTypes.func.isRequired,
};

export default Preview;
