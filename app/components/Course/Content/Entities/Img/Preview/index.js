import React, {
  PropTypes,
} from 'react';
import {
  Card as AntCard,
} from 'antd';
import styles from './styles.css';

const Preview = ({
  data: {
    image,
    cropImage,
    name,
  },
  storage,
}) =>
  <div className={styles.preview}>
    <AntCard>
      {(cropImage || name || image) ?
        <img
          className={styles.image}
          src={cropImage || storage[name] || image}
          role="presentation"
        />
        : <div
          className={styles.empty}
        >
          Изображение не загружено
        </div>
      }
    </AntCard>
  </div>;

Preview.propTypes = {
  data: PropTypes.shape({
    text: PropTypes.string.isRequired,
    image: PropTypes.string,
    cache: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  storage: PropTypes.object.isRequired,
};

export default Preview;
