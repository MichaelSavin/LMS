import React, { PropTypes } from 'react';

import Section from './Section';
// import Actions from './Actions';

import styles from './styles.css';

const Structure = ({ name, info, sections = [] }) => (
  <div className={styles.structure}>
    <div className={styles.name}>{name}</div>
    <div className={styles.info}>{info}</div>
    {sections.map((data, index) =>
      <Section key={index} {...data} />)
    }
    { /* <Actions /> */ }
  </div>
);

Structure.propTypes = {
  name: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
  sections: PropTypes.array,
};

export default Structure;
