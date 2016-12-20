import React, {
  PropTypes,
} from 'react';
import {
  Card as AntCard,
  Icon as AntIcon,
} from 'antd';
import classNames from 'classnames';
import styles from './styles.css';

const Preview = ({
  content: {
    text,
    title,
    image,
  },
  storage,
  placement,
  dimensions: {
    fullscreen,
  },
  toggleFullscreen,
}) =>
  <div
    className={classNames(
      styles.preview,
      { [styles.fullscreen]: fullscreen }
    )}
  >
    <AntCard>
      {image &&
        <img
          alt={image.text}
          src={
            storage.crop[placement][image.source] ||
            storage.image[image.source]
          }
          role="presentation"
          className={styles.image}
        />
      }
      {title &&
        <div className={styles.title}>
          {title}
        </div>
      }
      <div className={styles.text}>
        {text}
      </div>
    </AntCard>
    {placement === 'component' &&
      <div className={styles.icons}>
        <span className={styles.resize}>
          <AntIcon
            type={fullscreen
              ? 'shrink'
              : 'arrows-alt'
            }
            onClick={toggleFullscreen}
          />
        </span>
      </div>
    }
  </div>;

Preview.propTypes = {
  content: PropTypes.shape({
    text: PropTypes.string.isRequired,
    title: PropTypes.string,
    image: PropTypes.shape({
      source: PropTypes.string.isRequired,
      text: PropTypes.string,
      crop: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        pixels: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
          width: PropTypes.number.isRequired,
          height: PropTypes.number.isRequired,
        }).isRequired,
        aspect: PropTypes.oneOf([
          false,
          16 / 9,
          4 / 3,
          1,
          3 / 4,
          9 / 16,
        ]),
      }),
    }),
  }).isRequired,
  storage: PropTypes.shape({
    image: PropTypes.object.isRequired,
    crop: PropTypes.object.isRequired,
  }).isRequired,
  placement: PropTypes.oneOf([
    'editor',
    'component',
  ]).isRequired,
  dimensions: PropTypes.shape({
    fullscreen: PropTypes.bool.isRequired,
    width: PropTypes.number,
  }).isRequired,
  toggleFullscreen: PropTypes.func,
};

export default Preview;
