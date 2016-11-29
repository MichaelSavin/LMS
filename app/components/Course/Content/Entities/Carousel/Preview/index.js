import React, {
  PropTypes,
} from 'react';
import {
  Carousel as AntCarousel,
} from 'antd';
import styles from './styles.css';

const Preview = ({
  data,
  cache,
}) =>
  <div className={styles.preview}>
    <AntCarousel>
      {data.slides.map(({
        type,
        text,
        image,
      }, index) =>
        <div
          key={index}
          className={styles[type]}
        >
          {type === 'text'
            ? <div className={styles.text}>{text}</div>
            : type === 'image'
              ? cache[image.source]
                ?
                  <img
                    src={cache[image.source]}
                    alt={image.text}
                  />
                : <div className={styles.empty}>
                    Изображение не загружено
                  </div>
              : undefined
          }
        </div>
      )}
    </AntCarousel>
  </div>;

Preview.propTypes = {
  cache: PropTypes.object.isRequired,
  data: PropTypes.shape({
    slides: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf([
          'text',
          'image',
        ]).isRequired,
        text: PropTypes.string,
        image: PropTypes.shape({
          source: PropTypes.string,
          text: PropTypes.string,
        }),
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

export default Preview;
