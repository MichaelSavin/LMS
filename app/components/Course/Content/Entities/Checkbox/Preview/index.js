import React, {
  PropTypes,
} from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import styles from './styles.css';


const Preview = ({
  data,
  toggleChecked,
  images }) => {
  return (
    <div className={styles.preview}>
      <span className={styles.question}>{data.question}</span>
      {Object.keys(images).length !== 0 ? (
        <div className={styles.row}>
          {data.answers.map((content, index) =>
            <div className={styles.col} key={index}>
              <img
                src={images[content.image]}
                role="presentation"
                width={250}
              />
              <AntCheckbox
                key={index}
                checked={content.checked}
                className={styles.answer}
                onChange={toggleChecked(index)}
              >
                {content.value}
              </AntCheckbox>
            </div>
          )}
        </div>
      ) : (
        <div>
          {data.answers.map((content, index) =>
            <AntCheckbox
              key={index}
              checked={content.checked}
              className={styles.answer}
              onChange={toggleChecked(index)}
            >
              {content.value}
            </AntCheckbox>
          )}
        </div>
      )}
    </div>
  );
};

Preview.propTypes = {
  images: PropTypes.object.isRequired,
  toggleChecked: PropTypes.func.isRequired,
  data: PropTypes.shape({
    anwsers: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        checked: PropTypes.bool.isRequired,
      }).isRequired,
    ),
  }).isRequired,
};

export default Preview;
