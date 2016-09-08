import React, { PropTypes } from 'react';

import Subsection from './Subsection';

import Edit from 'components/UI/Icons/pencil';
import Remove from 'components/UI/Icons/trash';

import styles from './styles.css';

const Section = ({ name, subsections = [] }) => (
  <div className={styles.section}>
    <div className={styles.title}>
      <div className={styles.name}>
        {name}
        <Edit size={17.5} />
      </div>
      <div className={styles.actions}>
        <Remove size={20} />
      </div>
    </div>
    {subsections.map((data, index) =>
      <Subsection key={index} {...data} />)
    }
  </div>
);

Section.propTypes = {
  name: PropTypes.string.isRequired,
  subsections: PropTypes.array,
};

export default Section;
