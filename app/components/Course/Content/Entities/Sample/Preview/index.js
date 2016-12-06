import React, {
  PropTypes,
} from 'react';
import {
  Timeline as AntTimeline,
} from 'antd';
import styles from './styles.css';

const Preview = ({ data }) =>
  <div className={styles.preview}>
    <AntTimeline>
      {data.steps.map(({
        text,
        color,
        image,
      }, index) =>
        <AntTimeline.Item
          key={index}
          color={color}
        >
          {text}
          {image &&
            <img
              src={image}
              role="presentation"
            />
          }
        </AntTimeline.Item>
      )}
    </AntTimeline>
  </div>;

Preview.propTypes = {
  data: PropTypes.shape({
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        image: PropTypes.string,
        color: PropTypes.oneOf([
          'blue',
          'red',
          'green',
        ]).isRequired,
      }).isRequired
    ).isRequired,
  }).isRequired,
};

export default Preview;
