import React, { PropTypes } from 'react';

import Unit from './Unit';

import Edit from 'components/UI/Icons/pencil';
import Remove from 'components/UI/Icons/trash';

import styles from './styles.css';

const Subsection = ({ name, units = [] }) => (
  <div className={styles.subsection}>
    <div className={styles.title}>
      <div className={styles.name}>
        {name}
        <Edit size={15} />
      </div>
      <div className={styles.actions}>
        <Remove size={17.5} />
      </div>
    </div>
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
