import React, { PropTypes } from 'react';
import { Rate as AntRate } from 'antd';
// import styles from './styles.css';

const Rate = () =>
  <AntRate
    allowHalf
    style={{
      margin: 0,
      padding: 0,
    }}
    contentEditable={false}
    defaultValue={0}
  />;

Rate.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Rate;
