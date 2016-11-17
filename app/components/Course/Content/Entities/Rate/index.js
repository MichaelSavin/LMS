import React, { PropTypes } from 'react';
import { Rate as AntRate } from 'antd';
import styles from './styles.css';

const Rate = () =>
  <span
    className={styles.rate}
  >
    <AntRate
      allowHalf
      style={{
        margin: 0,
        padding: 0,
      }}
      defaultValue={0}
    />
  </span>;

Rate.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Rate;
