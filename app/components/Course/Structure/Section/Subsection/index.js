import React, { PropTypes } from 'react';

import Unit from './Unit';

import styles from './styles.css';

const Subsection = ({ name, units = [] }) => (
  <div className={styles.subsection}>
    <div className={styles.name}>{name}</div>
    {units.map((data, index) =>
      <Unit key={index} {...data} />)
    }
  </div>
);

Subsection.propTypes = {
  name: PropTypes.string.isRequired,
  units: PropTypes.array,
};

export default Subsection;
