import React, { PropTypes } from 'react';

import SubSection from './SubSection';

import styles from './styles.css';

const Section = ({ name, subsections }) => (
  <div className={styles.section}>
    <div className={styles.name}>{name}</div>
    {subsections && subsections.map((data, index) =>
      <SubSection key={index} {...data} />)
    }
  </div>
);

Section.propTypes = {
  name: PropTypes.string.isRequired,
  subsections: PropTypes.array,
};

export default Section;
