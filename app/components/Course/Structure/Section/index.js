import React, { PropTypes } from 'react';

import Subsection from './Subsection';

import styles from './styles.css';

const Section = ({ name, subsections = [] }) => (
  <div className={styles.section}>
    <div className={styles.name}>{name}</div>
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
