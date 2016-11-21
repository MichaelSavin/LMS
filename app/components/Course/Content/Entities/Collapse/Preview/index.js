import React, {
  PropTypes,
} from 'react';
import {
  Collapse as AntCollapse,
} from 'antd';
import styles from './styles.css';

const Preview = ({ data }) =>
  <div className={styles.preview}>
    <AntCollapse>
      {data.rows.map(({
        text,
        title,
      }, index) =>
        <AntCollapse.Panel
          key={index}
          header={title}
        >
          <p>{text}</p>
        </AntCollapse.Panel>
      )}
    </AntCollapse>
  </div>;

Preview.propTypes = {
  data: PropTypes.shape({
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

export default Preview;
