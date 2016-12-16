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
  data: {
    text,
    title,
    image,
    alt,
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
          className={styles.image}
          src={storage[`crop${image}`]}
          alt={alt}
          role="presentation"
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
    {placement === 'editor' &&
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
  data: PropTypes.shape({
    alt: PropTypes.string,
    text: PropTypes.string.isRequired,
    image: PropTypes.string,
    cache: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  storage: PropTypes.object.isRequired,
  placement: PropTypes.oneOf([
    'modal',
    'editor',
  ]).isRequired,
  dimensions: PropTypes.shape({
    fullscreen: PropTypes.bool.isRequired,
  }).isRequired,
  toggleFullscreen: PropTypes.func,
};

export default Preview;
