import React, {
  PropTypes,
} from 'react';
import { Icon as AntIcon } from 'antd';
import classNames from 'classnames';
import styles from './styles.css';

const Preview = ({
  size,
  content: {
    image,
  },
  storage,
  placement,
}) =>
  <div
    className={classNames(
      styles.preview,
      styles[size],
    )}
  >
    {image
      ?
        <img
          alt={image.text}
          src={
            storage.crop[placement][image.source] ||
            storage.image[image.source]
          }
          role="presentation"
          className={styles.image}
        />
      :
        <AntIcon
          type="camera"
          className={styles.icon}
        />
    }
  </div>;

Preview.propTypes = {
  size: PropTypes.oneOf(['small', 'auto']).isRequired,
  content: PropTypes.shape({
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
    image: PropTypes.objectOf(
      PropTypes.string.isRequired,
    ).isRequired,
    crop: PropTypes.shape({
      editor: PropTypes.objectOf(
        PropTypes.string.isRequired,
      ).isRequired,
      component: PropTypes.objectOf(
        PropTypes.string.isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
  placement: PropTypes.oneOf([
    'editor',
    'component',
  ]).isRequired,
};

export default Preview;
