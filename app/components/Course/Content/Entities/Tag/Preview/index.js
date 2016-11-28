import React, { PropTypes } from 'react';
import { Tag as AntTag } from 'antd';
import styles from './styles.css';

const Preview = ({ data }) =>
  <div className={styles.preview}>
    {data.tags.map(({
      text,
      color,
    }, index) =>
      <AntTag
        key={index}
        color={{
          blue: '#2db7f5',
          green: '#87d068',
          red: '#f50',
        }[color]}
        contentEditable={false}
      >
        {text || '?'}
      </AntTag>
    )}
  </div>;

Preview.propTypes = {
  data: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        color: PropTypes.oneOf([
          'blue',
          'green',
          'red',
        ]).isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

export default Preview;