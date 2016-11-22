import React, {
  PropTypes,
} from 'react';
import {
  Card as AntCard,
} from 'antd';
import styles from './styles.css';

const Preview = ({
  data: {
    text,
    title,
    image,
  },
  storage,
}) =>
  <div className={styles.preview}>
    <AntCard>
      {image &&
        <img
          className={styles.image}
          src={storage[image]}
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
