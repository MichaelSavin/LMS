import React, { PropTypes } from 'react';

import Unit from './Unit';

import styles from './styles.css';

const SubSection = ({ name, units }) => (
  <div className={styles.subsection}>
    <div className={styles.name}>{name}</div>
    {units && units.map((data, index) =>
      <Unit key={index} {...data} />)
    }
  </div>
);

SubSection.propTypes = {
  name: PropTypes.string.isRequired,
  units: PropTypes.array,
};

export default SubSection;
