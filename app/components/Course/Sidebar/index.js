import React, { PropTypes } from 'react';

import Section from './Section';

import styles from './styles.css';

const Sidebar = ({ data: { name, info, sections = [] }, actions }) => (
  <div className={styles.sidebar}>
    <div className={styles.name}>{name}</div>
    <div className={styles.info}>{info}</div>
    {sections.map((data, index) =>
      <Section
        key={index}
        data={{ ...data, id: index }}
        actions={actions}
      />
    )}
  </div>
);

Sidebar.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    sections: PropTypes.array,
  }).isRequired,
  actions: PropTypes.object.isRequired,
};

export default Sidebar;