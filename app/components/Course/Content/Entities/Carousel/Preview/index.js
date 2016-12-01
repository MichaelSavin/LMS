import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Carousel as AntCarousel,
} from 'antd';
import classNames from 'classnames';
import styles from './styles.css';

const Preview = ({
  data,
  cache,
  placement,
  fullscreen,
  toggleView,
}) =>
  <div
    className={
      classNames(
        styles.preview, {
          [styles.fullscreen]: fullscreen,
        }
      )
    }
  >
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
    {placement === 'editor' &&
      <span className={styles.resize}>
        <AntIcon
          type={fullscreen
            ? 'shrink'
            : 'arrows-alt'
          }
          onClick={toggleView}
        />
      </span>
    }
  </div>;

Preview.propTypes = {
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
  cache: PropTypes.object.isRequired,
  placement: PropTypes.oneOf([
    'modal',
    'editor',
  ]).isRequired,
  fullscreen: PropTypes.bool,
  toggleView: PropTypes.func,
};

export default Preview;
