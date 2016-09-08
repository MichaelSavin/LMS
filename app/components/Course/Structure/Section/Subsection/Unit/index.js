import React, { PropTypes } from 'react';

import styles from './styles.css';

const Unit = ({ data: { id, name, info }, actions }) => ( // eslint-disable-line no-unused-vars
  <div className={styles.unit}>
    <div className={styles.name}>{name}</div>
    <div className={styles.info}>{info}</div>
  </div>
);

Unit.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
  }).isRequired,
  actions: PropTypes.object.isRequired,
};

export default Unit;
